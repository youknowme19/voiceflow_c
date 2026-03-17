(function() {
  const script = document.currentScript;
  const agentId = script.getAttribute('data-agent-id');
  const agentName = script.getAttribute('data-agent-name') || 'AI Assistant';
  const siteUrl = script.src.split('/widget.js')[0];

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #voicebuild-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #voicebuild-launcher {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background: #6366F1;
      box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s ease;
    }
    #voicebuild-launcher:hover { transform: scale(1.1); }
    #voicebuild-iframe {
      width: 400px;
      height: 600px;
      border-radius: 20px;
      border: 1px solid rgba(0,0,0,0.1);
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: none;
      background: #fff;
      overflow: hidden;
      margin-bottom: 20px;
    }
  `;
  document.head.appendChild(style);

  // Create container
  const container = document.createElement('div');
  container.id = 'voicebuild-widget-container';
  
  const iframe = document.createElement('iframe');
  iframe.id = 'voicebuild-iframe';
  iframe.src = `${siteUrl}/chat/embed?agentId=${agentId}&name=${encodeURIComponent(agentName)}`;
  
  const launcher = document.createElement('div');
  launcher.id = 'voicebuild-launcher';
  launcher.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  
  launcher.onclick = () => {
    const isVisible = iframe.style.display === 'block';
    iframe.style.display = isVisible ? 'none' : 'block';
  };

  container.appendChild(iframe);
  container.appendChild(launcher);
  document.body.appendChild(container);
})();
