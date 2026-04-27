"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, MapPin, BookOpen, Briefcase } from "lucide-react";
import { api } from "@/lib/api";
import { getAvatarUrl } from "@/lib/utils";

interface DirectChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {
    Name: string;
    Age: number | string;
    Vibe: string;
    City: string;
    University?: string;
    Education?: string;
    Profession?: string;
    Hobbies?: string;
    Smoking?: string;
    Diet?: string;
    Religiosity?: string;
    Comm_Style?: string;
    Gender?: string;
  };
  initialMessage?: string;
}

interface ChatMessage {
  id: number;
  sender: "user" | "match";
  message: string;
  timestamp: string;
}

export default function DirectChatModal({ isOpen, onClose, match, initialMessage }: DirectChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessage) {
      const firstMsg: ChatMessage = {
        id: 0,
        sender: "user",
        message: initialMessage,
        timestamp: "Just now"
      };
      setMessages([firstMsg]);
      setInput("");
      setLoading(true);
      
      sendToAI(initialMessage);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendToAI = async (userMessage: string) => {
    try {
      const response = await fetch("http://localhost:8001/api/chat/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_data: match,
          chat_history: [
            { role: "user", content: userMessage }
          ]
        })
      });
      
      const data = await response.json();
      
      const aiResponse: ChatMessage = {
        id: messages.length + 1,
        sender: "match",
        message: data.response,
        timestamp: "Just now"
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (e) {
      console.error(e);
      
      const errorMsg: ChatMessage = {
        id: messages.length + 1,
        sender: "match",
        message: "Hey! Sorry, I got distracted. What were you saying?",
        timestamp: "Just now"
      };
      setMessages(prev => [...prev, errorMsg]);
    }
    
    setLoading(false);
  };

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    
    const userMsg: ChatMessage = {
      id: messages.length,
      sender: "user",
      message: input,
      timestamp: "Just now"
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setSending(true);
    setLoading(true);
    
    await sendToAI(input);
    setSending(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="relative w-full sm:max-w-lg sm:rounded-2xl bg-white dark:bg-[#161618] h-[85vh] sm:h-[600px] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/8">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(match.Name)}
                    alt={match.Name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-medium dark:text-white">{match.Name}, {match.Age}</h3>
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      {match.University && (
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {match.University}
                        </span>
                      )}
                      <span>{match.Vibe}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-[#71717A]" />
                </button>
              </div>

              {/* Initial Icebreaker */}
              {initialMessage && messages.length === 1 && (
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    Icebreaker sent: "{initialMessage}"
                  </p>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-[#0D0D0F] text-gray-900 dark:text-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-blue-200" : "text-[#71717A]"
                      }`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-[#0D0D0F] px-4 py-2 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-black/5 dark:border-white/8">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-[#0D0D0F] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={sending}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}