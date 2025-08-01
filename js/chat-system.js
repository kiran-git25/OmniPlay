// Enhanced Chat System for OmniPlay
// Supports 1-to-1 and group chats with voice/video calling

class ChatSystem {
    constructor() {
        this.activeChats = new Map();
        this.activeCalls = new Map();
        this.localPeerId = this.generatePeerId();
        this.mediaConstraints = {
            audio: true,
            video: { width: 640, height: 480 }
        };
        this.localStream = null;
        this.init();
    }

    generatePeerId() {
        return 'chat-' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.setupChatUI();
        this.bindChatEvents();
        this.setupAutoCleanup();
    }

    setupChatUI() {
        const chatSystemHTML = `
            <div id="chatSystem" class="chat-system" style="display: none;">
                <div class="chat-header">
                    <h3>💬 Chat System</h3>
                    <div class="chat-controls">
                        <button id="newChatBtn" class="new-chat-btn">+ New Chat</button>
                        <button id="closeChatSystem" class="close-btn">×</button>
                    </div>
                </div>

                <div class="chat-tabs-container">
                    <div id="chatTabs" class="chat-tabs"></div>
                </div>

                <div id="chatContent" class="chat-content">
                    <div id="noChatSelected" class="no-chat-selected">
                        <h4>Select a chat or create a new one</h4>
                        <p>Your ID: <span class="user-id">${this.localPeerId}</span></p>
                    </div>
                </div>
            </div>

            <!-- New Chat Modal -->
            <div id="newChatModal" class="chat-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Chat</h3>
                        <button onclick="chatSystem.closeNewChatModal()" class="close-btn">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="chat-type-selection">
                            <label class="radio-option">
                                <input type="radio" name="chatType" value="direct" checked>
                                <span>💬 Direct Chat (1-to-1)</span>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="chatType" value="group">
                                <span>👥 Group Chat</span>
                            </label>
                        </div>
                        <div class="peer-input">
                            <label>Peer ID(s):</label>
                            <input type="text" id="peerIds" placeholder="Enter peer ID(s) separated by commas" maxlength="200">
                            <small>Example: chat-abc123def, chat-xyz789ghi</small>
                        </div>
                        <div class="chat-name-input" id="groupNameInput" style="display: none;">
                            <label>Group Name:</label>
                            <input type="text" id="groupName" placeholder="Enter group name" maxlength="50">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button onclick="chatSystem.createChat()" class="create-btn">Create Chat</button>
                        <button onclick="chatSystem.closeNewChatModal()" class="cancel-btn">Cancel</button>
                    </div>
                </div>
            </div>

            <!-- Voice/Video Call Modal -->
            <div id="callModal" class="call-modal">
                <div class="call-content">
                    <div class="call-header">
                        <h3 id="callTitle">Voice Call</h3>
                        <button onclick="chatSystem.endCall()" class="end-call-btn">📞 End Call</button>
                    </div>
                    <div class="call-body">
                        <div class="video-container">
                            <video id="localVideo" class="local-video" muted autoplay></video>
                            <video id="remoteVideo" class="remote-video" autoplay></video>
                        </div>
                        <div class="call-controls">
                            <button id="muteBtn" onclick="chatSystem.toggleMute()" class="call-control-btn">🎤</button>
                            <button id="videoBtn" onclick="chatSystem.toggleVideo()" class="call-control-btn">📹</button>
                            <button id="screenShareBtn" onclick="chatSystem.toggleScreenShare()" class="call-control-btn">🖥️</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatSystemHTML);
    }

    bindChatEvents() {
        // Open chat system
        document.getElementById('networkingToggle').addEventListener('click', () => {
            const chatSystem = document.getElementById('chatSystem');
            const networkingPanel = document.getElementById('networkingPanel');
            
            // Hide networking panel, show chat system
            if (networkingPanel) networkingPanel.style.display = 'none';
            chatSystem.style.display = chatSystem.style.display === 'none' ? 'block' : 'none';
        });

        // Close chat system
        document.getElementById('closeChatSystem').addEventListener('click', () => {
            this.closeChatSystem();
        });

        // New chat button
        document.getElementById('newChatBtn').addEventListener('click', () => {
            this.showNewChatModal();
        });

        // Chat type selection
        document.querySelectorAll('input[name="chatType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const groupNameInput = document.getElementById('groupNameInput');
                groupNameInput.style.display = e.target.value === 'group' ? 'block' : 'none';
            });
        });

        // Auto-cleanup on window close/refresh
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });

        // Auto-cleanup on visibility change (tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.cleanup();
            }
        });
    }

    setupAutoCleanup() {
        // Clean up inactive chats every 30 seconds
        setInterval(() => {
            this.cleanupInactiveChats();
        }, 30000);
    }

    showNewChatModal() {
        document.getElementById('newChatModal').style.display = 'flex';
    }

    closeNewChatModal() {
        document.getElementById('newChatModal').style.display = 'none';
        // Clear form
        document.getElementById('peerIds').value = '';
        document.getElementById('groupName').value = '';
        document.querySelector('input[value="direct"]').checked = true;
        document.getElementById('groupNameInput').style.display = 'none';
    }

    createChat() {
        const chatType = document.querySelector('input[name="chatType"]:checked').value;
        const peerIdsInput = document.getElementById('peerIds').value.trim();
        const groupName = document.getElementById('groupName').value.trim();

        if (!peerIdsInput) {
            this.showNotification('Please enter at least one peer ID', 'warning');
            return;
        }

        const peerIds = peerIdsInput.split(',').map(id => id.trim()).filter(id => id);
        
        if (peerIds.length === 0) {
            this.showNotification('Please enter valid peer IDs', 'warning');
            return;
        }

        if (chatType === 'group' && !groupName) {
            this.showNotification('Please enter a group name', 'warning');
            return;
        }

        const chatId = this.generateChatId();
        const chat = {
            id: chatId,
            type: chatType,
            participants: [this.localPeerId, ...peerIds],
            name: chatType === 'group' ? groupName : peerIds[0],
            messages: [],
            lastActivity: Date.now(),
            isActive: true
        };

        this.activeChats.set(chatId, chat);
        this.createChatTab(chat);
        this.switchToChat(chatId);
        this.closeNewChatModal();

        this.showNotification(`${chatType === 'group' ? 'Group' : 'Direct'} chat created`, 'success');
    }

    generateChatId() {
        return 'chat-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    }

    createChatTab(chat) {
        const tabsContainer = document.getElementById('chatTabs');
        const tab = document.createElement('div');
        tab.className = 'chat-tab';
        tab.dataset.chatId = chat.id;
        tab.innerHTML = `
            <span class="tab-name">${this.escapeHtml(chat.name)}</span>
            <button onclick="chatSystem.closeChat('${chat.id}')" class="tab-close">×</button>
        `;
        
        tab.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                this.switchToChat(chat.id);
            }
        });

        tabsContainer.appendChild(tab);
    }

    switchToChat(chatId) {
        // Update tab states
        document.querySelectorAll('.chat-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-chat-id="${chatId}"]`).classList.add('active');

