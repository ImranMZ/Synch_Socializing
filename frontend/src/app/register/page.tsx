"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft } from "lucide-react";
import { useAuth, getAvatarUrl, saveProfile } from "@/lib/auth";

const avatarStyles = [
  { id: "avataaars", name: "Avataaars" },
  { id: "big-ears", name: "Big Ears" },
  { id: "bottts", name: "Bottts" },
  { id: "fun-emoji", name: "Fun" },
  { id: "lorelei", name: "Lorelei" },
  { id: "micah", name: "Micah" },
  { id: "notionists", name: "Notion" },
  { id: "openPeeps", name: "Open" },
  { id: "personas", name: "Personas" },
  { id: "puzzler", name: "Puzzler" },
];

const GENDERS = ["Male", "Female"];
const CITIES = ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", "Sialkot", "Hyderabad"];
const VIBES = ["GymBro", "Gamer", "Techie", "Artist", "Foodie", "Traveler", "Bookworm", "Fashionista", "Entrepreneur"];

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [step, setStep] = useState<number>(1);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [gender, setGender] = useState("");
  const [age, setAge] = useState(25);
  const [city, setCity] = useState("");
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const getAvatarUrlWithStyle = (style: string) => {
    const seed = name.replace(/\s+/g, "") || "default";
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const profile = {
      name,
      gender,
      age,
      city,
      vibe,
      avatarStyle: avatarStyles[selectedAvatar].id,
    };
    saveProfile(profile);
    login(name.trim(), gender, age, city, vibe, avatarStyles[selectedAvatar].id);
    router.push("/");
  };

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-50" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold text-center mb-2">Join Synch</h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Create your vibe profile</p>

            <div className="space-y-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What's your name?"
                  className="w-full px-6 py-4 bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  autoFocus
                />
              </motion.div>

              <AnimatePresence>
                {name.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-2xl"
                  >
                    <motion.img
                      src={getAvatarUrl(name)}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div>
                      <p className="font-semibold text-lg">{name}</p>
                      <p className="text-sm text-gray-500">@{name.toLowerCase().replace(/\s+/g, "")}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                onClick={handleNext}
                disabled={!name.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button onClick={() => router.push("/login")} className="text-blue-500 font-medium hover:underline">
                  Log In
                </button>
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
        <div className="absolute inset-0 bg-dots opacity-50" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <button 
            onClick={handleBack}
            className="mb-6 text-blue-500 font-medium flex items-center gap-2 hover:underline"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>

          <div className="glass dark:glass-dark rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-medium text-center mb-2">Choose Your Avatar</h2>
            <p className="text-[#71717A] dark:text-[#A1A1AA] text-center mb-6">Select an avatar that represents you</p>

            <div className="flex justify-center gap-3 mb-6">
              {avatarStyles.map((style, index) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedAvatar(index)}
                  className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                    selectedAvatar === index
                      ? "border-blue-600 scale-110"
                      : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <img
                    src={getAvatarUrlWithStyle(style.id)}
                    alt={style.name}
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>

            <motion.div
              key={selectedAvatar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-[#161618] rounded-lg p-4 mb-6 flex items-center gap-4 border border-black/5 dark:border-white/8"
            >
              <motion.img
                src={getAvatarUrlWithStyle(avatarStyles[selectedAvatar].id)}
                alt="Selected"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-medium dark:text-white">{name}</h3>
                <p className="text-[#71717A] text-sm">
                  {avatarStyles[selectedAvatar].name} style
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-dots opacity-50" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-80" />
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <button 
          onClick={handleBack}
          className="mb-6 text-blue-500 font-medium flex items-center gap-2 hover:underline"
        >
          <ChevronLeft className="w-5 h-5" /> Back
        </button>

        <div className="glass dark:glass-dark rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-2">Tell Us About You</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Help us find your perfect vibe match</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      gender === g
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-[#2C2C2E] text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-[#2C2C2E] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 50 }, (_, i) => 18 + i).map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-[#2C2C2E] rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Vibe</label>
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => (
                  <button
                    key={v}
                    onClick={() => setVibe(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      vibe === v
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-[#2C2C2E] text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading || !gender || !city || !vibe}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 mt-6"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                Get Started <Sparkles className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}