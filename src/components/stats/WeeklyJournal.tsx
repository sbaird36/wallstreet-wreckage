"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import { ACHIEVEMENTS } from "@/data/achievementData";
import type { JournalEntry } from "@/types";

function JournalCard({ entry }: { entry: JournalEntry }) {
  const [expanded, setExpanded] = useState(false);
  const isUp = entry.changePct >= 0;

  return (
    <div className={`border rounded-xl overflow-hidden ${isUp ? "border-emerald-900/50" : "border-rose-900/50"}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#151c2f]/30 transition-colors"
      >
        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isUp ? "bg-emerald-500" : "bg-rose-500"}`} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono text-slate-400 font-medium">Week {entry.weekNumber}</div>
          <div className="text-sm font-medium text-white leading-snug mt-0.5 truncate">{entry.narrative}</div>
        </div>
        <div className={`text-sm font-mono font-bold tabular-nums flex-shrink-0 ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
          {isUp ? "+" : ""}{formatPercent(entry.changePct)}
        </div>
        <span className="text-slate-500 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.07] pt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-[#151c2f] rounded-xl p-2">
              <div className="text-xs text-slate-400 font-medium">Start</div>
              <div className="text-white font-bold">{formatCurrency(entry.netWorthStart)}</div>
            </div>
            <div className="bg-[#151c2f] rounded-xl p-2">
              <div className="text-xs text-slate-400 font-medium">End</div>
              <div className={`font-bold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>{formatCurrency(entry.netWorthEnd)}</div>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono space-y-1">
            <div>Trades: <span className="text-white">{entry.tradeCount}</span></div>
            {entry.bestTrade && (
              <div>Best: <span className="text-emerald-400">{entry.bestTrade.ticker} +{(entry.bestTrade.returnPct * 100).toFixed(1)}%</span></div>
            )}
            {entry.worstTrade && entry.worstTrade.ticker !== entry.bestTrade?.ticker && (
              <div>Worst: <span className="text-rose-400">{entry.worstTrade.ticker} {(entry.worstTrade.returnPct * 100).toFixed(1)}%</span></div>
            )}
            {entry.challengesCompleted > 0 && (
              <div>Challenges: <span className="text-amber-400">{entry.challengesCompleted} completed</span></div>
            )}
          </div>
          {entry.achievementsUnlocked.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {entry.achievementsUnlocked.map((id) => {
                const def = ACHIEVEMENTS.find((a) => a.id === id);
                if (!def) return null;
                return (
                  <span key={id} className="text-[10px] font-mono bg-amber-900/40 text-amber-400 border border-amber-800/50 px-1.5 py-0.5 rounded">
                    {def.emoji} {def.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WeeklyJournal() {
  const { state } = useGame();
  const journal = [...(state.weeklyJournal ?? [])].reverse();

  if (journal.length === 0) {
    return (
      <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">📓</div>
        <div className="text-slate-400 text-sm">No journal entries yet.</div>
        <div className="text-slate-500 text-xs mt-1">Written at the end of each week.</div>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📓</span>
        <h2 className="text-sm font-semibold text-slate-200">Trading Journal</h2>
      </div>
      <div className="space-y-2">
        {journal.map((entry) => (
          <JournalCard key={entry.weekNumber} entry={entry} />
        ))}
      </div>
    </div>
  );
}