        // Show chat interface
        this.renderChatInterface(chatId);
    }

    renderChatInterface(chatId) {
        const chat = this.activeChats.get(chatId);
        if (!chat) return;

        const content = document.getElementById('chatContent');
        content.innerHTML = `
            <div class="active-chat">
                <div class="chat-info">
                    <h4>${this.escapeHtml(chat.name)}</h4>
                    <div class="chat-actions">
                        <button onclick="chatSystem.startVoiceCall('${chatId}')" class="call-btn voice">📞</button>
                        <button onclick="chatSystem.startVideoCall('${chatId}')" class="call-btn video">📹</button>
                        <button onclick="chatSystem.shareFileInChat('${chatId}')" class="share-btn">📎</button>
                    </div>
                </div>
                
                <div id="chatMessages-${chatId}" class="chat-messages-container">
                    ${this.renderMessages(chat.messages)}
                </div>
                
                <div class="chat-input-area">
                    <input type="text" id="messageInput-${chatId}" placeholder="Type a message..." maxlength="500" 
                           onkeypress="if(event.key==='Enter') chatSystem.sendMessage('${chatId}')">
                    <button onclick="chatSystem.sendMessage('${chatId}')" class="send-btn">Send</button>
                </div>
            </div>
        `;

        document.getElementById('noChatSelected').style.display = 'none';
    }

    renderMessages(messages) {
        if (messages.length === 0) {
            return '<div class="no-messages">No messages yet. Start the conversation!</div>';
        }

        return messages.map(msg => `
            <div class="message ${msg.sender === this.localPeerId ? 'own' : 'other'}">
                <div class="message-header">
                    <span class="sender">${msg.sender === this.localPeerId ? 'You' : this.escapeHtml(msg.sender)}</span>
                    <span class="timestamp">${new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
                <div class="message-content">
                    ${msg.type === 'file' ? this.renderFileMessage(msg) : this.escapeHtml(msg.content)}
                </div>
            </div>
        `).join('');
    }

    renderFileMessage(msg) {
        return `
            <div class="file-message">
                <div class="file-icon">📁</div>
                <div class="file-info">
                    <div class="file-name">${this.escapeHtml(msg.fileName)}</div>
                    <div class="file-size">${this.formatFileSize(msg.fileSize)}</div>
                </div>
                <button onclick="chatSystem.downloadChatFile('${msg.fileId}')" class="download-file-btn">💾</button>
            </div>
        `;
    }

    sendMessage(chatId) {
        const input = document.getElementById(`messageInput-${chatId}`);
        const content = input.value.trim();
        
        if (!content) return;

        const message = {
            id: Date.now(),
            sender: this.localPeerId,
            content: content,
            timestamp: Date.now(),
            type: 'text'
        };

        this.addMessageToChat(chatId, message);
        input.value = '';
        
        // Simulate sending to peers
        this.broadcastMessage(chatId, message);
    }

    addMessageToChat(chatId, message) {
        const chat = this.activeChats.get(chatId);
        if (!chat) return;

        chat.messages.push(message);
        chat.lastActivity = Date.now();

        // Update UI
        const messagesContainer = document.getElementById(`chatMessages-${chatId}`);
        if (messagesContainer) {
            messagesContainer.innerHTML = this.renderMessages(chat.messages);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    async shareFileInChat(chatId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.size > 25 * 1024 * 1024) { // 25MB limit for chat
                this.showNotification('File too large for chat. Maximum size is 25MB.', 'error');
                return;
            }

            const fileMessage = {
                id: Date.now(),
                sender: this.localPeerId,
                type: 'file',
                fileName: file.name,
                fileSize: file.size,
                fileId: 'file-' + Date.now(),
                timestamp: Date.now(),
                fileData: await this.fileToBase64(file)
            };

            this.addMessageToChat(chatId, fileMessage);
            this.broadcastMessage(chatId, fileMessage);
            this.showNotification(`File "${file.name}" shared in chat`, 'success');
        });
        
        input.click();
    }

    async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    downloadChatFile(fileId) {
        // Find the file message across all chats
        for (const [chatId, chat] of this.activeChats) {
            const fileMessage = chat.messages.find(msg => msg.fileId === fileId);
            if (fileMessage) {
                const file = this.base64ToFile(fileMessage.fileData, fileMessage.fileName);
                const url = URL.createObjectURL(file);
                const a = document.createElement('a');
                a.href = url;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                break;
            }
        }
    }

    base64ToFile(base64Data, filename) {
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        return new File([byteArray], filename);
    }

    // Voice/Video calling functions
    async startVoiceCall(chatId) {
        await this.startCall(chatId, false);
    }

    async startVideoCall(chatId) {
        await this.startCall(chatId, true);
    }

    async startCall(chatId, includeVideo) {
        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: includeVideo
            });

            const callModal = document.getElementById('callModal');
            const callTitle = document.getElementById('callTitle');
            const localVideo = document.getElementById('localVideo');

            callTitle.textContent = includeVideo ? 'Video Call' : 'Voice Call';
            callModal.style.display = 'flex';

            if (includeVideo) {
                localVideo.srcObject = this.localStream;
                localVideo.style.display = 'block';
            } else {
                localVideo.style.display = 'none';
            }

            // Store call info
            this.activeCalls.set(chatId, {
                stream: this.localStream,
                isVideo: includeVideo,
                isMuted: false,
                isVideoEnabled: includeVideo
            });

            this.showNotification(`${includeVideo ? 'Video' : 'Voice'} call started`, 'success');
            
            // Simulate call to peers
            this.broadcastCallInvite(chatId, includeVideo);

        } catch (error) {
            this.showNotification('Could not access camera/microphone', 'error');
            console.error('Call error:', error);
        }
    }

    toggleMute() {
        const callInfo = Array.from(this.activeCalls.values())[0];
        if (!callInfo) return;

        const audioTrack = callInfo.stream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            callInfo.isMuted = !audioTrack.enabled;
            
            const muteBtn = document.getElementById('muteBtn');
            muteBtn.textContent = callInfo.isMuted ? '🔇' : '🎤';
        }
    }

    toggleVideo() {
        const callInfo = Array.from(this.activeCalls.values())[0];
        if (!callInfo) return;

        const videoTrack = callInfo.stream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            callInfo.isVideoEnabled = videoTrack.enabled;
            
            const videoBtn = document.getElementById('videoBtn');
            videoBtn.textContent = callInfo.isVideoEnabled ? '📹' : '📷';
        }
    }

    async toggleScreenShare() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            const localVideo = document.getElementById('localVideo');
            localVideo.srcObject = screenStream;

            this.showNotification('Screen sharing started', 'success');

            // Stop screen share when user stops it
            screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                if (this.localStream) {
                    localVideo.srcObject = this.localStream;
                }
                this.showNotification('Screen sharing stopped', 'info');
            });

        } catch (error) {
            this.showNotification('Could not start screen sharing', 'error');
        }
    }

    endCall() {
        // Stop all tracks
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        // Clear active calls
        this.activeCalls.clear();

        // Hide call modal
        document.getElementById('callModal').style.display = 'none';

        this.showNotification('Call ended', 'info');
    }

    broadcastMessage(chatId, message) {
        const chat = this.activeChats.get(chatId);
        if (!chat) return;

        // Simulate broadcasting to peers
        console.log(`Broadcasting message to chat ${chatId}:`, message);
    }

    broadcastCallInvite(chatId, isVideo) {
        const chat = this.activeChats.get(chatId);
        if (!chat) return;

        console.log(`Inviting peers to ${isVideo ? 'video' : 'voice'} call in chat ${chatId}`);
    }

    closeChat(chatId) {
        // Remove from active chats
        this.activeChats.delete(chatId);

        // Remove tab
        const tab = document.querySelector(`[data-chat-id="${chatId}"]`);
        if (tab) {
            tab.remove();
        }

        // If this was the active chat, show no chat selected
        if (document.querySelector('.active-chat')) {
            document.getElementById('chatContent').innerHTML = `
                <div id="noChatSelected" class="no-chat-selected">
                    <h4>Select a chat or create a new one</h4>
                    <p>Your ID: <span class="user-id">${this.localPeerId}</span></p>
                </div>
            `;
        }

        this.showNotification('Chat closed and data cleared', 'info');
    }

    closeChatSystem() {
        // Auto-delete all chats and clear data
        this.cleanup();
        document.getElementById('chatSystem').style.display = 'none';
        this.showNotification('Chat system closed, all data cleared', 'info');
    }

    cleanupInactiveChats() {
        const now = Date.now();
        const INACTIVE_THRESHOLD = 30 * 60 * 1000; // 30 minutes

        for (const [chatId, chat] of this.activeChats) {
            if (now - chat.lastActivity > INACTIVE_THRESHOLD) {
                this.closeChat(chatId);
                console.log(`Auto-closed inactive chat: ${chatId}`);
            }
        }
    }

    cleanup() {
        // End any active calls
        if (this.activeCalls.size > 0) {
            this.endCall();
        }

        // Clear all chats
        this.activeChats.clear();

        // Clear UI
        document.getElementById('chatTabs').innerHTML = '';
        document.getElementById('chatContent').innerHTML = `
            <div id="noChatSelected" class="no-chat-selected">
                <h4>Select a chat or create a new one</h4>
                <p>Your ID: <span class="user-id">${this.localPeerId}</span></p>
            </div>
        `;

        console.log('🧹 Chat system data cleared for privacy');
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
}

// Initialize chat system
document.addEventListener('DOMContentLoaded', () => {
    window.chatSystem = new ChatSystem();
    
    // Integrate with privacy guard
    if (window.PrivacyGuard) {
        const originalCleanup = PrivacyGuard.emergencyCleanup;
        PrivacyGuard.emergencyCleanup = function() {
            originalCleanup.call(this);
            if (window.chatSystem) {
                window.chatSystem.cleanup();
            }
        };
    }
});