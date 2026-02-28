import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { uploadRouter } from "@/lib/uploadthing/core";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Réseau Social Universitaire",
  description: "Connectez-vous avec vos camarades et partagez votre expérience universitaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextSSRPlugin routerConfig={extractRouterConfig(uploadRouter)} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 p-8">
            {/* Left: Sidebar Navigation */}
            <div className="col-span-3">
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 sticky top-8">
                <Sidebar />
              </div>
            </div>
            
            {/* Center: Main Feed */}
            <div className="col-span-9">
              <div className="max-w-4xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
