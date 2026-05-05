"use client";

import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { RIVALS } from "@/data/rivalData";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency } from "@/utils/formatting";

export function RivalsLeaderboard() {
  const { state } = useGame();
  const playerNetWorth = getNetWorth(state.portfolio, state.assets);

  const leaderboard = useMemo(() => {
    const rivals = RIVALS.map((r) => ({
      id: r.id,
      name: r.name,
      emoji: r.emoji,
      personality: r.personality,
      netWorth: (state.rivalNetWorths ?? {})[r.id] ?? 10_000,
      isPlayer: false,
    }));
    const all = [
      { id: "player", name: state.playerName || "You", emoji: "👤", personality: "Human", netWorth: playerNetWorth, isPlayer: true },
      ...rivals,
    ].sort((a, b) => b.netWorth - a.netWorth);
    return all.map((entry, i) => ({ ...entry, rank: i + 1 }));
  }, [state.rivalNetWorths, playerNetWorth, state.playerName]);

  const playerRank = leaderboard.find((e) => e.id === "player")?.rank ?? 0;

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏁</span>
          <h2 className="text-sm font-semibold text-slate-200">Rival Leaderboard</h2>
        </div>
        {playerRank > 0 && (
          <span className="text-xs font-mono text-blue-400">You: #{playerRank}</span>
        )}
      </div>
      <p className="text-xs text-slate-500 mb-3">NPC traders compete on the same market. Updated weekly.</p>
      <div className="space-y-1.5">
        {leaderboard.map((entry) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
              entry.isPlayer ? "bg-blue-900/20 border border-blue-800/40" : "bg-[#151c2f]/40"
            }`}
          >
            <span className={`text-xs font-mono font-bold w-6 text-center flex-shrink-0 ${
              entry.rank === 1 ? "text-amber-400" :
              entry.rank === 2 ? "text-slate-200" :
              entry.rank === 3 ? "text-amber-700" : "text-slate-500"
            }`}>
              {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
            </span>
            <span className="text-lg leading-none flex-shrink-0">{entry.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-mono font-bold truncate ${entry.isPlayer ? "text-blue-300" : "text-white"}`}>
                {entry.name}
              </div>
              <div className="text-[10px] text-slate-500">{entry.personality}</div>
            </div>
            <div className="text-xs font-mono font-bold text-white tabular-nums">{formatCurrency(entry.netWorth)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
