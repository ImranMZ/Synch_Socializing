"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, ChevronRight, X, Sparkles, Activity, Check } from "lucide-react";

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

export default function Home() {
  const [step, setStep] = useState(0);
  
  const [formData, setFormData] = useState({
    Goal: "",
    Vibe: "",
    Hobbies: [] as string[],
    Religiosity: "",
    Diet: "",
    Smoking: "",
    Comm_Style: "",
    City: ""
  });

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleSelectGoal = (goal: string) => {
    setFormData({ ...formData, Goal: goal });
    setStep(1);
  };

  const toggleHobby = (hobby: string) => {
    if (formData.Hobbies.includes(hobby)) {
      setFormData({ ...formData, Hobbies: formData.Hobbies.filter(h => h !== hobby) });
    } else {
      setFormData({ ...formData, Hobbies: [...formData.Hobbies, hobby] });
    }
  };

  const handleMatch = async () => {
    setLoading(true);
    setStep(3); // Loading / Matching step
    
    // Convert array of hobbies to comma separated string for the backend
    const payload = {
      ...formData,
      Hobbies: formData.Hobbies.join(", ")
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSkip = () => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // iOS 26 styling variants
  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", damping: 25, stiffness: 200 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] text-black dark:text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden">
      
      {/* Abstract Background Blurs for Apple aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        
        {/* STEP 0: GOAL SELECTION */}
        {step === 0 && (
          <motion.div key="step0" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md flex flex-col items-center">
            <Sparkles className="w-16 h-16 mb-6 text-blue-500" />
            <h1 className="text-4xl font-bold mb-2 tracking-tight">Synch</h1>
            <p className="text-[#8E8E93] mb-12 text-center text-lg">Who are you looking for today?</p>
            
            <div className="w-full flex flex-col gap-4">
              <button 
                onClick={() => handleSelectGoal("Partner")}
                className="w-full bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 rounded-[32px] flex items-center justify-between shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center text-pink-500">
                    <Heart fill="currentColor" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-xl">A Partner</h3>
                    <p className="text-sm text-[#8E8E93]">Find your soulmate</p>
                  </div>
                </div>
                <ChevronRight className="text-[#8E8E93]" />
              </button>

              <button 
                onClick={() => handleSelectGoal("Friends")}
                className="w-full bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 p-6 rounded-[32px] flex items-center justify-between shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                    <User />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-xl">A Friend</h3>
                    <p className="text-sm text-[#8E8E93]">Expand your circle</p>
                  </div>
                </div>
                <ChevronRight className="text-[#8E8E93]" />
              </button>
            </div>

            {/* Stats Display */}
            {stats && (
              <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="w-full mt-12 bg-white/40 dark:bg-[#1C1C1E]/40 backdrop-blur-md rounded-3xl p-6 border border-black/5 dark:border-white/10">
                <h3 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wider mb-4 flex items-center gap-2"><Activity className="w-4 h-4" /> Community Insights</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#8E8E93] mb-2">Top Hobbies</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.top_hobbies || {}).slice(0, 5).map(([hobby, pct]) => (
                        <div key={hobby} className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                          {hobby}: {String(pct)}%
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[#8E8E93] mb-2">Top Vibes</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(stats.top_vibes || {}).slice(0, 3).map(([vibe, pct]) => (
                        <div key={vibe} className="bg-purple-500/10 text-purple-500 px-3 py-1 rounded-full text-xs font-medium border border-purple-500/20">
                          {vibe}: {String(pct)}%
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-center pt-2">
                     <p className="text-xs font-medium text-[#8E8E93]">Join {stats.total_users?.toLocaleString()} users on Synch</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 1: VIBE & HOBBIES */}
        {step === 1 && (
          <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(0)} className="mb-6 text-blue-500 font-medium">← Back</button>
            <h2 className="text-3xl font-bold mb-8">Tell us about you</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-[#8E8E93]">Your Core Vibe</h3>
              <div className="flex flex-wrap gap-3">
                {VIBE_OPTIONS.map(v => (
                  <button 
                    key={v}
                    onClick={() => setFormData({ ...formData, Vibe: v })}
                    className={`px-5 py-3 rounded-full font-medium transition-all ${
                      formData.Vibe === v 
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' 
                      : 'bg-white/50 dark:bg-[#1C1C1E]/50 border border-black/5 dark:border-white/10 text-[#8E8E93] hover:bg-white dark:hover:bg-[#2C2C2E]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-[#8E8E93]">Your Hobbies (Select multiple)</h3>
              <div className="flex flex-wrap gap-3">
                {HOBBIES_OPTIONS.map(h => {
                  const isSelected = formData.Hobbies.includes(h);
                  return (
                    <button 
                      key={h}
                      onClick={() => toggleHobby(h)}
                      className={`px-5 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${
                        isSelected 
                        ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' 
                        : 'bg-white/50 dark:bg-[#1C1C1E]/50 border border-black/5 dark:border-white/10 text-[#8E8E93] hover:bg-white dark:hover:bg-[#2C2C2E]'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      {h}
                    </button>
                  )
                })}
              </div>
            </div>

            <button 
              onClick={() => setStep(1.5)}
              disabled={!formData.Vibe || formData.Hobbies.length === 0}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-semibold text-lg disabled:opacity-50 transition-opacity"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 1.5: CITY SELECTION */}
        {step === 1.5 && (
          <motion.div key="step1.5" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(1)} className="mb-6 text-blue-500 font-medium">← Back</button>
            <h2 className="text-3xl font-bold mb-8">Where are you located?</h2>
            
            <div className="mb-10">
              <h3 className="text-lg font-semibold mb-4 text-[#8E8E93]">Select your City</h3>
              <div className="flex flex-wrap gap-3">
                {CITY_OPTIONS.map(c => (
                  <button 
                    key={c}
                    onClick={() => setFormData({ ...formData, City: c })}
                    className={`px-5 py-3 rounded-full font-medium transition-all ${
                      formData.City === c 
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' 
                      : 'bg-white/50 dark:bg-[#1C1C1E]/50 border border-black/5 dark:border-white/10 text-[#8E8E93] hover:bg-white dark:hover:bg-[#2C2C2E]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.City}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-full font-semibold text-lg disabled:opacity-50 transition-opacity"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 2: LIFESTYLE */}
        {step === 2 && (
          <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
            <button onClick={() => setStep(1.5)} className="mb-6 text-blue-500 font-medium">← Back</button>
            <h2 className="text-3xl font-bold mb-8">Lifestyle Details</h2>
            
            {/* Reusable Selection Block */}
            {[
              { label: "Religiosity", options: RELIGIOSITY_OPTIONS, field: "Religiosity" },
              { label: "Diet", options: DIET_OPTIONS, field: "Diet" },
              { label: "Smoking", options: SMOKING_OPTIONS, field: "Smoking" },
              { label: "Communication Style", options: COMM_STYLE_OPTIONS, field: "Comm_Style" },
            ].map(group => (
              <div key={group.field} className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-[#8E8E93]">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.options.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setFormData({ ...formData, [group.field]: opt })}
                      className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                        (formData as any)[group.field] === opt 
                        ? 'bg-blue-500 text-white shadow-sm' 
                        : 'bg-white/50 dark:bg-[#1C1C1E]/50 border border-black/5 dark:border-white/10 text-[#8E8E93]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button 
              onClick={handleMatch}
              className="w-full bg-blue-500 text-white py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/40 mt-4 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Find My Match
            </button>
          </motion.div>
        )}

        {/* STEP 3: MATCHING / RESULTS */}
        {step === 3 && (
          <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md flex flex-col items-center justify-center min-h-[60vh]">
            
            {loading ? (
              <div className="flex flex-col items-center">
                <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-6" />
                <h2 className="text-2xl font-bold tracking-tight">Analyzing Vibes...</h2>
                <p className="text-[#8E8E93] mt-2 text-center">Our ML model is finding your perfect frequency in our database of 30,000 profiles.</p>
              </div>
            ) : matches.length > 0 && currentIndex < matches.length ? (
              <div className="w-full">
                <h2 className="text-center text-[#8E8E93] font-medium mb-4 uppercase tracking-widest text-xs">Top Match #{currentIndex + 1}</h2>
                
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100, rotate: 5 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, x: -100, rotate: -5 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                    className="w-full bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-[40px] p-8 shadow-2xl overflow-hidden relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
                    
                    <div className="flex justify-between items-start mb-6 mt-2">
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight">{matches[currentIndex].Name || "Unknown Match"}</h3>
                        <p className="text-[#8E8E93]">Match Score</p>
                      </div>
                      <div className="bg-blue-500 text-white font-bold text-2xl px-4 py-2 rounded-2xl shadow-lg shadow-blue-500/40">
                        {matches[currentIndex].Compatibility_Score}%
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-[#8E8E93]">Demographics</span>
                        <span className="font-semibold text-right">{matches[currentIndex].Gender}, {matches[currentIndex].Age} yrs<br/><span className="text-sm font-normal text-[#8E8E93]">{matches[currentIndex].Location}</span></span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-[#8E8E93]">Vibe</span>
                        <span className="font-semibold">{matches[currentIndex].Vibe}</span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-[#8E8E93]">Hobbies</span>
                        <span className="font-semibold text-right max-w-[60%]">{matches[currentIndex].Hobbies || "None listed"}</span>
                      </div>
                      <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                        <span className="text-[#8E8E93]">Background</span>
                        <span className="font-semibold text-right">{matches[currentIndex].Education}<br/><span className="text-sm font-normal text-[#8E8E93]">{matches[currentIndex].Profession}</span></span>
                      </div>
                    </div>

                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={handleSkip}
                    className="flex-1 bg-white/50 dark:bg-[#1C1C1E]/50 backdrop-blur-md border border-black/5 dark:border-white/10 p-4 rounded-full flex justify-center items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-semibold"
                  >
                    <X className="w-5 h-5 text-red-500" />
                    Skip
                  </button>
                  <button 
                    className="flex-1 bg-blue-500 text-white shadow-lg shadow-blue-500/40 p-4 rounded-full flex justify-center items-center gap-2 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Connect
                  </button>
                </div>
                
                <div className="mt-6 text-center">
                  <button onClick={() => setStep(0)} className="text-sm text-[#8E8E93] hover:text-black dark:hover:text-white transition-colors">
                    Start Over
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">No more matches!</h2>
                <p className="text-[#8E8E93] mb-8">You've gone through all the top recommendations.</p>
                <button onClick={() => setStep(0)} className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-semibold">
                  Try Again
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
