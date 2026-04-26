"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      const publicPaths = ["/login", "/register", "/home"];
      const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
      
      if (!isPublicPath) {
        router.push("/home");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] dark:bg-[#000000]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        {user && <Header />}
      </AnimatePresence>
      
      <main 
        className={`transition-all duration-500 ease-in-out ${
          user 
            ? isMobile ? "pb-20 pt-4 px-4" : "pl-20 min-h-screen" 
            : ""
        }`}
      >
        <div className={user && !isMobile ? "max-w-[1600px] mx-auto p-8" : ""}>
          {children}
        </div>
      </main>
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}