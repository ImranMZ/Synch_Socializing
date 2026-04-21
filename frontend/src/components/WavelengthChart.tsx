"use client";

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
  const chartData = [
    { subject: "Vibe Sync", value: data.vibe_sync, fullMark: 100 },
    { subject: "Lifestyle", value: data.lifestyle, fullMark: 100 },
    { subject: "Communication", value: data.communication, fullMark: 100 },
    { subject: "Goals", value: data.goals, fullMark: 100 },
    { subject: "Curiosity", value: data.curiosity, fullMark: 100 },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            {overall}%
          </span>
          <p className="text-sm text-[#8E8E93]">Overall Wavelength</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#6B7280", fontSize: 10 }}
          />
          <Radar
            name="Compatibility"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.5}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[#8E8E93]">Vibe Sync: {data.vibe_sync}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-[#8E8E93]">Lifestyle: {data.lifestyle}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500" />
          <span className="text-[#8E8E93]">Comm: {data.communication}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[#8E8E93]">Goals: {data.goals}%</span>
        </div>
      </div>
    </div>
  );
}