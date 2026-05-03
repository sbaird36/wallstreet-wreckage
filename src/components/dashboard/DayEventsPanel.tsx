"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getDayName, getDayOfWeek } from "@/utils/dateUtils";
import type { EventSentiment } from "@/types";

const SENTIMENT_CONFIG: Record<
  EventSentiment,
  { accent: string; label: string; labelColor: string; bg: string }
> = {
  VERY_BULLISH: {
    accent: "bg-emerald-400",
    label: "VERY BULLISH",
    labelColor: "text-emerald-400",
    bg: "bg-emerald-950/30",
  },
  BULLISH: {
    accent: "bg-emerald-600",
    label: "BULLISH",
    labelColor: "text-emerald-500",
    bg: "bg-emerald-950/20",
  },
  BEARISH: {
    accent: "bg-rose-600",
    label: "BEARISH",
    labelColor: "text-rose-500",
    bg: "bg-rose-950/20",
  },
  VERY_BEARISH: {
    accent: "bg-rose-400",
    label: "VERY BEARISH",
    labelColor: "text-rose-400",
    bg: "bg-rose-950/30",
  },
  MIXED: {
    accent: "bg-yellow-500",
    label: "MIXED",
    labelColor: "text-yellow-400",
    bg: "bg-yellow-950/20",
  },
};

export function DayEventsPanel() {
  const { state } = useGame();
  const [collapsed, setCollapsed] = useState(false);

  if (!state.gameStarted) return null;

  const { activeEvents, currentDay, startDate, skillPoints, contactTips, advisorEmails } = state;
  const dayName = getDayName(startDate, currentDay);
  const dow = getDayOfWeek(startDate, currentDay);
  const isMonday = dow === 1;
  const newTips = (contactTips ?? []).filter((t) => !t.isRead);
  const newAdvisorEmails = (advisorEmails ?? []).filter((e) => !e.isRead);

  const hasContent =
    activeEvents.length > 0 ||
    (isMonday && skillPoints > 0) ||
    newTips.length > 0 ||
    newAdvisorEmails.length > 0;

  if (!hasContent) return null;

  const totalCount = activeEvents.length +
    (isMonday && skillPoints > 0 ? 1 : 0) +
    (newTips.length > 0 ? 1 : 0) +
    (newAdvisorEmails.length > 0 ? 1 : 0);

  return (
    <div className="mb-4 bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Market Events
          </span>
          <span className="text-xs text-gray-500 font-mono">
            · {dayName} · Day {currentDay}
          </span>
          <span className="text-[10px] bg-gray-700 text-gray-300 font-mono px-1.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>
        <span className="text-gray-600 text-xs select-none">
          {collapsed ? "▼ show" : "▲ hide"}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-gray-800 divide-y divide-gray-800/60">
          {/* Market events */}
          {activeEvents.map((fe, i) => {
            const cfg = SENTIMENT_CONFIG[fe.event.sentiment];
            return (
              <div key={i} className={`flex items-stretch ${cfg.bg}`}>
                {/* Accent bar */}
                <div className={`w-1 flex-shrink-0 ${cfg.accent}`} />
                {/* Content */}
                <div className="flex items-start gap-3 px-4 py-3 flex-1 min-w-0">
                  <span className="text-xl leading-none mt-0.5 flex-shrink-0">
                    {fe.event.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-white leading-snug">
                        {fe.event.headline}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold tracking-widest ${cfg.labelColor}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    {fe.affectedTickers.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <span className="text-[10px] text-gray-500 mr-0.5">
                          Affected:
                        </span>
                        {fe.affectedTickers.slice(0, 7).map((ticker) => (
                          <span
                            key={ticker}
                            className="text-[10px] font-mono bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded"
                          >
                            {ticker}
                          </span>
                        ))}
                        {fe.affectedTickers.length > 7 && (
                          <span className="text-[10px] text-gray-600">
                            +{fe.affectedTickers.length - 7} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Weekly skill point notification */}
          {isMonday && skillPoints > 0 && (
            <div className="flex items-stretch bg-amber-950/20">
              <div className="w-1 flex-shrink-0 bg-amber-500" />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <span className="text-xl leading-none">⚡</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      +1 Skill Point awarded
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 tracking-widest">
                      WEEKLY BONUS
                    </span>
                    {skillPoints > 1 && (
                      <span className="text-[10px] bg-amber-900/60 text-amber-300 font-mono px-1.5 py-0.5 rounded-full">
                        {skillPoints} unspent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Visit the Skills tab to upgrade your trader abilities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Contact tip notification */}
          {newTips.length > 0 && (
            <div className="flex items-stretch bg-blue-950/20">
              <div className="w-1 flex-shrink-0 bg-blue-500" />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <span className="text-xl leading-none">💬</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {newTips.length} new insider tip{newTips.length > 1 ? "s" : ""} from your contacts
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-400 tracking-widest">
                      INTEL
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Check the WSB tab for contact intelligence.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Advisor emails */}
          {newAdvisorEmails.length > 0 && (
            <div className="flex items-stretch bg-violet-950/20">
              <div className="w-1 flex-shrink-0 bg-violet-500" />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <span className="text-xl leading-none">📬</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {newAdvisorEmails.length} new email{newAdvisorEmails.length > 1 ? "s" : ""} from your advisor{newAdvisorEmails.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-violet-400 tracking-widest">
                      INBOX
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Visit the Advisors tab to read your messages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quiet day — no events */}
          {activeEvents.length === 0 && !isMonday && newTips.length === 0 && newAdvisorEmails.length === 0 && (
            <div className="flex items-stretch">
              <div className="w-1 flex-shrink-0 bg-gray-700" />
              <div className="px-4 py-3 text-sm text-gray-600 italic">
                No significant market events today.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
