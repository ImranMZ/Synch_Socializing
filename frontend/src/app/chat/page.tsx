"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { ArrowLeft, RefreshCw, Send, Users, BookOpen } from "lucide-react";

interface Message {
  id: number;
  name: string;
  university: string;
  university_name: string;
  city: string;
  vibe: string;
  message: string;
  timestamp: string;
}

interface Persona {
  Name: string;
  Vibe: string;
  University: string;
  UniversityName: string;
  City: string;
}

export default function ChatPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMessage, setUserMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [userParticipating, setUserParticipating] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadInitialChat = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8001/api/chat/personas", {
        method: "POST"
      });
      const personaData = await response.json();
      setPersonas(personaData || []);

      const simulateResponse = await fetch("http://localhost:8001/api/chat/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personas: personaData,
          history: [],
          user_participating: false
        })
      });
      const chatData = await simulateResponse.json();
      setMessages(chatData.messages || []);
      setRoundCount(1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadInitialChat();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() || sending) return;
    
    setSending(true);
    setUserParticipating(true);
    
    const userMsg = userMessage;
    setUserMessage("");
    
    try {
      const allMessages = [...messages];
      allMessages.push({
        id: allMessages.length,
        name: user?.name || "You",
        university: user?.university || "",
        university_name: user?.university || "",
        city: "",
        vibe: "",
        message: userMsg,
        timestamp: "Just now"
      });
      setMessages(allMessages);

      const response = await fetch("http://localhost:8001/api/chat/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personas: personas,
          history: allMessages,
          user_participating: true,
          user_message: userMsg
        })
      });
      
      const chatData = await response.json();
      setMessages(chatData.messages || allMessages);
      setRoundCount(prev => prev + 1);
    } catch (e) {
      console.error(e);
    }
    
    setSending(false);
  };

  const handleRefresh = () => {
    loadInitialChat();
    setRoundCount(0);
    setUserParticipating(false);
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
      <header className="sticky top-0 z-40 bg-white dark:bg-[#161618] border-b border-black/5 dark:border-white/8">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#71717A] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-medium dark:text-white">Community Chat</h1>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        
        {/* Persona Avatars Row */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {personas.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-full whitespace-nowrap">
                <BookOpen className="w-3 h-3 text-[#71717A]" />
                <span className="text-xs font-medium text-[#71717A]">{p.UniversityName}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-[#71717A]">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Loading chat...</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.name === user?.name || msg.name === "You" ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {msg.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`max-w-[75%] ${msg.name === user?.name || msg.name === "You" ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium dark:text-white">{msg.name}</span>
                    {msg.university_name && (
                      <span className="text-xs text-[#71717A]">• {msg.university_name}</span>
                    )}
                  </div>
                  <div className={`inline-block px-3 py-2 rounded-lg ${
                    msg.name === user?.name || msg.name === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-[#161618] border border-black/5 dark:border-white/8"
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <p className="text-xs text-[#71717A] mt-1">{msg.timestamp}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Round Indicator */}
      <div className="text-center py-2 text-xs text-[#71717A] border-t border-black/5 dark:border-white/8">
        💬 {messages.length} messages • Round {roundCount} • Chat {userParticipating ? "active" : "paused"}
      </div>

      {/* Join/Message Input */}
      <footer className="sticky bottom-0 bg-white dark:bg-[#161618] border-t border-black/5 dark:border-white/8 p-4">
        <div className="max-w-2xl mx-auto">
          {!userParticipating ? (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUserParticipating(true);
                  handleSendMessage();
                }}
                className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Join as yourself
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-white dark:bg-[#161618] border border-black/5 dark:border-white/8 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !userMessage.trim()}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}