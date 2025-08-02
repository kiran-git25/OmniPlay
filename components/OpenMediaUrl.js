// Open Media URL Component - Safe media URL access
class OpenMediaUrl {
    static show() {
        return new Promise((resolve) => {
            const modal = this.createUrlModal(resolve);
            document.body.appendChild(modal);
            
            // Focus on input
            setTimeout(() => {
                const input = modal.querySelector('.url-input');
                if (input) input.focus();
            }, 100);
        });
    }

    static createUrlModal(resolve) {
        const modal = document.createElement('div');
        modal.className = 'media-url-modal';
        modal.innerHTML = `
            <div class="media-url-overlay">
                <div class="media-url-content">
                    <div class="url-header">
                        <span class="url-icon">🔗</span>
                        <h2>Open Media from URL</h2>
                        <button class="close-btn" data-action="close">✕</button>
                    </div>
                    
                    <div class="url-body">
                        <div class="url-input-section">
                            <label for="mediaUrl">Enter media URL:</label>
                            <input 
                                type="url" 
                                id="mediaUrl" 
                                class="url-input" 
                                placeholder="https://example.com/video.mp4"
                                autocomplete="off"
                            >
                            <div class="url-help">
                                Supported: Direct media links (MP4, MP3, WebM, etc.)
                            </div>
                        </div>
                        
                        <div class="supported-formats">
                            <h4>Supported URL Types:</h4>
                            <div class="format-grid">
                                <div class="format-category">
                                    <strong>🎵 Audio:</strong>
                                    <span>.mp3, .wav, .ogg, .aac, .flac, .m4a</span>
                                </div>
                                <div class="format-category">
                                    <strong>🎥 Video:</strong>
                                    <span>.mp4, .webm, .avi, .mov, .mkv</span>
                                </div>
                                <div class="format-category">
                                    <strong>📄 Documents:</strong>
                                    <span>.pdf, .txt, .json, .xml, .csv</span>
                                </div>
                                <div class="format-category">
                                    <strong>🖼️ Images:</strong>
                                    <span>.jpg, .png, .gif, .svg, .webp</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="safety-notice">
                            <div class="notice-header">🛡️ Safety Features</div>
                            <ul>
                                <li>URLs are validated before loading</li>
                                <li>HTTPS connections preferred for security</li>
                                <li>No tracking or analytics sent</li>
                                <li>Content loaded directly in your browser</li>
                                <li>Cross-origin requests respect CORS policies</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="url-actions">
                        <button class="cancel-btn" data-action="cancel">Cancel</button>
                        <button class="load-btn" data-action="load">Load Media</button>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('media-url-overlay')) {
                this.handleCancel(modal, resolve);
            }
            
            const action = e.target.dataset.action;
            if (action === 'close' || action === 'cancel') {
                this.handleCancel(modal, resolve);
            } else if (action === 'load') {
                this.handleLoad(modal, resolve);
            }
        });

        // Handle Enter key in input
        const input = modal.querySelector('.url-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleLoad(modal, resolve);
            }
        });

        // Handle ESC key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                this.handleCancel(modal, resolve);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return modal;
    }

    static handleCancel(modal, resolve) {
        document.body.removeChild(modal);
        resolve(null);
    }

    static async handleLoad(modal, resolve) {
        const input = modal.querySelector('.url-input');
        const url = input.value.trim();
        
        if (!url) {
            this.showError(modal, 'Please enter a URL');
            return;
        }

        const validation = this.validateUrl(url);
        if (!validation.valid) {
            this.showError(modal, validation.error);
            return;
        }

        // Show loading state
        const loadBtn = modal.querySelector('.load-btn');
        const originalText = loadBtn.textContent;
        loadBtn.textContent = 'Loading...';
        loadBtn.disabled = true;

        try {
            const mediaData = await this.loadMediaFromUrl(validation.url);
            document.body.removeChild(modal);
            resolve(mediaData);
        } catch (error) {
            this.showError(modal, `Failed to load media: ${error.message}`);
            loadBtn.textContent = originalText;
            loadBtn.disabled = false;
        }
    }

    static validateUrl(url) {
        try {
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            const urlObj = new URL(url);
            
            // Check for supported protocols
            if (!['http:', 'https:'].includes(urlObj.protocol)) {
                return { valid: false, error: 'Only HTTP and HTTPS URLs are supported' };
            }

            // Extract file extension
            const pathname = urlObj.pathname.toLowerCase();
            const extension = pathname.split('.').pop();
            
            const supportedExtensions = [
                'mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a',
                'mp4', 'webm', 'avi', 'mov', 'mkv',
                'pdf', 'txt', 'json', 'xml', 'csv',
                'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'
            ];

            if (!supportedExtensions.includes(extension)) {
                return { 
                    valid: false, 
                    error: `Unsupported file type: .${extension}. Supported: ${supportedExtensions.join(', ')}` 
                };
            }

            return { valid: true, url, extension };
        } catch (e) {
            return { valid: false, error: 'Invalid URL format' };
        }
    }

    static async loadMediaFromUrl(url) {
        const response = await fetch(url, {
            method: 'HEAD',
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type') || '';
        const contentLength = response.headers.get('content-length');
        
        // Extract filename from URL
        const urlObj = new URL(url);
        const filename = urlObj.pathname.split('/').pop() || 'media-file';
        
        return {
            name: filename,
            size: contentLength ? parseInt(contentLength) : 0,
            type: contentType,
            url: url,
            isRemote: true,
            lastModified: Date.now()
        };
    }

    static showError(modal, message) {
        const existingError = modal.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span class="error-icon">⚠️</span>
            <span class="error-text">${this.escapeHtml(message)}</span>
        `;

        const urlBody = modal.querySelector('.url-body');
        urlBody.appendChild(errorDiv);

        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static addStyles() {
        if (document.getElementById('media-url-styles')) return;

        const style = document.createElement('style');
        style.id = 'media-url-styles';
        style.textContent = `
            .media-url-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .media-url-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            }

            .media-url-content {
                background: white;
                border-radius: 12px;
                max-width: 650px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }

            .url-header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 20px;
                border-radius: 12px 12px 0 0;
                display: flex;
                align-items: center;
                gap: 15px;
                position: relative;
            }

            .url-icon {
                font-size: 2rem;
            }

            .url-header h2 {
                margin: 0;
                flex: 1;
                font-size: 1.4rem;
                font-weight: 600;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: background 0.2s;
            }

            .close-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .url-body {
                padding: 25px;
            }

            .url-input-section {
                margin-bottom: 25px;
            }

            .url-input-section label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: #333;
            }

            .url-input {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #E1E5E9;
                border-radius: 8px;
                font-size: 1rem;
                box-sizing: border-box;
                transition: border-color 0.2s;
            }

            .url-input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .url-help {
                margin-top: 8px;
                font-size: 0.9rem;
                color: #666;
            }

            .supported-formats {
                background: #F8F9FA;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 20px;
            }

            .supported-formats h4 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 1rem;
            }

            .format-grid {
                display: grid;
                gap: 12px;
            }

            .format-category {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .format-category strong {
                color: #2C3E50;
            }

            .format-category span {
                font-size: 0.9rem;
                color: #666;
                font-family: monospace;
            }

            .safety-notice {
                background: #E8F5E8;
                border: 1px solid #4CAF50;
                border-radius: 8px;
                padding: 15px;
            }

            .notice-header {
                font-weight: bold;
                color: #2E7D32;
                margin-bottom: 10px;
            }

            .safety-notice ul {
                margin: 0;
                padding-left: 20px;
                color: #1B5E20;
            }

            .safety-notice li {
                margin: 5px 0;
                font-size: 0.9rem;
            }

            .url-actions {
                padding: 20px 25px;
                background: #F8F9FA;
                border-radius: 0 0 12px 12px;
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }

            .cancel-btn, .load-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .cancel-btn {
                background: #6C757D;
                color: white;
            }

            .cancel-btn:hover {
                background: #5A6268;
            }

            .load-btn {
                background: #667eea;
                color: white;
            }

            .load-btn:hover:not(:disabled) {
                background: #5a6fd8;
                transform: translateY(-1px);
            }

            .load-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .error-message {
                background: #F8D7DA;
                color: #721C24;
                border: 1px solid #F5C6CB;
                border-radius: 6px;
                padding: 12px;
                margin-top: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: errorSlideIn 0.3s ease-out;
            }

            @keyframes errorSlideIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .error-icon {
                font-size: 1.2rem;
            }

            @media (max-width: 768px) {
                .media-url-content {
                    margin: 10px;
                    max-height: 95vh;
                }

                .url-actions {
                    flex-direction: column;
                }

                .cancel-btn, .load-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize styles when loaded
if (typeof document !== 'undefined') {
    OpenMediaUrl.addStyles();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenMediaUrl;
}

// Global availability
window.OpenMediaUrl = OpenMediaUrl;