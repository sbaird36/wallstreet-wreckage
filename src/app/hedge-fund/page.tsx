"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { InterestMeter } from "@/components/dashboard/InterestMeter";
import { MarketTicker } from "@/components/dashboard/MarketTicker";

export default function HedgeFundPage() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <TopNav />
      <main className="flex-1 p-4 max-w-xl mx-auto w-full">
        <InterestMeter />
      </main>
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>
    </div>
  );
}
