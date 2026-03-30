"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { AdvanceDayButton } from "@/components/dashboard/AdvanceDayButton";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import { ROIChart } from "@/components/dashboard/ROIChart";
import { IndexWidget } from "@/components/dashboard/IndexWidget";
import { TradeModal } from "@/components/modals/TradeModal";
import { WeeklyRecapModal } from "@/components/modals/WeeklyRecapModal";
import { getDayOfWeek } from "@/utils/dateUtils";

export default function DashboardPage() {
  const { state } = useGame();
  const router = useRouter();
  const [showWeeklyRecap, setShowWeeklyRecap] = useState(false);
  const prevDayRef = useRef<number | null>(null);

  useEffect(() => {
    if (!state.gameStarted) {
      router.push("/");
    }
  }, [state.gameStarted, router]);

  // Show weekly recap when day advances to Monday (weekend just ended)
  useEffect(() => {
    if (!state.gameStarted) return;
    if (prevDayRef.current === null) {
      prevDayRef.current = state.currentDay;
      return;
    }
    if (state.currentDay > prevDayRef.current) {
      const dow = getDayOfWeek(state.startDate, state.currentDay);
      if (dow === 1) {
        setShowWeeklyRecap(true);
      }
    }
    prevDayRef.current = state.currentDay;
  }, [state.currentDay, state.gameStarted, state.startDate]);

  if (!state.gameStarted) return null;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <TopNav />

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {/* Trading command bar */}
        <div className="flex items-start justify-between mb-5 bg-gray-900 border border-gray-800 rounded-lg px-3 sm:px-5 py-3 gap-3">
          <AdvanceDayButton />
          <div className="hidden sm:flex items-center gap-2 text-right border-l border-gray-800 pl-5">
            <div>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Starting Capital</div>
              <div className="text-sm font-mono font-bold text-gray-400 tabular-nums">$10,000.00</div>
            </div>
          </div>
        </div>

        {/* Market Indexes */}
        <div className="mb-4">
          <IndexWidget />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <PortfolioOverview />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <ROIChart />
          </div>
          <div className="lg:col-span-5">
            <MarketTable />
          </div>
        </div>
      </main>

      {/* Bottom ticker */}
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>

      {/* Trade modal (rendered when pendingTrade is set) */}
      {state.pendingTrade && <TradeModal />}

      {/* Weekly recap modal (shown when advancing to Sunday) */}
      {showWeeklyRecap && <WeeklyRecapModal onClose={() => setShowWeeklyRecap(false)} />}
    </div>
  );
}
