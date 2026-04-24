"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Heart, ArrowRight, Check } from "lucide-react";
import { useAuth, getAvatarUrl, createUser } from "@/lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [step, setStep] = useState<"name" | "avatar">("name");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const avatarStyle = [
    "avataaars",
    "big-ears", 
    "bottts",
    "fun-emoji",
    "lorelei",
    "micah",
    "notionists",
    "openPeeps",
    "personas",
    "puzzler",
  ];

  useEffect(() => {
    if (name.trim()) {
      setSelectedAvatar(getAvatarUrl(name));
    }
  }, [name]);

  const handleContinue = () => {
    if (!name.trim()) return;
    setStep("avatar");
  };

  const handleSubmit = async () => {
    setLoading(true);
    login(name.trim());
    router.push("/");
  };

  const handleBack = () => {
    setStep("name");
  };

  if (step === "avatar") {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex flex-col items-center justify-center p-4">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <button onClick={handleBack} className="mb-6 text-blue-500 font-medium hover:underline">
            ← Back
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Choose Your Avatar</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Pick a style that represents you</p>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-8">
            {avatarStyle.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedAvatar(`https://api.dicebear.com/9.x/${style}/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`)}
                className={`aspect-square rounded-xl overflow-hidden bg-white dark:bg-[#1C1C1E] p-2 border-2 transition-all ${
                  selectedAvatar.includes(style)
                    ? "border-blue-500 scale-110"
                    : "border-transparent hover:border-black/10 dark:hover:border-white/10"
                }`}
              >
                <img
                  src={`https://api.dicebear.com/9.x/${style}/svg?seed=${name}&backgroundColor=b6e3f4`}
                  alt={style}
                  className="w-full h-full"
                />
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 mb-6 border border-black/10 dark:border-white/20">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview</p>
            <div className="flex items-center gap-4">
              <img
                src={selectedAvatar}
                alt="Your avatar"
                className="w-20 h-20 rounded-2xl"
              />
              <div>
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-gray-500 text-sm">@{name.toLowerCase().replace(/\s+/g, "")}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            {loading ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <>
                Get Started <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex flex-col items-center justify-center p-4">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold">Join Synch</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Create your vibe profile</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What's your name?"
              className="w-full px-6 py-4 bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <button
            onClick={handleContinue}
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button onClick={() => router.push("/login")} className="text-blue-500 font-medium hover:underline">
              Log In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}