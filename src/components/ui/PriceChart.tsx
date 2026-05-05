"use client";

import { useState, useMemo } from "react";
import type { PricePoint } from "@/types";
import { formatPrice } from "@/utils/formatting";
import { smaHistory } from "@/utils/technicals";

interface Props {
  history: PricePoint[];
  currentPrice: number;
  ticker: string;
  showVolume?: boolean;
  showMA?: boolean;
}

type Range = "7D" | "30D" | "90D" | "ALL";

export function PriceChart({
  history,
  currentPrice,
  ticker,
  showVolume = true,
  showMA = true,
}: Props) {
  const [range, setRange] = useState<Range>("30D");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const displayData = useMemo(() => {
    const n =
      range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 90 : history.length;
    return history.slice(-n);
  }, [history, range]);

  const closes = displayData.map((p) => p.close);
  const volumes = displayData.map((p) => p.volume);

  // Moving averages — computed over the full history so they're accurate at the edges
  const allCloses = history.map((p) => p.close);
  const allSma20 = smaHistory(allCloses, 20);
  const allSma50 = smaHistory(allCloses, 50);

  // Slice MAs to match displayData
  const historyOffset = history.length - displayData.length;
  const sma20 = allSma20.slice(historyOffset);
  const sma50 = allSma50.slice(historyOffset);

  const minPrice = Math.min(...closes);
  const maxPrice = Math.max(...closes);

  // Extend range to fit MA values if they're outside price range
  const maValues = [
    ...sma20.filter((v): v is number => v !== null),
    ...sma50.filter((v): v is number => v !== null),
  ];
  const overallMin = maValues.length ? Math.min(minPrice, ...maValues) : minPrice;
  const overallMax = maValues.length ? Math.max(maxPrice, ...maValues) : maxPrice;
  const priceRange = (overallMax - overallMin) * 1.02 || 1;
  const priceMin = overallMin * 0.99;

  const WIDTH = 600;
  const PRICE_HEIGHT = 160;
  const VOL_HEIGHT = showVolume ? 36 : 0;
  const GAP = showVolume ? 4 : 0;
  const TOTAL_HEIGHT = PRICE_HEIGHT + GAP + VOL_HEIGHT;
  const PAD = { top: 10, right: 50, bottom: showVolume ? 4 : 20, left: 4 };
  const cw = WIDTH - PAD.left - PAD.right;
  const ch = PRICE_HEIGHT - PAD.top - PAD.bottom;

  const toX = (i: number) =>
    PAD.left + (i / Math.max(displayData.length - 1, 1)) * cw;
  const toY = (price: number) =>
    PAD.top + ch - ((price - priceMin) / priceRange) * ch;

  const pathD = displayData
    .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.close)}`)
    .join(" ");

  const fillD =
    pathD +
    ` L ${toX(displayData.length - 1)} ${PAD.top + ch} L ${toX(0)} ${PAD.top + ch} Z`;

  const isPositive =
    displayData.length > 0 &&
    displayData[displayData.length - 1].close >= displayData[0].close;

  const strokeColor = isPositive ? "#34d399" : "#f43f5e";
  const fillColor = isPositive ? "rgba(52,211,153,0.10)" : "rgba(244,63,94,0.10)";

  // SMA paths (only connect non-null segments)
  function maPath(values: (number | null)[]): string {
    let d = "";
    let started = false;
    for (let i = 0; i < values.length; i++) {
      const v = values[i];
      if (v === null) { started = false; continue; }
      d += started ? ` L ${toX(i)} ${toY(v)}` : ` M ${toX(i)} ${toY(v)}`;
      started = true;
    }
    return d;
  }

  // Volume bars
  const maxVol = Math.max(...volumes) || 1;
  const volTop = PRICE_HEIGHT + GAP;
  const volH = VOL_HEIGHT - 2;

  const hoveredPoint = hoverIndex !== null ? displayData[hoverIndex] : null;

  return (
    <div className="w-full">
      {/* Controls row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {(["7D", "30D", "90D", "ALL"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                range === r
                  ? "bg-[#1e2a45] border-white/[0.07] text-white"
                  : "border-white/[0.07] text-slate-400 hover:border-white/[0.07] hover:text-slate-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        {showMA && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 h-0.5 bg-blue-400" />
              MA20
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-4 h-0.5 bg-orange-400" />
              MA50
            </span>
          </div>
        )}
      </div>

      {/* SVG chart */}
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${TOTAL_HEIGHT}`}
          className="w-full"
          style={{ height: TOTAL_HEIGHT }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {/* Price area grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD.top + frac * ch;
            const price = overallMax * 1.01 - frac * priceRange;
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={WIDTH - PAD.right}
                  y2={y}
                  stroke="#1f2937"
                  strokeWidth="1"
                />
                <text
                  x={WIDTH - PAD.right + 4}
                  y={y + 4}
                  fill="#6b7280"
                  fontSize="8"
                  textAnchor="start"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Fill */}
          <path d={fillD} fill={fillColor} />

          {/* MA50 */}
          {showMA && (
            <path
              d={maPath(sma50)}
              fill="none"
              stroke="#f97316"
              strokeWidth="1"
              strokeDasharray="3,2"
              opacity="0.8"
            />
          )}

          {/* MA20 */}
          {showMA && (
            <path
              d={maPath(sma20)}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="1"
              strokeDasharray="3,2"
              opacity="0.8"
            />
          )}

          {/* Price line */}
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Volume bars */}
          {showVolume &&
            displayData.map((p, i) => {
              const barH = (p.volume / maxVol) * volH;
              const barW = Math.max(1, cw / displayData.length - 1);
              return (
                <rect
                  key={i}
                  x={toX(i) - barW / 2}
                  y={volTop + volH - barH}
                  width={barW}
                  height={barH}
                  fill={
                    p.close >= p.open ? "rgba(52,211,153,0.4)" : "rgba(244,63,94,0.4)"
                  }
                />
              );
            })}

          {/* Hover capture zones */}
          {displayData.map((_, i) => (
            <rect
              key={i}
              x={toX(i) - 8}
              y={PAD.top}
              width={16}
              height={ch}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}

          {/* Hover crosshair + dot */}
          {hoverIndex !== null && (
            <>
              <line
                x1={toX(hoverIndex)}
                y1={PAD.top}
                x2={toX(hoverIndex)}
                y2={PAD.top + ch}
                stroke="#4b5563"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <circle
                cx={toX(hoverIndex)}
                cy={toY(displayData[hoverIndex].close)}
                r="3"
                fill={strokeColor}
              />
            </>
          )}
        </svg>

        {/* Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-1 right-12 bg-[#0f1221] border border-white/[0.07] rounded p-2 text-xs pointer-events-none z-10 shadow-lg">
            <div className="text-slate-300 mb-1 font-mono">Day {hoveredPoint.day}</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono tabular-nums">
              <span className="text-slate-400">O</span>
              <span className="text-white">${formatPrice(hoveredPoint.open)}</span>
              <span className="text-slate-400">H</span>
              <span className="text-emerald-400">${formatPrice(hoveredPoint.high)}</span>
              <span className="text-slate-400">L</span>
              <span className="text-rose-400">${formatPrice(hoveredPoint.low)}</span>
              <span className="text-slate-400">C</span>
              <span className="text-white">${formatPrice(hoveredPoint.close)}</span>
              <span className="text-slate-400">Vol</span>
              <span className="text-slate-200">
                {(hoveredPoint.volume / 1_000_000).toFixed(1)}M
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
