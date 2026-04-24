"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, Sparkles, Heart, Eye, Users, Trash2, Check, Search } from "lucide-react";
import { useAuth, getActivity, ActivityItem, markActivityRead, clearActivity } from "@/lib/auth";

export default function ActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState<"all" | "new_match" | "viewed" | "similar">("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    setActivity(getActivity());
  }, [user]);

  const filteredActivity = activity.filter(item => {
    if (filter !== "all" && item.type !== filter) return false;
    return true;
  });

  const unreadCount = activity.filter(a => !a.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "new_match": return Heart;
      case "viewed": return Eye;
      case "similar": return Users;
      default: return Sparkles;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "new_match": return "text-pink-500 bg-pink-100 dark:bg-pink-900/30";
      case "viewed": return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
      case "similar": return "text-purple-500 bg-purple-100 dark:bg-purple-900/30";
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const handleMarkRead = (id: string) => {
    markActivityRead(id);
    setActivity(getActivity());
  };

  const handleClear = () => {
    clearActivity();
    setActivity([]);
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="w-8 h-8" /> Activity
              </h1>
              <p className="text-gray-500">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </p>
            </div>
            
            {activity.length > 0 && (
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl text-sm font-medium"
              >
                Clear All
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["all", "new_match", "viewed", "similar"] as const).map((f) => (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
                  filter === f
                    ? "bg-blue-500 text-white"
                    : "bg-white dark:bg-[#1C1C1E] text-gray-600 dark:text-gray-400"
                }`}
              >
                {f === "all" ? "All" :
                 f === "new_match" ? "❤️ Matches" :
                 f === "viewed" ? "👁 Views" : "✨ Similar"}
              </motion.button>
            ))}
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            {filteredActivity.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No activity yet</p>
                <motion.button
                  onClick={() => router.push("/discover")}
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl font-medium"
                >
                  Start Discovering
                </motion.button>
              </div>
            ) : (
              filteredActivity.map((item, index) => {
                const Icon = getIcon(item.type);
                const colorClass = getColor(item.type);
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => !item.read && handleMarkRead(item.id)}
                    className={`glass dark:glass-dark rounded-2xl p-4 flex items-start gap-4 cursor-pointer hover:shadow-lg transition-all ${
                      !item.read ? "ring-2 ring-blue-500/30" : ""
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {!item.read && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}