// Utility functions for OmniPlay
class Utils {
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    static escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }

    static getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    static getMimeTypeIcon(mimeType, extension) {
        // Comprehensive icon mapping
        const iconMap = {
            // Images
            'image/jpeg': '🖼️',
            'image/jpg': '🖼️',
            'image/png': '🖼️',
            'image/gif': '🎞️',
            'image/svg+xml': '🎨',
            'image/webp': '🖼️',
            'image/bmp': '🖼️',
            'image/ico': '🖼️',
            
            // Documents
            'application/pdf': '📄',
            'application/msword': '📝',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
            'application/vnd.ms-excel': '📊',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
            'application/vnd.ms-powerpoint': '📽️',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📽️',
            
            // Archives
            'application/zip': '🗜️',
            'application/x-rar-compressed': '🗜️',
            'application/x-7z-compressed': '🗜️',
            'application/x-tar': '🗜️',
            'application/gzip': '🗜️',
            
            // Text
            'text/plain': '📃',
            'text/html': '🌐',
            'text/css': '🎨',
            'text/javascript': '⚡',
            'application/javascript': '⚡',
            'application/json': '📋',
            'text/xml': '📋',
            'application/xml': '📋',
            'text/csv': '📊',
            'text/markdown': '📝',
            
            // Audio
            'audio/mpeg': '🎵',
            'audio/wav': '🎵',
            'audio/ogg': '🎵',
            'audio/flac': '🎵',
            'audio/mp4': '🎵',
            
            // Video
            'video/mp4': '🎬',
            'video/webm': '🎬',
            'video/ogg': '🎬',
            'video/avi': '🎬',
            'video/mov': '🎬'
        };

        // Extension-based fallback
        const extensionMap = {
            'pdf': '📄',
            'doc': '📝', 'docx': '📝',
            'xls': '📊', 'xlsx': '📊',
            'ppt': '📽️', 'pptx': '📽️',
            'txt': '📃', 'md': '📝',
            'html': '🌐', 'css': '🎨', 'js': '⚡',
            'json': '📋', 'xml': '📋', 'yaml': '📋', 'yml': '📋',
            'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🎞️',
            'svg': '🎨', 'webp': '🖼️', 'bmp': '🖼️', 'ico': '🖼️',
            'zip': '🗜️', 'rar': '🗜️', '7z': '🗜️', 'tar': '🗜️', 'gz': '🗜️',
            'mp3': '🎵', 'wav': '🎵', 'ogg': '🎵', 'flac': '🎵',
            'mp4': '🎬', 'webm': '🎬', 'avi': '🎬', 'mov': '🎬'
        };

        return iconMap[mimeType] || extensionMap[extension] || '📄';
    }

    static isImageFile(filename, mimeType) {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff'];
        const extension = Utils.getFileExtension(filename);
        return mimeType.startsWith('image/') || imageExtensions.includes(extension);
    }

    static isTextFile(filename, mimeType) {
        const textExtensions = [
            'txt', 'md', 'json', 'xml', 'yaml', 'yml', 'csv',
            'js', 'ts', 'html', 'css', 'py', 'java', 'cpp', 'c',
            'php', 'rb', 'go', 'rs', 'sh', 'bat', 'ps1', 'sql'
        ];
        const extension = Utils.getFileExtension(filename);
        return mimeType.startsWith('text/') || textExtensions.includes(extension);
    }

    static isDocumentFile(filename, mimeType) {
        const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
        const extension = Utils.getFileExtension(filename);
        return mimeType.includes('pdf') || 
               mimeType.includes('officedocument') || 
               mimeType.includes('msword') || 
               mimeType.includes('ms-excel') || 
               mimeType.includes('ms-powerpoint') ||
               docExtensions.includes(extension);
    }

    static isArchiveFile(filename, mimeType) {
        const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'];
        const extension = Utils.getFileExtension(filename);
        return mimeType.includes('zip') || 
               mimeType.includes('rar') || 
               mimeType.includes('compressed') ||
               archiveExtensions.includes(extension);
    }

    static isMediaFile(filename, mimeType) {
        return mimeType.startsWith('audio/') || mimeType.startsWith('video/');
    }

    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    static validateFile(file, options = {}) {
        const errors = [];
        
        // Size validation
        if (options.maxSize && file.size > options.maxSize) {
            errors.push(`File size (${Utils.formatBytes(file.size)}) exceeds maximum allowed size (${Utils.formatBytes(options.maxSize)})`);
        }
        
        // Type validation
        if (options.allowedTypes && options.allowedTypes.length > 0) {
            const extension = Utils.getFileExtension(file.name);
            const mimeType = file.type.toLowerCase();
            
            const isAllowed = options.allowedTypes.some(type => 
                mimeType.includes(type.toLowerCase()) || 
                extension === type.toLowerCase().replace('.', '')
            );
            
            if (!isAllowed) {
                errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
            }
        }
        
        // Name validation
        if (options.maxNameLength && file.name.length > options.maxNameLength) {
            errors.push(`Filename too long (${file.name.length} chars). Maximum: ${options.maxNameLength} chars`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    static async createThumbnail(file, maxWidth = 150, maxHeight = 150, quality = 0.8) {
        if (!Utils.isImageFile(file.name, file.type)) {
            return null;
        }

        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and convert to data URL
                ctx.drawImage(img, 0, 0, width, height);
                const thumbnailUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(thumbnailUrl);
            };

            img.onerror = () => resolve(null);
            img.src = URL.createObjectURL(file);
        });
    }

    static formatDate(date, options = {}) {
        const defaults = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };

        const formatOptions = { ...defaults, ...options };
        return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
    }

    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const result = document.execCommand('copy');
                textArea.remove();
                return result;
            }
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    }

    static downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static getDeviceType() {
        if (Utils.isMobile()) {
            return /iPad/.test(navigator.userAgent) ? 'tablet' : 'mobile';
        }
        return 'desktop';
    }
}

// Performance monitoring utilities
class PerformanceMonitor {
    static startTimer(label) {
        console.time(label);
        performance.mark(`${label}-start`);
    }

    static endTimer(label) {
        console.timeEnd(label);
        performance.mark(`${label}-end`);
        performance.measure(label, `${label}-start`, `${label}-end`);
    }

    static getMemoryUsage() {
        if (performance.memory) {
            return {
                used: Utils.formatBytes(performance.memory.usedJSHeapSize),
                total: Utils.formatBytes(performance.memory.totalJSHeapSize),
                limit: Utils.formatBytes(performance.memory.jsHeapSizeLimit)
            };
        }
        return null;
    }

    static logPerformanceEntry(entry) {
        console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`);
    }
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, PerformanceMonitor };
} else if (typeof window !== 'undefined') {
    window.Utils = Utils;
    window.PerformanceMonitor = PerformanceMonitor;
}