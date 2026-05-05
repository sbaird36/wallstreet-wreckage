"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { AssetResearchView } from "@/components/research/AssetResearchView";
import { TradeModal } from "@/components/modals/TradeModal";
import { MarketTicker } from "@/components/dashboard/MarketTicker";

interface Props {
  params: { ticker: string };
}

export default function CryptoPage({ params }: Props) {
  const { state } = useGame();
  const router = useRouter();
  const ticker = params.ticker.toUpperCase();

  useEffect(() => {
    if (!state.gameStarted) {
      router.push("/");
    }
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <TopNav />
      <main className="flex-1 py-4">
        <AssetResearchView ticker={ticker} />
      </main>
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>
      {state.pendingTrade && <TradeModal />}
    </div>
  );
}
