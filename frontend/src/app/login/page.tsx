"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Sparkles, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { getAvatarUrl, isValidName, isValidAge } from "@/lib/utils";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Input validation
    if (!name.trim() || name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    
    if (age && (parseInt(age) < 18 || parseInt(age) > 99)) {
      setError("Age must be between 18 and 99");
      return;
    }
    
    setLoading(true);
    login(name.trim(), gender, age ? parseInt(age) : undefined, city.trim());
    router.push("/");
  };

  const handleGuest = () => {
    router.push("/register");
  };

  // iOS 26 styling variants
  const pageVariants: any = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, damping: 25, stiffness: 200 } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0A0A0F] text-black dark:text-white flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* Simplified Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-40 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-40 pointer-events-none" />

      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border border-black/5 dark:border-white/10 p-10 md:p-14 rounded-[40px] shadow-2xl relative overflow-hidden">
          
          {/* Logo */}
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-[280px] mx-auto mb-4"
            >
              <img src="/logo-medium.svg" alt="Synch Branding" className="w-full h-auto drop-shadow-[0_0_15px_rgba(123,47,247,0.3)]" />
            </motion.div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="col-span-1 md:col-span-2 relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8E8E93]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-[#2C2C2E]/50 border border-black/5 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-[#8E8E93]"
                  autoFocus
                  required
                />
              </div>

              {/* Gender Field */}
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-6 py-5 bg-white/50 dark:bg-[#2C2C2E]/50 border border-black/5 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-[#8E8E93]"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age Field */}
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8E8E93]" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  min="18"
                  max="120"
                  className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-[#2C2C2E]/50 border border-black/5 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-[#8E8E93]"
                />
              </div>

              {/* City Field */}
              <div className="col-span-1 md:col-span-2 relative">
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#8E8E93]" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Place"
                  className="w-full pl-14 pr-6 py-5 bg-white/50 dark:bg-[#2C2C2E]/50 border border-black/5 dark:border-white/10 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-[#8E8E93]"
                />
              </div>
            </div>

            {/* Live avatar preview inside the card */}
            <AnimatePresence>
              {name.trim() && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center gap-3 mb-6"
                >
                  <div className="relative p-1 bg-white/50 dark:bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                    <img
                      src={getAvatarUrl(name)}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-xl"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#1C1C1E] rounded-full" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-500">Your Identity</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full bg-blue-500 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all mt-2 shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Enter the Synch <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center mt-2"
              >
                {error}
              </motion.p>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#8E8E93] text-lg">
              Want to explore first?{" "}
              <button onClick={handleGuest} className="text-blue-500 font-bold transition-colors">
                Continue as Guest
              </button>
            </p>
          </div>
        </div>

        {/* Removed absolute preview from here */}
      </motion.div>
    </div>
  );
}