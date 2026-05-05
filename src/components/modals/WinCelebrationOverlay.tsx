"use client";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { formatCurrency } from "@/utils/formatting";

export function WinCelebrationOverlay() {
  const { state, dispatch } = useGame();
  const result = state.lastTradeResult;

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => dispatch({ type: "DISMISS_TRADE_RESULT" }), 3000);
    return () => clearTimeout(t);
  }, [result, dispatch]);

  if (!result) return null;

  const isLegendary = result.returnPct >= 0.5;
  const isBig = result.returnPct >= 0.2;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none"
      onClick={() => dispatch({ type: "DISMISS_TRADE_RESULT" })}
    >
      {/* Flash ring */}
      <div className={`absolute inset-0 ${isLegendary ? "bg-amber-500/10" : "bg-emerald-500/5"} animate-pulse`} />

      <div className={`pointer-events-auto relative rounded-2xl p-6 text-center shadow-2xl border backdrop-blur-sm max-w-xs w-full mx-4 ${
        isLegendary
          ? "bg-amber-950/90 border-amber-600/60 shadow-amber-900/50"
          : "bg-emerald-950/90 border-emerald-600/50 shadow-emerald-900/50"
      }`}>
        <div className="text-4xl mb-2">
          {isLegendary ? "🚀" : isBig ? "🎯" : "✅"}
        </div>
        <div className={`text-xs font-mono font-bold uppercase tracking-widest mb-1 ${isLegendary ? "text-amber-400" : "text-emerald-400"}`}>
          {isLegendary ? "LEGENDARY CALL" : isBig ? "PERFECT CALL" : "PROFITABLE TRADE"}
        </div>
        <div className={`text-2xl font-mono font-bold mb-1 ${isLegendary ? "text-amber-300" : "text-emerald-300"}`}>
          +{formatCurrency(result.profitDollars)}
        </div>
        <div className={`text-sm font-mono mb-3 ${isLegendary ? "text-amber-500" : "text-emerald-500"}`}>
          +{(result.returnPct * 100).toFixed(1)}% · {result.ticker}
        </div>
        <div className="flex items-center justify-center gap-3 text-xs">
          <span className="font-mono text-amber-400">+{result.xpGained} XP</span>
          {result.streakCount > 1 && (
            <span className="font-mono text-orange-400">🔥 {result.streakCount} streak</span>
          )}
          {result.challengesCompleted > 0 && (
            <span className="font-mono text-blue-400">⚡ {result.challengesCompleted} challenge{result.challengesCompleted > 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="text-xs text-slate-400 font-medium mt-3">tap to dismiss</div>
      </div>
    </div>
  );
}
