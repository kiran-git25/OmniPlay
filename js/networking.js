// Networking Module for OmniPlay
// Handles P2P connections, chat, and file sharing

class OmniPlayNetworking {
    constructor() {
        this.connections = new Map();
        this.isOnline = navigator.onLine;
        this.localPeerId = this.generatePeerId();
        this.rtcConfiguration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };
        this.chatHistory = [];
        this.sharedFiles = new Map();
        this.init();
    }

    init() {
        this.setupNetworkDetection();
        this.setupUI();
        this.startDiscovery();
    }

    generatePeerId() {
        return 'omni-' + Math.random().toString(36).substr(2, 9);
    }

    setupNetworkDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateNetworkStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateNetworkStatus();
        });
    }

    setupUI() {
        // Add networking UI to the main interface
        const networkingHTML = `
            <div id="networkingPanel" class="networking-panel" style="display: none;">
                <div class="network-header">
                    <h3>🌐 Network Options</h3>
                    <button id="closeNetworking" class="close-btn">×</button>
                </div>
                
                <div class="network-status">
                    <div id="networkMode" class="network-mode">
                        ${this.isOnline ? '🌍 Online Mode' : '📡 Offline Mode'}
                    </div>
                    <div id="peerId" class="peer-id">ID: ${this.localPeerId}</div>
                </div>

                <div class="network-tabs">
                    <button class="tab-btn active" data-tab="chat">💬 Chat</button>
                    <button class="tab-btn" data-tab="share">📁 Share</button>
                    <button class="tab-btn" data-tab="peers">👥 Peers</button>
                </div>

                <div id="chatTab" class="tab-content active">
                    <div id="chatMessages" class="chat-messages"></div>
                    <div class="chat-input-container">
                        <input type="text" id="chatInput" placeholder="Type a message..." maxlength="500">
                        <button id="sendMessage">Send</button>
                    </div>
                </div>

                <div id="shareTab" class="tab-content">
                    <div class="share-options">
                        <button id="shareCurrentFile" class="share-btn">📤 Share Current File</button>
                        <button id="shareNewFile" class="share-btn">📂 Share New File</button>
                    </div>
                    <div id="sharedFilesList" class="shared-files-list"></div>
                </div>

                <div id="peersTab" class="tab-content">
                    <div class="peer-discovery">
                        <button id="startDiscovery" class="discovery-btn">🔍 Discover Peers</button>
                        <button id="showQR" class="qr-btn">📱 Show QR Code</button>
                    </div>
                    <div id="peersList" class="peers-list"></div>
                </div>
            </div>

            <button id="networkingToggle" class="networking-toggle">🌐</button>
        `;

        document.body.insertAdjacentHTML('beforeend', networkingHTML);
        this.bindNetworkingEvents();
    }

    bindNetworkingEvents() {
        // Toggle networking panel
        document.getElementById('networkingToggle').addEventListener('click', () => {
            const panel = document.getElementById('networkingPanel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Close networking panel
        document.getElementById('closeNetworking').addEventListener('click', () => {
            document.getElementById('networkingPanel').style.display = 'none';
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Chat functionality
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // File sharing
        document.getElementById('shareCurrentFile').addEventListener('click', () => {
            this.shareCurrentFile();
        });

        document.getElementById('shareNewFile').addEventListener('click', () => {
            this.shareNewFile();
        });

        // Peer discovery
        document.getElementById('startDiscovery').addEventListener('click', () => {
            this.startPeerDiscovery();
        });

        document.getElementById('showQR').addEventListener('click', () => {
            this.showQRCode();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    }

    updateNetworkStatus() {
        const networkMode = document.getElementById('networkMode');
        if (networkMode) {
            networkMode.textContent = this.isOnline ? '🌍 Online Mode' : '📡 Offline Mode';
        }
    }

    // Chat functionality
    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        const chatMessage = {
            id: Date.now(),
            text: message,
            sender: this.localPeerId,
            timestamp: new Date().toLocaleTimeString(),
            type: 'message'
        };

        this.addChatMessage(chatMessage, true);
        this.broadcastToAllPeers(chatMessage);
        
        input.value = '';
        this.chatHistory.push(chatMessage);
    }

    addChatMessage(message, isLocal = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${isLocal ? 'local' : 'remote'}`;
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="sender">${isLocal ? 'You' : message.sender}</span>
                <span class="timestamp">${message.timestamp}</span>
            </div>
            <div class="message-text">${this.escapeHtml(message.text)}</div>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // File sharing functionality
    shareCurrentFile() {
        if (!window.omniplay || !window.omniplay.currentFile) {
            this.showNotification('No file is currently loaded', 'warning');
            return;
        }

        const file = window.omniplay.currentFile.file;
        this.shareFile(file);
    }

    async shareNewFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        
        input.addEventListener('change', (e) => {
            Array.from(e.target.files).forEach(file => {
                this.shareFile(file);
            });
        });
        
        input.click();
    }

    async shareFile(file) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
            this.showNotification('File too large. Maximum size is 50MB.', 'error');
            return;
        }

        const fileData = {
            id: Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: await this.fileToBase64(file),
            sender: this.localPeerId,
            timestamp: new Date().toLocaleTimeString()
        };

        this.sharedFiles.set(fileData.id, fileData);
        this.updateSharedFilesList();
        this.broadcastToAllPeers({
            type: 'file_share',
            file: fileData
        });

        this.showNotification(`Sharing "${file.name}" with connected peers`, 'success');
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    base64ToFile(base64Data, filename, mimeType) {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new File([byteArray], filename, { type: mimeType });
    }

    updateSharedFilesList() {
        const listContainer = document.getElementById('sharedFilesList');
        listContainer.innerHTML = '';

        this.sharedFiles.forEach((fileData, id) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'shared-file-item';
            fileElement.innerHTML = `
                <div class="file-info">
                    <div class="file-name">${this.escapeHtml(fileData.name)}</div>
                    <div class="file-details">${this.formatFileSize(fileData.size)} • ${fileData.timestamp}</div>
                </div>
                <button class="download-btn" onclick="networking.downloadSharedFile('${id}')">💾</button>
            `;
            listContainer.appendChild(fileElement);
        });
    }

    downloadSharedFile(fileId) {
        const fileData = this.sharedFiles.get(parseInt(fileId));
        if (!fileData) return;

        const file = this.base64ToFile(fileData.data, fileData.name, fileData.type);
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Peer discovery and connection
    startDiscovery() {
        if (this.isOnline) {
            this.startWebRTCDiscovery();
        } else {
            this.startLocalDiscovery();
        }
    }

    startWebRTCDiscovery() {
        // Simulated WebRTC peer discovery
        this.showNotification('Searching for peers via WebRTC...', 'info');
        
        // In a real implementation, this would use a signaling server
        setTimeout(() => {
            this.addDiscoveredPeer({
                id: 'demo-peer-1',
                name: 'Demo Peer',
                type: 'webrtc',
                status: 'available'
            });
        }, 2000);
    }

    startLocalDiscovery() {
        this.showNotification('Searching for local peers...', 'info');
        
        // Simulated local network discovery
        setTimeout(() => {
            this.addDiscoveredPeer({
                id: 'local-peer-1',
                name: 'Local Device',
                type: 'local',
                status: 'available'
            });
        }, 1500);
    }

    startPeerDiscovery() {
        this.startDiscovery();
    }

    addDiscoveredPeer(peerInfo) {
        const peersList = document.getElementById('peersList');
        const peerElement = document.createElement('div');
        peerElement.className = 'peer-item';
        peerElement.innerHTML = `
            <div class="peer-info">
                <div class="peer-name">${this.escapeHtml(peerInfo.name)}</div>
                <div class="peer-status">${peerInfo.type} • ${peerInfo.status}</div>
            </div>
            <button class="connect-btn" onclick="networking.connectToPeer('${peerInfo.id}')">Connect</button>
        `;
        peersList.appendChild(peerElement);
    }

    async connectToPeer(peerId) {
        this.showNotification(`Connecting to ${peerId}...`, 'info');
        
        // Simulated connection process
        setTimeout(() => {
            this.connections.set(peerId, {
                id: peerId,
                status: 'connected',
                lastSeen: Date.now()
            });
            
            this.showNotification(`Connected to ${peerId}`, 'success');
            this.updateConnectedPeersCount();
        }, 1500);
    }

    showQRCode() {
        const qrData = {
            id: this.localPeerId,
            name: 'OmniPlay User',
            type: 'connection_invite'
        };

        const modal = document.createElement('div');
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-content">
                <h3>🔗 Connection QR Code</h3>
                <div class="qr-code">
                    <div class="qr-placeholder">
                        📱<br>
                        QR Code<br>
                        ${this.localPeerId}
                    </div>
                </div>
                <p>Other devices can scan this code to connect</p>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    broadcastToAllPeers(data) {
        this.connections.forEach((connection, peerId) => {
            if (connection.status === 'connected') {
                // In a real implementation, this would send data via WebRTC or local network
                console.log(`Broadcasting to ${peerId}:`, data);
            }
        });
    }

    updateConnectedPeersCount() {
        const connectedCount = Array.from(this.connections.values())
            .filter(conn => conn.status === 'connected').length;
        
        const toggle = document.getElementById('networkingToggle');
        if (connectedCount > 0) {
            toggle.textContent = `🌐 (${connectedCount})`;
            toggle.classList.add('has-connections');
        } else {
            toggle.textContent = '🌐';
            toggle.classList.remove('has-connections');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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

    // Privacy cleanup for networking data
    cleanup() {
        this.chatHistory = [];
        this.sharedFiles.clear();
        this.connections.clear();
        
        const networkingPanel = document.getElementById('networkingPanel');
        if (networkingPanel) {
            networkingPanel.style.display = 'none';
        }
        
        console.log('🧹 Networking data cleared for privacy');
    }
}

// Initialize networking when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.networking = new OmniPlayNetworking();
    
    // Add networking cleanup to privacy guard
    if (window.PrivacyGuard) {
        const originalCleanup = PrivacyGuard.emergencyCleanup;
        PrivacyGuard.emergencyCleanup = function() {
            originalCleanup.call(this);
            if (window.networking) {
                window.networking.cleanup();
            }
        };
    }
});