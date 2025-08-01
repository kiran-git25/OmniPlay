class OpenMediaUrl {
    static init() {
        if (typeof document !== 'undefined') {
            OpenMediaUrl.addStyles();
        }
    }

    static show() {
        return new Promise((resolve) => {
            const modal = this.createModal(resolve);
            document.body.appendChild(modal);

            setTimeout(() => {
                modal.querySelector('.url-input')?.focus();
            }, 100);
        });
    }

    static createModal(resolve) {
        const modal = document.createElement('div');
        modal.className = 'media-url-modal';
        modal.innerHTML = this.modalTemplate();

        modal.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (e.target.classList.contains('media-url-overlay') || action === 'close' || action === 'cancel') {
                this.cleanup(modal, resolve);
            } else if (action === 'load') {
                this.loadUrl(modal, resolve);
            }
        });

        modal.querySelector('.url-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.loadUrl(modal, resolve);
        });

        const escListener = (e) => {
            if (e.key === 'Escape') {
                this.cleanup(modal, resolve);
                document.removeEventListener('keydown', escListener);
            }
        };
        document.addEventListener('keydown', escListener);

        return modal;
    }

    static async loadUrl(modal, resolve) {
        const input = modal.querySelector('.url-input');
        const url = input.value.trim();

        if (!url) return this.showError(modal, 'Please enter a URL');

        const { valid, error, url: finalUrl } = this.validateUrl(url);
        if (!valid) return this.showError(modal, error);

        const loadBtn = modal.querySelector('.load-btn');
        loadBtn.disabled = true;
        loadBtn.textContent = 'Loading...';

        try {
            const mediaData = await this.fetchMeta(finalUrl);
            this.cleanup(modal);
            resolve(mediaData);
        } catch (err) {
            this.showError(modal, `Failed to load media: ${err.message}`);
            loadBtn.disabled = false;
            loadBtn.textContent = 'Load Media';
        }
    }

    static validateUrl(url) {
        try {
            const fullUrl = url.startsWith('http') ? url : `https://${url}`;
            const u = new URL(fullUrl);
            const ext = u.pathname.split('.').pop().toLowerCase();
            const allowed = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'mp4', 'webm', 'avi', 'mov', 'mkv', 'pdf', 'txt', 'json', 'xml', 'csv', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
            if (!allowed.includes(ext)) {
                return { valid: false, error: `Unsupported file type: .${ext}` };
            }
            return { valid: true, url: fullUrl, extension: ext };
        } catch {
            return { valid: false, error: 'Invalid URL format' };
        }
    }

    static async fetchMeta(url) {
        const res = await fetch(url, { method: 'HEAD', mode: 'cors' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get('content-type') || '';
        const contentLength = res.headers.get('content-length') || '0';
        const name = new URL(url).pathname.split('/').pop() || 'media-file';
        return { name, type: contentType, size: parseInt(contentLength), url, isRemote: true, lastModified: Date.now() };
    }

    static showError(modal, msg) {
        const errDiv = document.createElement('div');
        errDiv.className = 'error-message';
        errDiv.innerHTML = `<span class="error-icon">⚠️</span> <span class="error-text">${msg}</span>`;
        modal.querySelector('.url-body').appendChild(errDiv);
        setTimeout(() => errDiv.remove(), 5000);
    }

    static cleanup(modal, resolve = () => {}) {
        modal.remove();
        resolve(null);
    }

    static modalTemplate() {
        return `
            <div class="media-url-overlay">
                <div class="media-url-content">
                    <div class="url-header">
                        <span class="url-icon">🔗</span>
                        <h2>Open Media from URL</h2>
                        <button class="close-btn" data-action="close">✕</button>
                    </div>
                    <div class="url-body">
                        <div class="url-input-section">
                            <label>Enter media URL:</label>
                            <input type="url" class="url-input" placeholder="https://example.com/video.mp4" />
                            <div class="url-help">Supported: MP4, MP3, WebM, etc.</div>
                        </div>
                    </div>
                    <div class="url-actions">
                        <button class="cancel-btn" data-action="cancel">Cancel</button>
                        <button class="load-btn" data-action="load">Load Media</button>
                    </div>
                </div>
            </div>
        `;
    }

    static addStyles() {
        if (document.getElementById('media-url-styles')) return;
        const style = document.createElement('style');
        style.id = 'media-url-styles';
        style.textContent = `
            .media-url-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 10000; }
            .media-url-overlay { background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; height: 100%; }
            .media-url-content { background: #fff; border-radius: 8px; width: 100%; max-width: 600px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            .url-header { background: #667eea; color: white; padding: 1rem; display: flex; align-items: center; justify-content: space-between; }
            .url-icon { font-size: 1.5rem; }
            .url-body { padding: 1rem; }
            .url-input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 6px; }
            .url-actions { padding: 1rem; display: flex; justify-content: flex-end; gap: 1rem; }
            .cancel-btn, .load-btn { padding: 0.5rem 1rem; border: none; border-radius: 6px; cursor: pointer; }
            .cancel-btn { background: #ccc; }
            .load-btn { background: #667eea; color: white; }
            .error-message { background: #ffe6e6; color: #900; margin-top: 0.5rem; padding: 0.5rem; border-radius: 4px; }
        `;
        document.head.appendChild(style);
    }
}

window.OpenMediaUrl = OpenMediaUrl;
OpenMediaUrl.init();
