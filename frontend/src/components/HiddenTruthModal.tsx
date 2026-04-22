"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Share2, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

interface HiddenTruthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegenerate?: () => void;
  data: {
    layer_one?: string;
    layer_two?: string;
    layer_three?: string;
  } | null;
  loading?: boolean;
}

export default function HiddenTruthModal({ isOpen, onClose, onRegenerate, data, loading }: HiddenTruthModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!data) return;
    const text = `🌑 ${data.layer_one}\n\n🌘 ${data.layer_two}\n\n🌕 ${data.layer_three}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              className="relative w-full max-w-md max-h-[85vh] overflow-y-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[40px] p-6 shadow-2xl border border-white/10"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">The Hidden Truth</h2>
              </div>
              
              <p className="text-white/50 text-sm mb-6">Three layers. No filters.</p>

              {loading ? (
                <div className="flex flex-col items-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full"
                  />
                  <p className="mt-4 text-white/50">Peeling back the layers...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Layer One */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🌑</span>
                      <span className="text-white/40 text-xs uppercase tracking-widest">Layer One</span>
                    </div>
                    <p className="text-white leading-relaxed">{data?.layer_one || "..."}</p>
                  </motion.div>

                  {/* Layer Two */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 rounded-2xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🌘</span>
                      <span className="text-white/40 text-xs uppercase tracking-widest">Layer Two</span>
                    </div>
                    <p className="text-white leading-relaxed">{data?.layer_two || "..."}</p>
                  </motion.div>

                  {/* Layer Three */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-4 border border-amber-500/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🌕</span>
                      <span className="text-amber-400/80 text-xs uppercase tracking-widest">Layer Three</span>
                    </div>
                    <p className="text-white font-medium leading-relaxed">{data?.layer_three || "..."}</p>
                  </motion.div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full mt-3 bg-transparent border border-white/20 text-white/60 hover:text-white hover:border-white/40 py-3 rounded-full font-medium transition-colors"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}