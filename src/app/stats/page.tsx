"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import { StatsView } from "@/components/stats/StatsView";

export default function StatsPage() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <TopNav />
      <main className="flex-1 p-4 w-full max-w-7xl mx-auto">
        <StatsView />
      </main>
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>
    </div>
  );
}
