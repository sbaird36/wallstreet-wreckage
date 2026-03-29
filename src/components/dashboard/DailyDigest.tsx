"use client";

import { useState } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { SentimentBadge } from "@/components/ui/Badge";
import { getTipOfTheDay } from "@/data/tradingTips";
import {
  getEventEducation,
  getCompanyRecommendations,
  getUpcomingEarnings,
  getCategoryLabel,
  type CompanyRecommendation,
  type EarningsAlert,
} from "@/utils/eventEducation";
import type { FiredEvent } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  MOMENTUM: "📈",
  RISK: "🛡️",
  FUNDAMENTALS: "🏗️",
  PSYCHOLOGY: "🧠",
  STRATEGY: "♟️",
  CRYPTO: "₿",
};

const SENTIMENT_BORDER: Record<string, string> = {
  VERY_BULLISH: "border-l-emerald-500",
  BULLISH: "border-l-green-500",
  MIXED: "border-l-yellow-500",
  BEARISH: "border-l-orange-500",
  VERY_BEARISH: "border-l-rose-500",
};

const SIGNAL_STYLES = {
  bullish: "bg-emerald-900/60 border-emerald-800 text-emerald-300",
  bearish: "bg-rose-900/60 border-rose-800 text-rose-300",
  watch: "bg-yellow-900/60 border-yellow-800 text-yellow-300",
};

const SIGNAL_ARROW = {
  bullish: "▲",
  bearish: "▼",
  watch: "◆",
};

// ─── Earnings Alert Panel ────────────────────────────────────────────────────

