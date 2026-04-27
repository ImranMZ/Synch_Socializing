"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Heart, Users, Target, ArrowRight, ChevronRight, Star, Zap, MapPin, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import ParticleField from "@/components/ParticleField";

export default function HomePage() {
  const router = useRouter();
  const { settings } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    api.getStats()
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const features = [
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Our ML algorithm finds your perfect vibe match from 30,000+ profiles",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Vibe-Based Compatibility",
      description: "Match based on your core personality, not just looks",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: Zap,
      title: "Instant Connections",
      description: "Get matches in seconds, not weeks",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const testimonials = [
    { name: "Ali", vibe: "Techie", text: "Found someone who actually gets my coding obsession! 💻" },
    { name: "Sara", vibe: "Artist", text: "The vibe matching is spot on. Met my best friend here! 🎨" },
    { name: "Usman", vibe: "GymBro", text: "Finally an app that understands what I'm looking for 💪" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleField />
      
      {/* Background - only when mesh enabled */}
      {settings.meshGradient && (
        <>
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        </>
      )}
      
      {/* Floating orbs - Desktop only, mesh enabled only */}
      {!isMobile && settings.meshGradient && (
        <>
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-[60px]"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/10 rounded-full blur-[60px]"
          />
        </>
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-[500px] mb-8"
          >
            <img src="/logo-full.svg" alt="Synch Branding" className="w-full h-auto drop-shadow-[0_0_20px_rgba(123,47,247,0.2)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={() => router.push("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              Find Your Match <ArrowRight className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={() => router.push("/discover")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#1C1C1E] text-gray-700 dark:text-gray-300 rounded-2xl font-semibold text-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" /> Browse Profiles
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-4 mb-16"
          >
            {[
              { value: stats.total_users?.toLocaleString() || "30K+", label: "Active Users" },
              { value: "50K+", label: "Matches Made" },
              { value: "95%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass dark:glass-dark rounded-2xl p-6 text-center"
              >
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="glass dark:glass-dark rounded-2xl p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">Success Stories</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-3">"{testimonial.text}"</p>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-blue-500">{testimonial.vibe}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Match?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Join thousands of others who found their vibe</p>
          
          <motion.button
            onClick={() => router.push("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started Free
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center text-gray-400 dark:text-gray-500 text-sm"
        >
          <p>© 2026 Synch. Made with 💜 in Pakistan</p>
        </motion.footer>
      </div>
    </div>
  );
}