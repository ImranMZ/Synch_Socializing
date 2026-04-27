"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, addToMatchHistory } from "@/lib/auth";
import { getAvatarUrl } from "@/lib/utils";
import { api, UserProfile, MatchProfile } from "@/lib/api";
import { X, Heart, Sparkles, Grid, RefreshCw, MapPin, Clock } from "lucide-react";
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
  Techie: "border-l-cyan-500",
  Artist: "border-l-pink-500",
  Gamer: "border-l-emerald-500",
  Foodie: "border-l-amber-500",
  GymBro: "border-l-red-500",
  Traveler: "border-l-purple-500",
  Bookworm: "border-l-indigo-500",
  Entrepreneur: "border-l-teal-500",
};

const VIBE_BG_COLORS: Record<string, string> = {
  Techie: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  Artist: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  Gamer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Foodie: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  GymBro: "bg-red-500/10 text-red-600 dark:text-red-400",
  Traveler: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Bookworm: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  Entrepreneur: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

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
  const [loading, setLoading] = useState(false);
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
      const enriched = data.map((m: MatchProfile) => ({
        ...m,
        Compatibility_Score: Math.floor(Math.random() * 20) + 80,
        lastActive: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      }));
      setMatches(enriched);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setIsAIThinking(false);
  };

  const handleSkip = (match: BrowseMatch) => {
    setMatches(matches.filter(m => m.Name !== match.Name));
  };

  const handleLike = async (match: BrowseMatch) => {
    setSelectedMatch(match);
    if (match.Compatibility_Score && match.Compatibility_Score >= 95) {
      setShowCelebration(true);
      setShowShareCard(true);
    } else {
      setShowWhyMatch(true);
    }
    if (user) {
      addToMatchHistory({ name: match.Name, score: match.Compatibility_Score || 0, action: "liked" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Discover</h1>
            <p className="text-[#71717A] dark:text-[#A1A1AA]">{matches.length} profiles</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={loadMatches}
              disabled={loading}
              className="p-3 rounded-2xl bg-white dark:bg-[#161618] border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-white dark:bg-[#161618] rounded-2xl p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-white/10 rounded-xl mb-4" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded mb-2" />
                <div className="h-3 w-16 bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold mb-2 dark:text-white">That's everyone!</h3>
            <p className="text-[#71717A] dark:text-[#A1A1AA] mb-8 max-w-sm">Check back later for new matches.</p>
            <button
              onClick={loadMatches}
              className="px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors"
            >
              Reload Profiles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {matches.map((match) => {
              const vibeBorder = VIBE_COLORS[match.Vibe] || "border-l-cyan-500";
              const vibeBg = VIBE_BG_COLORS[match.Vibe] || "bg-cyan-500/10";
              return (
                <div
                  key={match.Name}
                  className={`bg-white dark:bg-[#161618] rounded-lg overflow-hidden border-l-4 ${vibeBorder} hover:shadow-md transition-all duration-200 flex flex-col`}
                >
                  <div className="relative aspect-square p-3 flex items-center justify-center bg-gray-50 dark:bg-[#0D0D0F]">
                    <img
                      src={getAvatarUrl(match.Name)}
                      alt={match.Name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-bold text-white">
                      {match.Compatibility_Score}%
                    </div>
                  </div>
                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-semibold dark:text-white">{match.Name}, {match.Age}</h3>
                    </div>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full ${vibeBg} inline-block mb-2`}>
                      {match.Vibe}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[#71717A] dark:text-[#A1A1AA] mb-2">
                      <MapPin className="w-2.5 h-2.5" />
                      <span>{match.City}</span>
                    </div>
                    <div className="flex gap-1.5 mt-auto">
                      <button 
                        onClick={() => handleSkip(match)}
                        className="flex-1 py-1.5 bg-gray-100 dark:bg-white/5 text-[#71717A] dark:text-[#A1A1AA] rounded-lg text-xs font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                      >
                        Skip
                      </button>
                      <button 
                        onClick={() => handleLike(match)}
                        className="flex-1 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
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

      {showShareCard && selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowShareCard(false)}>
          <div className="bg-white dark:bg-[#161618] rounded-3xl p-6 shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <ShareCard
              userName={user?.name || "You"}
              matchName={selectedMatch.Name}
              matchScore={selectedMatch.Compatibility_Score || 0}
              matchVibe={selectedMatch.Vibe}
            />
            <button
              onClick={() => setShowShareCard(false)}
              className="w-full mt-4 py-3 bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}