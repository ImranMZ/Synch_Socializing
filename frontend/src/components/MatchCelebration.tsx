"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Heart, Star } from "lucide-react";

interface MatchCelebrationProps {
  isOpen: boolean;
  matchName: string;
  matchScore: number;
  onClose: () => void;
}

export default function MatchCelebration({ 
  isOpen, 
  matchName, 
  matchScore,
  onClose 
}: MatchCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative max-w-md w-full mx-4 p-8 glass-tactile-dark rounded-3xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2"
            >
              <Sparkles className="w-16 h-16 text-yellow-400" />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Heart className="w-16 h-16 mx-auto text-red-500 fill-red-500" />
              </motion.div>
              
              <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                It's a Match!
              </h2>
              
              <p className="text-xl mt-2 text-gray-300">
                with <span className="font-bold text-white">{matchName}</span>
              </p>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white">{matchScore}% Compatible</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </motion.div>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-gray-400 mt-4"
              >
                Your vibes are aligned ✨
              </motion.p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
            >
              Continue Exploring
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}