// OmniPlay - Universal File Viewer Application
class OmniPlay {
    constructor() {
        this.loadedFiles = new Map(); // Memory-only, never persisted
        this.currentFile = null;
        this.initializeEventListeners();
        this.setupDragAndDrop();
        this.ensureNoDataPersistence();
    }

    ensureNoDataPersistence() {
        // Explicitly prevent any form of data storage
        if (typeof localStorage !== 'undefined') {
            // Clear any existing data and disable future storage
            localStorage.clear();
        }
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
        }
        
        // Override storage methods to prevent accidental usage
        const preventStorage = () => {
            throw new Error('Data storage is disabled for privacy protection');
        };
        
        // Disable storage APIs
        if (typeof Storage !== 'undefined') {
            Storage.prototype.setItem = preventStorage;
        }
        
        console.log('🔒 Privacy Mode: All data storage disabled');
    }

    initializeEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('dropZone');

        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        dropZone.addEventListener('click', () => fileInput.click());
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    async handleFileSelect(event) {
        const files = Array.from(event.target.files);
        await this.processFiles(files);
    }

    async handleDrop(event) {
        const dt = event.dataTransfer;
        const files = Array.from(dt.files);
        await this.processFiles(files);
    }

    async processFiles(files) {
        if (files.length === 0) return;

        this.showLoading();

        try {
            // Process files in memory only - no persistence
            for (const file of files) {
                await this.loadFile(file);
            }

            if (files.length === 1) {
                await this.displayFile(files[0]);
            } else {
                this.showFileList();
            }
        } catch (error) {
            this.showError('Error processing files', error.message);
        } finally {
            this.hideLoading();
            // Clear any temporary data after processing
            this.cleanupTempData();
        }
    }

    cleanupTempData() {
        // Ensure no temporary data remains in memory longer than necessary
        setTimeout(() => {
            if (this.loadedFiles.size > 10) {
                // Keep only recent files to prevent memory buildup
                const entries = Array.from(this.loadedFiles.entries());
                this.loadedFiles.clear();
                // Keep only the last 5 files
                entries.slice(-5).forEach(([key, value]) => {
                    this.loadedFiles.set(key, value);
                });
            }
        }, 30000); // Clean up after 30 seconds
    }

    async loadFile(file) {
        // Check if file is dangerous
        if (DangerousExtensions && DangerousExtensions.isDangerous(file.name)) {
            const proceed = await UnsafeFileWarning.show(
                file.name,
                DangerousExtensions.getFileCategory(file.name),
                () => console.log('🛡️ User chose to proceed with unsafe file viewing'),
                () => console.log('🚫 User cancelled unsafe file')
            );
            
            if (!proceed) {
                throw new Error('File loading cancelled for safety');
            }
        }

        const fileId = this.generateFileId(file);
        
        const fileData = {
            id: fileId,
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            file: file,
            icon: this.getFileIcon(file.name),
            processed: false,
            content: null,
            isDangerous: DangerousExtensions ? DangerousExtensions.isDangerous(file.name) : false,
            isRemote: file.isRemote || false
        };

        this.loadedFiles.set(fileId, fileData);
        return fileData;
    }

    generateFileId(file) {
        return `${file.name}_${file.size}_${file.lastModified}`;
    }

    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        
        const iconMap = {
            // Documents
            'pdf': '📄',
            'doc': '📝', 'docx': '📝',
            'xls': '📊', 'xlsx': '📊',
            'ppt': '📽️', 'pptx': '📽️',
            'txt': '📃', 'md': '📃',
            
            // Images
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
            'svg': '🎨', 'bmp': '🖼️', 'ico': '🖼️', 'webp': '🖼️',
            
            // Archives
            'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️', 'tar': '🗜️', 'gz': '🗜️',
            
            // Code
            'js': '⚡', 'html': '🌐', 'css': '🎨', 'json': '📋',
            'xml': '📋', 'yaml': '📋', 'yml': '📋',
            
            // Media
            'mp3': '🎵', 'wav': '🎵', 'mp4': '🎬', 'avi': '🎬',
            
            // Default
            'default': '📄'
        };

        return iconMap[extension] || iconMap.default;
    }

    async displayFile(fileOrId) {
        const fileData = typeof fileOrId === 'string' 
            ? this.loadedFiles.get(fileOrId) 
            : this.loadedFiles.get(this.generateFileId(fileOrId));

        if (!fileData) {
            this.showError('File not found', 'The requested file could not be found.');
            return;
        }

        this.currentFile = fileData;
        this.showLoading();

        try {
            if (!fileData.processed) {
                fileData.content = await this.processFileContent(fileData);
                fileData.processed = true;
            }

            this.updateFileInfo(fileData);
            this.renderFileContent(fileData);
            this.showViewer();
        } catch (error) {
            this.showError('Error displaying file', error.message);
        } finally {
            this.hideLoading();
        }
    }

    async processFileContent(fileData) {
        const { file, type, name, isDangerous, isRemote } = fileData;
        const extension = name.split('.').pop().toLowerCase();

        try {
            // Force dangerous files to be displayed as text only
            if (isDangerous) {
                const content = isRemote ? 
                    await this.loadRemoteText(file.url) : 
                    await this.readAsText(file);
                return {
                    type: 'text',
                    content: content,
                    warning: '⚠️ This file is potentially unsafe and is displayed as text only for your security.'
                };
            }

            // Handle remote files
            if (isRemote) {
                return await this.processRemoteFile(fileData);
            }
            // Handle different file types
            if (type.startsWith('image/')) {
                return await this.processImage(file);
            }
            
            if (type === 'application/pdf') {
                return await this.processPDF(file);
            }
            
            if (extension === 'docx' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return await this.processWord(file);
            }
            
            if (extension === 'xlsx' || type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                return await this.processExcel(file);
            }
            
            if (extension === 'zip' || type === 'application/zip') {
                return await this.processZip(file);
            }
            
            if (type.startsWith('text/') || this.isTextFile(extension)) {
                return await this.processText(file);
            }
            
            // Default: try as text
            return await this.processText(file);
            
        } catch (error) {
            throw new Error(`Failed to process ${extension.toUpperCase()} file: ${error.message}`);
        }
    }

    async processImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    type: 'image',
                    url: e.target.result,
                    alt: file.name
                });
            };
            reader.readAsDataURL(file);
        });
    }

    async processPDF(file) {
        const url = URL.createObjectURL(file);
        return {
            type: 'pdf',
            url: url,
            name: file.name
        };
    }

    async processWord(file) {
        if (typeof mammoth === 'undefined') {
            throw new Error('Mammoth library not loaded. Word document processing unavailable.');
        }

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        
        return {
            type: 'document',
            html: result.value,
            messages: result.messages
        };
    }

    async processExcel(file) {
        // Note: XLSX library would be loaded via CDN or npm
        throw new Error('Excel processing not yet implemented. Please add XLSX library dependency.');
    }

    async processZip(file) {
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library not loaded. Archive processing unavailable.');
        }

        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const fileList = [];

        for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
            if (!zipEntry.dir) {
                fileList.push({
                    name: relativePath,
                    size: zipEntry._data ? zipEntry._data.uncompressedSize : 0,
                    isDirectory: false
                });
            }
        }

        return {
            type: 'archive',
            fileCount: fileList.length,
            files: fileList,
            zipObject: zip
        };
    }

    async processRemoteFile(fileData) {
        const { name, type } = fileData;
        const extension = name.split('.').pop().toLowerCase();
        
        if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) {
            return { type: 'audio', url: fileData.file.url };
        }
        
        if (['mp4', 'webm', 'avi', 'mov', 'mkv'].includes(extension)) {
            return { type: 'video', url: fileData.file.url };
        }
        
        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
            return { type: 'image', url: fileData.file.url };
        }
        
        if (['pdf'].includes(extension)) {
            return { type: 'pdf', url: fileData.file.url };
        }
        
        // For text files, fetch content
        if (['txt', 'json', 'xml', 'csv'].includes(extension)) {
            const content = await this.loadRemoteText(fileData.file.url);
            return { type: 'text', content: content };
        }
        
        return { type: 'unsupported', message: 'Remote file type not supported for direct viewing' };
    }

    async loadRemoteText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load remote file: ${response.status} ${response.statusText}`);
        }
        return await response.text();
    }

    async processText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve({
                    type: 'text',
                    content: e.target.result
                });
            };
            reader.onerror = () => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    isTextFile(extension) {
        const textExtensions = [
            'txt', 'md', 'json', 'xml', 'yaml', 'yml', 'csv',
            'js', 'html', 'css', 'py', 'java', 'cpp', 'c',
            'php', 'rb', 'go', 'rs', 'sh', 'bat', 'ps1'
        ];
        return textExtensions.includes(extension);
    }

    updateFileInfo(fileData) {
        document.getElementById('fileName').textContent = fileData.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(fileData.size);
        document.getElementById('fileType').textContent = fileData.type || 'Unknown';
    }

    renderFileContent(fileData) {
        const container = document.getElementById('viewerContent');
        const { content } = fileData;

        container.innerHTML = '';

        switch (content.type) {
            case 'image':
                container.innerHTML = `
                    <div class="image-content">
                        <img src="${content.url}" alt="${content.alt}" />
                    </div>
                `;
                break;

            case 'pdf':
                container.innerHTML = `
                    <div class="pdf-content">
                        <embed src="${content.url}" type="application/pdf" />
                    </div>
                `;
                break;

            case 'document':
                container.innerHTML = `
                    <div class="document-content">
                        ${content.html}
                    </div>
                `;
                break;

            case 'text':
                let textHtml = `<div class="text-content">${this.escapeHtml(content.content)}</div>`;
                if (content.warning) {
                    textHtml = `<div class="danger-warning">${content.warning}</div>` + textHtml;
                }
                container.innerHTML = textHtml;
                break;

            case 'audio':
                container.innerHTML = `
                    <div class="audio-content">
                        <audio controls style="width: 100%; max-width: 500px;">
                            <source src="${content.url}" type="audio/mpeg">
                            Your browser does not support audio playback.
                        </audio>
                    </div>
                `;
                break;

            case 'video':
                container.innerHTML = `
                    <div class="video-content">
                        <video controls style="max-width: 100%; max-height: 70vh;">
                            <source src="${content.url}">
                            Your browser does not support video playback.
                        </video>
                    </div>
                `;
                break;

            case 'archive':
                this.renderArchiveContent(container, content);
                break;

            default:
                this.renderUnsupportedContent(container, fileData);
        }
    }

    renderArchiveContent(container, content) {
        const fileListHtml = content.files.map(file => `
            <div class="archive-file">
                <span class="file-icon">📄</span>
                <span class="file-name">${this.escapeHtml(file.name)}</span>
                <span class="file-size">${this.formatFileSize(file.size)}</span>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="archive-content">
                <h3>Archive Contents (${content.fileCount} files)</h3>
                <div class="archive-file-list">
                    ${fileListHtml}
                </div>
            </div>
        `;
    }

    renderUnsupportedContent(container, fileData) {
        const supportedFormats = [
            'Images (JPG, PNG, GIF, SVG, WebP)',
            'Documents (PDF, DOCX)',
            'Text files (TXT, MD, JSON, XML, YAML)',
            'Archives (ZIP)',
            'Code files (JS, HTML, CSS, Python, etc.)'
        ];

        container.innerHTML = `
            <div class="error-content">
                <h3>File type not supported</h3>
                <p>Cannot display ${fileData.name}</p>
                <div class="supported-formats">
                    <h4>Supported formats:</h4>
                    <div class="format-list">
                        ${supportedFormats.map(format => `<span class="format-tag">${format}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    showFileList() {
        const container = document.getElementById('filesContainer');
        const fileList = document.getElementById('fileList');
        
        container.innerHTML = '';
        
        this.loadedFiles.forEach((fileData) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            fileElement.innerHTML = `
                <div class="file-item-icon">${fileData.icon}</div>
                <div class="file-item-name">${this.escapeHtml(fileData.name)}</div>
                <div class="file-item-size">${this.formatFileSize(fileData.size)}</div>
            `;
            
            fileElement.addEventListener('click', () => this.displayFile(fileData.id));
            container.appendChild(fileElement);
        });
        
        fileList.style.display = 'block';
        document.getElementById('uploadSection').style.display = 'none';
    }

    showViewer() {
        document.getElementById('viewerSection').style.display = 'block';
        document.getElementById('uploadSection').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(title, message) {
        const container = document.getElementById('viewerContent');
        container.innerHTML = `
            <div class="error-content">
                <h3>${this.escapeHtml(title)}</h3>
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.showViewer();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global functions for UI interactions
function downloadFile() {
    if (window.omniplay && window.omniplay.currentFile) {
        const file = window.omniplay.currentFile.file;
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function closeViewer() {
    document.getElementById('viewerSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'block';
    
    if (window.omniplay && window.omniplay.loadedFiles.size > 1) {
        document.getElementById('fileList').style.display = 'block';
    }
}

async function openUrlModal() {
    try {
        const urlData = await OpenMediaUrl.show();
        if (urlData) {
            // Create a pseudo-file object for remote URLs
            const pseudoFile = {
                name: urlData.name,
                size: urlData.size,
                type: urlData.type,
                lastModified: urlData.lastModified,
                url: urlData.url,
                isRemote: true
            };
            
            await window.omniplay.processFiles([pseudoFile]);
        }
    } catch (error) {
        console.error('Error loading URL:', error);
        window.omniplay.showError('URL Loading Error', error.message);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.omniplay = new OmniPlay();
    
    // Add some helpful console messages
    console.log('🎉 OmniPlay initialized successfully!');
    console.log('📁 Drop files or click browse to get started');
});