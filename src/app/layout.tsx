import type { Metadata } from "next";
import "./globals.css";
import { GameProvider } from "@/context/GameContext";
import { BottomNav } from "@/components/layout/BottomNav";

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
    <html lang="en" className="dark">
      <body className="bg-gray-950 text-gray-100 min-h-screen font-mono pb-14 sm:pb-0">
        <GameProvider>
          {children}
          <BottomNav />
        </GameProvider>
      </body>
    </html>
  );
}
