"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Home, User, Settings, LogOut, Sparkles, Sun, Moon, Compass, History, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout, settings, updateSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem("synch_activity") || "[]");
    setUnreadCount(activity.filter((a: any) => !a.read).length);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/discover", icon: Compass, label: "Discover" },
    { path: "/history", icon: History, label: "History" },
    { path: "/activity", icon: Bell, label: "Activity", badge: unreadCount },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="font-bold text-lg hidden sm:block">Synch</span>
          </button>

          {/* Navigation - Mobile friendly */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-2 rounded-xl transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-500/10 text-blue-500"
                      : "hover:bg-black/5 dark:hover:bg-white/5 text-gray-500"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Right side - User & Settings */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title={settings.darkMode ? "Light mode" : "Dark mode"}
            >
              {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {/* Profile */}
            <motion.button
              onClick={() => router.push("/profile")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-colors ${
                isActive("/profile")
                  ? "bg-blue-500/10"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full"
              />
              <span className="text-sm font-medium hidden md:block">{user.name}</span>
            </motion.button>

            {/* Logout */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}