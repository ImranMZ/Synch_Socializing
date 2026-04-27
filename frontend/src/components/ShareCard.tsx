"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Heart, Sparkles } from "lucide-react";

interface ShareCardProps {
  matchName: string;
  matchVibe: string;
  compatibilityScore: number;
}

const GRADIENTS = {
  techie: "from-cyan-500 via-blue-500 to-purple-500",
  artist: "from-pink-500 via-purple-500 to-red-500",
  gamer: "from-green-500 via-teal-500 to-blue-500",
  foodie: "from-yellow-500 via-orange-500 to-red-500",
  default: "from-purple-500 via-pink-500 to-cyan-500",
};

export default function ShareCard({
  matchName,
  matchVibe,
  compatibilityScore,
}: ShareCardProps) {
  const [gradientKey, setGradientKey] = useState<keyof typeof GRADIENTS>("default");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const vibe = matchVibe?.toLowerCase();
    if (vibe?.includes("tech")) setGradientKey("techie");
    else if (vibe?.includes("artist")) setGradientKey("artist");
    else if (vibe?.includes("gamer")) setGradientKey("gamer");
    else if (vibe?.includes("food")) setGradientKey("foodie");
    else setGradientKey("default");
  }, [matchVibe]);

  const gradient = GRADIENTS[gradientKey];

  const downloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 400;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (gradientKey === "techie") {
      gradient.addColorStop(0, "#06B6D4");
      gradient.addColorStop(0.5, "#3B82F6");
      gradient.addColorStop(1, "#8B5CF6");
    } else if (gradientKey === "artist") {
      gradient.addColorStop(0, "#EC4899");
      gradient.addColorStop(0.5, "#8B5CF6");
      gradient.addColorStop(1, "#EF4444");
    } else if (gradientKey === "gamer") {
      gradient.addColorStop(0, "#10B981");
      gradient.addColorStop(0.5, "#06B6D4");
      gradient.addColorStop(1, "#3B82F6");
    } else {
      gradient.addColorStop(0, "#8B5CF6");
      gradient.addColorStop(0.5, "#EC4899");
      gradient.addColorStop(1, "#06B6D4");
    }

    ctx.fillStyle = "#0A0A0F";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(200, 150, 80, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(matchName || "New Match", 200, 270);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#9CA3AF";
    ctx.fillText(matchVibe || "Vibe Match", 200, 300);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(200, 420, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(`${compatibilityScore}%`, 200, 440);

    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#D1D5DB";
    ctx.fillText("Compatible", 200, 460);

    ctx.font = "12px sans-serif";
    ctx.fillStyle = "#6B7280";
    ctx.fillText("SYNCH - Find Your Vibe", 200, 550);

    const link = document.createElement("a");
    link.download = `synch-match-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-sm w-full mx-4"
      >
        <div className="relative aspect-[2/3] rounded-3xl overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-16 h-16 text-white fill-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mt-6">{matchName}</h2>
            <p className="text-white/70">{matchVibe}</p>
            
            <div className="mt-8 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full">
              <span className="text-4xl font-bold text-white">{compatibilityScore}%</span>
              <p className="text-sm text-white/70 text-center">Compatible</p>
            </div>
            
            <div className="absolute bottom-8 flex items-center gap-2 text-white/50 text-sm">
              <Sparkles className="w-4 h-4" />
              SYNCH - Find Your Vibe
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCard}
            className="flex-1 py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Download
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-4 bg-white/20 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" /> Share
          </motion.button>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </motion.div>
    </div>
  );
}