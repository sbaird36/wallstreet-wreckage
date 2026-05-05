"use client";
import { useGame } from "@/context/GameContext";
import { MILESTONES } from "@/data/milestoneData";

export function MilestoneModal() {
  const { state, dispatch } = useGame();
  if (!state.pendingMilestone) return null;
  const milestone = MILESTONES.find((m) => m.id === state.pendingMilestone);
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div className="relative bg-[#0f1221] border border-amber-700/50 rounded-2xl w-full max-w-sm shadow-2xl shadow-amber-900/30 p-8 text-center">
        <div className="text-7xl mb-4 animate-bounce">{milestone.emoji}</div>
        <div className="text-xs font-medium text-amber-400 uppercase mb-2">Milestone Unlocked</div>
        <div className="text-2xl font-bold text-white mb-1">{milestone.title}</div>
        <div className="text-sm text-slate-400 mb-4">{milestone.subtitle}</div>
        <div className="inline-flex items-center gap-2 bg-amber-900/40 border border-amber-700/50 rounded-full px-4 py-1.5 mb-6">
          <span className="text-amber-400 font-mono font-bold text-sm">+{milestone.xpReward} XP</span>
        </div>
        <button
          onClick={() => dispatch({ type: "DISMISS_MILESTONE" })}
          className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-xl font-mono font-bold transition-colors"
        >
          Continue Trading
        </button>
      </div>
    </div>
  );
}
