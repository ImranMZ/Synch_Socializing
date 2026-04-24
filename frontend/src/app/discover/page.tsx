"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Sparkles, Filter, Grid, RefreshCw, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useAuth, getAvatarUrl, addToMatchHistory } from "@/lib/auth";
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

const avatarStyles = ["avataaars", "big-ears", "bottts", "fun-emoji", "lorelei", "micah", "notionists", "openPeeps", "personas", "puzzler"];

export default function DiscoverPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<BrowseMatch[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "grid">("cards");

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

  const handleLike = async () => {
    if (currentIndex >= matches.length) return;
    
    const match = matches[currentIndex];
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    
    addToMatchHistory({
      id: Date.now().toString(),
      name: match.Name,
      avatar: `https://api.dicebear.com/9.x/${style}/svg?seed=${match.Name}&backgroundColor=b6e3f4`,
      vibe: match.Vibe,
      score: 85,
      action: "liked",
      date: new Date().toISOString(),
    });
    
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      loadMatches();
    }
  };

  const handleSkip = () => {
    if (currentIndex >= matches.length) return;
    
    const match = matches[currentIndex];
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    
    addToMatchHistory({
      id: Date.now().toString(),
      name: match.Name,
      avatar: `https://api.dicebear.com/9.x/${style}/svg?seed=${match.Name}&backgroundColor=b6e3f4`,
      vibe: match.Vibe,
      score: 0,
      action: "skipped",
      date: new Date().toISOString(),
    });
    
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      loadMatches();
    }
  };

  const getAvatarForMatch = (name: string) => {
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Discover</h1>
            <p className="text-gray-500">Browse and find your vibe</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewMode(viewMode === "cards" ? "grid" : "cards")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl bg-white dark:bg-[#1C1C1E] shadow-lg"
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={loadMatches}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="p-2 rounded-xl bg-white dark:bg-[#1C1C1E] shadow-lg"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <Sparkles className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No more profiles to show</p>
            <motion.button
              onClick={loadMatches}
              whileHover={{ scale: 1.05 }}
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
            >
              Load More
            </motion.button>
          </div>
        ) : viewMode === "cards" ? (
          <AnimatePresence mode="wait">
            {matches.slice(currentIndex, currentIndex + 1).map((match) => (
              <motion.div
                key={match.Name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass dark:glass-dark rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Avatar */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                  <motion.img
                    src={getAvatarForMatch(match.Name)}
                    alt={match.Name}
                    className="w-full h-full object-cover"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-black/50 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {matches.length}
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold">{match.Name}</h2>
                      <p className="text-gray-500">{match.Age} years old • {match.Gender}</p>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full text-sm font-medium">
                      {match.Vibe}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{match.Location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm">{match.Education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 col-span-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{match.Profession}</span>
                    </div>
                  </div>

                  {/* Hobbies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {match.Hobbies?.split(",").slice(0, 5).map((hobby, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {hobby.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleSkip}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl font-semibold flex items-center justify-center gap-2"
                    >
                      <X className="w-6 h-6" /> Skip
                    </motion.button>
                    <motion.button
                      onClick={handleLike}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
                    >
                      <Heart className="w-6 h-6" /> Like
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.Name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass dark:glass-dark rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <img
                  src={getAvatarForMatch(match.Name)}
                  alt={match.Name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-semibold">{match.Name}</h3>
                  <p className="text-xs text-gray-500">{match.Age} • {match.Vibe}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}