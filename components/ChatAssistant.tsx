
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { ChatIcon, SendIcon } from './common/Icons';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hello! I'm your context-aware Network Admin Assistant, powered by Gemini. Ask me anything about this packet capture.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(newMessages);
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: aiResponse },
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-brand-gray-dark flex flex-col shadow-2xl z-50 transform transition-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-brand-gray-light flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-green p-2 rounded-md">
                <ChatIcon className="h-6 w-6 text-brand-dark" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white">Network Admin Assistant</h2>
                <p className="text-xs text-brand-gray-text">Context-aware AI powered by Gemini</p>
            </div>
          </div>
           <div className="flex items-center space-x-4">
              <span className="text-xs bg-brand-purple text-white px-2 py-1 rounded-md">1 credit/msg</span>
              <button onClick={onClose} className="text-brand-gray-text hover:text-white">&times;</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-sm rounded-lg px-4 py-2 ${
                  msg.sender === 'user' ? 'bg-brand-green text-brand-dark' : 'bg-brand-gray-light text-white'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>') }} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-sm rounded-lg px-4 py-2 bg-brand-gray-light text-white">
                 <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-brand-green rounded-full animate-pulse delay-150"></div>
                 </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-brand-gray-light">
          <div className="flex items-center bg-brand-gray-light rounded-lg">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="tell me about the risks here..."
              className="flex-1 bg-transparent p-3 text-white placeholder-brand-gray-text focus:outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || input.trim() === ''}
              className="p-3 text-brand-green disabled:text-brand-gray-text transition-colors"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
