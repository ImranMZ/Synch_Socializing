"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Heart, ArrowRight, Sparkles, MapPin, Calendar, User as UserIcon } from "lucide-react";
import { useAuth, getAvatarUrl } from "@/lib/auth";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  // Mouse move effect for card tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    login(name.trim(), gender, age ? parseInt(age) : undefined, city.trim());
    router.push("/");
  };

  const handleGuest = () => {
    router.push("/register");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0A0B]"
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Parallax Floating Orbs */}
      <motion.div
        style={{ x: useTransform(x, [-300, 300], [20, -20]), y: useTransform(y, [-300, 300], [20, -20]) }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(x, [-300, 300], [-30, 30]), y: useTransform(y, [-300, 300], [-30, 30]) }}
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(x, [-300, 300], [10, -10]), y: useTransform(y, [-300, 300], [-20, 20]) }}
        className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none"
      />

      <motion.div
        style={{ rotateX, rotateY, perspective: 1000 }}
        className="relative z-10 w-full max-w-2xl mx-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="glass dark:glass-dark rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden"
        >
          {/* Decorative Corner Sparkles */}
          <Sparkles className="absolute top-8 left-8 w-6 h-6 text-pink-500/50" />
          <Sparkles className="absolute bottom-8 right-8 w-8 h-8 text-blue-500/50" />

          {/* Logo */}
          <motion.div 
            className="text-center mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              className="w-28 h-28 mx-auto mb-6 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20">
                <Heart className="w-14 h-14 text-white" fill="currentColor" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400"
            >
              Synch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 mt-3 text-xl font-medium"
            >
              Enter your essence. Find your vibe.
            </motion.p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="col-span-1 md:col-span-2 relative group"
              >
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent focus:bg-white/10 transition-all placeholder:text-gray-600"
                  autoFocus
                  required
                />
              </motion.div>

              {/* Gender Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent focus:bg-white/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-gray-900">Select Gender</option>
                  <option value="male" className="bg-gray-900">Male</option>
                  <option value="female" className="bg-gray-900">Female</option>
                  <option value="non-binary" className="bg-gray-900">Non-binary</option>
                  <option value="other" className="bg-gray-900">Other</option>
                </select>
              </motion.div>

              {/* Age Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="relative group"
              >
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Age"
                  min="18"
                  max="120"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-transparent focus:bg-white/10 transition-all placeholder:text-gray-600"
                />
              </motion.div>

              {/* City Field */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="col-span-1 md:col-span-2 relative group"
              >
                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City / Place"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent focus:bg-white/10 transition-all placeholder:text-gray-600"
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              disabled={!name.trim() || loading}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(168,85,247,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white py-5 rounded-2xl font-bold text-2xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all mt-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Enter the Synch <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-lg">
              Want to explore first?{" "}
              <button onClick={handleGuest} className="text-purple-400 font-bold hover:text-purple-300 transition-colors hover:underline">
                Continue as Guest
              </button>
            </p>
          </motion.div>
        </motion.div>

        {/* Live avatar preview */}
        <AnimatePresence>
          {name.trim() && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.5 }}
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="text-center">
                <motion.div 
                  className="relative p-2 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={getAvatarUrl(name)}
                    alt="Avatar preview"
                    className="w-24 h-24 rounded-2xl"
                  />
                  {/* Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-[#12121A] rounded-full" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}