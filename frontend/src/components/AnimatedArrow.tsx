"use client";

import { motion } from "framer-motion";

interface AnimatedArrowProps {
  targetX?: number;
  targetY?: number;
}

export default function AnimatedArrow({ targetX = 0, targetY = 0 }: AnimatedArrowProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        right: 20,
        top: 20,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <svg
        width="60"
        height="80"
        viewBox="0 0 60 80"
        fill="none"
        className="drop-shadow-lg"
      >
        <motion.path
          d="M30 75 L30 25"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
        />
        <motion.path
          d="M15 40 L30 25 L45 40"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      <motion.div
        className="absolute -top-1 left-1/2 w-3 h-3 bg-blue-500 rounded-full"
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.2, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
    </motion.div>
  );
}