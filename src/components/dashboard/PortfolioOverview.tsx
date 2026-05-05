"use client";

import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { ChangeIndicator } from "@/components/ui/ChangeIndicator";
import { TypeBadge } from "@/components/ui/Badge";
import {
  getNetWorth,
  getHoldingValue,
  getHoldingPnL,
  getHoldingPnLPercent,
  getPriceChangePercent,
} from "@/utils/calculations";
import { formatCurrency, formatPrice } from "@/utils/formatting";

export function PortfolioOverview() {
  const { state, dispatch } = useGame();
  const { portfolio, assets } = state;
  const netWorth = getNetWorth(portfolio, assets);
  const holdings = Object.values(portfolio.holdings);

  // XP progress
  const currentXp = state.xp ?? 0;
  function xpThresholdForLevel(n: number) { return Math.floor(100 * Math.pow(1.5, n)); }
  function skillPointsEarnedFromXP(totalXp: number) {
    let points = 0; let spent = 0;
    while (spent + xpThresholdForLevel(points) <= totalXp) { spent += xpThresholdForLevel(points); points++; }
    return points;
  }
  function xpSpentOnLevels(totalXp: number) {
    let points = 0; let spent = 0;
    while (spent + xpThresholdForLevel(points) <= totalXp) { spent += xpThresholdForLevel(points); points++; }
    return spent;
  }
  const spentXp = xpSpentOnLevels(currentXp);
  const currentLevelPoints = skillPointsEarnedFromXP(currentXp);
  const nextLevelThreshold = xpThresholdForLevel(currentLevelPoints);
  const xpIntoLevel = currentXp - spentXp;
  const xpToNext = nextLevelThreshold - xpIntoLevel;
  const xpProgressPct = nextLevelThreshold > 0 ? (xpIntoLevel / nextLevelThreshold) * 100 : 0;

  const startNetWorth = portfolio.netWorthHistory[0]?.netWorth ?? netWorth;
  const totalReturn = (netWorth - startNetWorth) / startNetWorth;
  const pnlDollars = netWorth - startNetWorth;
  const isUp = pnlDollars > 0;
  const isDown = pnlDollars < 0;

  const dailyPnl = holdings.reduce((sum, holding) => {
    const asset = assets[holding.ticker];
    if (!asset) return sum;
    return sum + holding.quantity * (asset.currentPrice - asset.previousPrice);
  }, 0);

  function handleTrade(ticker: string, action: "BUY" | "SELL") {
    const asset = assets[ticker];
    if (!asset) return;
    dispatch({
      type: "SET_PENDING_TRADE",
      payload: { ticker, action, quantity: 1, pricePerUnit: asset.currentPrice },
    });
  }

  return (
    <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl overflow-hidden shadow-lg shadow-black/40">
      {/* Hero P&L strip */}
      <div
        className={`px-4 pt-4 pb-3 border-b border-white/[0.07] ${
          isUp
            ? "bg-emerald-950/40"
            : isDown
            ? "bg-rose-950/40"
            : "bg-[#151c2f]/20"
        }`}
      >
        <div className="text-xs text-slate-400 font-medium mb-1">
          portfolio value
        </div>
        <div className="text-4xl sm:text-3xl font-bold text-white tabular-nums leading-none">
          {formatCurrency(netWorth)}
        </div>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span
            className={`text-base font-mono tabular-nums ${
              isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-slate-400"
            }`}
          >
            {pnlDollars >= 0 ? "+" : ""}
            {formatCurrency(pnlDollars)} ({(totalReturn * 100).toFixed(2)}%) all time
          </span>
          {dailyPnl !== 0 && (
            <span
              className={`text-xs font-mono tabular-nums ${
                dailyPnl >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {dailyPnl >= 0 ? "+" : ""}
              {formatCurrency(Math.abs(dailyPnl))} today
            </span>
          )}
        </div>
      </div>

      {/* XP progress bar + streak */}
      <div className="px-4 py-2 border-b border-white/[0.07] flex items-center gap-3">
        {/* XP bar */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 font-medium">XP</span>
            <span className="text-[10px] font-mono text-amber-400">{currentXp} total</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, xpProgressPct)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{xpToNext} XP to next skill point</div>
        </div>
        {/* Streak */}
        {(state.tradeStreak ?? 0) > 1 && (
          <div className="flex-shrink-0 text-center">
            <div className="text-xs font-mono font-bold text-orange-400">🔥 {state.tradeStreak}</div>
            <div className="text-[9px] text-slate-500">streak</div>
          </div>
        )}
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 gap-0 border-b border-white/[0.07]">
        <div className="px-4 py-2.5 border-r border-white/[0.07]">
          <div className="text-xs text-slate-400 font-medium mb-1">cash</div>
          <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
            {formatCurrency(portfolio.cash)}
          </div>
        </div>
        <div className="px-4 py-2.5">
          <div className="text-xs text-slate-400 font-medium mb-1">invested</div>
          <div className="text-lg font-mono font-bold text-white tabular-nums">
            {formatCurrency(netWorth - portfolio.cash)}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Holdings</h2>

        {holdings.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">
            No holdings yet. Buy something from the market below.
          </div>
        ) : (
          <>
            {/* Mobile: card layout */}
            <div className="sm:hidden space-y-2">
              {holdings.map((holding) => {
                const asset = assets[holding.ticker];
                if (!asset) return null;
                const value = getHoldingValue(holding, assets);
                const pnl = getHoldingPnL(holding, assets);
                const pnlPct = getHoldingPnLPercent(holding, assets);
                const href =
                  holding.assetType === "stock"
                    ? `/stock/${holding.ticker}`
                    : `/crypto/${holding.ticker}`;

                return (
                  <div
                    key={holding.ticker}
                    className="bg-[#151c2f]/50 border border-white/[0.07] rounded-xl p-3"
                  >
                    {/* Top row: ticker + price */}
                    <div className="flex items-start justify-between mb-2">
                      <Link href={href} className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-white text-sm">
                          {holding.ticker}
                        </span>
                        <TypeBadge type={holding.assetType} />
                      </Link>
                      <div className="text-right">
                        <div className="font-mono text-white text-sm tabular-nums">
                          ${formatPrice(asset.currentPrice)}
                        </div>
                        <ChangeIndicator value={getPriceChangePercent(asset)} size="sm" />
                      </div>
                    </div>

                    {/* Middle: position info */}
                    <div className="text-xs text-slate-400 font-mono mb-2">
                      {holding.quantity.toLocaleString()}{" "}
                      {holding.assetType === "crypto" ? "coins" : "shares"} @ $
                      {formatPrice(holding.averageCostBasis)}
                    </div>

                    {/* Bottom: value + P&L + trade button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-xs text-slate-400 font-medium">value</div>
                          <div className="text-sm font-mono text-white tabular-nums">
                            {formatCurrency(value)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-medium">P&amp;L</div>
                          <div
                            className={`text-sm font-mono tabular-nums ${
                              pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}
                            {formatCurrency(pnl)}
                            <span className="text-[10px] ml-1">
                              ({(pnlPct * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleTrade(holding.ticker, "SELL")}
                        className="text-xs px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-300 rounded border border-rose-700/60 transition-colors font-mono"
                      >
                        Trade
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop: table layout */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-white/[0.07]">
                    <th className="text-left pb-2">Asset</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Avg Cost</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Value</th>
                    <th className="text-right pb-2">P&amp;L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {holdings.map((holding) => {
                    const asset = assets[holding.ticker];
                    if (!asset) return null;
                    const value = getHoldingValue(holding, assets);
                    const pnl = getHoldingPnL(holding, assets);
                    const pnlPct = getHoldingPnLPercent(holding, assets);
                    const href =
                      holding.assetType === "stock"
                        ? `/stock/${holding.ticker}`
                        : `/crypto/${holding.ticker}`;

                    return (
                      <tr key={holding.ticker} className="hover:bg-[#151c2f]/50 transition-colors">
                        <td className="py-2">
                          <Link href={href} className="group flex items-center gap-2">
                            <span className="font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                              {holding.ticker}
                            </span>
                            <TypeBadge type={holding.assetType} />
                          </Link>
                        </td>
                        <td className="text-right py-2 text-slate-300 tabular-nums">
                          {holding.quantity.toLocaleString()}
                        </td>
                        <td className="text-right py-2 text-slate-400 tabular-nums">
                          ${formatPrice(holding.averageCostBasis)}
                        </td>
                        <td className="text-right py-2 text-white tabular-nums">
                          ${formatPrice(asset.currentPrice)}
                        </td>
                        <td className="text-right py-2 text-white tabular-nums">
                          {formatCurrency(value)}
                        </td>
                        <td className="text-right py-2">
                          <div className="flex flex-col items-end">
                            <span
                              className={`tabular-nums ${pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                            >
                              {pnl >= 0 ? "+" : ""}
                              {formatCurrency(Math.abs(pnl))}
                            </span>
                            <ChangeIndicator value={pnlPct} size="sm" />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
