import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import ClientLayout from "@/components/ClientLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import DemoMode from "@/components/DemoMode";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Synch - Find Your Vibe Match",
  description: "AI-powered vibe matching app to find your perfect match",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ErrorBoundary>
          <AuthProvider>
            <DemoMode>
              <ClientLayout>{children}</ClientLayout>
            </DemoMode>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}