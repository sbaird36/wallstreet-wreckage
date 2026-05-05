"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { formatCurrency } from "@/utils/formatting";
import { RESEARCH_COSTS, RESEARCH_LABELS, generateResearchResult } from "@/engine/researchEngine";
import type { ResearchType, ResearchPurchase, Asset } from "@/types";

const RESEARCH_DESCRIPTIONS: Record<ResearchType, string> = {
  earnings_preview: "Pre-release earnings intelligence. See if a stock will beat or miss consensus estimates.",
  insider_flow:     "Dark pool and block trade data. Know what smart money is doing before the crowd.",
  macro_report:     "Weekly macro outlook and sector rotation signals. Understand the big picture.",
  sentiment_scan:   "Real-time social sentiment analysis for a specific ticker.",
};

const RESEARCH_ICONS: Record<ResearchType, string> = {
  earnings_preview: "📊",
  insider_flow:     "🕵️",
  macro_report:     "🌐",
  sentiment_scan:   "📡",
};

const NEEDS_TICKER: Record<ResearchType, boolean> = {
  earnings_preview: true,
  insider_flow:     true,
  macro_report:     false,
  sentiment_scan:   true,
};

function ResearchCard({
  type, cash, assets, onBuy,
}: {
  type: ResearchType;
  cash: number;
  assets: Record<string, Asset>;
  onBuy: (type: ResearchType, ticker: string | null) => void;
}) {
  const [ticker, setTicker] = useState("");
  const cost = RESEARCH_COSTS[type];
  const needsTicker = NEEDS_TICKER[type];
  const canBuy = cash >= cost && (!needsTicker || ticker !== "");
  const stockTickers = Object.values(assets).filter((a) => a.type === "stock").map((a) => a.ticker).sort();
  const allTickers = Object.keys(assets).sort();

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl leading-none mt-0.5">{RESEARCH_ICONS[type]}</span>
        <div className="flex-1">
          <div className="text-sm font-mono font-bold text-white">{RESEARCH_LABELS[type]}</div>
          <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{RESEARCH_DESCRIPTIONS[type]}</div>
        </div>
        <div className="text-sm font-mono font-bold text-white flex-shrink-0">{formatCurrency(cost)}</div>
      </div>
      {needsTicker && (
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="w-full bg-[#151c2f] border border-white/[0.07] rounded px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-600"
        >
          <option value="">Select a ticker…</option>
          {(type === "earnings_preview" ? stockTickers : allTickers).map((t) => (
            <option key={t} value={t}>{t} — {assets[t]?.name}</option>
          ))}
        </select>
      )}
      <button
        onClick={() => onBuy(type, needsTicker ? ticker : null)}
        disabled={!canBuy}
        className={`w-full py-2 text-xs font-mono font-bold rounded border transition-colors ${
          canBuy
            ? "border-blue-600 bg-blue-900/40 text-blue-300 hover:bg-blue-800/60"
            : "border-white/[0.07] text-slate-500 cursor-not-allowed"
        }`}
      >
        {cash < cost
          ? `Need ${formatCurrency(cost - cash)} more`
          : needsTicker && !ticker
          ? "Select a ticker first"
          : `Purchase — ${formatCurrency(cost)}`}
      </button>
    </div>
  );
}

function PurchasedReport({ report }: { report: ResearchPurchase }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-white/[0.07] rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#151c2f]/30 transition-colors"
      >
        <span className="text-lg">{RESEARCH_ICONS[report.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-mono font-bold text-white">
            {RESEARCH_LABELS[report.type]}{report.ticker ? ` — ${report.ticker}` : ""}
          </div>
          <div className="text-xs text-slate-400 font-medium">Day {report.purchasedDay}</div>
        </div>
        {report.direction && (
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
            report.direction === "bullish" ? "text-emerald-400 border-emerald-800 bg-emerald-900/30" :
            report.direction === "bearish" ? "text-rose-400 border-rose-800 bg-rose-900/30" :
            "text-slate-300 border-white/[0.07]"
          }`}>
            {report.direction.toUpperCase()}
          </span>
        )}
        <span className="text-slate-500 text-xs">{expanded ? "▲" : "▼"}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.07] pt-3">
          <p className="text-sm text-slate-200 leading-relaxed">{report.result}</p>
        </div>
      )}
    </div>
  );
}

export default function ResearchPage() {
  const { state, dispatch } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  const allTypes: ResearchType[] = ["earnings_preview", "insider_flow", "macro_report", "sentiment_scan"];
  const purchases = [...(state.researchPurchases ?? [])].reverse();

  function handleBuy(type: ResearchType, ticker: string | null) {
    const cost = RESEARCH_COSTS[type];
    if (state.portfolio.cash < cost) return;
    const { result, direction } = generateResearchResult(state, type, ticker, state.currentDay);
    const purchase: ResearchPurchase = {
      id: `research_${Date.now()}`,
      type,
      ticker,
      purchasedDay: state.currentDay,
      cost,
      result,
      direction,
    };
    dispatch({ type: "BUY_RESEARCH", payload: purchase });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <TopNav />
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full pb-14 sm:pb-4">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-white">Research Lab</h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Buy intelligence reports to gain an edge. Results are seeded daily — same report, same day, same result.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {allTypes.map((type) => (
            <ResearchCard
              key={type}
              type={type}
              cash={state.portfolio.cash}
              assets={state.assets}
              onBuy={handleBuy}
            />
          ))}
        </div>
        {purchases.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3">
              Your Reports ({purchases.length})
            </h2>
            <div className="space-y-2">
              {purchases.map((r) => (
                <PurchasedReport key={r.id} report={r} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
