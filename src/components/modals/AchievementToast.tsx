"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/context/GameContext";
import { ACHIEVEMENTS } from "@/data/achievementData";

export function AchievementToast() {
  const { state, dispatch } = useGame();
  const [visible, setVisible] = useState<string | null>(null);

  useEffect(() => {
    const pending = state.pendingAchievements ?? [];
    if (pending.length === 0) return;
    setVisible(pending[0]);
    const t = setTimeout(() => {
      setVisible(null);
      dispatch({ type: "DISMISS_ACHIEVEMENTS" });
    }, 4000);
    return () => clearTimeout(t);
  }, [state.pendingAchievements, dispatch]);

  if (!visible) return null;
  const def = ACHIEVEMENTS.find((a) => a.id === visible);
  if (!def) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] pointer-events-none">
      <div className="bg-[#0f1221] border border-amber-700/60 rounded-xl px-4 py-3 shadow-2xl shadow-amber-900/30 flex items-center gap-3 max-w-xs">
        <span className="text-2xl flex-shrink-0">{def.emoji}</span>
        <div className="min-w-0">
          <div className="text-[10px] font-medium text-amber-400 uppercase">Achievement Unlocked</div>
          <div className="text-sm font-bold text-white leading-tight">{def.title}</div>
          <div className="text-xs text-slate-400 truncate">{def.description}</div>
          <div className="text-[10px] font-mono text-amber-400 mt-0.5">+{def.xpReward} XP</div>
        </div>
      </div>
    </div>
  );
}
