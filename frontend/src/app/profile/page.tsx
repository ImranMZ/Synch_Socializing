"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, getAvatarUrl } from "@/lib/auth";
import { Sparkles, ArrowRight, Camera, Heart, User, Settings, Trash2 } from "lucide-react";

const avatarStyles = [
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

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const router = useRouter();

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleSave = () => {
    if (name.trim()) {
      updateUser({ name: name.trim(), avatar: selectedAvatar || getAvatarUrl(name) });
      setEditing(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      logout();
      router.push("/login");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 border border-black/10 dark:border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Your Profile</h1>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl font-medium text-sm hover:bg-blue-500/20 transition-colors"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <img
                  src={selectedAvatar || user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-blue-500/30"
                />
                {editing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                {editing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                )}
                <p className="text-gray-500 dark:text-gray-400">@{user.name?.toLowerCase().replace(/\s+/g, "")}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {editing && (
              <>
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Choose Avatar Style</p>
                  <div className="grid grid-cols-5 gap-2">
                    {avatarStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setSelectedAvatar(`https://api.dicebear.com/9.x/${style}/svg?seed=${name}&backgroundColor=b6e3f4,c0aede,d1d4f9`)}
                        className={`aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#2C2C2E] p-1 border-2 transition-all ${
                          selectedAvatar?.includes(style)
                            ? "border-blue-500"
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
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>

          {!editing && (
            <>
              <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/10 dark:border-white/20 shadow-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" /> Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/")}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-xl hover:bg-gray-100 dark:hover:bg-[#3C3C3E] transition-colors"
                  >
                    <span className="font-medium">Find Matches</span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 border border-black/10 dark:border-white/20 shadow-lg">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Account
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2C2C2E] rounded-xl hover:bg-gray-100 dark:hover:bg-[#3C3C3E] transition-colors text-orange-500"
                  >
                    <span className="font-medium">Log Out</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                  >
                    <span className="font-medium">Delete Account</span>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}