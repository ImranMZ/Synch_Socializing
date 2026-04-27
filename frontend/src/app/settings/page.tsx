"use client";

import { useRouter } from "next/navigation";
import { useAuth, ThemeMode } from "@/lib/auth";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Sun, Moon, Stars, Bell, BellOff, User, Shield, HelpCircle, Info, ChevronRight, Palette, Sliders } from "lucide-react";

export default function SettingsPage() {
  const { user, settings, updateSettings, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const cycleTheme = () => {
    const themes: ThemeMode[] = ['light', 'dark', 'deep'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSettings({ theme: themes[nextIndex], darkMode: themes[nextIndex] !== 'light' });
  };

const themeIcon = settings.theme === 'deep' ? Stars : settings.theme === 'dark' ? Moon : Sun;
  const themeLabel = settings.theme === 'deep' ? 'Deep Dark' : settings.theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  const themeDesc = settings.theme === 'deep' ? 'Ultimate dark experience' : settings.theme === 'dark' ? 'Easy on the eyes' : 'Classic light look';

  const themeItems = [
    {
      icon: themeIcon,
      label: themeLabel,
      description: themeDesc,
      action: cycleTheme,
      iconColor: settings.theme === 'deep' ? 'text-purple-400' : settings.theme === 'dark' ? 'text-blue-400' : 'text-yellow-400',
    },
    {
      icon: Palette,
      label: 'Mesh Gradient',
      description: settings.meshGradient ? 'Animated background on' : 'Animated background off',
      action: () => updateSettings({ meshGradient: !settings.meshGradient }),
      iconColor: settings.meshGradient ? 'text-pink-400' : 'text-gray-400',
    },
  ];

  const previewThemes = [
    { id: 'light', label: 'Light', bg: 'bg-gray-100', text: 'text-gray-900', border: 'border-gray-300' },
    { id: 'dark', label: 'Dark', bg: 'bg-[#1C1C1E]', text: 'text-white', border: 'border-gray-700' },
    { id: 'deep', label: 'Deep', bg: 'bg-black', text: 'text-purple-400', border: 'border-purple-500' },
  ];

  const preferenceItems = [
    {
      icon: Sliders,
      label: 'Age Range',
      description: `${settings.ageRangeMin || 18} - ${settings.ageRangeMax || 35} years`,
      action: () => {
        const newMin = (settings.ageRangeMin || 18) >= 35 ? 18 : (settings.ageRangeMin || 18) + 1;
        const newMax = (settings.ageRangeMax || 35) >= 50 ? 18 : (settings.ageRangeMax || 35) + 1;
        updateSettings({ ageRangeMin: newMin, ageRangeMax: newMax });
      },
      iconColor: 'text-cyan-400',
    },
  ];

  const settingGroups = [
    {
      title: "Appearance",
      items: themeItems,
    },
    {
      title: "Preferences",
      items: preferenceItems,
    },
    {
      title: "Notifications",
      items: [
        {
          icon: settings.notifications ? Bell : BellOff,
          label: "Push Notifications",
          description: settings.notifications ? "Currently enabled" : "Currently disabled",
          action: () => updateSettings({ notifications: !settings.notifications }),
          iconColor: settings.notifications ? "text-green-400" : "text-gray-400",
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
          iconColor: "text-blue-400",
        },
        {
          icon: ChevronRight,
          label: "Subscription",
          description: "Free plan active",
          action: () => {},
          iconColor: "text-pink-400",
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
          iconColor: "text-purple-400",
        },
        {
          icon: Info,
          label: "About",
          description: "Version 1.0.0",
          action: () => {},
          iconColor: "text-gray-400",
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "How we handle your data",
          action: () => {},
          iconColor: "text-green-400",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {(settings.meshGradient || settings.theme === 'deep') && (
        <>
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
        </>
      )}

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" /> Settings
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 glass dark:glass-dark rounded-2xl p-6"
          >
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Theme Preview
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {previewThemes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => {
                    const themes: ThemeMode[] = ['light', 'dark', 'deep'];
                    const targetTheme = theme.id as ThemeMode;
                    updateSettings({ theme: targetTheme, darkMode: targetTheme !== 'light' });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-xl ${theme.bg} ${theme.text} border-2 transition-all ${
                    settings.theme === theme.id ? theme.border : 'border-transparent'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-bold text-sm">{theme.label}</p>
                    <div className="mt-2 h-8 rounded bg-gradient-to-r from-purple-500 to-pink-500" />
                    <p className="text-xs mt-2 opacity-60">Aa</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

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
            Synch v1.0.0
          </p>
        </motion.div>
      </div>
    </div>
  );
}