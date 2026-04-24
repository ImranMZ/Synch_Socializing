"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Home, User, Settings, LogOut, Sparkles } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Synch</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push("/profile")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                isActive("/profile")
                  ? "bg-blue-500/10 text-blue-500"
                  : "hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium hidden sm:block">{user.name}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}