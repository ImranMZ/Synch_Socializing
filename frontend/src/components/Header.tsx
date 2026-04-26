"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Home, User, Settings, LogOut, Sparkles, Sun, Moon, Compass, History, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { getAvatarUrl } from "@/lib/utils";

export default function Header() {
  const { user, logout, settings, updateSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const { scrollY } = useScroll();
  const headerBgOpacity = useTransform(scrollY, [0, 100], [0.5, 0.9]);
  const headerBlur = useTransform(scrollY, [0, 100], [10, 24]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Mobile Bottom Nav
  if (isMobile) {
    return (
      <header className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              onClick={() => router.push(item.path)}
              whileTap={{ scale: 0.9 }}
              className={`relative p-2 flex flex-col items-center justify-center ${
                isActive(item.path) ? "text-blue-500" : "text-[#8E8E93]"
              }`}
            >
              <Icon className="w-6 h-6" />
              {item.badge > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
        <motion.button
          onClick={() => router.push("/profile")}
          whileTap={{ scale: 0.9 }}
          className={`w-8 h-8 rounded-full overflow-hidden border-2 ${
            isActive("/profile") ? "border-blue-500" : "border-transparent"
          }`}
        >
          <img src={getAvatarUrl(user.name)} alt={user.name} className="w-full h-full object-cover" />
        </motion.button>
      </header>
    );
  }

  // Desktop Sidebar
  return (
    <motion.header 
      style={{
        backgroundColor: settings.darkMode ? `rgba(28, 28, 30, ${headerBgOpacity.get()})` : `rgba(255, 255, 255, ${headerBgOpacity.get()})`,
        backdropFilter: `blur(${headerBlur.get()}px)`
      }}
      className="fixed top-0 left-0 bottom-0 w-20 z-50 border-r border-black/5 dark:border-white/10 flex flex-col items-center py-6 shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
    >
      <button 
        onClick={() => router.push("/")}
        className="flex flex-col items-center gap-1 mb-8 w-full px-2"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full h-12 flex items-center justify-center overflow-hidden"
        >
          <img src="/logo-medium.svg" alt="Synch Logo" className="w-auto h-full max-w-full drop-shadow-[0_0_8px_rgba(123,47,247,0.3)] object-contain" />
        </motion.div>
      </button>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-6 flex-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              onClick={() => router.push(item.path)}
              whileTap={{ scale: 0.95 }}
              className={`relative p-3 rounded-2xl transition-all duration-300 w-12 h-12 flex items-center justify-center ${
                isActive(item.path)
                  ? "bg-blue-500/10 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                  : "text-[#8E8E93] hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              {item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.5)] border-2 border-white dark:border-[#1C1C1E]">
                  {item.badge}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-4 mt-auto">
        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleDarkMode}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl text-[#8E8E93] hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-12 h-12 flex items-center justify-center"
          title={settings.darkMode ? "Light mode" : "Dark mode"}
        >
          {settings.darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </motion.button>

        {/* Profile */}
        <motion.button
          onClick={() => router.push("/profile")}
          whileTap={{ scale: 0.95 }}
          className={`p-0.5 rounded-full transition-all w-12 h-12 flex items-center justify-center ${
            isActive("/profile")
              ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
              : "hover:scale-105"
          }`}
          title="Profile"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={getAvatarUrl(user.name)}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.button>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-2xl text-red-500 transition-all w-12 h-12 flex items-center justify-center mt-2 bg-red-500/10 hover:bg-red-500/20 dark:shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
}