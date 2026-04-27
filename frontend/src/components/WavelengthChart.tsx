"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface WavelengthChartProps {
  data: {
    vibe_sync: number;
    lifestyle: number;
    communication: number;
    goals: number;
    curiosity: number;
  };
  overall: number;
}

export default function WavelengthChart({ data, overall }: WavelengthChartProps) {
  const [animatedData, setAnimatedData] = useState({
    vibe_sync: 0,
    lifestyle: 0,
    communication: 0,
    goals: 0,
    curiosity: 0,
  });
  const [animatedOverall, setAnimatedOverall] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedData({
        vibe_sync: Math.round(data.vibe_sync * easeOut),
        lifestyle: Math.round(data.lifestyle * easeOut),
        communication: Math.round(data.communication * easeOut),
        goals: Math.round(data.goals * easeOut),
        curiosity: Math.round(data.curiosity * easeOut),
      });
      setAnimatedOverall(Math.round(overall * easeOut));
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, [data, overall]);

  const chartData = [
    { subject: "Vibe", value: animatedData.vibe_sync, fullMark: 100 },
    { subject: "Lifestyle", value: animatedData.lifestyle, fullMark: 100 },
    { subject: "Comm", value: animatedData.communication, fullMark: 100 },
    { subject: "Goals", value: animatedData.goals, fullMark: 100 },
    { subject: "Curiosity", value: animatedData.curiosity, fullMark: 100 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative"
        >
          <motion.span
            key={animatedOverall}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent"
          >
            {animatedOverall}%
          </motion.span>
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -right-6 -top-2 text-xs"
          >
            ✨
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="rgba(139, 92, 246, 0.3)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#A1A1AA", fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              name="Compatibility"
              dataKey="value"
              stroke="url(#gradient)"
              fill="url(#gradient)"
              fillOpacity={0.4}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#8B5CF6",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-5 gap-1 mt-2 text-center"
      >
        {[
          { label: "Vibe", value: animatedData.vibe_sync, color: "text-purple-400" },
          { label: "Life", value: animatedData.lifestyle, color: "text-cyan-400" },
          { label: "Comm", value: animatedData.communication, color: "text-pink-400" },
          { label: "Goals", value: animatedData.goals, color: "text-green-400" },
          { label: "Curious", value: animatedData.curiosity, color: "text-yellow-400" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className={`text-xs font-bold ${item.color}`}>{item.value}%</p>
            <p className="text-[10px] text-gray-500">{item.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}