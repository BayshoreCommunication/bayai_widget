import { useCallback, useState } from 'react';

export const useChatApi = (apiKey, visitorId, sessionId) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (message, history = []) => {
    setIsLoading(true);
    setError(null);

    const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/ask`;

    try {
      console.log("📡 HOOK: Sending request to:", API_URL);
      console.log("🆔 Headers:", { "X-Visitor-ID": visitorId, "X-Session-ID": sessionId });
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
          "X-Visitor-ID": visitorId,
          "X-Session-ID": sessionId
        },
        body: JSON.stringify({
          message,
          history // Optional: Pass history if backend supports it
        }),
      });

      const data = await response.json();
      console.log("📥 HOOK: API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      return data.answer || data.message || "No response text received.";

    } catch (err) {
      console.error("❌ HOOK Error:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, visitorId, sessionId]);

  return {
    sendMessage,
    isLoading,
    error
  };
};
