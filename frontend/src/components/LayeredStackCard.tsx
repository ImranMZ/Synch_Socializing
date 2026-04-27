"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LucideIcon } from "lucide-react";

interface LayeredStackCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  options: {
    label: string;
    emoji?: string;
    content: string;
  }[];
  onSelect?: (index: number) => void;
  selectedIndex?: number;
}

export default function LayeredStackCard({
  title,
  icon: Icon,
  color,
  options,
  onSelect,
  selectedIndex = 0,
}: LayeredStackCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localSelected, setLocalSelected] = useState(selectedIndex);

  const currentOption = options[localSelected];

  const handleSelect = (index: number) => {
    setLocalSelected(index);
    setIsExpanded(false);
    onSelect?.(index);
  };

  return (
    <div className="relative w-full">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all duration-300 ${
          isExpanded 
            ? `${color.replace('from-', 'from-').replace(' to-', ' to-')} bg-opacity-20 border border-opacity-30`
            : `bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/8`
        }`}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <span className="text-xs font-semibold block dark:text-white">{title}</span>
          <span className="text-xs text-[#71717A] dark:text-[#A1A1AA] line-clamp-1">
            {currentOption?.label || "Tap to explore"}
          </span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className="w-4 h-4 text-[#71717A]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSelect(index)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`w-full p-3 rounded-xl text-left flex items-center gap-3 transition-all duration-200 ${
                    localSelected === index
                      ? `bg-gradient-to-br ${color} bg-opacity-20 border border-opacity-30`
                      : "bg-white/30 dark:bg-white/5 border border-transparent hover:bg-white/60 dark:hover:bg-white/10"
                  }`}
                >
                  {option.emoji && (
                    <span className="text-lg flex-shrink-0">{option.emoji}</span>
                  )}
                  <span className="flex-1 text-xs font-medium dark:text-white">{option.label}</span>
                  {localSelected === index && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-current"
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}