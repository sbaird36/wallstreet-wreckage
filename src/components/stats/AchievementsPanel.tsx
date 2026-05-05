"use client";

import { useMemo, useState } from "react";
import { useGame } from "@/context/GameContext";
import { ACHIEVEMENTS, type AchievementDef } from "@/data/achievementData";

const CATEGORY_LABELS: Record<string, string> = {
  trading: "Trading",
  streak: "Streaks",
  social: "Social",
  portfolio: "Portfolio",
  exploration: "Exploration",
};

function AchievementCard({ def, unlocked, day }: { def: AchievementDef; unlocked: boolean; day?: number }) {
  return (
    <div className={`rounded-xl border p-3 flex items-start gap-3 ${
      unlocked ? "bg-[#151c2f] border-amber-800/40" : "bg-[#0f1221] border-white/[0.07] opacity-50"
    }`}>
      <div className={`text-2xl leading-none flex-shrink-0 ${unlocked ? "" : "grayscale opacity-40"}`}>
        {def.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono font-bold ${unlocked ? "text-white" : "text-slate-500"}`}>
            {def.title}
          </span>
          {unlocked && <span className="text-[9px] font-mono text-amber-400">+{def.xpReward} XP</span>}
        </div>
        <div className={`text-[11px] mt-0.5 ${unlocked ? "text-slate-300" : "text-slate-500"}`}>
          {def.description}
        </div>
        {unlocked && day !== undefined && (
          <div className="text-xs text-slate-400 font-medium mt-0.5">Day {day}</div>
        )}
      </div>
      {unlocked && <span className="text-emerald-500 text-sm flex-shrink-0">✓</span>}
    </div>
  );
}

export function AchievementsPanel() {
  const { state } = useGame();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const unlockedMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of state.achievements ?? []) m.set(a.id, a.unlockedOnDay);
    return m;
  }, [state.achievements]);

  const categories = ["all", ...Object.keys(CATEGORY_LABELS)];
  const unlockedCount = unlockedMap.size;
  const totalCount = ACHIEVEMENTS.length;

  const filtered = ACHIEVEMENTS
    .filter((def) => activeCategory === "all" || def.category === activeCategory)
    .sort((a, b) => {
      const aU = unlockedMap.has(a.id) ? 1 : 0;
      const bU = unlockedMap.has(b.id) ? 1 : 0;
      return bU - aU;
    });

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">🏆</span>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Achievements</h2>
        </div>
        <span className="text-xs font-mono text-amber-400">{unlockedCount} / {totalCount}</span>
      </div>
      <div className="h-1.5 bg-[#151c2f] rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
        />
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${
              activeCategory === cat
                ? "bg-[#1e2a45] border-white/20 text-white"
                : "border-white/[0.07] text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((def) => (
          <AchievementCard
            key={def.id}
            def={def}
            unlocked={unlockedMap.has(def.id)}
            day={unlockedMap.get(def.id)}
          />
        ))}
      </div>
    </div>
  );
}
