"use client";
import { useGame } from "@/context/GameContext";
import type { DailyChallenge } from "@/types";

function ChallengeRow({ challenge }: { challenge: DailyChallenge }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 ${challenge.completed ? "opacity-60" : ""}`}>
      <div className={`w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-xs border ${
        challenge.completed
          ? "bg-emerald-500 border-emerald-500 text-white"
          : "border-slate-600 bg-[#151c2f]"
      }`}>
        {challenge.completed && "✓"}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-xs ${challenge.completed ? "text-slate-500 line-through" : "text-slate-300"}`}>
          {challenge.description}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-[10px] font-mono text-amber-400">+{challenge.xpReward} XP</span>
        {challenge.cashReward > 0 && (
          <span className="text-[10px] font-mono text-emerald-400">+${challenge.cashReward}</span>
        )}
      </div>
    </div>
  );
}

export function DailyChallenges() {
  const { state } = useGame();
  const today = (state.dailyChallenges ?? []).filter((c) => c.day === state.currentDay);
  if (today.length === 0) return null;
  const completedCount = today.filter((c) => c.completed).length;

  return (
    <div>
      <div className="px-4 py-2 flex items-center justify-between border-t border-white/[0.04]">
        <span className="text-xs font-medium text-slate-400">daily challenges</span>
        <span className="text-[10px] font-mono text-slate-500">{completedCount}/{today.length} done</span>
      </div>
      {today.map((c) => (
        <ChallengeRow key={c.id} challenge={c} />
      ))}
    </div>
  );
}
