// Chatbot Widget Loader Script
(function () {
  // Configuration
  const widgetConfig = {
    apiKey: document.currentScript?.getAttribute("data-api-key") || "",
    position: document.currentScript?.getAttribute("data-position") || "bottom-right",
    baseUrl: document.currentScript?.src ? new URL(document.currentScript.src).origin : "https://your-domain.com",
  };

  if (!widgetConfig.apiKey) {
    console.warn("Chatbot Widget: No API key provided.");
  }

  // Styles
  const style = document.createElement("style");
  style.textContent = `
    .chatbot-widget-container {
      position: fixed;
      z-index: 9999;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .chatbot-widget-container.bottom-left { right: auto; left: 20px; align-items: flex-start; }
    .chatbot-widget-container.top-right { bottom: auto; top: 20px; }
    .chatbot-widget-container.top-left { bottom: auto; top: 20px; right: auto; left: 20px; align-items: flex-start; }

    .chatbot-frame {
      width: 400px;
      height: 600px;
      max-height: 80vh;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 16px;
      background: #fff;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      transform-origin: bottom right;
      transition: opacity 0.3s ease, transform 0.3s ease;
      pointer-events: none;
    }
    .chatbot-frame.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    .chatbot-toggle {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      background-color: #000;
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }
    .chatbot-toggle:hover {
      transform: scale(1.05);
    }
    .chatbot-toggle svg {
      width: 32px;
      height: 32px;
    }
    .chatbot-toggle .close-icon {
      display: none;
    }
    .chatbot-toggle.open .chat-icon {
      display: none;
    }
    .chatbot-toggle.open .close-icon {
      display: block;
    }
  `;
  document.head.appendChild(style);

  // Container
  const container = document.createElement("div");
  container.className = `chatbot-widget-container ${widgetConfig.position}`;

  // Iframe
  const iframe = document.createElement("iframe");
  iframe.className = "chatbot-frame";
  // Point to the root index.html with apiKey param
  iframe.src = `${widgetConfig.baseUrl}/?apiKey=${widgetConfig.apiKey}`;
  
  // Toggle Button
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "chatbot-toggle";
  toggleBtn.innerHTML = `
    <svg class="chat-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
    <svg class="close-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;

  let isOpen = false;

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      iframe.classList.add("open");
      toggleBtn.classList.add("open");
    } else {
      iframe.classList.remove("open");
      toggleBtn.classList.remove("open");
    }
  }

  toggleBtn.onclick = toggleChat;

  container.appendChild(iframe);
  container.appendChild(toggleBtn);
  document.body.appendChild(container);

  // Listen for close requests from iframe
  window.addEventListener("message", (event) => {
    if (event.data === "closeChatbot") {
      if (isOpen) toggleChat();
    }
  });

})();
