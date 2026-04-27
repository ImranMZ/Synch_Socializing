"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, Zap, Heart, Star, Users } from "lucide-react";

interface DemoModeProps {
  children: React.ReactNode;
}

export default function DemoMode({ children }: DemoModeProps) {
  const router = useRouter();
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStats, setDemoStats] = useState({
    onlineUsers: 247,
    matchesToday: 18,
    avgCompatibility: 87,
  });
  const [keyCount, setKeyCount] = useState(0);
  const [lastKeyTime, setLastKeyTime] = useState(0);

  const triggerDemo = useCallback(() => {
    setIsDemoMode(true);
    
    setTimeout(() => setIsDemoMode(false), 5000);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "d" || e.key === "D") {
        const now = Date.now();
        
        if (now - lastKeyTime < 500) {
          setKeyCount(prev => {
            const newCount = prev + 1;
            if (newCount >= 3) {
              triggerDemo();
              return 0;
            }
            return newCount;
          });
        } else {
          setKeyCount(1);
        }
        setLastKeyTime(now);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [lastKeyTime, triggerDemo]);

  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setDemoStats(prev => ({
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 5) - 2,
        matchesToday: prev.matchesToday + (Math.random() > 0.7 ? 1 : 0),
        avgCompatibility: Math.min(99, prev.avgCompatibility + Math.floor(Math.random() * 3) - 1),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  return (
    <>
      {children}
      
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-2xl shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-white animate-pulse" />
                <span className="text-white font-bold">DEMO MODE</span>
              </div>
              
              <div className="flex items-center gap-6 mt-3 text-white/90 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{demoStats.onlineUsers} online</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{demoStats.matchesToday} matches</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>{demoStats.avgCompatibility}% avg</span>
                </div>
              </div>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                router.push("/discover");
                setTimeout(() => setIsDemoMode(false), 1000);
              }}
              className="px-4 py-2 bg-white text-black rounded-xl font-medium text-sm shadow-lg"
            >
              Start Demo →
            </motion.button>
          </div>
        </motion.div>
      )}
    </>
  );
}