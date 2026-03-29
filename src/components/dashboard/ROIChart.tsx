"use client";

import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { getNetWorth, getHoldingValue } from "@/utils/calculations";
import { formatCurrency, formatPercent } from "@/utils/formatting";

const STARTING_CAPITAL = 10_000;

export function ROIChart() {
  const { state } = useGame();
  const { portfolio, assets } = state;

  // ── Derived current values ─────────────────────────────────
  const currentNetWorth = getNetWorth(portfolio, assets);

  const totalCostBasis = Object.values(portfolio.holdings).reduce(
    (sum, h) => sum + h.totalCostBasis,
    0
  );

  const totalMarketValue = Object.values(portfolio.holdings).reduce(
    (sum, h) => sum + getHoldingValue(h, assets),
    0
  );

  const unrealizedGain = totalMarketValue - totalCostBasis;

  // Realized gain: sum of SELL proceeds minus the cost basis of what was sold
  const realizedGain = useMemo(() => {
    let gain = 0;
    // For each sell transaction we need cost basis at time of sale.
    // We approximate by tracking a simple running cost basis per ticker.
    const basisTracker: Record<string, { qty: number; totalCost: number }> = {};
    for (const tx of portfolio.transactions) {
      if (tx.action === "BUY") {
        const existing = basisTracker[tx.ticker] ?? { qty: 0, totalCost: 0 };
        basisTracker[tx.ticker] = {
          qty: existing.qty + tx.quantity,
          totalCost: existing.totalCost + tx.totalValue,
        };
      } else {
        const existing = basisTracker[tx.ticker];
        if (existing && existing.qty > 0) {
          const avgCost = existing.totalCost / existing.qty;
          const soldCost = avgCost * tx.quantity;
          gain += tx.totalValue - soldCost;
          basisTracker[tx.ticker] = {
            qty: Math.max(0, existing.qty - tx.quantity),
            totalCost: Math.max(0, existing.totalCost - soldCost),
          };
        }
      }
    }
    return gain;
  }, [portfolio.transactions]);

  const totalReturn = (currentNetWorth - STARTING_CAPITAL) / STARTING_CAPITAL;
  const isPositive = currentNetWorth >= STARTING_CAPITAL;

  // ── Net worth history for the line chart ──────────────────
  const history = portfolio.netWorthHistory;

  // ── SVG chart dimensions ───────────────────────────────────
  const W = 800;
  const H = 140;
  const PAD = { top: 12, right: 8, bottom: 20, left: 8 };
  const cw = W - PAD.left - PAD.right;
  const ch = H - PAD.top - PAD.bottom;

  const chartData = useMemo(() => {
    if (history.length < 2) return null;

    const values = history.map((p) => p.netWorth);
    // Extend range so baseline ($100k) is always visible
    const allValues = [...values, STARTING_CAPITAL];
    const minV = Math.min(...allValues) * 0.995;
    const maxV = Math.max(...allValues) * 1.005;
    const rangeV = maxV - minV || 1;

    const toX = (i: number) =>
      PAD.left + (i / Math.max(history.length - 1, 1)) * cw;
    const toY = (v: number) =>
      PAD.top + ch - ((v - minV) / rangeV) * ch;

    // Worth line
    const linePath = history
      .map((p, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(p.netWorth)}`)
      .join(" ");

    // Fill to baseline
    const baselineY = toY(STARTING_CAPITAL);
    const fillPath =
      linePath +
      ` L ${toX(history.length - 1)} ${baselineY} L ${toX(0)} ${baselineY} Z`;

    // Baseline (starting capital)
    const baselinePath = `M ${PAD.left} ${baselineY} L ${W - PAD.right} ${baselineY}`;

    // Tick labels on Y axis (min, baseline, max)
    const ticks = [
      { y: toY(minV), label: formatCurrency(minV) },
      { y: baselineY, label: "$100K" },
      { y: toY(maxV), label: formatCurrency(maxV) },
    ];

    return { linePath, fillPath, baselinePath, baselineY, ticks };
  }, [history]);

  // ── Composition bar ────────────────────────────────────────
  // Shows: Cash | Invested (cost basis) with gain/loss overlay
  const barData = useMemo(() => {
    const cash = portfolio.cash;
    const invested = totalCostBasis;
    const gain = Math.max(0, unrealizedGain);
    const loss = Math.max(0, -unrealizedGain);
    const total = cash + invested + gain;
    if (total === 0) return null;

    const cashPct = cash / total;
    const investedPct = invested / total;
    const gainPct = gain / total;
    const lossPct = loss / total;

    return { cashPct, investedPct, gainPct, lossPct, gain, loss };
  }, [portfolio.cash, totalCostBasis, unrealizedGain]);

  const hasHoldings = totalCostBasis > 0;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs text-gray-400 uppercase tracking-wider">
          Portfolio Performance
        </h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block w-3 h-0.5 bg-gray-500 border-dashed" />
          Starting Capital
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard
          label="Net Worth"
          value={formatCurrency(currentNetWorth)}
          sub={
            <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
              {isPositive ? "▲" : "▼"} {formatPercent(Math.abs(totalReturn), false)} all-time
            </span>
          }
          highlight={isPositive ? "emerald" : "rose"}
        />
        <StatCard
          label="Total Invested"
          value={formatCurrency(totalCostBasis)}
          sub={
            <span className="text-gray-500">
              {hasHoldings
                ? `${((totalCostBasis / currentNetWorth) * 100).toFixed(1)}% of portfolio`
                : "No open positions"}
            </span>
          }
          highlight="blue"
        />
        <StatCard
          label="Unrealized P&L"
          value={
            (unrealizedGain >= 0 ? "+" : "") + formatCurrency(unrealizedGain)
          }
          sub={
            hasHoldings ? (
              <span
                className={
                  unrealizedGain >= 0 ? "text-emerald-400" : "text-rose-400"
                }
              >
                {formatPercent(
                  totalCostBasis > 0 ? unrealizedGain / totalCostBasis : 0
                )}{" "}
                on open positions
              </span>
            ) : (
              <span className="text-gray-500">No open positions</span>
            )
          }
          highlight={unrealizedGain >= 0 ? "emerald" : "rose"}
        />
        <StatCard
          label="Realized P&L"
          value={
            (realizedGain >= 0 ? "+" : "") + formatCurrency(realizedGain)
          }
          sub={
            <span
              className={
                realizedGain > 0
                  ? "text-emerald-400"
                  : realizedGain < 0
                  ? "text-rose-400"
                  : "text-gray-500"
              }
            >
              {realizedGain === 0
                ? "No closed trades"
                : realizedGain > 0
                ? "Locked in gains"
                : "Locked in losses"}
            </span>
          }
          highlight={
            realizedGain > 0 ? "emerald" : realizedGain < 0 ? "rose" : "gray"
          }
        />
      </div>

      {/* ── Line chart ── */}
      {chartData ? (
        <div className="mb-4">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full"
            style={{ height: 140 }}
          >
            {/* Grid */}
            {chartData.ticks.map((t, i) => (
              <g key={i}>
                <line
                  x1={PAD.left}
                  y1={t.y}
                  x2={W - PAD.right}
                  y2={t.y}
                  stroke="#0e2038"
                  strokeWidth="1"
                />
                <text
                  x={W - PAD.right + 2}
                  y={t.y + 4}
                  fill="#3f6480"
                  fontSize="8"
                  textAnchor="start"
                >
                  {t.label}
                </text>
              </g>
            ))}

            {/* Fill area (gain = green, loss = red) */}
            <path
              d={chartData.fillPath}
              fill={isPositive ? "rgba(52,211,153,0.1)" : "rgba(244,63,94,0.1)"}
            />

            {/* Starting capital baseline (dashed) */}
            <path
              d={chartData.baselinePath}
              fill="none"
              stroke="#3f6480"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Net worth line */}
            <path
              d={chartData.linePath}
              fill="none"
              stroke={isPositive ? "#34d399" : "#f43f5e"}
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Current value dot */}
            {history.length > 0 && (() => {
              const last = history[history.length - 1];
              const x =
                PAD.left +
                ((history.length - 1) / Math.max(history.length - 1, 1)) * cw;
              const allValues = history.map((p) => p.netWorth).concat(STARTING_CAPITAL);
              const minV = Math.min(...allValues) * 0.995;
              const maxV = Math.max(...allValues) * 1.005;
              const rangeV = maxV - minV || 1;
              const y = PAD.top + ch - ((last.netWorth - minV) / rangeV) * ch;
              return (
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isPositive ? "#34d399" : "#f43f5e"}
                />
              );
            })()}
          </svg>
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center text-gray-600 text-xs mb-4">
          Advance a day to see performance history
        </div>
      )}

      {/* ── Composition bar ── */}
      {barData && (
        <div>
          <div className="text-xs text-gray-500 mb-1.5">Portfolio Composition</div>
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-800">
            {/* Cash */}
            <div
              className="h-full bg-gray-600 transition-all duration-500"
              style={{ width: `${barData.cashPct * 100}%` }}
              title={`Cash: ${formatCurrency(portfolio.cash)}`}
            />
            {/* Invested cost basis */}
            <div
              className="h-full bg-blue-700 transition-all duration-500"
              style={{ width: `${barData.investedPct * 100}%` }}
              title={`Invested: ${formatCurrency(totalCostBasis)}`}
            />
            {/* Unrealized gain */}
            {barData.gain > 0 && (
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${barData.gainPct * 100}%` }}
                title={`Gain: +${formatCurrency(barData.gain)}`}
              />
            )}
            {/* Unrealized loss (shown as negative portion) */}
            {barData.loss > 0 && (
              <div
                className="h-full bg-rose-700 transition-all duration-500"
                style={{ width: `${barData.lossPct * 100}%` }}
                title={`Loss: -${formatCurrency(barData.loss)}`}
              />
            )}
          </div>
          <div className="flex gap-4 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-gray-600" />
              Cash {((barData.cashPct) * 100).toFixed(0)}%
            </span>
            {totalCostBasis > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-blue-700" />
                Invested {((barData.investedPct) * 100).toFixed(0)}%
              </span>
            )}
            {barData.gain > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-emerald-600" />
                Unrealized Gain {((barData.gainPct) * 100).toFixed(0)}%
              </span>
            )}
            {barData.loss > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-sm bg-rose-700" />
                Unrealized Loss
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stat card sub-component ────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  highlight: "emerald" | "rose" | "blue" | "gray";
}) {
  const borderColor = {
    emerald: "border-l-emerald-600",
    rose: "border-l-rose-600",
    blue: "border-l-blue-600",
    gray: "border-l-gray-600",
  }[highlight];

  return (
    <div className={`bg-gray-800 rounded-lg p-3 border-l-2 ${borderColor}`}>
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className="text-sm font-mono font-bold text-white tabular-nums leading-tight">
        {value}
      </div>
      <div className="text-xs mt-0.5">{sub}</div>
    </div>
  );
}
