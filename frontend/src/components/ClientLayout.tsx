"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      // Public paths that don't require authentication
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
    <>
      {user && <Header />}
      <main className={user ? "pt-14" : ""}>
        {children}
      </main>
    </>
  );
}