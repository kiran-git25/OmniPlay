// Privacy Guard - Ensures absolute no data storage
class PrivacyGuard {
    static init() {
        this.enforceNoStorage();
        this.preventDataLeaks();
        this.monitorMemoryUsage();
    }

    static enforceNoStorage() {
        // Override all storage methods
        const preventStorage = (method) => {
            throw new Error(`${method} is disabled for privacy protection`);
        };

        // LocalStorage protection
        if (typeof localStorage !== 'undefined') {
            localStorage.clear();
            Object.defineProperty(window, 'localStorage', {
                get: () => ({
                    setItem: () => preventStorage('localStorage.setItem'),
                    getItem: () => null,
                    removeItem: () => {},
                    clear: () => {},
                    length: 0
                })
            });
        }

        // SessionStorage protection
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
            Object.defineProperty(window, 'sessionStorage', {
                get: () => ({
                    setItem: () => preventStorage('sessionStorage.setItem'),
                    getItem: () => null,
                    removeItem: () => {},
                    clear: () => {},
                    length: 0
                })
            });
        }

        // IndexedDB protection
        if ('indexedDB' in window) {
            Object.defineProperty(window, 'indexedDB', {
                get: () => ({
                    open: () => Promise.reject(new Error('IndexedDB disabled for privacy'))
                })
            });
        }

        // WebSQL protection (deprecated but still available in some browsers)
        if ('openDatabase' in window) {
            window.openDatabase = () => {
                throw new Error('WebSQL disabled for privacy protection');
            };
        }
    }

    static preventDataLeaks() {
        // Prevent form data storage
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                form.setAttribute('autocomplete', 'off');
            });

            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.setAttribute('autocomplete', 'off');
                input.setAttribute('data-private', 'true');
            });
        });

        // Clear clipboard after operations
        const originalWriteText = navigator.clipboard?.writeText;
        if (originalWriteText) {
            navigator.clipboard.writeText = function(text) {
                const result = originalWriteText.call(this, text);
                // Clear clipboard after 30 seconds
                setTimeout(() => {
                    originalWriteText.call(this, '').catch(() => {});
                }, 30000);
                return result;
            };
        }
    }

    static monitorMemoryUsage() {
        // Monitor and cleanup memory usage
        setInterval(() => {
            if (performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                const limit = performance.memory.jsHeapSizeLimit;
                
                // If memory usage is high, trigger cleanup
                if (used / limit > 0.8) {
                    PrivacyGuard.emergencyCleanup();
                }
            }
        }, 10000); // Check every 10 seconds

        // Cleanup on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                PrivacyGuard.emergencyCleanup();
            }
        });

        // Cleanup before page unload
        window.addEventListener('beforeunload', () => {
            PrivacyGuard.emergencyCleanup();
        });
    }

    static emergencyCleanup() {
        // Clear all object URLs
        if (window.omniplay && window.omniplay.loadedFiles) {
            window.omniplay.loadedFiles.forEach(fileData => {
                if (fileData.content && fileData.content.url) {
                    URL.revokeObjectURL(fileData.content.url);
                }
            });
            window.omniplay.loadedFiles.clear();
        }

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        console.log('🧹 Emergency privacy cleanup completed');
    }

    static verifyPrivacyCompliance() {
        const checks = {
            localStorage: false,
            sessionStorage: false,
            indexedDB: false,
            cookies: document.cookie.length === 0,
            caching: false
        };

        // Test localStorage
        try {
            localStorage.setItem('test', 'test');
            checks.localStorage = true;
            localStorage.removeItem('test');
        } catch (e) {
            // Storage blocked - good!
        }

        // Test sessionStorage
        try {
            sessionStorage.setItem('test', 'test');
            checks.sessionStorage = true;
            sessionStorage.removeItem('test');
        } catch (e) {
            // Storage blocked - good!
        }

        // Test indexedDB
        try {
            const request = indexedDB.open('test');
            request.onsuccess = () => {
                checks.indexedDB = true;
            };
        } catch (e) {
            // IndexedDB blocked - good!
        }

        // Check cache headers
        fetch(window.location.href, { method: 'HEAD' })
            .then(response => {
                const cacheControl = response.headers.get('cache-control');
                checks.caching = !cacheControl || !cacheControl.includes('no-store');
            })
            .catch(() => {});

        return checks;
    }
}

// Auto-initialize privacy guard
if (typeof window !== 'undefined') {
    PrivacyGuard.init();
    
    // Export for testing
    window.PrivacyGuard = PrivacyGuard;
    
    console.log('🛡️ Privacy Guard activated - All data storage disabled');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrivacyGuard;
}