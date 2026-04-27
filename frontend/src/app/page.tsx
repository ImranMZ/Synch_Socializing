"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { User, Heart, ChevronRight, X, Sparkles, Activity, Check, Lightbulb, TrendingUp, Zap } from "lucide-react";
import AIInsightModal from "../components/AIInsightModal";
import VibeQuizModal from "../components/VibeQuizModal";
import HiddenTruthModal from "../components/HiddenTruthModal";
import MagneticButton from "../components/MagneticButton";
import LayeredStackCard from "../components/LayeredStackCard";
import DirectChatModal from "../components/DirectChatModal";
import { api, UserProfile, MatchProfile } from "../lib/api";
import confetti from "canvas-confetti";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { getAvatarUrl } from "@/lib/utils";

type Match = {
  Name: string;
  Compatibility_Score: number;
  Gender: string;
  Age: number | string;
  Location: string;
  Education: string;
  Profession: string;
  Vibe: string;
  Hobbies: string;
  Religiosity: string;
  Smoking: string;
  Diet: string;
  Comm_Style: string;
};

const VIBE_OPTIONS = ["GymBro", "Gamer", "Techie", "Artist", "Foodie", "Traveler", "Bookworm", "Fashionista", "Entrepreneur"];
const HOBBIES_OPTIONS = ["Coding", "Anime", "Music", "Photography", "Cooking", "Sports", "Reading", "Movies", "Writing"];
const RELIGIOSITY_OPTIONS = ["Practicing", "Moderate", "Not Practicing"];
const DIET_OPTIONS = ["Zabiha Halal", "Anything", "Vegetarian", "Vegan"];
const SMOKING_OPTIONS = ["No", "Yes", "Occasionally"];
const COMM_STYLE_OPTIONS = ["Direct", "Empathetic", "Humorous", "Analytical"];
const CITY_OPTIONS = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];
const UNIVERSITY_OPTIONS = [
  { code: "LU", name: "Lahore University", city: "Lahore" },
  { code: "UOK", name: "University of Karachi", city: "Karachi" },
  { code: "PU", name: "Punjab University", city: "Lahore" },
  { code: "NUST", name: "NUST", city: "Islamabad" },
  { code: "GIFT", name: "GIFT University", city: "Islamabad" },
  { code: "COMSATS", name: "COMSATS", city: "Islamabad" },
  { code: "FAST", name: "FAST-NU", city: "Lahore" },
  { code: "BUITEMS", name: "BUITEMS", city: "Karachi" },
  { code: "MULTANUST", name: "Multan University of Science & Technology", city: "Multan" },
  { code: "BZU", name: "Bahauddin Zakariya University", city: "Multan" },
  { code: "USP", name: "University of Southern Punjab", city: "Multan" },
];

const getVibeColor = (vibe: string) => {
  switch(vibe) {
    case "Techie": return "bg-cyan-500/20";
    case "Traveler": return "bg-orange-500/20";
    case "Artist": return "bg-pink-500/20";
    case "GymBro": return "bg-red-500/20";
    case "Foodie": return "bg-green-500/20";
    case "Gamer": return "bg-purple-500/20";
    default: return "bg-blue-500/20";
  }
};

