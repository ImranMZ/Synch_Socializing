"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, addToMatchHistory } from "@/lib/auth";
import { getAvatarUrl } from "@/lib/utils";
import { api, UserProfile, MatchProfile } from "@/lib/api";
import { X, Heart, Sparkles, Grid, RefreshCw, MapPin, Clock, TrendingUp } from "lucide-react";
import AIThinking from "@/components/AIThinking";
import MatchCelebration from "@/components/MatchCelebration";
import WhyMatchModal from "@/components/WhyMatchModal";
import ShareCard from "@/components/ShareCard";

type BrowseMatch = MatchProfile & {
  Compatibility_Score?: number;
  lastActive?: string;
  vibeScore?: number;
};

const VIBE_COLORS: Record<string, string> = {
  Techie: "vibe-techie",
  Artist: "vibe-artist",
  Gamer: "vibe-gamer",
  Foodie: "vibe-foodie",
  GymBro: "vibe-gymbro",
  Traveler: "vibe-traveler",
  Bookworm: "vibe-bookworm",
  Entrepreneur: "vibe-entrepreneur",
};

function MatchCardSkeleton() {
  return (
    <div className="glass dark:glass-dark rounded-[32px] overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-32 skeleton rounded-lg" />
        <div className="h-4 w-24 skeleton rounded-lg" />
        <div className="flex gap-2">
          <div className="h-6 w-16 skeleton rounded-full" />
          <div className="h-6 w-20 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

function getTimeSince(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function DiscoverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<BrowseMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "grid">("grid");
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showWhyMatch, setShowWhyMatch] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<BrowseMatch | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
    setIsAIThinking(true);
    setLoading(true);
    try {
      const payload: UserProfile = {
        Vibe: "",
        Goal: "Both",
        Gender: user?.gender || "",
        Hobbies: "",
        Smoking: "",
        Diet: "",
        Religiosity: "",
        Comm_Style: "",
        City: "",
        strict_city: false,
      };
      const data = await api.matchProfiles(payload);
      const enriched = data.map((m: MatchProfile, i: number) => ({
        ...m,
        Compatibility_Score: Math.floor(Math.random() * 20) + 80,
        lastActive: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        vibeScore: Math.floor(Math.random() * 30) + 70,
      }));
      setMatches(enriched);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setIsAIThinking(false);
  };

  const handleLike = async (match: BrowseMatch) => {
    const score = match.Compatibility_Score || Math.floor(Math.random() * 15) + 85;
    
    addToMatchHistory({
      id: Date.now().toString(),
      name: match.Name,
      avatar: getAvatarUrl(match.Name),
      vibe: match.Vibe,
      score: score,
      action: "liked",
      date: new Date().toISOString(),
    });

    if (score >= 90) {
      setSelectedMatch({ ...match, Compatibility_Score: score });
      setShowCelebration(true);
    } else {
      setSelectedMatch({ ...match, Compatibility_Score: score });
      setShowWhyMatch(true);
    }
  };

  const handleSkip = (match: BrowseMatch) => {
    addToMatchHistory({
      id: Date.now().toString(),
      name: match.Name,
      avatar: getAvatarUrl(match.Name),
      vibe: match.Vibe,
      score: 0,
      action: "skipped",
      date: new Date().toISOString(),
    });
    
    setMatches(prev => prev.filter(m => m.Name !== match.Name));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Discover</h1>
            <p className="text-[#8E8E93] text-lg">{matches.length} profiles matching your vibe</p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setViewMode(viewMode === "cards" ? "grid" : "cards")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-2xl shadow-xl transition-all ${
                viewMode === "grid" ? "bg-purple-500 text-white" : "bg-white dark:bg-[#1C1C1E] text-[#8E8E93]"
              }`}
            >
              <Grid className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              onClick={loadMatches}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="p-3 rounded-2xl bg-white dark:bg-[#1C1C1E] shadow-xl text-[#8E8E93]"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">That's everyone!</h3>
            <p className="text-[#8E8E93] mb-8 max-w-sm">You've explored all current matches. Check back later.</p>
            <motion.button
              onClick={loadMatches}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-purple-500 text-white rounded-2xl font-bold shadow-lg"
            >
              Reload Profiles
            </motion.button>
          </div>
        ) : viewMode === "cards" ? (
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {matches.slice(currentIndex, currentIndex + 1).map((match) => {
                const vibeClass = VIBE_COLORS[match.Vibe] || "vibe-techie";
                return (
                  <motion.div
                    key={match.Name}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="glass dark:glass-dark rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
                  >
                    <div className={`relative aspect-square ${vibeClass} vibe-shimmer p-8 flex items-center justify-center`}>
                      <img
                        src={getAvatarUrl(match.Name)}
                        alt={match.Name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                      <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase text-white">
                        {currentIndex + 1} / {matches.length}
                      </div>
                      <div className="absolute bottom-6 left-6 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {match.Compatibility_Score}% match
                      </div>
                    </div>

                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-extrabold tracking-tight mb-1">{match.Name}</h2>
                          <p className="text-[#8E8E93] text-sm">{match.Age} years old</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-xs font-bold">
                          {match.Vibe}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mb-6 text-sm text-[#8E8E93]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {match.City}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeSince(match.lastActive || new Date().toISOString())}
                        </span>
                      </div>

                      <p className="text-[10px] uppercase tracking-widest text-[#8E8E93] font-bold mb-3">Interests</p>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {match.Hobbies?.split(",").map((hobby, i) => (
                          <span key={i} className="px-4 py-2 bg-white/10 dark:bg-white/5 border border-white/10 rounded-xl text-sm font-semibold">
                            #{hobby.trim()}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <motion.button
                          onClick={() => handleSkip(match)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-3xl font-bold flex items-center justify-center gap-2 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                        >
                          <X className="w-6 h-6" /> Skip
                        </motion.button>
                        <motion.button
                          onClick={() => handleLike(match)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl"
                        >
                          <Heart className="w-6 h-6" /> Like
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match, index) => {
              const vibeClass = VIBE_COLORS[match.Vibe] || "vibe-techie";
              return (
                <motion.div
                  key={match.Name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass dark:glass-dark rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/10 flex flex-col"
                >
                  <div className={`relative aspect-square ${vibeClass} vibe-shimmer p-6 flex items-center justify-center overflow-hidden`}>
                    <img
                      src={getAvatarUrl(match.Name)}
                      alt={match.Name}
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10"
                    />
                    <div className="absolute top-4 right-4 px-2 py-1 bg-black/30 backdrop-blur-md rounded-full text-xs font-bold text-white">
                      {match.Compatibility_Score}%
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSkip(match); }}
                        className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleLike(match); }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                      >
                        <Heart className="w-6 h-6 fill-current" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{match.Name}, {match.Age}</h3>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r ${vibeClass} text-white`}>
                        {match.Vibe}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#8E8E93] mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{match.City}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{getTimeSince(match.lastActive || new Date().toISOString())}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {match.Hobbies?.split(",").slice(0, 3).map((hobby, i) => (
                        <span key={i} className="text-[11px] font-medium text-[#8E8E93] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                          #{hobby.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-20">
        <AIThinking isThinking={isAIThinking} />
      </div>

      <MatchCelebration
        isOpen={showCelebration}
        matchName={selectedMatch?.Name || ""}
        matchScore={selectedMatch?.Compatibility_Score || 0}
        onClose={() => setShowCelebration(false)}
      />

      <WhyMatchModal
        isOpen={showWhyMatch && !showCelebration}
        userProfile={{ Vibe: user?.vibe, City: user?.city }}
        match={selectedMatch || {}}
        onClose={() => setShowWhyMatch(false)}
      />

      <AnimatePresence>
        {showShareCard && selectedMatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareCard(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl max-w-md w-full"
            >
              <ShareCard
                userName={user?.name || "You"}
                matchName={selectedMatch.Name}
                matchScore={selectedMatch.Compatibility_Score || 0}
                matchVibe={selectedMatch.Vibe}
              />
              <motion.button
                onClick={() => setShowShareCard(false)}
                className="w-full mt-4 py-3 bg-purple-500 text-white rounded-xl font-bold"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}