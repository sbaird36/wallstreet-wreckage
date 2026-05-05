"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { AlgorithmBuilder } from "@/components/algorithm/AlgorithmBuilder";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import { TradeModal } from "@/components/modals/TradeModal";

export default function AlgorithmPage() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <TopNav />
      <main className="flex-1 p-4 w-full">
        <AlgorithmBuilder />
      </main>
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>
      {state.pendingTrade && <TradeModal />}
    </div>
  );
}
