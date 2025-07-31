// メインレンダラープロセスのスクリプト

class ChatApp {
  constructor() {
    this.currentChannel = 'general';
    this.currentUser = 'あなた';
    this.messages = [];
    
    this.initializeApp();
    this.setupEventListeners();
  }

  initializeApp() {
    console.log('LazyChillRoom チャットアプリを初期化中...');
    
    // 初期メッセージをロード
    this.loadMessages();
    
    // UIを初期化
    this.initializeUI();
  }

  setupEventListeners() {
    // メッセージ入力フィールドのイベント
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });

    // チャンネル切り替え
    const channelItems = document.querySelectorAll('.channel-item');
    channelItems.forEach(item => {
      item.addEventListener('click', () => {
        this.switchChannel(item);
      });
    });

    // メンバーリストの表示/非表示
    const chatControls = document.querySelector('.chat-controls');
    if (chatControls) {
      const memberToggle = chatControls.children[1]; // 👥 ボタン
      memberToggle.addEventListener('click', () => {
        this.toggleMembersList();
      });
    }

    // ファイル添付ボタン
    const attachButton = document.querySelector('.input-btn');
    if (attachButton && attachButton.textContent === '📎') {
      attachButton.addEventListener('click', () => {
        this.attachFile();
      });
    }
  }

  initializeUI() {
    // 現在の時刻を表示
    this.updateTimestamp();
    
    // メッセージエリアを一番下にスクロール
    this.scrollToBottom();
  }

  loadMessages() {
    // ローカルストレージからメッセージを読み込み
    const savedMessages = localStorage.getItem(`messages_${this.currentChannel}`);
    if (savedMessages) {
      this.messages = JSON.parse(savedMessages);
      this.renderMessages();
    }
  }

  saveMessages() {
    // ローカルストレージにメッセージを保存
    localStorage.setItem(`messages_${this.currentChannel}`, JSON.stringify(this.messages));
  }

  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    
    if (messageText === '') return;

    const message = {
      id: Date.now(),
      author: this.currentUser,
      text: messageText,
      timestamp: new Date(),
      channel: this.currentChannel
    };

    this.messages.push(message);
    this.saveMessages();
    this.renderNewMessage(message);
    
    messageInput.value = '';
    this.scrollToBottom();

    // 将来的にはここでSocket.IOを使ってサーバーに送信
    console.log('メッセージを送信:', message);
  }

  renderNewMessage(message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = this.createMessageElement(message);
    messagesContainer.appendChild(messageElement);
  }

  renderMessages() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML = '';
    
    this.messages.forEach(message => {
      const messageElement = this.createMessageElement(message);
      messagesContainer.appendChild(messageElement);
    });
  }

  createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const timestamp = this.formatTimestamp(message.timestamp);
    const avatarLetter = message.author.charAt(0).toUpperCase();
    
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatarLetter}</div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-author">${message.author}</span>
          <span class="message-timestamp">${timestamp}</span>
        </div>
        <div class="message-text">${this.escapeHtml(message.text)}</div>
      </div>
    `;
    
    return messageDiv;
  }

  switchChannel(channelElement) {
    // 前のアクティブチャンネルを非アクティブに
    document.querySelector('.channel-item.active').classList.remove('active');
    
    // 新しいチャンネルをアクティブに
    channelElement.classList.add('active');
    
    // チャンネル名を取得
    const channelName = channelElement.querySelector('.channel-name').textContent;
    this.currentChannel = channelName;
    
    // チャットヘッダーを更新
    document.querySelector('.chat-header .channel-name').textContent = channelName;
    
    // メッセージ入力プレースホルダーを更新
    const messageInput = document.getElementById('messageInput');
    messageInput.placeholder = `#${channelName} にメッセージを送信`;
    
    // そのチャンネルのメッセージを読み込み
    this.loadMessages();
    
    console.log(`チャンネルを切り替え: #${channelName}`);
  }

  toggleMembersList() {
    const membersSidebar = document.querySelector('.members-sidebar');
    membersSidebar.style.display = membersSidebar.style.display === 'none' ? 'block' : 'none';
  }

  attachFile() {
    // 将来的にはElectronのダイアログAPIを使用
    console.log('ファイル添付機能（今後実装予定）');
    
    // 現在はアラートで代用
    alert('ファイル添付機能は今後実装予定です！');
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById('messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return `今日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  }

  updateTimestamp() {
    // リアルタイムで時刻を更新（1分ごと）
    setInterval(() => {
      const timestampElements = document.querySelectorAll('.message-timestamp');
      timestampElements.forEach(element => {
        // タイムスタンプの更新ロジック（必要に応じて）
      });
    }, 60000);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ユーザー設定を変更
  setUsername(username) {
    this.currentUser = username;
    localStorage.setItem('username', username);
    
    // ユーザー情報エリアを更新
    const usernameElement = document.querySelector('.username');
    if (usernameElement) {
      usernameElement.textContent = username;
    }
  }

  // 今後追加予定の機能
  setupSocketConnection() {
    // Socket.IOを使ったリアルタイム通信の設定
    console.log('Socket.IO接続を設定中...');
  }

  setupVoiceChat() {
    // ボイスチャット機能の設定
    console.log('ボイスチャット機能の設定中...');
  }

  setupNotifications() {
    // デスクトップ通知の設定
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  showNotification(title, message) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: './assets/icon.png'
      });
    }
  }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  const app = new ChatApp();
  
  // グローバルに公開（デバッグ用）
  window.chatApp = app;
  
  // 保存されたユーザー名を読み込み
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    app.setUsername(savedUsername);
  }
  
  console.log('LazyChillRoom が正常に起動しました！');
});
