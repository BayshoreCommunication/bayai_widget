import { useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';
import ChatHeader from './components/ChatHeader';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import defaultSettings from './config/settings.json';
import { useChatApi } from './hooks/useChatApi';

import { getSessionId, getVisitorId, resetSessionId } from './utils/session';

import LandingPage from './components/LandingPage';

function App() {
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState('');
  const [config, setConfig] = useState(defaultSettings);
  
  // Session State
  const [visitorId, setVisitorId] = useState(getVisitorId());
  const [sessionId, setSessionId] = useState(getSessionId());

  // Custom Hook
  const { sendMessage, isLoading, error } = useChatApi(apiKey, visitorId, sessionId);

  // Check for API Key immediately (simpler check than logic inside effect for rendering decision)
  const queryParams = new URLSearchParams(window.location.search);
  const hasApiKey = queryParams.has('apiKey');

  useEffect(() => {
    // If no API Key, we don't need to initialize the full chat config logic
    if (!hasApiKey) return;

    // 1. Initialize Configuration (Theme, Fonts, etc.)
    const primaryColor = config.theme?.primary_color || '#2563eb';
    
    // Auto-generate secondary color (10% darker)
    const secondaryColor = tinycolor(primaryColor).darken(10).toString();
    
    // Configured Font or default
    const fontName = config.theme?.font_family || 'Inter';
    const fontStack = `${fontName}, system-ui, -apple-system, sans-serif`;

    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    document.documentElement.style.setProperty('--font-family', fontStack);
    
    // Dynamically load Google Font if it's not a system font
    if (fontName !== 'system-ui' && fontName !== 'sans-serif') {
       const link = document.createElement('link');
       link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;500;600&display=swap`;
       link.rel = 'stylesheet';
       document.head.appendChild(link);
    }
    // 2. Set Initial Welcome Message
    if (config.behavior?.show_welcome_message && messages.length === 0) {
      setMessages([{ role: 'assistant', text: config.content?.welcome_message }]);
    }

    // Send Config to Parent (Widget Loader) to update Launcher Icon of outside
    const sendConfigToParent = () => {
      console.log("📤 React App: Sending CONFIG_UPDATED to parent", {
        primaryColor,
        logo: config.launcher?.brand_image_url
      });
      window.parent.postMessage({
        type: 'CONFIG_UPDATED',
        config: {
          primaryColor: primaryColor,
          logo: config.launcher?.brand_image_url
        }
      }, '*');
    };

    // Send immediately and retry a few times to ensure parent is ready
    sendConfigToParent();
    setTimeout(sendConfigToParent, 500);
    setTimeout(sendConfigToParent, 1500);

    // 3. Handle Auto-Open
    if (config.behavior?.auto_open) {
      setTimeout(() => {
        window.parent.postMessage('openChatbot', '*');
      }, config.behavior?.open_delay || 2000);
    }

    // Get API Key from URL params
    const params = new URLSearchParams(window.location.search);
    const key = params.get('apiKey');
    const pos = params.get('position');
    
    console.log("--------------- DEBUG: WIDGET LOADED ---------------");
    console.log("🔑 API Key from URL:", key);
    console.log("📍 Position from URL:", pos);
    console.log("🆔 Visitor ID:", visitorId);
    console.log("🆔 Session ID:", sessionId);
    
    if (key) setApiKey(key);

    // Listen for messages from parent
    const handleMessage = (event) => {
      if (event.data === 'openChat') {
         // Could assume chat is opened
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sessionId, visitorId, hasApiKey]); // Add hasApiKey to dependency


  // Conditional Render: If no API key, show Landing Page
  if (!hasApiKey) {
    return <LandingPage />;
  }

  const handleSend = async (text) => {
    console.log("📝 User Typed:", text);

    // Add user message immediately
    const userMsg = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // Call API using Hook
    const responseText = await sendMessage(text, messages);

    if (responseText) {
      setMessages(prev => [...prev, { role: 'assistant', text: responseText }]);
    } else {
      // Error is handled by the hook state, but we can show a generic fallback here if needed
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, something went wrong." }]);
    }
  };

  const handleRefresh = () => {
    // 1. Reset Session ID
    const newSessionId = resetSessionId();
    setSessionId(newSessionId);
    console.log("🔄 Session Reset. New ID:", newSessionId);

    // 2. Clear Messages
    setMessages([{ role: 'assistant', text: config.content?.welcome_message || 'Hello!' }]);
  };

  const handleClose = () => {
    window.parent.postMessage('closeChatbot', '*');
  };

  return (
    <div className="flex h-screen flex-col bg-white font-sans text-gray-900">
      <ChatHeader 
        title={config.bot_name}
        logo={config.launcher?.brand_image_url}
        onRefresh={handleRefresh} 
        onClose={handleClose} 
      />
      
      {/* Show Error Banner if Hook has error */}
      {error && (
        <div className="bg-red-50 p-2 text-center text-xs text-red-600 border-b border-red-100">
          Error: {error}
        </div>
      )}

      <MessageList 
        messages={messages} 
        isTyping={isLoading} 
        welcomeVideo={config.content?.welcome_video}
        videoAutoplay={config.content?.welcome_video_autoplay}
      />
      <MessageInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}

export default App;