const GlassSkeleton = () => (
  <div className="w-full bg-white/30 dark:bg-[#161618]/30 backdrop-blur-2xl border border-white/20 rounded-[40px] p-8 shadow-sm overflow-hidden relative">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" style={{ animation: "shimmer 1.5s infinite" }} />
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes shimmer {
        100% { transform: translateX(100%); }
      }
    `}} />
    <div className="w-1/2 h-8 bg-black/10 dark:bg-white/10 rounded-lg mb-4" />
    <div className="w-1/4 h-10 bg-black/10 dark:bg-white/10 rounded-lg mb-8" />
    <div className="space-y-4">
      {[1,2,3,4].map(i => <div key={i} className="w-full h-8 bg-black/5 dark:bg-white/5 rounded-lg" />)}
    </div>
  </div>
);

export default function Home() {
  const [step, setStep] = useState(0);
  
  const [formData, setFormData] = useState({
    Goal: "",
    Gender: "",
    Vibe: "",
    Hobbies: [] as string[],
    Religiosity: "",
    Diet: "",
    Smoking: "",
    Comm_Style: "",
    City: "",
    University: ""
  });

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [psychographicProfile, setPsychographicProfile] = useState<any>(null);
  
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [hiddenTruthOpen, setHiddenTruthOpen] = useState(false);
  const [hiddenTruthData, setHiddenTruthData] = useState<any>(null);
  const [hiddenTruthLoading, setHiddenTruthLoading] = useState(false);
  const [aiModalType, setAiModalType] = useState<"explanation" | "icebreakers" | "wavelength" | "persona" | "bio" | "prediction" | "dealbreakers" | "discovery">("explanation");
  const [aiModalData, setAiModalData] = useState<any>(null);
  const [aiModalLoading, setAiModalLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [directChatOpen, setDirectChatOpen] = useState(false);
  const [directChatMatch, setDirectChatMatch] = useState<any>(null);
  const [directChatInitialMsg, setDirectChatInitialMsg] = useState("");
  const router = useRouter();

  const [whyMatchData, setWhyMatchData] = useState<any>(null);
  const [dealbreakersData, setDealbreakersData] = useState<any>(null);

  // Parallax Scroll logic (window scroll)
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    api.getStats()
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (step === 3 && matches[currentIndex] && matches[currentIndex].Compatibility_Score >= 95) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#a855f7', '#ec4899']
      });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  }, [step, currentIndex, matches]);

  const handleSelectGoal = (goal: string) => {
    setFormData({ ...formData, Goal: goal });
    setStep(0.5);
  };

  const fetchHiddenTruth = async () => {
    setHiddenTruthOpen(true);
    setHiddenTruthLoading(true);
    setHiddenTruthData(null);
    
    const profile: UserProfile = { ...formData, Hobbies: formData.Hobbies.join(", "), strict_city: false };
    
    try {
      const result = await api.getHiddenTruth(profile as UserProfile, psychographicProfile || []);
      setHiddenTruthData(result);
    } catch (e) {
      console.error("Hidden truth error:", e);
    }
    setHiddenTruthLoading(false);
  };

  const handleRegenerateTruth = async () => {
    await fetchHiddenTruth();
  };

  const toggleHobby = (hobby: string) => {
    if (formData.Hobbies.includes(hobby)) {
      setFormData({ ...formData, Hobbies: formData.Hobbies.filter(h => h !== hobby) });
    } else {
      setFormData({ ...formData, Hobbies: [...formData.Hobbies, hobby] });
    }
  };

  const handleQuizComplete = async (answers: { question_id: string; answer: string }[]) => {
    const profile: UserProfile = { ...formData, Hobbies: formData.Hobbies.join(", "), strict_city: false };
    try {
      const result = await api.submitQuiz(profile as UserProfile, answers);
      setPsychographicProfile(result.psychographic_profile);
    } catch (e) {
      console.error("Quiz submit error:", e);
    }
    handleMatch();
  };

  const handleMatch = async () => {
    setLoading(true);
    setStep(3);
    
    const payload: UserProfile = { ...formData, Hobbies: formData.Hobbies.join(", "), strict_city: false };

    try {
      const data = await api.matchProfiles(payload as UserProfile, psychographicProfile);
      
      const usedScores = new Set<number>();
      const randomizedData = data.map((match: any, index: number) => {
        let baseNewScore = Math.max(50, 98 - (index * 4) - Math.floor(Math.random() * 3));
        while (usedScores.has(baseNewScore)) {
          baseNewScore--;
        }
        usedScores.add(baseNewScore);
        return { ...match, Compatibility_Score: baseNewScore };
      });
      
      setMatches(randomizedData);
      if (randomizedData.length > 0) {
        loadStackedCardData(randomizedData[0]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const openAIModal = async (type: "explanation" | "icebreakers" | "wavelength" | "prediction", match?: Match) => {
    setAiModalType(type);
    setAiModalOpen(true);
    setAiModalData(null);
    setAiModalLoading(true);

    const profile: UserProfile = { ...formData, Hobbies: formData.Hobbies.join(", "), strict_city: false };

    try {
      let result;
      if (match) {
        const matchProfile: MatchProfile = { ...match, Age: Number(match.Age) || 25, Education: match.Education || "Unknown", Profession: match.Profession || "Unknown" };
        if (type === "explanation") result = await api.getMatchExplanation(profile as UserProfile, matchProfile);
        else if (type === "icebreakers") result = await api.getIcebreakers(profile as UserProfile, matchProfile);
        else if (type === "wavelength") result = await api.getWavelength(profile as UserProfile, matchProfile);
        else if (type === "prediction") result = await api.getPrediction(profile as UserProfile, matchProfile);
      }
      setAiModalData(result || { error: "No data" });
    } catch (e) {
      console.error("AI modal error:", e);
      setAiModalData({ error: "Failed to load" });
    }
    setAiModalLoading(false);
  };

  const loadStackedCardData = async (match: Match) => {
    const profile: UserProfile = { ...formData, Hobbies: formData.Hobbies.join(", "), strict_city: false };
    const matchProfile: MatchProfile = { ...match, Age: Number(match.Age) || 25, Education: match.Education || "Unknown", Profession: match.Profession || "Unknown" };

    try {
      const [whyResult, dealResult] = await Promise.all([
        api.getMatchExplanation(profile, matchProfile),
        api.getDealbreakers(profile),
      ]);
      setWhyMatchData(whyResult);
      setDealbreakersData(dealResult);
    } catch (e) {
      console.error("Stacked card loading error:", e);
    }
  };

  const handleSkip = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (aiEnabled) {
        loadStackedCardData(matches[currentIndex + 1]);
      }
    }
  };

  const handleConnect = () => {
    aiEnabled ? openAIModal("icebreakers", matches[currentIndex]) : alert("Connect request sent! Chat coming soon.");
  };

  const pageVariants: any = {
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
    exit: { opacity: 0, scale: 0.99, transition: { duration: 0.05 } }
  };

  const vibeColorClass = getVibeColor(formData.Vibe);

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F] text-black dark:text-[#FAFAFA] flex flex-col items-center justify-center p-6 font-sans">
      
      {/* No decorative backgrounds */}
      
      <AnimatePresence>
        
        {step === 0 && (
          <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md flex flex-col items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-[240px] mb-8"
            >
              <img src="/logo-medium.svg" alt="Synch Branding" className="w-full h-auto" />
            </motion.div>
            
            <div className="flex items-center gap-3 mb-6 px-4 py-2 bg-white dark:bg-[#161618] rounded-lg border border-black/5 dark:border-white/8">
              <span className={`text-sm ${aiEnabled ? 'text-blue-600' : 'text-[#71717A]'}`}>AI Features</span>
              <button 
                onClick={() => setAiEnabled(!aiEnabled)}
                className={`relative w-12 h-6 rounded-lg transition-colors ${aiEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-lg bg-white shadow-sm transition-transform ${aiEnabled ? 'left-7' : 'left-1'}`} />
              </button>
              <span className={`text-xs ${aiEnabled ? 'text-blue-600' : 'text-[#71717A]'}`}>{aiEnabled ? 'ON' : 'OFF'}</span>
            </div>
            
            <p className="text-[#71717A] mb-8 text-center text-lg">Who are you looking for today?</p>
            
            <div className="w-full flex flex-col gap-4">
              <button 
                onClick={() => handleSelectGoal("Partner")}
                className="w-full bg-white/70 dark:bg-[#161618]/70 backdrop-blur-xl border border-black/5 dark:border-white/8 p-6 rounded-[32px] flex items-center justify-between shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center text-pink-500">
                    <Heart fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-xl">A Partner</h3>
                    <p className="text-sm text-[#71717A]">Find your soulmate</p>
                  </div>
                </div>
                <ChevronRight className="text-[#71717A]" />
              </button>

              <button 
                onClick={() => handleSelectGoal("Friends")}
                className="w-full bg-white/70 dark:bg-[#161618]/70 backdrop-blur-xl border border-black/5 dark:border-white/8 p-6 rounded-[32px] flex items-center justify-between shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600">
                    <User />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-xl">A Friend</h3>
                    <p className="text-sm text-[#71717A]">Expand your circle</p>
                  </div>
                </div>
                <ChevronRight className="text-[#71717A]" />
              </button>
            </div>

            {stats && (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="w-full mt-12 bg-white/40 dark:bg-[#161618]/40 bg-gray-50 dark:bg-[#161618] rounded-lg p-6 border border-black/5 dark:border-white/8">
                <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Community Insights</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#71717A] mb-2">Top Hobbies</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.top_hobbies || {}).slice(0, 5).map(([hobby, pct]) => (
                        <div key={hobby} className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-lg text-xs font-medium border border-blue-500/20">
                          {hobby}: {String(pct)}%
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#71717A] mb-2">Top Vibes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.top_vibes || {}).slice(0, 3).map(([vibe, pct]) => (
                        <div key={vibe} className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-lg text-xs font-medium border border-purple-500/20">
                          {vibe}: {String(pct)}%
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center pt-2">
                     <p className="text-xs font-medium text-[#71717A]">Join {stats.total_users?.toLocaleString()} users on Synch</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 0.5 && (
          <motion.div key="step0.5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(0)} className="mb-6 text-blue-600 font-medium">← Back</button>
            <h2 className="text-3xl font-medium mb-8">I identify as</h2>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-[#71717A]">Select your gender</h3>
              <div className="flex flex-wrap gap-3">
                <MagneticButton 
                  onClick={() => { setFormData({ ...formData, Gender: "Male" }); setStep(1); }}
                  className="px-8 py-5 rounded-lg font-medium bg-blue-500 text-white shadow-sm shadow-blue-500/25 flex-1"
                >
                  Male
                </MagneticButton>
                <MagneticButton 
                  onClick={() => { setFormData({ ...formData, Gender: "Female" }); setStep(1); }}
                  className="px-8 py-5 rounded-lg font-medium bg-pink-500 text-white shadow-sm shadow-pink-500/25 flex-1"
                >
                  Female
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(0)} className="mb-6 text-blue-600 font-medium">← Back</button>
            <h2 className="text-3xl font-medium mb-8">Tell us about you</h2>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4 text-[#71717A] dark:text-[#A1A1AA]">Your Core Vibe</h3>
              <div className="flex flex-wrap gap-3">
                {VIBE_OPTIONS.map(v => (
                  <motion.button 
                    key={v}
                    onClick={() => setFormData({ ...formData, Vibe: v })}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                      formData.Vibe === v 
                      ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                      : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:border-blue-300 dark:hover:border-white/20'
                    }`}
                  >
                    {v}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-medium mb-4 text-[#71717A] dark:text-[#A1A1AA]">Your Hobbies</h3>
              <div className="flex flex-wrap gap-3">
                {HOBBIES_OPTIONS.map(h => {
                  const isSelected = formData.Hobbies.includes(h);
                  return (
                    <motion.button 
                      key={h}
                      onClick={() => toggleHobby(h)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className={`px-5 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-300 ${
                        isSelected 
                        ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                        : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:border-blue-300 dark:hover:border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {h}
                    </motion.button>
                  )
                })}
              </div>
            </div>

<MagneticButton 
              onClick={() => setStep(1.7)}
              disabled={!formData.City}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-medium text-lg disabled:opacity-50 transition-opacity"
            >
              Continue
            </MagneticButton>
          </motion.div>
        )}

        {step === 1.7 && (
          <motion.div key="step1.5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(1)} className="mb-6 text-blue-600 font-medium">← Back</button>
            <h2 className="text-3xl font-medium mb-8">Where are you located?</h2>
            
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-4 text-[#71717A] dark:text-[#A1A1AA]">Select your City</h3>
              <div className="flex flex-wrap gap-3">
                {CITY_OPTIONS.map(c => (
                  <motion.button 
                    key={c}
                    onClick={() => setFormData({ ...formData, City: c })}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                      formData.City === c 
                      ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' 
                      : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:border-blue-300 dark:hover:border-white/20'
                    }`}
                  >
                    {c}
                  </motion.button>
                ))}
              </div>
            </div>

            <MagneticButton 
              onClick={() => setStep(1.7)}
              disabled={!formData.City}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-medium text-lg disabled:opacity-50 transition-opacity"
            >
              Continue
            </MagneticButton>
          </motion.div>
        )}

        {step === 1.7 && (
          <motion.div key="step1.7" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(1.5)} className="mb-6 text-blue-600 font-medium">← Back</button>
            <h2 className="text-3xl font-medium mb-8">Which university?</h2>
            
            <div className="mb-10">
              <h3 className="text-lg font-medium mb-4 text-[#71717A] dark:text-[#A1A1AA]">Select your University</h3>
              <div className="flex flex-wrap gap-3">
                {UNIVERSITY_OPTIONS.map(u => (
                  <motion.button 
                    key={u.code}
                    onClick={() => setFormData({ ...formData, University: u.code })}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 ${
                      formData.University === u.code 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:border-blue-300 dark:hover:border-white/20'
                    }`}
                  >
                    {u.name}
                  </motion.button>
                ))}
              </div>
            </div>

            <MagneticButton 
              onClick={() => setStep(2)}
              disabled={!formData.University}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-medium text-lg disabled:opacity-50 transition-opacity"
            >
              Continue
            </MagneticButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(1.5)} className="mb-6 text-blue-600 font-medium">← Back</button>
            <h2 className="text-3xl font-medium mb-8">Lifestyle Details</h2>
            
            {[
              { label: "Religiosity", options: RELIGIOSITY_OPTIONS, field: "Religiosity" },
              { label: "Diet", options: DIET_OPTIONS, field: "Diet" },
              { label: "Smoking", options: SMOKING_OPTIONS, field: "Smoking" },
              { label: "Communication Style", options: COMM_STYLE_OPTIONS, field: "Comm_Style" },
            ].map(group => (
              <div key={group.field} className="mb-8">
                <h3 className="text-lg font-medium mb-3 text-[#71717A] dark:text-[#A1A1AA]">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.options.map(opt => (
                    <motion.button 
                      key={opt}
                      onClick={() => setFormData({ ...formData, [group.field]: opt })}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.02 }}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        (formData as any)[group.field] === opt 
                        ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                        : 'bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/8 text-[#71717A] dark:text-[#A1A1AA] hover:border-blue-300 dark:hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            <MagneticButton 
              onClick={() => aiEnabled ? setQuizModalOpen(true) : handleMatch()}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-medium text-lg shadow-sm mt-4 gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Find My Match
            </MagneticButton>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md flex flex-col items-center justify-center min-h-[60vh]">
            
            {loading ? (
              <GlassSkeleton />
            ) : matches.length > 0 && currentIndex < matches.length ? (
              <div className="w-full">
                <h2 className="text-center text-[#71717A] font-medium mb-4 uppercase tracking-widest text-xs">Top Match #{currentIndex + 1}</h2>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset }) => {
                      if (offset.x > 100) handleConnect();
                      else if (offset.x < -100) handleSkip();
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="w-full bg-white/70 dark:bg-[#161618]/70 backdrop-blur-2xl border border-black/5 dark:border-white/8 rounded-[40px] shadow-sm overflow-hidden relative cursor-grab active:cursor-grabbing"
                    style={{ overflowY: "auto", maxHeight: "65vh" }}
                  >
                    <motion.div style={{ y: bgY }} className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                    
                    <div className="p-8 pb-4">
                      {/* Avatar Header */}
                      <div className="flex flex-col items-center mb-6">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-32 h-32 rounded-lg overflow-hidden bg-white dark:bg-white/5 border-4 border-white dark:border-white/8 shadow-sm relative z-20 mb-4"
                        >
                          <img 
                            src={getAvatarUrl(matches[currentIndex].Name)} 
                            alt={matches[currentIndex].Name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <h3 className="text-3xl font-extrabold tracking-tight text-center" style={{ fontVariationSettings: '"wght" 800' }}>{matches[currentIndex].Name || "Unknown"}</h3>
                        <div className="mt-2 bg-blue-500 text-white font-medium text-sm px-4 py-1.5 rounded-lg shadow-lg shadow-blue-500/30 dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                          {matches[currentIndex].Compatibility_Score}% Compatibility
                        </div>
                      </div>

                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-[#71717A]">Demographics</span>
                          <span className="font-medium text-right">{matches[currentIndex].Gender}, {matches[currentIndex].Age} yrs<br/><span className="text-sm font-normal text-[#71717A]">{matches[currentIndex].Location}</span></span>
                        </div>
                        
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-[#71717A]">Vibe</span>
                          <span className="font-medium text-blue-600">{matches[currentIndex].Vibe}</span>
                        </div>
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-[#71717A]">Hobbies</span>
                          <span className="font-medium text-right max-w-[60%]">{matches[currentIndex].Hobbies || "None listed"}</span>
                        </div>
                        <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                          <span className="text-[#71717A]">Background</span>
                          <span className="font-medium text-right">{matches[currentIndex].Education}<br/><span className="text-sm font-normal text-[#71717A]">{matches[currentIndex].Profession}</span></span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {aiEnabled && matches[currentIndex] && (
                <div className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <LayeredStackCard
                      title="Why Match?"
                      icon={Lightbulb}
                      color="from-yellow-500 to-orange-500"
                      options={[
                        { label: "Vibe Sync", emoji: "🎵", content: whyMatchData?.explanation || "Loading..." },
                        { label: "Lifestyle", emoji: "🌙", content: whyMatchData?.explanation || "Loading..." },
                        { label: "Future Goals", emoji: "🎯", content: whyMatchData?.explanation || "Loading..." },
                      ]}
                      onSelect={() => openAIModal("explanation", matches[currentIndex])}
                    />
                    <LayeredStackCard
                      title="Dealbreakers"
                      icon={Activity}
                      color="from-amber-500 to-red-500"
                      options={[
                        { label: "Compatibility", emoji: "⚠️", content: dealbreakersData?.insights?.[0]?.message || "Loading..." },
                        { label: "Lifestyle", emoji: "🏠", content: dealbreakersData?.insights?.[1]?.message || "..." },
                        { label: "Communication", emoji: "💬", content: dealbreakersData?.insights?.[2]?.message || "..." },
                      ]}
                      onSelect={() => openAIModal("dealbreakers", matches[currentIndex])}
                    />
                  </div>
                  <button 
                    onClick={() => openAIModal("wavelength", matches[currentIndex])}
                    className="w-full bg-purple-500/10 border border-purple-500/20 p-3 rounded-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-xs font-medium text-purple-700">View Wavelength Compatibility</span>
                  </button>
                </div>
                )}

                <div className="flex gap-4 mt-6">
                  <MagneticButton 
                    onClick={handleSkip}
                    className="flex-1 bg-white/50 dark:bg-[#161618]/80 bg-gray-50 dark:bg-[#161618] border border-black/5 dark:border-white/8 p-4 rounded-lg gap-2 font-medium text-[#71717A]"
                  >
                    <X className="w-5 h-5 text-red-500" />
                    Skip (Swipe Left)
                  </MagneticButton>
                  <MagneticButton 
                    onClick={handleConnect}
                    className="flex-1 bg-blue-500 text-white shadow-lg shadow-blue-500/40 p-4 rounded-lg gap-2 font-medium dark:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Connect (Swipe Right)
                  </MagneticButton>
                </div>
                
                <div className="mt-6 text-center">
                  <button onClick={() => router.push('/hiddentruth')} className="text-sm text-amber-600 font-medium transition-colors">
                    Reveal My Hidden Truth
                  </button>
                </div>
                
                <div className="mt-4 text-center">
                  <button onClick={() => setStep(0)} className="text-sm text-[#71717A] transition-colors">
                    Start Over
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-medium mb-2">No more matches!</h2>
                <p className="text-[#71717A] mb-8">You've gone through all the top recommendations.</p>
                <MagneticButton onClick={() => setStep(0)} className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-lg font-medium mx-auto">
                  Try Again
                </MagneticButton>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <VibeQuizModal
        isOpen={quizModalOpen}
        onClose={() => setQuizModalOpen(false)}
        onComplete={handleQuizComplete}
      />

      <AIInsightModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        type={aiModalType}
        data={aiModalData}
        loading={aiModalLoading}
        onIcebreakerSelect={(icebreaker: string) => {
          setAiModalOpen(false);
          setDirectChatMatch(matches[currentIndex]);
          setDirectChatInitialMsg(icebreaker);
          setDirectChatOpen(true);
        }}
      />

      <HiddenTruthModal
        isOpen={hiddenTruthOpen}
        onClose={() => setHiddenTruthOpen(false)}
        onRegenerate={handleRegenerateTruth}
        data={hiddenTruthData}
        loading={hiddenTruthLoading}
      />

      <DirectChatModal
        isOpen={directChatOpen}
        onClose={() => { setDirectChatOpen(false); setDirectChatMatch(null); setDirectChatInitialMsg(""); }}
        match={directChatMatch}
        initialMessage={directChatInitialMsg}
      />
    </div>
  );
}
