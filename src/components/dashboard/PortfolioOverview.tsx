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
} from "@/utils/calculations";
import { formatCurrency, formatPrice } from "@/utils/formatting";

export function PortfolioOverview() {
  const { state } = useGame();
  const { portfolio, assets } = state;
  const netWorth = getNetWorth(portfolio, assets);
  const holdings = Object.values(portfolio.holdings);

  const startNetWorth = portfolio.netWorthHistory[0]?.netWorth ?? netWorth;
  const totalReturn = (netWorth - startNetWorth) / startNetWorth;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Portfolio</h2>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Net Worth</div>
          <div className="text-lg font-mono font-bold text-white tabular-nums">
            {formatCurrency(netWorth)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Cash</div>
          <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
            {formatCurrency(portfolio.cash)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Total Return</div>
          <div className="text-lg">
            <ChangeIndicator value={totalReturn} size="lg" />
          </div>
        </div>
      </div>

      {/* Holdings table */}
      {holdings.length === 0 ? (
        <div className="text-center text-gray-600 py-8 text-sm">
          No holdings yet. Buy something from the market below.
        </div>
      ) : (
        <div className="overflow-x-auto">
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
      )}
    </div>
  );
}
