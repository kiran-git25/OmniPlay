// Specialized file handlers for different formats
class FileHandlers {
    static async handlePDF(file) {
        try {
            // For client-side PDF viewing, we use the browser's native PDF viewer
            const url = URL.createObjectURL(file);
            return {
                type: 'pdf',
                url: url,
                name: file.name,
                size: file.size
            };
        } catch (error) {
            throw new Error(`PDF processing failed: ${error.message}`);
        }
    }

    static async handleImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Not a valid image file'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        type: 'image',
                        url: e.target.result,
                        alt: file.name,
                        dimensions: {
                            width: img.width,
                            height: img.height
                        }
                    });
                };
                img.onerror = () => reject(new Error('Invalid image format'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read image file'));
            reader.readAsDataURL(file);
        });
    }

    static async handleText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                let content = e.target.result;
                
                // Basic syntax highlighting for common file types
                const extension = file.name.split('.').pop().toLowerCase();
                const language = FileHandlers.detectLanguage(extension);
                
                resolve({
                    type: 'text',
                    content: content,
                    language: language,
                    extension: extension,
                    lineCount: content.split('\n').length
                });
            };
            reader.onerror = () => reject(new Error('Failed to read text file'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    static detectLanguage(extension) {
        const languageMap = {
            'js': 'javascript',
            'ts': 'typescript',
            'html': 'html',
            'css': 'css',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'php': 'php',
            'rb': 'ruby',
            'go': 'go',
            'rs': 'rust',
            'sh': 'bash',
            'json': 'json',
            'xml': 'xml',
            'yaml': 'yaml',
            'yml': 'yaml',
            'md': 'markdown'
        };
        
        return languageMap[extension] || 'text';
    }

    static async handleArchive(file) {
        try {
            // Load JSZip from the npm package
            const JSZip = require('jszip');
            
            const zip = new JSZip();
            const contents = await zip.loadAsync(file);
            const fileList = [];
            let totalSize = 0;

            // Extract file information
            for (const [relativePath, zipEntry] of Object.entries(contents.files)) {
                if (!zipEntry.dir) {
                    const fileInfo = {
                        name: relativePath,
                        size: zipEntry._data ? zipEntry._data.uncompressedSize : 0,
                        compressedSize: zipEntry._data ? zipEntry._data.compressedSize : 0,
                        isDirectory: false,
                        lastModified: zipEntry.date,
                        path: relativePath.split('/').slice(0, -1).join('/') || '/'
                    };
                    fileList.push(fileInfo);
                    totalSize += fileInfo.size;
                }
            }

            return {
                type: 'archive',
                fileCount: fileList.length,
                files: fileList,
                totalSize: totalSize,
                compressionRatio: file.size > 0 ? ((totalSize - file.size) / totalSize * 100).toFixed(1) : 0,
                zipObject: zip
            };
        } catch (error) {
            throw new Error(`Archive processing failed: ${error.message}`);
        }
    }

    static async handleWord(file) {
        try {
            // Load Mammoth from the npm package
            const mammoth = require('mammoth');
            
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            
            // Count basic document statistics
            const textContent = result.value.replace(/<[^>]*>/g, '');
            const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
            const charCount = textContent.length;
            
            return {
                type: 'document',
                html: result.value,
                messages: result.messages,
                stats: {
                    words: wordCount,
                    characters: charCount,
                    charactersNoSpaces: textContent.replace(/\s/g, '').length
                }
            };
        } catch (error) {
            throw new Error(`Word document processing failed: ${error.message}`);
        }
    }

    static async handleCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvText = e.target.result;
                    const lines = csvText.split('\n').filter(line => line.trim());
                    
                    if (lines.length === 0) {
                        resolve({
                            type: 'csv',
                            rows: [],
                            headers: [],
                            rowCount: 0
                        });
                        return;
                    }

                    // Simple CSV parsing (doesn't handle complex cases with quotes containing commas)
                    const headers = lines[0].split(',').map(h => h.trim());
                    const rows = lines.slice(1).map(line => {
                        const values = line.split(',').map(v => v.trim());
                        const row = {};
                        headers.forEach((header, index) => {
                            row[header] = values[index] || '';
                        });
                        return row;
                    });

                    resolve({
                        type: 'csv',
                        headers: headers,
                        rows: rows,
                        rowCount: rows.length,
                        columnCount: headers.length
                    });
                } catch (error) {
                    reject(new Error(`CSV parsing failed: ${error.message}`));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read CSV file'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    static async handleJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonText = e.target.result;
                    const jsonData = JSON.parse(jsonText);
                    
                    resolve({
                        type: 'json',
                        data: jsonData,
                        formatted: JSON.stringify(jsonData, null, 2),
                        size: Object.keys(jsonData).length,
                        isArray: Array.isArray(jsonData)
                    });
                } catch (error) {
                    reject(new Error(`JSON parsing failed: ${error.message}`));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read JSON file'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    static async handleXML(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const xmlText = e.target.result;
                    
                    // Basic XML validation
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    
                    const parseError = xmlDoc.getElementsByTagName('parsererror');
                    if (parseError.length > 0) {
                        throw new Error('Invalid XML format');
                    }

                    // Format XML for display
                    const serializer = new XMLSerializer();
                    const formatted = FileHandlers.formatXML(xmlText);
                    
                    resolve({
                        type: 'xml',
                        raw: xmlText,
                        formatted: formatted,
                        rootElement: xmlDoc.documentElement ? xmlDoc.documentElement.tagName : null,
                        isValid: true
                    });
                } catch (error) {
                    reject(new Error(`XML processing failed: ${error.message}`));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read XML file'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    static formatXML(xml) {
        let formatted = '';
        let indent = 0;
        const tab = '  ';
        
        xml.split(/>\s*</).forEach((node) => {
            if (node.match(/^\/\w/)) {
                indent--;
            }
            formatted += tab.repeat(indent) + '<' + node + '>\n';
            if (node.match(/^<?\w[^>]*[^\/]$/)) {
                indent++;
            }
        });
        
        return formatted.substring(1, formatted.length - 2);
    }

    static async handleAudio(file) {
        if (!file.type.startsWith('audio/')) {
            throw new Error('Not a valid audio file');
        }

        const url = URL.createObjectURL(file);
        
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.addEventListener('loadedmetadata', () => {
                resolve({
                    type: 'audio',
                    url: url,
                    duration: audio.duration,
                    canPlay: true
                });
            });
            
            audio.addEventListener('error', () => {
                resolve({
                    type: 'audio',
                    url: url,
                    duration: 0,
                    canPlay: false,
                    error: 'Unsupported audio format'
                });
            });
            
            audio.src = url;
        });
    }

    static async handleVideo(file) {
        if (!file.type.startsWith('video/')) {
            throw new Error('Not a valid video file');
        }

        const url = URL.createObjectURL(file);
        
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.addEventListener('loadedmetadata', () => {
                resolve({
                    type: 'video',
                    url: url,
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight,
                    canPlay: true
                });
            });
            
            video.addEventListener('error', () => {
                resolve({
                    type: 'video',
                    url: url,
                    duration: 0,
                    width: 0,
                    height: 0,
                    canPlay: false,
                    error: 'Unsupported video format'
                });
            });
            
            video.src = url;
        });
    }

    static getFileType(file) {
        const extension = file.name.split('.').pop().toLowerCase();
        const mimeType = file.type.toLowerCase();

        // Determine handler based on file extension and MIME type
        if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp', 'ico'].includes(extension)) {
            return 'image';
        }
        
        if (mimeType === 'application/pdf' || extension === 'pdf') {
            return 'pdf';
        }
        
        if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || extension === 'docx') {
            return 'word';
        }
        
        if (mimeType === 'application/zip' || extension === 'zip') {
            return 'archive';
        }
        
        if (mimeType === 'text/csv' || extension === 'csv') {
            return 'csv';
        }
        
        if (mimeType === 'application/json' || extension === 'json') {
            return 'json';
        }
        
        if (mimeType === 'text/xml' || mimeType === 'application/xml' || extension === 'xml') {
            return 'xml';
        }
        
        if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
            return 'audio';
        }
        
        if (mimeType.startsWith('video/') || ['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
            return 'video';
        }
        
        if (mimeType.startsWith('text/') || ['txt', 'md', 'js', 'html', 'css', 'py', 'java', 'cpp'].includes(extension)) {
            return 'text';
        }
        
        return 'unknown';
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileHandlers;
} else if (typeof window !== 'undefined') {
    window.FileHandlers = FileHandlers;
}