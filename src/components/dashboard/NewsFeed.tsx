"use client";

import { useGame } from "@/context/GameContext";
import { SentimentBadge } from "@/components/ui/Badge";
import type { FiredEvent } from "@/types";

const SENTIMENT_BORDER: Record<string, string> = {
  VERY_BULLISH: "border-l-emerald-500",
  BULLISH: "border-l-green-500",
  MIXED: "border-l-yellow-500",
  BEARISH: "border-l-orange-500",
  VERY_BEARISH: "border-l-rose-500",
};

function EventCard({ fired, isToday }: { fired: FiredEvent; isToday: boolean }) {
  const borderColor =
    SENTIMENT_BORDER[fired.event.sentiment] ?? "border-l-slate-400";

  return (
    <div
      className={`border-l-4 ${borderColor} bg-[#151c2f] rounded-r p-3 mb-2`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-lg">{fired.event.icon}</span>
          <div>
            {isToday && (
              <span className="text-xs bg-emerald-900 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded mr-2">
                TODAY
              </span>
            )}
            <span className="text-xs text-slate-300">Day {fired.day}</span>
          </div>
        </div>
        <SentimentBadge sentiment={fired.event.sentiment} />
      </div>
      <div className="text-sm font-bold text-white mb-1">
        {fired.event.headline}
      </div>
      <div className="text-xs text-slate-300 mb-2">{fired.event.body}</div>
      {fired.affectedTickers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {fired.affectedTickers.slice(0, 6).map((ticker) => {
            const mult = fired.actualMultipliers[ticker];
            const isUp = mult >= 1;
            return (
              <span
                key={ticker}
                className={`text-xs px-1.5 py-0.5 rounded font-mono border ${
                  isUp
                    ? "bg-emerald-900 text-emerald-300 border-emerald-700"
                    : "bg-rose-900 text-rose-300 border-rose-700"
                }`}
              >
                {ticker} {isUp ? "+" : ""}
                {((mult - 1) * 100).toFixed(1)}%
              </span>
            );
          })}
          {fired.affectedTickers.length > 6 && (
            <span className="text-xs text-slate-400">
              +{fired.affectedTickers.length - 6} more
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function NewsFeed() {
  const { state } = useGame();
  const { activeEvents, eventHistory } = state;

  const allEvents = [...activeEvents, ...eventHistory]
    .filter(
      (e, i, arr) =>
        arr.findIndex(
          (x) => x.event.id === e.event.id && x.day === e.day
        ) === i
    )
    .sort((a, b) => b.day - a.day);

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4 flex flex-col h-full">
      <h2 className="text-sm font-semibold text-slate-300 mb-3">
        Market News
      </h2>
      <div className="overflow-y-auto flex-1 max-h-[500px] pr-1">
        {allEvents.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">
            No news yet. Advance a day to see what happens.
          </div>
        ) : (
          allEvents.map((fired) => (
            <EventCard
              key={`${fired.event.id}-${fired.day}`}
              fired={fired}
              isToday={activeEvents.some(
                (e) => e.event.id === fired.event.id && e.day === fired.day
              )}
            />
          ))
        )}
      </div>
    </div>
  );
}
