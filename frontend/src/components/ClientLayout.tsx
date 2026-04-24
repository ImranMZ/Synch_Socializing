"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user && typeof window !== "undefined") {
      const publicPaths = ["/login", "/register"];
      const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
      
      if (!isPublicPath) {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {user && <Header />}
      <main className={user ? "pt-16" : ""}>
        {children}
      </main>
    </>
  );
}