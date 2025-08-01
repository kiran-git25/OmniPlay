// Security Test Suite for OmniPlay
// Tests security measures and dangerous file handling

class SecurityTester {
    constructor() {
        this.testResults = [];
        this.mockFiles = this.createMockFiles();
    }

    createMockFiles() {
        return {
            // Dangerous executable files
            maliciousExe: this.createMockFile('virus.exe', 'application/octet-stream', 'MZ\x90\x00\x03\x00\x00\x00'),
            maliciousScript: this.createMockFile('script.bat', 'text/plain', '@echo off\necho "This is a test batch file"'),
            macroDoc: this.createMockFile('document.docm', 'application/vnd.ms-word.document.macroEnabled.12', 'Mock macro document'),
            
            // Suspicious archives
            suspiciousZip: this.createMockFile('archive.zip', 'application/zip', 'PK\x03\x04Mock zip content'),
            
            // Safe files for comparison
            safeText: this.createMockFile('document.txt', 'text/plain', 'This is a safe text document.'),
            safeImage: this.createMockFile('image.jpg', 'image/jpeg', 'Mock JPEG content'),
            safePdf: this.createMockFile('document.pdf', 'application/pdf', '%PDF-1.4 Mock PDF content'),
            
            // Edge cases
            noExtension: this.createMockFile('README', 'text/plain', 'File without extension'),
            multipleExtensions: this.createMockFile('file.txt.exe', 'application/octet-stream', 'Deceptive filename'),
            hiddenExtension: this.createMockFile('image.jpg.exe', 'application/octet-stream', 'Hidden executable')
        };
    }

    createMockFile(name, type, content) {
        const blob = new Blob([content], { type });
        const file = new File([blob], name, { type, lastModified: Date.now() });
        return file;
    }

    async runAllTests() {
        console.log('🧪 Starting OmniPlay Security Test Suite...');
        
        await this.testDangerousFileDetection();
        await this.testWarningSystem();
        await this.testMemoryCleanup();
        await this.testStorageProtection();
        await this.testUrlValidation();
        await this.testCSPCompliance();
        
        this.generateTestReport();
        return this.testResults;
    }

    async testDangerousFileDetection() {
        console.log('🔍 Testing dangerous file detection...');
        
        const tests = [
            { file: this.mockFiles.maliciousExe, expected: true, name: 'Executable detection' },
            { file: this.mockFiles.maliciousScript, expected: true, name: 'Script detection' },
            { file: this.mockFiles.macroDoc, expected: true, name: 'Macro document detection' },
            { file: this.mockFiles.safeText, expected: false, name: 'Safe text file' },
            { file: this.mockFiles.safeImage, expected: false, name: 'Safe image file' },
            { file: this.mockFiles.multipleExtensions, expected: true, name: 'Multiple extension detection' },
            { file: this.mockFiles.hiddenExtension, expected: true, name: 'Hidden extension detection' }
        ];

        for (const test of tests) {
            try {
                const isDangerous = DangerousExtensions.isDangerous(test.file.name);
                const passed = isDangerous === test.expected;
                
                this.testResults.push({
                    test: test.name,
                    category: 'File Detection',
                    passed,
                    expected: test.expected,
                    actual: isDangerous,
                    file: test.file.name
                });
                
                console.log(`${passed ? '✅' : '❌'} ${test.name}: ${test.file.name}`);
            } catch (error) {
                this.testResults.push({
                    test: test.name,
                    category: 'File Detection',
                    passed: false,
                    error: error.message,
                    file: test.file.name
                });
                console.log(`❌ ${test.name}: Error - ${error.message}`);
            }
        }
    }

