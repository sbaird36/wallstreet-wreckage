"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { ChangeIndicator } from "@/components/ui/ChangeIndicator";
import { formatCurrency } from "@/utils/formatting";
import type { MarketIndex } from "@/types";

function IndexSparkline({ history }: { history: MarketIndex["history"] }) {
  if (history.length < 2) {
    return <div className="w-20 h-8 flex items-center justify-center text-slate-500 text-xs">—</div>;
  }

  const values = history.map((h) => h.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 80;
  const H = 32;

  const toX = (i: number) => (i / (values.length - 1)) * W;
  const toY = (v: number) => H - 2 - ((v - min) / range) * (H - 4);

  const path = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`)
    .join(" ");

  const isUp = values[values.length - 1] >= values[0];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <path
        d={path}
        fill="none"
        stroke={isUp ? "#34d399" : "#f43f5e"}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IndexDetailModal({
  index,
  onClose,
}: {
  index: MarketIndex;
  onClose: () => void;
}) {
  const changePct =
    index.previousValue > 0
      ? (index.currentValue - index.previousValue) / index.previousValue
      : 0;
  const totalChangePct =
    index.startingValue > 0
      ? (index.currentValue - index.startingValue) / index.startingValue
      : 0;

  // Full chart
  const history = index.history;
  const values = history.map((h) => h.value);
  const min = Math.min(...values) * 0.999;
  const max = Math.max(...values) * 1.001;
  const range = max - min || 1;
  const W = 560;
  const H = 140;
  const PAD = { top: 10, right: 60, bottom: 20, left: 10 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / Math.max(history.length - 1, 1)) * cw;
  const toY = (v: number) => PAD.top + ch - ((v - min) / range) * ch;

  const pathD = history.map((h, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(h.value)}`).join(" ");
  const fillD = pathD + ` L ${toX(history.length - 1)} ${PAD.top + ch} L ${toX(0)} ${PAD.top + ch} Z`;
  const isUp = values[values.length - 1] >= values[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#0f1221] border border-white/[0.07] rounded-xl p-6 w-full max-w-xl shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-mono font-bold text-white">{index.ticker}</h2>
            <div className="text-sm text-slate-300">{index.name}</div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="flex items-end gap-4 mb-5">
          <div className="text-3xl font-mono font-bold text-white tabular-nums">
            {index.currentValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <div className="pb-1">
            <ChangeIndicator value={changePct} size="lg" />
          </div>
          <div className="pb-1 text-xs text-slate-400">
            All-time: <span className={totalChangePct >= 0 ? "text-emerald-400" : "text-rose-400"}>
              {totalChangePct >= 0 ? "+" : ""}{(totalChangePct * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="mb-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: H }}>
            {[0, 0.5, 1].map((frac) => {
              const y = PAD.top + frac * ch;
              const val = max - frac * range;
              return (
                <g key={frac}>
                  <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#0e2038" strokeWidth="1" />
                  <text x={W - PAD.right + 4} y={y + 4} fill="#3f6480" fontSize="9" textAnchor="start">
                    {val.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </text>
                </g>
              );
            })}
            <path d={fillD} fill={isUp ? "rgba(52,211,153,0.08)" : "rgba(244,63,94,0.08)"} />
            <path d={pathD} fill="none" stroke={isUp ? "#34d399" : "#f43f5e"} strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">{index.description}</p>

        <div>
          <div className="text-xs text-slate-400 font-medium mb-2">
            Constituents ({index.constituents.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {index.constituents.map((t) => (
              <span key={t} className="text-xs font-mono bg-[#151c2f] border border-white/[0.07] px-2 py-0.5 rounded text-slate-200">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndexWidget() {
  const { state } = useGame();
  const [selectedIndex, setSelectedIndex] = useState<MarketIndex | null>(null);
  const indexes = Object.values(state.indexes);

  if (indexes.length === 0) return null;

  return (
    <>
      <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          Market Indexes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {indexes.map((index) => {
            const changePct =
              index.previousValue > 0
                ? (index.currentValue - index.previousValue) / index.previousValue
                : 0;
            const totalChangePct =
              index.startingValue > 0
                ? (index.currentValue - index.startingValue) / index.startingValue
                : 0;
            const isUp = index.currentValue >= index.startingValue;

            return (
              <button
                key={index.id}
                onClick={() => setSelectedIndex(index)}
                className="bg-[#151c2f] hover:bg-[#1e2a45] border border-white/[0.07] rounded-xl p-3 text-left transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-xs font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                      {index.ticker}
                    </div>
                    <div className="text-xs text-slate-400 truncate">{index.name}</div>
                  </div>
                  <IndexSparkline history={index.history} />
                </div>
                <div className="text-lg font-mono font-bold text-white tabular-nums">
                  {index.currentValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <ChangeIndicator value={changePct} size="sm" />
                  <span className="text-xs text-slate-500">today</span>
                  <span className={`text-xs font-mono tabular-nums ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                    {totalChangePct >= 0 ? "+" : ""}{(totalChangePct * 100).toFixed(1)}% all-time
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedIndex && (
        <IndexDetailModal index={selectedIndex} onClose={() => setSelectedIndex(null)} />
      )}
    </>
  );
}
