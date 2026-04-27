"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, RefreshCw, Send, Users, GraduationCap, MessageCircle, Sparkles } from "lucide-react";

interface Message {
  id: number;
  name: string;
  university: string;
  university_name: string;
  city: string;
  vibe: string;
  message: string;
  timestamp: string;
  isUser?: boolean;
}

interface Persona {
  Name: string;
  Vibe: string;
  University: string;
  UniversityName: string;
  City: string;
  Hobbies?: string;
  personality?: string;
}

const VIBE_COLORS: Record<string, string> = {
  "Techie": "bg-cyan-500/20 text-cyan-600",
  "Gamer": "bg-purple-500/20 text-purple-600",
  "GymBro": "bg-red-500/20 text-red-600",
  "Bookworm": "bg-amber-500/20 text-amber-600",
  "Foodie": "bg-orange-500/20 text-orange-600",
  "Artist": "bg-pink-500/20 text-pink-600",
  "Traveler": "bg-green-500/20 text-green-600",
  "Fashionista": "bg-violet-500/20 text-violet-600",
  "Entrepreneur": "bg-blue-500/20 text-blue-600",
};

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMessage, setUserMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadInitialChat = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/api/chat/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personas: [],
          history: [],
          user_participating: false,
          user_message: ""
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const chatData = await response.json();
      setPersonas(chatData.personas || []);
      
      const newMessages = (chatData.messages || []).map((msg: any, idx: number) => ({
        ...msg,
        id: idx,
        isUser: false
      }));
      setMessages(newMessages);
    } catch (e: any) {
      console.error("Chat load error:", e);
      setError(e.message || "Failed to load chat. Tap refresh to retry.");
      
      const mockMessages: Message[] = [
        { id: 0, name: "Ahmed Khan", university: "NUST", university_name: "NUST", city: "Islamabad", vibe: "Techie", message: "Hey everyone! How's it going?", timestamp: "Just now", isUser: false },
        { id: 1, name: "Fatima Ali", university: "LU", university_name: "Lahore University", city: "Lahore", vibe: "Bookworm", message: "Just finished my midterm exams, so relieved!", timestamp: "Just now", isUser: false },
        { id: 2, name: "Hassan Raza", university: "PU", university_name: "Punjab University", city: "Lahore", vibe: "GymBro", message: "Anyone up for coffee later?", timestamp: "Just now", isUser: false },
      ];
      setMessages(mockMessages);
      setPersonas([
        { Name: "Ahmed Khan", Vibe: "Techie", University: "NUST", UniversityName: "NUST", City: "Islamabad" },
        { Name: "Fatima Ali", Vibe: "Bookworm", University: "LU", UniversityName: "Lahore University", City: "Lahore" },
        { Name: "Hassan Raza", Vibe: "GymBro", University: "PU", UniversityName: "Punjab University", City: "Lahore" },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadInitialChat();
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || sending) return;
    
    setSending(true);
    setIsTyping(true);
    
    const userMsg = userMessage.trim();
    const userMsgObj: Message = {
      id: messages.length,
      name: user?.name || "You",
      university: "",
      university_name: user?.university || "",
      city: "",
      vibe: "",
      message: userMsg,
      timestamp: "Just now",
      isUser: true
    };
    
    setUserMessage("");
    setMessages(prev => [...prev, userMsgObj]);

    try {
      const response = await fetch("http://localhost:8001/api/chat/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personas: personas,
          history: messages.map(m => ({ type: m.isUser ? "user" : "persona", name: m.name, message: m.message })),
          user_participating: true,
          user_message: userMsg
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const chatData = await response.json();
      const newMessages = (chatData.messages || []).map((msg: any, idx: number) => ({
        ...msg,
        id: messages.length + idx + 1,
        isUser: false
      }));
      
      setMessages(prev => [...prev, ...newMessages]);
    } catch (e: any) {
      console.error("Send message error:", e);
      const fallbackMsg: Message = {
        id: messages.length + 1,
        name: "AI Bot",
        university: "NUST",
        university_name: "NUST",
        city: "Islamabad",
        vibe: "Techie",
        message: "Thanks for the message! The community is active. Check back soon for responses.",
        timestamp: "Just now",
        isUser: false
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
    
    setSending(false);
    setIsTyping(false);
  };

  const handleRefresh = () => {
    loadInitialChat();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getVibeColor = (vibe: string) => {
    return VIBE_COLORS[vibe] || "bg-gray-500/20 text-gray-600";
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#161618]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/8">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#71717A] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h1 className="text-lg font-semibold dark:text-white">Community Chat</h1>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-full transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        
        {/* Persona Cards */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-[#71717A]">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Loading personas...
              </div>
            ) : (
              personas.map((p, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/60 dark:bg-white/5 rounded-full whitespace-nowrap border border-black/5 dark:border-white/10"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-white">
                      {getInitials(p.Name)}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#71717A] dark:text-[#A1A1AA]">{p.UniversityName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getVibeColor(p.Vibe)}`}>
                    {p.Vibe}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[#71717A]">Loading chat...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-sm text-[#71717A] text-center">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm text-[#71717A]">Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.isUser ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isUser 
                      ? "bg-blue-500" 
                      : msg.vibe === "Techie" ? "bg-cyan-500" :
                        msg.vibe === "Gamer" ? "bg-purple-500" :
                        msg.vibe === "GymBro" ? "bg-red-500" :
                        msg.vibe === "Bookworm" ? "bg-amber-500" :
                        msg.vibe === "Foodie" ? "bg-orange-500" :
                        msg.vibe === "Artist" ? "bg-pink-500" :
                        msg.vibe === "Traveler" ? "bg-green-500" :
                        msg.vibe === "Fashionista" ? "bg-violet-500" :
                        msg.vibe === "Entrepreneur" ? "bg-blue-500" :
                        "bg-gray-500"
                  }`}>
                    <span className="text-xs font-medium text-white">
                      {getInitials(msg.name)}
                    </span>
                  </div>
                  
                  {/* Message Content */}
                  <div className={`max-w-[75%] ${msg.isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium dark:text-white">{msg.name}</span>
                      {msg.university_name && !msg.isUser && (
                        <span className="text-xs text-[#71717A]">• {msg.university_name}</span>
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`px-4 py-2.5 rounded-2xl ${
                      msg.isUser
                        ? "bg-blue-500 text-white rounded-br-md"
                        : "bg-white dark:bg-[#161618] border border-black/5 dark:border-white/8 rounded-bl-md"
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    
                    <span className="text-xs text-[#71717A]">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">...</span>
                  </div>
                  <div className="bg-white dark:bg-[#161618] border border-black/5 dark:border-white/8 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-[#71717A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Count */}
      <div className="text-center py-2 text-xs text-[#71717A] border-t border-black/5 dark:border-white/8">
        💬 {messages.length} messages • Chat active
      </div>

      {/* Message Input */}
      <footer className="sticky bottom-0 bg-white/80 dark:bg-[#161618]/80 backdrop-blur-xl border-t border-black/5 dark:border-white/8 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white dark:bg-[#0D0D0F] border border-black/10 dark:border-white/10 rounded-full text-sm focus:outline-none focus:border-blue-500 placeholder:text-[#71717A]"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !userMessage.trim()}
              className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}