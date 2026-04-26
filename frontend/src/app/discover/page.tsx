"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, Filter, Grid, RefreshCw, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useAuth, addToMatchHistory } from "@/lib/auth";
import { getAvatarUrl } from "@/lib/utils";
import { api, UserProfile } from "@/lib/api";

type BrowseMatch = {
  Name: string;
  Gender: string;
  Age: number;
  Location: string;
  Education: string;
  Profession: string;
  Vibe: string;
  Hobbies: string;
};

export default function DiscoverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<BrowseMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "grid">("grid");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadMatches();
  }, [user]);

  const loadMatches = async () => {
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
      setMatches(data);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleLike = async (match: BrowseMatch) => {
    addToMatchHistory({
      id: Date.now().toString(),
      name: match.Name,
      avatar: getAvatarUrl(match.Name),
      vibe: match.Vibe,
      score: 85,
      action: "liked",
      date: new Date().toISOString(),
    });
    
    setMatches(prev => prev.filter(m => m.Name !== match.Name));
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
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontVariationSettings: '"wght" 800' }}>Discover</h1>
            <p className="text-[#8E8E93] text-lg">Browse 30,000+ profiles in your vibe</p>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setViewMode(viewMode === "cards" ? "grid" : "cards")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-2xl shadow-xl transition-all ${
                viewMode === "grid" ? "bg-blue-500 text-white" : "bg-white dark:bg-[#1C1C1E] text-[#8E8E93]"
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

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
            <p className="text-[#8E8E93] animate-pulse">Scanning the matrix...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2">That's everyone!</h3>
            <p className="text-[#8E8E93] mb-8 max-w-sm">You've explored all current matches. Check back later or expand your vibe filters.</p>
            <motion.button
              onClick={loadMatches}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/25"
            >
              Reload Profiles
            </motion.button>
          </div>
        ) : viewMode === "cards" ? (
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {matches.slice(currentIndex, currentIndex + 1).map((match) => (
                <motion.div
                  key={match.Name}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  className="glass dark:glass-dark rounded-[40px] overflow-hidden shadow-2xl border border-white/20"
                >
                  {/* Avatar */}
                  <div className="relative aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 flex items-center justify-center p-8">
                    <img
                      src={getAvatarUrl(match.Name)}
                      alt={match.Name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                    <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/5 dark:bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase">
                      {currentIndex + 1} / {matches.length}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-extrabold tracking-tight mb-1">{match.Name}</h2>
                        <p className="text-[#8E8E93] text-sm">{match.Age} years old • {match.Vibe}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-8">
                      <p className="text-[10px] uppercase tracking-widest text-[#8E8E93] font-bold">Interests & Essence</p>
                      <div className="flex flex-wrap gap-2">
                        {match.Hobbies?.split(",").map((hobby, i) => (
                          <span key={i} className="px-4 py-2 bg-blue-500/5 dark:bg-white/5 border border-blue-500/10 dark:border-white/10 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400">
                            #{hobby.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                      <motion.button
                        onClick={() => handleSkip(match)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-3xl font-bold flex items-center justify-center gap-2 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
                      >
                        <X className="w-6 h-6" /> Skip
                      </motion.button>
                      <motion.button
                        onClick={() => handleLike(match)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 py-4 bg-blue-500 text-white rounded-3xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30"
                      >
                        <Heart className="w-6 h-6" /> Like
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Grid View - Improved for visibility of multiple matches */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match, index) => (
              <motion.div
                key={match.Name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass dark:glass-dark rounded-[32px] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-white/10 flex flex-col"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/5 dark:to-purple-900/5 p-6 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
                  <img
                    src={getAvatarUrl(match.Name)}
                    alt={match.Name}
                    className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500 relative z-10"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleSkip(match); }}
                      className="w-10 h-10 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-md flex items-center justify-center text-red-500 shadow-lg hover:scale-110 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(match); }}
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all"
                    >
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{match.Name}, {match.Age}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{match.Vibe}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {match.Hobbies?.split(",").slice(0, 3).map((hobby, i) => (
                      <span key={i} className="text-[11px] font-medium text-[#8E8E93] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">
                        #{hobby.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                    <p className="text-sm text-[#8E8E93] line-clamp-3 italic leading-relaxed">
                      "I'm into {match.Hobbies}. Let's synch!"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}