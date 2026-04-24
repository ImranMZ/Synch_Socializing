"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Heart, ArrowRight } from "lucide-react";
import { useAuth, getAvatarUrl } from "@/lib/auth";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    login(name.trim());
    router.push("/");
  };

  const handleGuest = () => {
    router.push("/register");
  };

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
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Enter your name to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-6 py-4 bg-white dark:bg-[#1C1C1E] border border-black/10 dark:border-white/20 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
          >
            {loading ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <>
                Continue <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            New here?{" "}
            <button onClick={handleGuest} className="text-blue-500 font-medium hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}