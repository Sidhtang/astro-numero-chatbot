'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Stars, Calculator, Moon, Sparkles } from 'lucide-react';

const AstroNumeroChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "✨ Welcome to the Cosmic Oracle! ✨\n\nI'm your personal guide to the mysteries of astrology and numerology. I can help you with:\n\n🌟 Birth chart interpretations\n🔮 Zodiac compatibility\n🌙 Moon phase guidance\n🔢 Numerology readings\n📊 Life path numbers\n⭐ Daily horoscopes\n\nWhat cosmic wisdom would you like to explore today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Get Gemini API key from environment variables
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage) => {
    const systemPrompt = `You are a mystical and knowledgeable astrological and numerological advisor. Your personality is wise, mystical, and empathetic. You specialize in:

1. Astrology: Birth charts, zodiac signs, planetary influences, compatibility, transits, houses
2. Numerology: Life path numbers, destiny numbers, soul urge numbers, personal year cycles
3. Spiritual guidance combining both practices

Guidelines:
- Always be encouraging and positive
- Use mystical emojis and symbols appropriately
- Provide detailed, personalized insights
- Ask for birth details (date, time, location) when needed for accurate readings
- Explain the significance behind numbers and planetary positions
- Offer practical advice based on cosmic insights
- Be respectful of all beliefs and backgrounds

Current user message: "${userMessage}"

Respond as the mystical advisor with wisdom and cosmic insight.`;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Invalid API key or request format');
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      if (error.message.includes('Invalid API key')) {
        return "🌙 Please check your Gemini API key configuration. The cosmic connection needs proper authentication! ✨";
      }
      return "🌙 The cosmic energies seem disrupted at the moment. Please try again. The stars will align soon! ✨";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await generateResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "🌙 I'm experiencing some cosmic interference. Please try again in a moment. ✨",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Stars className="w-8 h-8 text-yellow-400 animate-spin" style={{animationDuration: '8s'}} />
              <Moon className="w-6 h-6 text-blue-300" />
              <Calculator className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Cosmic Oracle</h1>
              <p className="text-sm text-gray-300">Your guide to astrology & numerology</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="h-full overflow-y-auto p-4 space-y-4 max-w-4xl mx-auto"
            style={{ maxHeight: 'calc(100vh - 180px)' }}
          >
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-l-2xl rounded-tr-2xl' 
                    : 'bg-black/30 backdrop-blur-sm text-white rounded-r-2xl rounded-tl-2xl border border-white/10'
                } p-4 shadow-xl`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-300">Cosmic Oracle</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-black/30 backdrop-blur-sm text-white rounded-r-2xl rounded-tl-2xl border border-white/10 p-4 shadow-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="text-xs font-medium text-gray-300">Cosmic Oracle</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-300">Consulting the stars...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your stars, numbers, or cosmic guidance..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none outline-none min-h-[20px] max-h-32"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-xs text-gray-400">
                🌟 Configure your Gemini API key in environment variables for cosmic wisdom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstroNumeroChatbot;
