import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WallStreet Wreckage — Day Trading Simulator",
  description: "A turn-based day trading simulation game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0a0a0f] text-slate-100 min-h-screen font-sans pb-14 sm:pb-0">
        <GameProvider>
          {children}
          <BottomNav />
        </GameProvider>
      </body>
    </html>
  );
}
