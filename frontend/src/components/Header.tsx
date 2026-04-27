"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Home, User, Settings, LogOut, Sparkles, Sun, Moon, Compass, History, Bell, Menu, X, Grid } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { getAvatarUrl } from "@/lib/utils";

export default function Header() {
  const { user, logout, settings, updateSettings } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [orbOpen, setOrbOpen] = useState(false);

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

  // Mobile Navigation Orb
  if (isMobile) {
    return (
      <>
        {/* Floating Orb Button */}
        <motion.button
          onClick={() => setOrbOpen(!orbOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/30 flex items-center justify-center z-50"
        >
          {orbOpen ? <X className="w-6 h-6 text-white" /> : <Grid className="w-6 h-6 text-white" />}
        </motion.button>

        {/* Radial Menu when open */}
        <AnimatePresence>
          {orbOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOrbOpen(false)}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="fixed bottom-20 left-1/2 -translate-x-1/2 flex flex-col gap-3"
              >
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0, delay: index * 0.05 }}
                      onClick={() => {
                        router.push(item.path);
                        setOrbOpen(false);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`relative p-3 rounded-full glass-tactile ${
                        isActive(item.path) ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      {item.badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mini bottom bar */}
        <header className="fixed bottom-0 left-0 right-0 h-12 bg-white/60 dark:bg-[#1C1C1E]/60 backdrop-blur-md border-t border-black/5 dark:border-white/10 z-30 flex items-center justify-around px-4">
          <motion.button
            onClick={() => router.push("/")}
            whileTap={{ scale: 0.9 }}
            className={`${isActive("/") ? "text-blue-500" : "text-gray-400"}`}
          >
            <Home className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => router.push("/discover")}
            whileTap={{ scale: 0.9 }}
            className={`${isActive("/discover") ? "text-blue-500" : "text-gray-400"}`}
          >
            <Compass className="w-5 h-5" />
          </motion.button>
          {/* Empty space for orb */}
          <div className="w-14" />
          <motion.button
            onClick={() => router.push("/history")}
            whileTap={{ scale: 0.9 }}
            className={`${isActive("/history") ? "text-blue-500" : "text-gray-400"}`}
          >
            <History className="w-5 h-5" />
          </motion.button>
          <motion.button
            onClick={() => router.push("/settings")}
            whileTap={{ scale: 0.9 }}
            className={`${isActive("/settings") ? "text-blue-500" : "text-gray-400"}`}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        </header>
      </>
    );
  }

  // Desktop Sidebar - Floating Water Bubble Style
  return (
    <header 
      className="fixed top-4 left-4 bottom-4 w-20 z-50 
        bg-[#161618] border border-white/8 
        rounded-xl
        flex flex-col items-center py-6"
    >
      <button 
        onClick={() => router.push("/")}
        className="flex flex-col items-center gap-1 mb-8 w-full px-2"
      >
        <div className="w-full h-12 flex items-center justify-center overflow-hidden">
          <img src="/logo-medium.svg" alt="Synch Logo" className="w-auto h-full object-contain" />
        </div>
      </button>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-3 flex-1 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`relative p-3 rounded-lg transition-colors duration-150 w-12 h-12 flex items-center justify-center ${
                isActive(item.path)
                  ? "bg-blue-600/10 text-blue-600"
                  : "text-[#71717A] hover:bg-white/5 hover:text-white"
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              {item.badge > 0 ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm shadow-red-500/30 border-2 border-[#161618]">
                  {item.badge}
                </span>
              ) : null}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="flex flex-col items-center gap-3 mt-auto px-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-lg text-[#71717A] hover:bg-white/5 hover:text-white transition-colors w-12 h-12 flex items-center justify-center"
          title={settings.darkMode ? "Light mode" : "Dark mode"}
        >
          {settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile */}
        <button
          onClick={() => router.push("/profile")}
          className={`p-0.5 rounded-lg transition-all w-12 h-12 flex items-center justify-center ${
            isActive("/profile")
              ? "ring-2 ring-blue-600"
              : "hover:scale-105"
          }`}
          title="Profile"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700">
            <img
              src={getAvatarUrl(user.name)}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-3 rounded-lg text-red-400 transition-colors w-12 h-12 flex items-center justify-center mt-1 bg-red-500/10 hover:bg-red-500/20"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}