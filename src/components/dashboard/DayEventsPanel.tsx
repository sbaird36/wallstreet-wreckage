"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { getDayName, getDayOfWeek } from "@/utils/dateUtils";
import type { EventSentiment } from "@/types";
import { DailyChallenges } from "@/components/dashboard/DailyChallenges";

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

  const { activeEvents, currentDay, startDate, skillPoints, contactTips, advisorEmails, activeSectorPlays } = state;
  const dayName = getDayName(startDate, currentDay);
  const dow = getDayOfWeek(startDate, currentDay);
  const isMonday = dow === 1;
  const newTips = (contactTips ?? []).filter((t) => !t.isRead);
  const newAdvisorEmails = (advisorEmails ?? []).filter((e) => !e.isRead);
  const todayChallenges = (state.dailyChallenges ?? []).filter(c => c.day === currentDay);
  const activePlays = (activeSectorPlays ?? []).filter(p => !p.completed);

  const hasContent =
    activeEvents.length > 0 ||
    (isMonday && skillPoints > 0) ||
    newTips.length > 0 ||
    newAdvisorEmails.length > 0 ||
    todayChallenges.length > 0 ||
    activePlays.length > 0;

  if (!hasContent) return null;

  const totalCount = activeEvents.length +
    (isMonday && skillPoints > 0 ? 1 : 0) +
    (newTips.length > 0 ? 1 : 0) +
    (newAdvisorEmails.length > 0 ? 1 : 0) +
    (todayChallenges.length > 0 ? 1 : 0) +
    activePlays.length;

  return (
    <div className="mb-4 bg-[#0f1221] border border-white/[0.07] rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#151c2f]/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-sm font-semibold text-white">
            Market Events
          </span>
          <span className="text-xs text-slate-400">
            · {dayName} · Day {currentDay}
          </span>
          <span className="text-[10px] bg-[#151c2f] text-slate-300 font-mono px-1.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>
        <span className="text-slate-500 text-xs select-none">
          {collapsed ? "▼ show" : "▲ hide"}
        </span>
      </button>

      {!collapsed && (
        <div className="border-t border-white/[0.07] divide-y divide-white/[0.04]">
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
                        <span className="text-xs text-slate-400 font-medium mr-0.5">
                          Affected:
                        </span>
                        {fe.affectedTickers.slice(0, 7).map((ticker) => (
                          <span
                            key={ticker}
                            className="text-[10px] font-mono bg-[#151c2f] text-slate-300 px-1.5 py-0.5 rounded"
                          >
                            {ticker}
                          </span>
                        ))}
                        {fe.affectedTickers.length > 7 && (
                          <span className="text-[10px] text-slate-500">
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
                  <p className="text-xs text-slate-400 mt-0.5">
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
                  <p className="text-xs text-slate-400 mt-0.5">
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
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visit the Advisors tab to read your messages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Active sector plays */}
          {activePlays.map((play) => (
            <div key={play.id} className="flex items-stretch bg-indigo-950/20">
              <div className="w-1 flex-shrink-0 bg-indigo-500" />
              <div className="flex items-center gap-3 px-4 py-3 flex-1">
                <span className="text-xl leading-none">🏭</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Sector Play: {play.sector}</span>
                    <span className="text-[10px] font-mono font-bold text-indigo-400 tracking-widest">ACTIVE</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {play.tickers.join(", ")} · {Math.max(0, 5 - (currentDay - play.startDay))} days to win
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Quiet day — no events */}
          {activeEvents.length === 0 && !isMonday && newTips.length === 0 && newAdvisorEmails.length === 0 && todayChallenges.length === 0 && activePlays.length === 0 && (
            <div className="flex items-stretch">
              <div className="w-1 flex-shrink-0 bg-slate-600" />
              <div className="px-4 py-3 text-sm text-slate-500 italic">
                No significant market events today.
              </div>
            </div>
          )}

          {/* Daily challenges */}
          <DailyChallenges />
        </div>
      )}
    </div>
  );
}
