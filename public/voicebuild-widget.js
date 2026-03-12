// VoiceBuild Embedded Chat Widget
// Usage: <script src="https://voicebuild.ai/widget.js?agentId=YOUR_AGENT_ID"></script>

(function() {
  // Configuration
  const API_BASE_URL = 'https://voicebuild.ai';
  const WIDGET_VERSION = '1.0.0';

  // Get agent ID from query params
  const scriptTag = document.currentScript;
  const agentId = new URLSearchParams(scriptTag.src.split('?')[1]).get('agentId');

  if (!agentId) {
    console.error('VoiceBuild Widget: agentId required in script src');
    return;
  }

  class VoiceBuildWidget {
    constructor() {
      this.isOpen = false;
      this.conversationId = null;
      this.messages = [];
      this.init();
    }

    init() {
      this.createStyles();
      this.createDOM();
      this.attachEventListeners();
      this.loadConversation();
    }

    createStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .voicebuild-widget-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          z-index: 9999;
        }

        .voicebuild-bubble {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .voicebuild-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        .voicebuild-bubble svg {
          width: 28px;
          height: 28px;
          fill: white;
        }

        .voicebuild-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 400px;
          height: 600px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .voicebuild-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .voicebuild-header {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          padding: 16px;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .voicebuild-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .voicebuild-close {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 20px;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .voicebuild-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          background: #f9fafb;
        }

        .voicebuild-message {
          margin-bottom: 12px;
          display: flex;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .voicebuild-message.user {
          justify-content: flex-end;
        }

        .voicebuild-message-content {
          max-width: 80%;
          padding: 12px 14px;
          border-radius: 8px;
          line-height: 1.4;
          font-size: 14px;
        }

        .voicebuild-message.user .voicebuild-message-content {
          background: #3b82f6;
          color: white;
          border-radius: 12px 0 12px 12px;
        }

        .voicebuild-message.agent .voicebuild-message-content {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
          border-radius: 0 12px 12px 12px;
        }

        .voicebuild-input-area {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 8px;
        }

        .voicebuild-input {
          flex: 1;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          font-family: inherit;
          resize: none;
          max-height: 100px;
        }

        .voicebuild-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .voicebuild-send {
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }

        .voicebuild-send:hover {
          background: #2563eb;
        }

        .voicebuild-send:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .voicebuild-window {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
            bottom: 0;
            right: 0;
            border-radius: 0;
          }

          .voicebuild-header {
            border-radius: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    createDOM() {
      const container = document.createElement('div');
      container.className = 'voicebuild-widget-container';

      // Bubble button
      const bubble = document.createElement('button');
      bubble.className = 'voicebuild-bubble';
      bubble.innerHTML = `
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l6.29-.97C9 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.41 0-2.73-.36-3.88-.98l-.28-.15-2.89.44.44-2.89-.15-.28C4.36 14.73 4 13.41 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z"/>
        </svg>
      `;

      // Chat window
      const window = document.createElement('div');
      window.className = 'voicebuild-window';
      window.innerHTML = `
        <div class="voicebuild-header">
          <h3>Chat with us</h3>
          <button class="voicebuild-close">×</button>
        </div>
        <div class="voicebuild-messages" id="voicebuild-messages"></div>
        <div class="voicebuild-input-area">
          <textarea class="voicebuild-input" id="voicebuild-input" placeholder="Type your message..." rows="1"></textarea>
          <button class="voicebuild-send" id="voicebuild-send">Send</button>
        </div>
      `;

      container.appendChild(bubble);
      container.appendChild(window);
      document.body.appendChild(container);

      this.bubble = bubble;
      this.window = window;
      this.messagesContainer = window.querySelector('#voicebuild-messages');
      this.input = window.querySelector('#voicebuild-input');
      this.sendBtn = window.querySelector('#voicebuild-send');
      this.closeBtn = window.querySelector('.voicebuild-close');
    }

    attachEventListeners() {
      this.bubble.addEventListener('click', () => this.toggleWindow());
      this.closeBtn.addEventListener('click', () => this.toggleWindow());
      this.sendBtn.addEventListener('click', () => this.sendMessage());
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    toggleWindow() {
      this.isOpen = !this.isOpen;
      this.window.classList.toggle('open');
      if (this.isOpen) {
        this.input.focus();
      }
    }

    async sendMessage() {
      const text = this.input.value.trim();
      if (!text) return;

      // Add user message to UI
      this.addMessage(text, 'user');
      this.input.value = '';
      this.sendBtn.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/api/agents/${agentId}/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            agentId,
            conversationId: this.conversationId,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          this.conversationId = data.conversationId;
          this.addMessage(data.reply, 'agent');
        } else {
          this.addMessage('Sorry, I encountered an error. Please try again.', 'agent');
        }
      } catch (error) {
        this.addMessage('Connection error. Please try again later.', 'agent');
      } finally {
        this.sendBtn.disabled = false;
        this.input.focus();
      }
    }

    addMessage(content, sender) {
      const messageEl = document.createElement('div');
      messageEl.className = `voicebuild-message ${sender}`;
      messageEl.innerHTML = `<div class="voicebuild-message-content">${this.escapeHtml(content)}</div>`;
      this.messagesContainer.appendChild(messageEl);
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async loadConversation() {
      // Try to load existing conversation from localStorage
      const savedConvId = localStorage.getItem(`voicebuild-conv-${agentId}`);
      if (savedConvId) {
        this.conversationId = savedConvId;
      }
    }

    escapeHtml(text) {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, (m) => map[m]);
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new VoiceBuildWidget();
    });
  } else {
    new VoiceBuildWidget();
  }
})();
