"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { History, Search, Heart, X, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { useAuth, getMatchHistory, MatchHistoryItem } from "@/lib/auth";

export default function HistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<MatchHistoryItem[]>([]);
  const [filter, setFilter] = useState<"all" | "liked" | "skipped" | "connected">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setHistory(getMatchHistory());
  }, [user]);

  const filteredHistory = history.filter(item => {
    if (filter !== "all" && item.action !== filter) return false;
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: history.length,
    liked: history.filter(h => h.action === "liked").length,
    connected: history.filter(h => h.action === "connected").length,
    skipped: history.filter(h => h.action === "skipped").length,
  };

  if (!user) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <History className="w-8 h-8" /> Match History
          </h1>
          <p className="text-gray-500 mb-8">Your past matches and connections</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "from-blue-500 to-cyan-500" },
              { label: "Liked", value: stats.liked, color: "from-pink-500 to-red-500" },
              { label: "Connected", value: stats.connected, color: "from-green-500 to-emerald-500" },
              { label: "Skipped", value: stats.skipped, color: "from-gray-500 to-slate-500" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05 }}
                className="glass dark:glass-dark rounded-2xl p-4 text-center"
              >
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1C1C1E] rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              {(["all", "liked", "connected", "skipped"] as const).map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-colors ${
                    filter === f
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-[#1C1C1E] text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No matches yet</p>
                <motion.button
                  onClick={() => router.push("/discover")}
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
                >
                  Start Discovering
                </motion.button>
              </div>
            ) : (
              filteredHistory.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass dark:glass-dark rounded-2xl p-4 flex items-center gap-4 hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.vibe} • {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.action === "liked" ? "bg-pink-100 text-pink-600 dark:bg-pink-900/30" :
                    item.action === "connected" ? "bg-green-100 text-green-600 dark:bg-green-900/30" :
                    "bg-gray-100 text-gray-600 dark:bg-gray-900/30"
                  }`}>
                    {item.action === "liked" ? "❤️ Liked" :
                     item.action === "connected" ? "🤝 Connected" :
                     "⏭ Skipped"}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}