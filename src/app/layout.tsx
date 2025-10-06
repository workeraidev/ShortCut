import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "ShortCut | AI-Powered YouTube Shorts Creation",
    template: "%s | ShortCut",
  },
  description: "Your AI-powered toolkit for creating viral YouTube Shorts. Analyze videos, generate scripts, optimize for trends, and plan short series.",
  keywords: ["YouTube Shorts", "AI video", "content creation", "viral video", "script generator", "video analysis"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