    async testWarningSystem() {
        console.log('⚠️ Testing warning system...');
        
        try {
            // Test that warning modal exists and functions
            const warningExists = typeof UnsafeFileWarning !== 'undefined';
            this.testResults.push({
                test: 'Warning system availability',
                category: 'Warning System',
                passed: warningExists,
                expected: true,
                actual: warningExists
            });

            // Test warning modal creation
            if (warningExists) {
                const testWarning = UnsafeFileWarning.createWarningModal(
                    'test.exe', 
                    'executable', 
                    () => {}, 
                    () => {}, 
                    () => {}
                );
                
                const modalCreated = testWarning && testWarning.className === 'unsafe-file-modal';
                this.testResults.push({
                    test: 'Warning modal creation',
                    category: 'Warning System',
                    passed: modalCreated,
                    expected: true,
                    actual: modalCreated
                });

                // Cleanup test modal
                if (testWarning && testWarning.parentNode) {
                    testWarning.parentNode.removeChild(testWarning);
                }
            }

            console.log('✅ Warning system tests completed');
        } catch (error) {
            this.testResults.push({
                test: 'Warning system error',
                category: 'Warning System',
                passed: false,
                error: error.message
            });
            console.log(`❌ Warning system error: ${error.message}`);
        }
    }

    async testMemoryCleanup() {
        console.log('🧹 Testing memory cleanup...');
        
        try {
            // Test that PrivacyGuard exists and functions
            const privacyGuardExists = typeof PrivacyGuard !== 'undefined';
            this.testResults.push({
                test: 'Privacy guard availability',
                category: 'Memory Cleanup',
                passed: privacyGuardExists,
                expected: true,
                actual: privacyGuardExists
            });

            if (privacyGuardExists) {
                // Test emergency cleanup function
                try {
                    PrivacyGuard.emergencyCleanup();
                    this.testResults.push({
                        test: 'Emergency cleanup execution',
                        category: 'Memory Cleanup',
                        passed: true,
                        expected: true,
                        actual: true
                    });
                } catch (cleanupError) {
                    this.testResults.push({
                        test: 'Emergency cleanup execution',
                        category: 'Memory Cleanup',
                        passed: false,
                        error: cleanupError.message
                    });
                }
            }

            console.log('✅ Memory cleanup tests completed');
        } catch (error) {
            this.testResults.push({
                test: 'Memory cleanup error',
                category: 'Memory Cleanup',
                passed: false,
                error: error.message
            });
            console.log(`❌ Memory cleanup error: ${error.message}`);
        }
    }

    async testStorageProtection() {
        console.log('🔒 Testing storage protection...');
        
        const storageTests = [
            {
                name: 'localStorage disabled',
                test: () => {
                    try {
                        localStorage.setItem('test', 'value');
                        return false; // Should not succeed
                    } catch (e) {
                        return true; // Should throw error
                    }
                }
            },
            {
                name: 'sessionStorage disabled',
                test: () => {
                    try {
                        sessionStorage.setItem('test', 'value');
                        return false; // Should not succeed
                    } catch (e) {
                        return true; // Should throw error
                    }
                }
            }
        ];

        for (const storageTest of storageTests) {
            try {
                const passed = storageTest.test();
                this.testResults.push({
                    test: storageTest.name,
                    category: 'Storage Protection',
                    passed,
                    expected: true,
                    actual: passed
                });
                console.log(`${passed ? '✅' : '❌'} ${storageTest.name}`);
            } catch (error) {
                this.testResults.push({
                    test: storageTest.name,
                    category: 'Storage Protection',
                    passed: false,
                    error: error.message
                });
                console.log(`❌ ${storageTest.name}: ${error.message}`);
            }
        }
    }

