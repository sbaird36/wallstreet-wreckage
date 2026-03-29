"use client";

import { useGame } from "@/context/GameContext";
import { getPriceChangePercent } from "@/utils/calculations";
import { formatPrice, formatPercent } from "@/utils/formatting";

export function MarketTicker() {
  const { state } = useGame();
  const assets = Object.values(state.assets);

  const tickerItems = assets.map((asset) => {
    const change = getPriceChangePercent(asset);
    const isUp = change >= 0;
    return {
      ticker: asset.ticker,
      price: asset.currentPrice,
      change,
      isUp,
    };
  });

  return (
    <div className="bg-gray-900 border-t border-gray-800 overflow-hidden py-3 text-sm font-mono">
      <div className="ticker-scroll inline-block whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5">
            <span className="text-gray-200 font-bold">{item.ticker}</span>
            <span className="text-gray-400">${formatPrice(item.price)}</span>
            <span className={item.isUp ? "text-emerald-400" : "text-rose-400"}>
              {item.isUp ? "▲" : "▼"} {formatPercent(item.change)}
            </span>
            <span className="text-gray-700 mx-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
