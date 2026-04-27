"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Zap, Loader } from "lucide-react";

interface AIThinkingProps {
  isThinking: boolean;
  messages?: string[];
  onComplete?: () => void;
}

const defaultMessages = [
  "Analyzing 30,000+ profiles...",
  "Calculating vibe compatibility...",
  "Finding your perfect match...",
  "Generating personalized icebreakers...",
];

export default function AIThinking({ 
  isThinking, 
  messages = defaultMessages,
  onComplete 
}: AIThinkingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!isThinking) {
      setDisplayText("");
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(0);
  }, [isThinking]);

  useEffect(() => {
    if (!isThinking || currentIndex >= messages.length) return;

    const message = messages[currentIndex];
    setDisplayText("");

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= message.length) {
        setDisplayText(message.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        
        setTimeout(() => {
          if (currentIndex < messages.length - 1) {
            setCurrentIndex(currentIndex + 1);
          } else {
            onComplete?.();
          }
        }, 400);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [isThinking, currentIndex, messages, onComplete]);

  useEffect(() => {
    if (!isThinking) return;
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, [isThinking]);

  if (!isThinking) return null;

  const getIcon = () => {
    const icons = [Brain, Sparkles, Zap, Loader];
    const Icon = icons[currentIndex % icons.length] || Brain;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 px-4 py-3 glass-tactile rounded-2xl"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-purple-400"
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>
      
      <div className="flex flex-col">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2"
        >
          <span className="text-purple-400 text-sm font-medium">
            {displayText}
          </span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="w-0.5 h-4 bg-purple-400"
          />
        </motion.div>
        
        <div className="flex gap-1 mt-1">
          {messages.map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.3 }}
              animate={{ 
                scale: i <= currentIndex ? 1 : 0.8, 
                opacity: i <= currentIndex ? 1 : 0.3 
              }}
              className={`w-1.5 h-1.5 rounded-full ${
                i <= currentIndex ? "bg-purple-400" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}