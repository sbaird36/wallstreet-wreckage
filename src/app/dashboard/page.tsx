"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { MarketTable } from "@/components/dashboard/MarketTable";
import { MarketTicker } from "@/components/dashboard/MarketTicker";
import { ROIChart } from "@/components/dashboard/ROIChart";
import { IndexWidget } from "@/components/dashboard/IndexWidget";
import { DayEventsPanel } from "@/components/dashboard/DayEventsPanel";
import { TradeModal } from "@/components/modals/TradeModal";
import { WeeklyRecapModal } from "@/components/modals/WeeklyRecapModal";
import { MilestoneModal } from "@/components/modals/MilestoneModal";
import { WinCelebrationOverlay } from "@/components/modals/WinCelebrationOverlay";
import { AchievementToast } from "@/components/modals/AchievementToast";
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
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <TopNav />

      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {/* Day events / notifications */}
        <DayEventsPanel />

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

      {/* Bottom ticker — desktop only (mobile uses BottomNav) */}
      <div className="sticky bottom-0 hidden sm:block">
        <MarketTicker />
      </div>

      {/* Trade modal (rendered when pendingTrade is set) */}
      {state.pendingTrade && <TradeModal />}

      {/* Weekly recap modal (shown when advancing to Sunday) */}
      {showWeeklyRecap && <WeeklyRecapModal onClose={() => setShowWeeklyRecap(false)} />}

      {/* Milestone celebration */}
      {state.pendingMilestone && <MilestoneModal />}

      {/* Win celebration overlay */}
      {state.lastTradeResult && <WinCelebrationOverlay />}

      {/* Achievement toast */}
      <AchievementToast />
    </div>
  );
}
