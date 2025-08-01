// Unsafe File Warning Component
class UnsafeFileWarning {
    static show(filename, fileType, onProceed, onCancel) {
        return new Promise((resolve) => {
            const modal = this.createWarningModal(filename, fileType, onProceed, onCancel, resolve);
            document.body.appendChild(modal);
            
            // Focus on cancel button by default for safety
            setTimeout(() => {
                const cancelBtn = modal.querySelector('.warning-cancel-btn');
                if (cancelBtn) cancelBtn.focus();
            }, 100);
        });
    }

    static createWarningModal(filename, fileType, onProceed, onCancel, resolve) {
        const modal = document.createElement('div');
        modal.className = 'unsafe-file-modal';
        modal.innerHTML = `
            <div class="unsafe-file-overlay">
                <div class="unsafe-file-content">
                    <div class="warning-header">
                        <span class="warning-icon">⚠️</span>
                        <h2>Potentially Unsafe File Detected</h2>
                    </div>
                    
                    <div class="warning-body">
                        <div class="file-info">
                            <strong>File:</strong> ${this.escapeHtml(filename)}<br>
                            <strong>Type:</strong> ${this.escapeHtml(fileType)}<br>
                            <strong>Risk Level:</strong> <span class="risk-high">HIGH</span>
                        </div>
                        
                        <div class="warning-message">
                            <p><strong>This file type can potentially contain malicious code.</strong></p>
                            <p>OmniPlay will only display this file as plain text for your safety. The file will NOT be executed.</p>
                            
                            <div class="safety-measures">
                                <h4>Safety Measures Active:</h4>
                                <ul>
                                    <li>✅ File content displayed as text only</li>
                                    <li>✅ No code execution allowed</li>
                                    <li>✅ Sandboxed viewing environment</li>
                                    <li>✅ No system access granted</li>
                                </ul>
                            </div>
                            
                            <div class="user-responsibilities">
                                <h4>Your Responsibilities:</h4>
                                <ul>
                                    <li>🔍 Verify the file source is trustworthy</li>
                                    <li>🚫 Do not run/execute this file outside OmniPlay</li>
                                    <li>⚡ Report suspicious files to authorities if needed</li>
                                    <li>🛡️ Use proper antivirus software on your system</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="warning-actions">
                        <button class="warning-cancel-btn" data-action="cancel">
                            🚫 Cancel - Don't Open
                        </button>
                        <button class="warning-proceed-btn" data-action="proceed">
                            👁️ View as Text Only
                        </button>
                    </div>
                    
                    <div class="warning-footer">
                        <small>OmniPlay - Privacy & Security First | File viewing only, never execution</small>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('unsafe-file-overlay')) {
                this.handleCancel(modal, onCancel, resolve);
            }
            
            const action = e.target.dataset.action;
            if (action === 'cancel') {
                this.handleCancel(modal, onCancel, resolve);
            } else if (action === 'proceed') {
                this.handleProceed(modal, onProceed, resolve);
            }
        });

        // Handle ESC key
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                this.handleCancel(modal, onCancel, resolve);
                document.removeEventListener('keydown', handleKeyDown);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return modal;
    }

    static handleCancel(modal, onCancel, resolve) {
        document.body.removeChild(modal);
        if (onCancel) onCancel();
        resolve(false);
    }

    static handleProceed(modal, onProceed, resolve) {
        document.body.removeChild(modal);
        if (onProceed) onProceed();
        resolve(true);
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static addStyles() {
        if (document.getElementById('unsafe-file-warning-styles')) return;

        const style = document.createElement('style');
        style.id = 'unsafe-file-warning-styles';
        style.textContent = `
            .unsafe-file-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .unsafe-file-overlay {
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

            .unsafe-file-content {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: modalSlideIn 0.3s ease-out;
            }

            @keyframes modalSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .warning-header {
                background: linear-gradient(135deg, #FF6B6B, #FF8E53);
                color: white;
                padding: 20px;
                border-radius: 12px 12px 0 0;
                text-align: center;
            }

            .warning-icon {
                font-size: 3rem;
                display: block;
                margin-bottom: 10px;
            }

            .warning-header h2 {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
            }

            .warning-body {
                padding: 25px;
            }

            .file-info {
                background: #FFF3CD;
                border: 1px solid #FFEAA7;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
                font-family: monospace;
                font-size: 0.9rem;
            }

            .risk-high {
                color: #DC3545;
                font-weight: bold;
                background: #F8D7DA;
                padding: 2px 6px;
                border-radius: 4px;
            }

            .warning-message p {
                color: #333;
                line-height: 1.5;
                margin-bottom: 15px;
            }

            .safety-measures, .user-responsibilities {
                margin: 20px 0;
            }

            .safety-measures h4, .user-responsibilities h4 {
                color: #2C5530;
                margin-bottom: 10px;
                font-size: 1rem;
            }

            .safety-measures ul, .user-responsibilities ul {
                margin: 0;
                padding-left: 20px;
            }

            .safety-measures li, .user-responsibilities li {
                margin: 5px 0;
                color: #555;
            }

            .warning-actions {
                padding: 20px 25px;
                background: #F8F9FA;
                border-radius: 0 0 12px 12px;
                display: flex;
                gap: 15px;
                justify-content: center;
            }

            .warning-cancel-btn, .warning-proceed-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                min-width: 150px;
            }

            .warning-cancel-btn {
                background: #DC3545;
                color: white;
            }

            .warning-cancel-btn:hover {
                background: #C82333;
                transform: translateY(-1px);
            }

            .warning-proceed-btn {
                background: #28A745;
                color: white;
            }

            .warning-proceed-btn:hover {
                background: #218838;
                transform: translateY(-1px);
            }

            .warning-footer {
                text-align: center;
                padding: 10px 25px;
                color: #666;
                font-size: 0.8rem;
                background: #F8F9FA;
            }

            @media (max-width: 768px) {
                .unsafe-file-content {
                    margin: 10px;
                    max-height: 95vh;
                }

                .warning-actions {
                    flex-direction: column;
                }

                .warning-cancel-btn, .warning-proceed-btn {
                    width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize styles when loaded
if (typeof document !== 'undefined') {
    UnsafeFileWarning.addStyles();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnsafeFileWarning;
}

// Global availability
window.UnsafeFileWarning = UnsafeFileWarning;