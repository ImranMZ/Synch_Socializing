"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Sun, Moon, Bell, BellOff, User, Shield, HelpCircle, Info, ChevronRight, Sparkles, Heart } from "lucide-react";

export default function SettingsPage() {
  const { user, settings, updateSettings, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const settingGroups = [
    {
      title: "Appearance",
      items: [
        {
          icon: settings.darkMode ? Sun : Moon,
          label: settings.darkMode ? "Light Mode" : "Dark Mode",
          description: settings.darkMode ? "Switch to light theme" : "Switch to dark theme",
          action: () => updateSettings({ darkMode: !settings.darkMode }),
          iconColor: settings.darkMode ? "text-yellow-500" : "text-blue-500",
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: settings.notifications ? Bell : BellOff,
          label: "Push Notifications",
          description: settings.notifications ? "Currently enabled" : "Currently disabled",
          action: () => updateSettings({ notifications: !settings.notifications }),
          iconColor: settings.notifications ? "text-green-500" : "text-gray-400",
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          description: "Change your name, avatar, bio",
          action: () => router.push("/profile"),
          iconColor: "text-blue-500",
        },
        {
          icon: Heart,
          label: "Subscription",
          description: "Free plan active",
          action: () => {},
          iconColor: "text-pink-500",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "Get help with Synch",
          action: () => window.open("https://github.com/ImranMZ/Synch", "_blank"),
          iconColor: "text-purple-500",
        },
        {
          icon: Info,
          label: "About",
          description: "Version 1.0.0",
          action: () => {},
          iconColor: "text-gray-500",
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "How we handle your data",
          action: () => {},
          iconColor: "text-green-500",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" /> Settings
          </h1>

          {settingGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {group.title}
              </h2>

              <div className="glass dark:glass-dark rounded-2xl overflow-hidden">
                {group.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.label}
                      onClick={item.action}
                      whileHover={{ x: 5 }}
                      className={`w-full flex items-center gap-4 p-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                        itemIndex < group.items.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#2C2C2E] flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-8 py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            Log Out
          </motion.button>

          {/* Version */}
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
            Synch v1.0.0 • Made with 💜 in Pakistan
          </p>
        </motion.div>
      </div>
    </div>
  );
}