function EarningsPanel({ alerts }: { alerts: EarningsAlert[] }) {
  const [expanded, setExpanded] = useState(true);
  if (alerts.length === 0) return null;

  return (
    <div className="bg-yellow-950/40 border border-yellow-800/50 rounded-lg p-3 mb-3">
      <button
        className="w-full flex items-center justify-between"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span>📅</span>
          <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
            Upcoming Earnings
          </span>
          <span className="text-xs bg-yellow-800 text-yellow-300 px-1.5 py-0.5 rounded font-mono">
            {alerts.length}
          </span>
        </div>
        <span className="text-xs text-gray-500">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <>
          <p className="text-xs text-yellow-200/70 mt-2 mb-2 leading-relaxed">
            Stocks reporting earnings soon. Expect higher volatility in the days leading up — and on — the release. Prices can swing 5–20% on the result.
          </p>
          <div className="space-y-1.5">
            {alerts.map((a) => (
              <Link
                key={a.ticker}
                href={a.href}
                className="flex items-center justify-between bg-yellow-900/30 hover:bg-yellow-900/50 border border-yellow-800/40 rounded-lg px-3 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-xs">{a.ticker}</span>
                  <span className="text-xs text-gray-400 truncate max-w-[120px]">{a.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-xs font-mono font-bold ${
                      a.daysAway === 1 ? "text-rose-400" : a.daysAway <= 3 ? "text-yellow-400" : "text-gray-400"
                    }`}
                  >
                    {a.daysAway === 1 ? "TOMORROW" : `Day ${a.earningsDay}`}
                  </span>
                  {a.daysAway > 1 && (
                    <div className="text-xs text-gray-600">{a.daysAway} days away</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-2 text-xs text-yellow-700">
            Tip: Research these companies now to form a view before the report lands.
          </div>
        </>
      )}
    </div>
  );
}

// ─── Company Recommendations ─────────────────────────────────────────────────

function CompanyList({ recs }: { recs: CompanyRecommendation[] }) {
  if (recs.length === 0) return null;

  return (
    <div className="mt-2">
      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1.5">
        🔍 Companies to Watch
      </div>
      <div className="space-y-1">
        {recs.slice(0, 6).map((rec) => (
          <Link
            key={rec.ticker}
            href={rec.href}
            className={`flex items-start justify-between rounded border px-2.5 py-2 transition-colors hover:opacity-90 ${SIGNAL_STYLES[rec.signal]}`}
          >
            <div className="flex items-start gap-2 min-w-0">
              <span className="text-xs font-bold mt-0.5">{SIGNAL_ARROW[rec.signal]}</span>
              <div className="min-w-0">
                <span className="font-mono font-bold text-xs">{rec.ticker}</span>
                <span className="text-xs opacity-70 ml-1.5">{rec.name}</span>
                <div className="text-xs opacity-60 leading-snug mt-0.5">{rec.reason}</div>
              </div>
            </div>
            <span className="text-xs opacity-50 ml-2 flex-shrink-0 mt-0.5">→</span>
          </Link>
        ))}
        {recs.length > 6 && (
          <div className="text-xs text-gray-600 text-center">
            +{recs.length - 6} more affected
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  fired,
  isToday,
  assets,
}: {
  fired: FiredEvent;
  isToday: boolean;
  assets: Record<string, import("@/types").Asset>;
}) {
  const [expanded, setExpanded] = useState(isToday); // auto-expand today's events
  const education = getEventEducation(fired.event);
  const recs = getCompanyRecommendations(fired.event, assets);
  const borderColor = SENTIMENT_BORDER[fired.event.sentiment] ?? "border-l-gray-500";

  return (
    <div className={`border-l-4 ${borderColor} bg-gray-800 rounded-r mb-2 overflow-hidden`}>
      {/* Header */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{fired.event.icon}</span>
            <div>
              {isToday && (
                <span className="text-xs bg-emerald-900 text-emerald-300 border border-emerald-700 px-1.5 py-0.5 rounded mr-2">
                  TODAY
                </span>
              )}
              <span className="text-xs text-gray-500">
                {getCategoryLabel(fired.event.category)} · Day {fired.day}
              </span>
            </div>
          </div>
          <SentimentBadge sentiment={fired.event.sentiment} />
        </div>

        <div className="text-sm font-bold text-white mb-1">{fired.event.headline}</div>
        <div className="text-xs text-gray-400 mb-2 leading-relaxed">{fired.event.body}</div>

        {/* Price impact tags */}
        {fired.affectedTickers.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {fired.affectedTickers.slice(0, 8).map((ticker) => {
              const mult = fired.actualMultipliers[ticker];
              const isUp = mult >= 1;
              return (
                <Link
                  key={ticker}
                  href={`/${assets[ticker]?.type === "crypto" ? "crypto" : "stock"}/${ticker}`}
                  className={`text-xs px-1.5 py-0.5 rounded font-mono border transition-colors hover:opacity-80 ${
                    isUp
                      ? "bg-emerald-900 text-emerald-300 border-emerald-700"
                      : "bg-rose-900 text-rose-300 border-rose-700"
                  }`}
                >
                  {ticker} {isUp ? "+" : ""}
                  {((mult - 1) * 100).toFixed(1)}%
                </Link>
              );
            })}
            {fired.affectedTickers.length > 8 && (
              <span className="text-xs text-gray-500">
                +{fired.affectedTickers.length - 8} more
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <span>{expanded ? "▲" : "▼"}</span>
          {expanded ? "Hide analysis" : "What does this mean for traders?"}
        </button>
      </div>

      {/* Educational expansion */}
      {expanded && (
        <div className="border-t border-gray-700 bg-gray-900/60 p-3 space-y-3">
          <div>
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
              📊 Why Markets Move
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{education.mechanism}</p>
          </div>
          <div>
            <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">
              👀 What to Watch For
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{education.watchFor}</p>
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">
              💡 Trader Tip
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{education.traderTip}</p>
          </div>

          {/* Company recommendations */}
          <CompanyList recs={recs} />
        </div>
      )}
    </div>
  );
}

// ─── Daily Digest ─────────────────────────────────────────────────────────────

export function DailyDigest() {
  const { state } = useGame();
  const [tipDismissed, setTipDismissed] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const tip = getTipOfTheDay(state.currentDay);
  const { activeEvents, eventHistory, assets, currentDay } = state;

  const earningsAlerts = getUpcomingEarnings(assets, currentDay, 7);

  const historyEvents = [...eventHistory]
    .filter((e) => !activeEvents.some((a) => a.event.id === e.event.id && a.day === e.day))
    .sort((a, b) => b.day - a.day);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex flex-col">
      <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
        Market News &amp; Education
      </h2>

      {/* Tip of the Day */}
      {!tipDismissed && (
        <div className="bg-blue-950/60 border border-blue-800/60 rounded-lg p-3 mb-3">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">{CATEGORY_ICONS[tip.category] ?? "💡"}</span>
              <div>
                <div className="text-xs text-blue-400 uppercase tracking-wider font-bold">
                  Tip · {tip.category}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">{tip.title}</div>
              </div>
            </div>
            <button
              onClick={() => setTipDismissed(true)}
              className="text-gray-600 hover:text-gray-400 text-xs ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-2">{tip.body}</p>
          <div className="bg-blue-900/40 border border-blue-800/40 rounded px-2.5 py-1.5">
            <span className="text-xs text-blue-300 font-bold">Key takeaway: </span>
            <span className="text-xs text-blue-200">{tip.takeaway}</span>
          </div>
        </div>
      )}

      {/* Upcoming Earnings */}
      <EarningsPanel alerts={earningsAlerts} />

      {/* Today's events */}
      {activeEvents.length > 0 ? (
        <div className="mb-2">
          <div className="text-xs text-gray-600 uppercase tracking-wider mb-2">
            Today&apos;s Events
          </div>
          {activeEvents.map((fired) => (
            <EventCard
              key={`${fired.event.id}-${fired.day}`}
              fired={fired}
              isToday
              assets={assets}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 py-4 text-xs mb-2">
          {currentDay === 1
            ? "Advance a day to see market events."
            : "No events today. Markets were quiet — a good day to research companies."}
        </div>
      )}

      {/* History */}
      {historyEvents.length > 0 && (
        <div>
          <button
            onClick={() => setShowHistory((v) => !v)}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors w-full text-left mb-2 flex items-center gap-1"
          >
            <span>{showHistory ? "▲" : "▼"}</span>
            {showHistory ? "Hide" : "Show"} past events ({historyEvents.length})
          </button>

          {showHistory && (
            <div className="max-h-[500px] overflow-y-auto pr-1">
              {historyEvents.map((fired) => (
                <EventCard
                  key={`${fired.event.id}-${fired.day}`}
                  fired={fired}
                  isToday={false}
                  assets={assets}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
