"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, getAvatarUrl } from "@/lib/auth";
import { getProfileCompleteness } from "@/lib/utils";
import { Sparkles, ArrowRight, Heart, Trash2, LogOut, CheckCircle, AlertCircle, Settings } from "lucide-react";

const avatarStyles = [
  { id: "avataaars", name: "Avatar" },
  { id: "big-ears", name: "Ears" },
  { id: "bottts", name: "Bot" },
  { id: "fun-emoji", name: "Fun" },
  { id: "lorelei", name: "Girl" },
  { id: "micah", name: "Micah" },
  { id: "notionists", name: "Notion" },
  { id: "openPeeps", name: "Peeps" },
  { id: "personas", name: "Persona" },
  { id: "puzzler", name: "Puzzle" },
];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    const style = avatarStyles[selectedAvatar].id;
    const newAvatar = `https://api.dicebear.com/9.x/${style}/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    updateUser({ name: name.trim(), avatar: newAvatar });
    setEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure? This cannot be undone.")) {
      logout();
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getAvatarUrlWithStyle = (styleId: string) => {
    const seed = name.replace(/\s+/g, "") || "default";
    return `https://api.dicebear.com/9.x/${styleId}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-40 right-20 w-48 h-48 bg-pink-500/10 rounded-full blur-[80px]"
      />

      <div className="relative z-10 max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Profile Card */}
          <motion.div
            variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
            className="glass dark:glass-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <motion.h1 
                className="text-2xl font-bold"
                variants={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}
              >
                Your Profile
              </motion.h1>
              <motion.button
                onClick={() => setEditing(!editing)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all"
              >
                {editing ? "Cancel" : "Edit"}
              </motion.button>
            </div>

            {/* Avatar */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center gap-6 mb-8"
              variants={{ initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } }}
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl blur-lg opacity-40" />
                  <img
                    src={editing ? getAvatarUrlWithStyle(avatarStyles[selectedAvatar].id) : user.avatar}
                    alt={user.name}
                    className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl border-4 border-white/20 shadow-2xl"
                  />
                </motion.div>
              </div>
              
              <div className="text-center sm:text-left">
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none text-center sm:text-left"
                  />
                ) : (
                  <motion.div>
                    <h2 className="text-3xl font-bold">{user.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">@{user.name?.toLowerCase().replace(/\s+/g, "")}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-500">
                        {getProfileCompleteness(user)}% complete
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Edit Mode - Avatar Picker */}
            {editing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Choose Avatar Style</p>
                <div className="grid grid-cols-5 gap-2">
                  {avatarStyles.map((style, index) => (
                    <motion.button
                      key={style.id}
                      onClick={() => setSelectedAvatar(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`aspect-square rounded-xl overflow-hidden bg-white dark:bg-[#2C2C2E] p-1.5 border-4 transition-all ${
                        selectedAvatar === index
                          ? "border-blue-500 scale-105 shadow-lg"
                          : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                      }`}
                    >
                      <img
                        src={getAvatarUrlWithStyle(style.id)}
                        alt={style.name}
                        className="w-full h-full"
                      />
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Save Changes
              </motion.button>
            </motion.div>
          )}
        </motion.div>

          {/* Quick Actions - Only show when not editing */}
          {!editing && (
            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
              className="glass dark:glass-dark rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" /> Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={() => router.push("/")}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2C2C2E] rounded-2xl hover:shadow-lg transition-all group"
                >
                  <span className="font-medium">Find Matches</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Account Settings */}
          {!editing && (
            <motion.div
              variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
              className="glass dark:glass-dark rounded-3xl p-6 shadow-lg border border-white/20"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" /> Account
              </h3>
              <div className="space-y-3">
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="w-full flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl hover:shadow-lg transition-all text-orange-600"
                >
                  <span className="font-medium flex items-center gap-2">
                    <LogOut className="w-5 h-5" /> Log Out
                  </span>
                </motion.button>
                <motion.button
                  onClick={handleDelete}
                  whileHover={{ scale: 1.02 }}
                  className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl hover:shadow-lg transition-all text-red-600"
                >
                  <span className="font-medium flex items-center gap-2">
                    <Trash2 className="w-5 h-5" /> Delete Account
                  </span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}