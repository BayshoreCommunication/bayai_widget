import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function MessageList({ messages, isTyping, welcomeVideo, videoAutoplay }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Construct Video URL with Autoplay parameters
  const getVideoUrl = (url) => {
    if (!url) return "";
    try {
      const videoUrl = new URL(url);
      if (videoAutoplay) {
        // Append autoplay=1 and mute=1 (required for most browsers)
        videoUrl.searchParams.set("autoplay", "1");
        videoUrl.searchParams.set("mute", "1");
      }
      return videoUrl.toString();
    } catch (e) {
      return url;
    }
  };

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
      {/* Welcome Video - Fixed at top */}
      {welcomeVideo && (
        <div className="mb-4 overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white">
          <div className="aspect-video w-full">
            <iframe 
              src={getVideoUrl(welcomeVideo)} 
              title="Welcome Video"
              className="h-full w-full" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap break-words ${
              msg.role === 'user'
                ? 'text-white rounded-br-none'
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
            }`}
            style={msg.role === 'user' ? { backgroundColor: 'var(--primary-color)' } : {}}
          >
            {msg.text}
          </div>
        </motion.div>
      ))}

      {isTyping && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-start"
        >
          <div className="flex items-center space-x-1 rounded-2xl rounded-bl-none bg-white px-4 py-4 shadow-sm border border-gray-100">
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-0"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
