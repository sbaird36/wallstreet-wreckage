"use client";

import { useGame } from "@/context/GameContext";

export const TRADER_RANKS = [
  { minXp: 0,      title: "Intern",             color: "text-slate-400",   bg: "bg-[#151c2f]" },
  { minXp: 500,    title: "Junior Analyst",      color: "text-blue-400",    bg: "bg-blue-900/40" },
  { minXp: 1500,   title: "Trader",              color: "text-cyan-400",    bg: "bg-cyan-900/40" },
  { minXp: 4000,   title: "Senior Trader",       color: "text-emerald-400", bg: "bg-emerald-900/40" },
  { minXp: 8000,   title: "Portfolio Manager",   color: "text-amber-400",   bg: "bg-amber-900/40" },
  { minXp: 15000,  title: "Fund Director",       color: "text-orange-400",  bg: "bg-orange-900/40" },
  { minXp: 30000,  title: "Market Legend",       color: "text-rose-400",    bg: "bg-rose-900/40" },
];

export function getTraderRank(xp: number) {
  let rank = TRADER_RANKS[0];
  for (const r of TRADER_RANKS) {
    if (xp >= r.minXp) rank = r;
    else break;
  }
  return rank;
}

export function getNextRank(xp: number) {
  for (const r of TRADER_RANKS) {
    if (xp < r.minXp) return r;
  }
  return null;
}

export function TraderRankBadge({ xp, size = "sm" }: { xp: number; size?: "xs" | "sm" | "md" }) {
  const rank = getTraderRank(xp);
  const textSize = size === "xs" ? "text-[9px]" : size === "sm" ? "text-[10px]" : "text-xs";
  return (
    <span className={`inline-flex items-center font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded ${rank.bg} ${rank.color} ${textSize} border border-current/20`}>
      {rank.title}
    </span>
  );
}
