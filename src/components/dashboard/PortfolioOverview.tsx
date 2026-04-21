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
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Hero P&L strip */}
      <div
        className={`px-4 pt-4 pb-3 border-b border-gray-800 ${
          isUp
            ? "bg-emerald-950/40"
            : isDown
            ? "bg-rose-950/40"
            : "bg-gray-800/20"
        }`}
      >
        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-mono">
          Portfolio Value
        </div>
        <div className="text-3xl sm:text-2xl font-mono font-bold text-white tabular-nums leading-none">
          {formatCurrency(netWorth)}
        </div>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span
            className={`text-sm font-mono tabular-nums ${
              isUp ? "text-emerald-400" : isDown ? "text-rose-400" : "text-gray-400"
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

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 gap-0 border-b border-gray-800">
        <div className="px-4 py-2.5 border-r border-gray-800">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-0.5">Cash</div>
          <div className="text-base font-mono font-bold text-emerald-400 tabular-nums">
            {formatCurrency(portfolio.cash)}
          </div>
        </div>
        <div className="px-4 py-2.5">
          <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-0.5">Invested</div>
          <div className="text-base font-mono font-bold text-white tabular-nums">
            {formatCurrency(netWorth - portfolio.cash)}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="p-4">
        <h2 className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-3">Holdings</h2>

        {holdings.length === 0 ? (
          <div className="text-center text-gray-600 py-8 text-sm">
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
                    className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3"
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
                    <div className="text-xs text-gray-500 font-mono mb-2">
                      {holding.quantity.toLocaleString()}{" "}
                      {holding.assetType === "crypto" ? "coins" : "shares"} @ $
                      {formatPrice(holding.averageCostBasis)}
                    </div>

                    {/* Bottom: value + P&L + trade button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">Value</div>
                          <div className="text-sm font-mono text-white tabular-nums">
                            {formatCurrency(value)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500 uppercase tracking-wide">P&amp;L</div>
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
                  <tr className="text-gray-500 border-b border-gray-800">
                    <th className="text-left pb-2">Asset</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Avg Cost</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Value</th>
                    <th className="text-right pb-2">P&amp;L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
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
                      <tr key={holding.ticker} className="hover:bg-gray-800/50 transition-colors">
                        <td className="py-2">
                          <Link href={href} className="group flex items-center gap-2">
                            <span className="font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                              {holding.ticker}
                            </span>
                            <TypeBadge type={holding.assetType} />
                          </Link>
                        </td>
                        <td className="text-right py-2 text-gray-300 tabular-nums">
                          {holding.quantity.toLocaleString()}
                        </td>
                        <td className="text-right py-2 text-gray-400 tabular-nums">
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
