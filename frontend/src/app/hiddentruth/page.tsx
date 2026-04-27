"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { ArrowLeft, RefreshCw, Copy, Check, Sparkles } from "lucide-react";

export default function HiddenTruthPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await api.getHiddenTruth({
        Vibe: "",
        Gender: user?.gender || "Male",
        Hobbies: "",
        City: "",
        Goal: "Both",
      });
      setData(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCopy = (layer: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(layer);
    setTimeout(() => setCopied(null), 2000);
  };

  const layers = [
    { key: "layer_one", emoji: "🌑", title: "The Foundation" },
    { key: "layer_two", emoji: "🌘", title: "The Pattern" },
    { key: "layer_three", emoji: "🌕", title: "The Truth" },
  ];

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#0D0D0F]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#161618] border-b border-black/5 dark:border-white/8">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#71717A] hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-medium dark:text-white">The Hidden Truth</h1>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats Dashboard Row */}
        <section className="mb-6">
          <h2 className="text-sm font-medium text-[#71717A] mb-3">YOUR COMPATIBILITY INSIGHTS</h2>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#161618] rounded-lg p-3 border border-black/5 dark:border-white/8">
              <p className="text-xl font-semibold dark:text-white">127</p>
              <p className="text-xs text-[#71717A]">Matches</p>
            </div>
            <div className="bg-white dark:bg-[#161618] rounded-lg p-3 border border-black/5 dark:border-white/8">
              <p className="text-xl font-semibold dark:text-white">94%</p>
              <p className="text-xs text-[#71717A]">Vibe</p>
            </div>
            <div className="bg-white dark:bg-[#161618] rounded-lg p-3 border border-black/5 dark:border-white/8">
              <p className="text-xl font-semibold dark:text-white">A+</p>
              <p className="text-xs text-[#71717A]">Score</p>
            </div>
            <div className="bg-white dark:bg-[#161618] rounded-lg p-3 border border-black/5 dark:border-white/8">
              <p className="text-xl font-semibold dark:text-white">Top 5%</p>
              <p className="text-xs text-[#71717A]">Rank</p>
            </div>
          </div>
        </section>

        {/* Layer Navigation */}
        <section className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
          {layers.map((layer, index) => (
            <button
              key={layer.key}
              onClick={() => setActiveLayer(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeLayer === index
                  ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                  : "bg-white dark:bg-[#161618] text-[#71717A] border border-black/5 dark:border-white/8"
              }`}
            >
              <span>{layer.emoji}</span>
              <span className="hidden sm:inline">{layer.title}</span>
            </button>
          ))}
        </section>

        {/* Layer Content Cards - Horizontal */}
        <section className="space-y-3">
          {loading ? (
            <div className="bg-white dark:bg-[#161618] rounded-lg p-6 border border-black/5 dark:border-white/8 animate-pulse">
              <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded mb-4" />
              <div className="h-4 w-full bg-gray-200 dark:bg-white/10 rounded mb-2" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
            </div>
          ) : data ? (
            layers.map((layer, index) => (
              <div
                key={layer.key}
                className={`bg-white dark:bg-[#161618] rounded-lg p-4 border border-black/5 dark:border-white/8 transition-opacity ${
                  activeLayer === index ? "opacity-100" : "opacity-0 absolute pointer-events-none"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{layer.emoji}</span>
                    <h3 className="font-medium dark:text-white">{layer.title}</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(layer.key, data[layer.key] || "")}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-[#71717A] hover:text-amber-600 transition-colors"
                  >
                    {copied === layer.key ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-sm text-[#71717A] leading-relaxed">
                  {data[layer.key] || "No data available"}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-[#161618] rounded-lg p-6 border border-black/5 dark:border-white/8 text-center">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-[#71717A]">No data available</p>
              <button
                onClick={fetchData}
                className="mt-3 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium"
              >
                Generate Now
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}