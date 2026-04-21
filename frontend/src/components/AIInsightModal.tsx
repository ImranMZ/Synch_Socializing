"use client";

import { motion } from "framer-motion";
import { X, Lightbulb, MessageSquare, Sparkles, TrendingUp, FlaskConical, Zap, Heart } from "lucide-react";
import { useState } from "react";
import WavelengthChart from "./WavelengthChart";

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "explanation" | "icebreakers" | "wavelength" | "persona" | "bio" | "prediction" | "dealbreakers" | "discovery";
  data: any;
  loading?: boolean;
}

const typeConfig = {
  explanation: {
    title: "Why Do You Two Sync?",
    icon: Lightbulb,
    color: "from-yellow-500 to-orange-500",
  },
  icebreakers: {
    title: "Start the Conversation",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
  },
  wavelength: {
    title: "Wavelength Breakdown",
    icon: TrendingUp,
    color: "from-purple-500 to-pink-500",
  },
  persona: {
    title: "Your Vibe Archetype",
    icon: Sparkles,
    color: "from-blue-500 to-purple-500",
  },
  bio: {
    title: "Profile Bio Options",
    icon: FlaskConical,
    color: "from-green-500 to-teal-500",
  },
  prediction: {
    title: "If You Two Dated...",
    icon: Zap,
    color: "from-pink-500 to-red-500",
  },
  dealbreakers: {
    title: "Compatibility Insights",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
  },
  discovery: {
    title: "Discover New Interests",
    icon: Heart,
    color: "from-indigo-500 to-blue-500",
  },
};

export default function AIInsightModal({ isOpen, onClose, type, data, loading }: AIInsightModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const config = typeConfig[type];
  const Icon = config.icon;

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1C1C1E] rounded-[40px] p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-[#8E8E93]" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold">{config.title}</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="mt-4 text-[#8E8E93]">Generating insights...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {type === "explanation" && data?.explanation && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4">
                <p className="text-sm leading-relaxed">{data.explanation}</p>
              </div>
            )}

            {type === "icebreakers" && data && (
              <div className="space-y-3">
                {data.curious && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💭</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Curious</span>
                    </div>
                    <p className="text-sm">{data.curious}</p>
                  </div>
                )}
                {data.funny && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">😂</span>
                      <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Funny</span>
                    </div>
                    <p className="text-sm">{data.funny}</p>
                  </div>
                )}
                {data.bold && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">Bold</span>
                    </div>
                    <p className="text-sm">{data.bold}</p>
                  </div>
                )}
              </div>
            )}

            {type === "wavelength" && data?.dimensions && (
              <WavelengthChart data={data.dimensions} overall={data.overall} />
            )}

            {type === "persona" && data && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4">
                <div className="text-center mb-4">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="text-2xl font-bold">{data.title}</h3>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm whitespace-pre-wrap">{data.full_analysis}</p>
                </div>
              </div>
            )}

            {type === "bio" && data && (
              <div className="space-y-3">
                {data.mysterious && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌙</span>
                        <span className="text-sm font-medium">Mysterious</span>
                      </div>
                      <button
                        onClick={() => handleCopy(data.mysterious, "mysterious")}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {copied === "mysterious" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm">{data.mysterious}</p>
                  </div>
                )}
                {data.warm && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">☀️</span>
                        <span className="text-sm font-medium">Warm</span>
                      </div>
                      <button
                        onClick={() => handleCopy(data.warm, "warm")}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {copied === "warm" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm">{data.warm}</p>
                  </div>
                )}
                {data.bold && (
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <span className="text-sm font-medium">Bold</span>
                      </div>
                      <button
                        onClick={() => handleCopy(data.bold, "bold")}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {copied === "bold" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <p className="text-sm">{data.bold}</p>
                  </div>
                )}
              </div>
            )}

            {type === "prediction" && data && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-2xl p-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {data.prediction}
                  </div>
                </div>
                {data.verdict && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Verdict</p>
                    <p className="text-sm">{data.verdict}</p>
                  </div>
                )}
                {data.fun_fact && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4">
                    <p className="text-sm">✨ {data.fun_fact}</p>
                  </div>
                )}
              </div>
            )}

            {type === "dealbreakers" && data && (
              <div className="space-y-4">
                {data.insights?.map((insight: any, i: number) => (
                  <div key={i} className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <p className="text-sm font-medium">{insight.message}</p>
                        {insight.suggestion && (
                          <p className="text-sm text-[#8E8E93] mt-2">💡 {insight.suggestion}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {data.pool_estimate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                    <p className="text-sm">{data.pool_estimate}</p>
                  </div>
                )}
              </div>
            )}

            {type === "discovery" && data?.suggestions && (
              <div className="space-y-3">
                <p className="text-sm text-[#8E8E93] mb-4">Based on your {data.vibe_matched} vibe:</p>
                {data.suggestions.map((suggestion: string, i: number) => (
                  <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-medium"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  );
}