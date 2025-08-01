// OmniPlay Test JavaScript File
class TestApplication {
    constructor() {
        this.name = 'OmniPlay Test';
        this.version = '1.0.0';
        this.features = [
            'Universal file viewer',
            'Client-side processing',
            'Multiple format support',
            'Secure file handling'
        ];
        
        this.init();
    }

    init() {
        console.log(`${this.name} v${this.version} initialized`);
        this.displayFeatures();
        this.setupEventListeners();
    }

    displayFeatures() {
        console.log('Features:');
        this.features.forEach((feature, index) => {
            console.log(`${index + 1}. ${feature}`);
        });
    }

    setupEventListeners() {
        // Example event listener setup
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM Content Loaded');
        });
    }

    processFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                const result = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: event.target.result
                };
                resolve(result);
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsText(file);
        });
    }

    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    validateFileType(filename) {
        const allowedExtensions = [
            'txt', 'json', 'xml', 'html', 'css', 'js',
            'pdf', 'docx', 'xlsx', 'jpg', 'png', 'gif'
        ];

        const extension = filename.split('.').pop().toLowerCase();
        return allowedExtensions.includes(extension);
    }
}

// Initialize the test application
const testApp = new TestApplication();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestApplication;
}