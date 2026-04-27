"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Zap, Globe, Target, Copy, Check, X } from "lucide-react";
import { api, MatchProfile } from "@/lib/api";

interface WhyMatchModalProps {
  isOpen: boolean;
  userProfile: any;
  match: MatchProfile;
  onClose: () => void;
}

interface MatchReason {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

export default function WhyMatchModal({
  isOpen,
  userProfile,
  match,
  onClose,
}: WhyMatchModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reasons, setReasons] = useState<MatchReason[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    api.getMatchExplanation(userProfile, match)
      .then(data => {
        const explanation = data.explanation || "";
        
        const generatedReasons: MatchReason[] = [
          {
            icon: Sparkles,
            title: "Vibe Sync",
            description: "You're both looking for the same connection type",
            color: "text-purple-400",
          },
          {
            icon: Heart,
            title: "Shared Interests",
            description: `You both love ${(match.Hobbies || "exploring new things").split(",")[0].trim()}`,
            color: "text-pink-400",
          },
          {
            icon: Globe,
            title: "Location Match",
            description: match.Location === userProfile?.Location 
              ? "You're in the same city!" 
              : "Different cities could mean exciting visits!",
            color: "text-cyan-400",
          },
        ];

        setReasons(generatedReasons);
        setLoading(false);
      })
      .catch(() => {
        setReasons([
          {
            icon: Sparkles,
            title: "Vibe Match",
            description: "Your energy signatures align",
            color: "text-purple-400",
          },
          {
            icon: Target,
            title: "Goals Aligned",
            description: "You're looking for the same thing",
            color: "text-pink-400",
          },
          {
            icon: Globe,
            title: "Location Match",
            description: "You're in the same area!",
            color: "text-cyan-400",
          },
        ]);
        setLoading(false);
      });
  }, [isOpen, userProfile, match]);

  const handleCopyIcebreaker = () => {
    const text = `Hey! I found us on Synch - looks like we're ${match.Compatibility_Score || 87}% compatible! What do you think? 🌟`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center pb-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-lg mx-4 p-6 glass-tactile-dark rounded-t-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Why We Match
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-full bg-white/10"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                reasons.map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <motion.div
                      key={reason.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl"
                    >
                      <div className={`p-3 rounded-xl bg-white/10 ${reason.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{reason.title}</h4>
                        <p className="text-sm text-gray-400">{reason.description}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyIcebreaker}
              className="w-full mt-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" /> Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" /> Send First Message
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}