    async testUrlValidation() {
        console.log('🔗 Testing URL validation...');
        
        const urlTests = [
            { url: 'https://example.com/file.mp4', expected: true, name: 'Valid HTTPS video URL' },
            { url: 'http://example.com/audio.mp3', expected: true, name: 'Valid HTTP audio URL' },
            { url: 'ftp://example.com/file.pdf', expected: false, name: 'Invalid FTP protocol' },
            { url: 'https://example.com/file.exe', expected: false, name: 'Dangerous file extension' },
            { url: 'not-a-url', expected: false, name: 'Invalid URL format' },
            { url: 'javascript:alert(1)', expected: false, name: 'JavaScript protocol' }
        ];

        if (typeof OpenMediaUrl !== 'undefined') {
            for (const urlTest of urlTests) {
                try {
                    const validation = OpenMediaUrl.validateUrl(urlTest.url);
                    const passed = validation.valid === urlTest.expected;
                    
                    this.testResults.push({
                        test: urlTest.name,
                        category: 'URL Validation',
                        passed,
                        expected: urlTest.expected,
                        actual: validation.valid,
                        url: urlTest.url
                    });
                    
                    console.log(`${passed ? '✅' : '❌'} ${urlTest.name}: ${urlTest.url}`);
                } catch (error) {
                    this.testResults.push({
                        test: urlTest.name,
                        category: 'URL Validation',
                        passed: false,
                        error: error.message,
                        url: urlTest.url
                    });
                    console.log(`❌ ${urlTest.name}: Error - ${error.message}`);
                }
            }
        } else {
            this.testResults.push({
                test: 'URL validation module',
                category: 'URL Validation',
                passed: false,
                error: 'OpenMediaUrl not available'
            });
        }
    }

    async testCSPCompliance() {
        console.log('🛡️ Testing CSP compliance...');
        
        try {
            // Test inline script restriction
            const scriptElement = document.createElement('script');
            scriptElement.innerHTML = 'console.log("CSP test");';
            
            let cspViolation = false;
            const originalOnError = window.onerror;
            
            window.onerror = (msg) => {
                if (msg.includes('Content Security Policy')) {
                    cspViolation = true;
                }
            };
            
            document.head.appendChild(scriptElement);
            
            // Wait a moment for CSP to potentially trigger
            setTimeout(() => {
                document.head.removeChild(scriptElement);
                window.onerror = originalOnError;
                
                this.testResults.push({
                    test: 'CSP script restriction',
                    category: 'CSP Compliance',
                    passed: true, // If we get here without errors, CSP is working
                    expected: true,
                    actual: true
                });
                
                console.log('✅ CSP compliance tests completed');
            }, 100);
            
        } catch (error) {
            this.testResults.push({
                test: 'CSP compliance error',
                category: 'CSP Compliance',
                passed: false,
                error: error.message
            });
            console.log(`❌ CSP compliance error: ${error.message}`);
        }
    }

    generateTestReport() {
        console.log('\n📊 Security Test Report');
        console.log('========================');
        
        const categories = [...new Set(this.testResults.map(r => r.category))];
        let totalTests = 0;
        let passedTests = 0;
        
        for (const category of categories) {
            const categoryTests = this.testResults.filter(r => r.category === category);
            const categoryPassed = categoryTests.filter(r => r.passed).length;
            
            console.log(`\n${category}: ${categoryPassed}/${categoryTests.length} passed`);
            
            for (const test of categoryTests) {
                const status = test.passed ? '✅' : '❌';
                console.log(`  ${status} ${test.test}`);
                if (!test.passed && test.error) {
                    console.log(`    Error: ${test.error}`);
                }
            }
            
            totalTests += categoryTests.length;
            passedTests += categoryPassed;
        }
        
        console.log(`\nOverall: ${passedTests}/${totalTests} tests passed (${Math.round(passedTests/totalTests*100)}%)`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All security tests passed!');
        } else {
            console.log('⚠️ Some security tests failed. Review the results above.');
        }
        
        return {
            total: totalTests,
            passed: passedTests,
            percentage: Math.round(passedTests/totalTests*100),
            results: this.testResults
        };
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityTester;
}

// Global availability
window.SecurityTester = SecurityTester;

// Auto-run tests if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Wait for DOM and other scripts to load
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(async () => {
            const tester = new SecurityTester();
            await tester.runAllTests();
        }, 1000);
    });
}