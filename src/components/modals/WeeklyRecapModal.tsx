"use client";

import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import { getWeekNumber, formatGameDate, getShortDayName } from "@/utils/dateUtils";

interface Props {
  onClose: () => void;
}

export function WeeklyRecapModal({ onClose }: Props) {
  const { state } = useGame();
  const { currentDay, startDate, portfolio, assets, indexes, eventHistory } = state;

  const recap = useMemo(() => {
    const weekNum = getWeekNumber(startDate, currentDay);
    const startOfWeek = Math.max(1, currentDay - 6);

    // Net worth at start of week
    const startEntry = portfolio.netWorthHistory
      .slice()
      .reverse()
      .find((e) => e.day <= startOfWeek);
    const startNetWorth = startEntry?.netWorth ?? 10_000;
    const endNetWorth = getNetWorth(portfolio, assets);
    const nwChange = endNetWorth - startNetWorth;
    const nwChangePct = startNetWorth > 0 ? nwChange / startNetWorth : 0;

    // Market return this week (SNP499)
    const snp499 = indexes["snp499"];
    const snpStartEntry = snp499?.history.slice().reverse().find((h) => h.day <= startOfWeek);
    const snpStart = snpStartEntry?.value ?? snp499?.startingValue ?? 1;
    const snpWeekPct = snp499 ? (snp499.currentValue - snpStart) / snpStart : 0;
    const alpha = nwChangePct - snpWeekPct;

    // Transactions this week
    const weekTxs = portfolio.transactions.filter(
      (t) => t.day >= startOfWeek && t.day <= currentDay
    );

    // Events this week
    const weekEvents = eventHistory.filter(
      (e) => e.day >= startOfWeek && e.day <= currentDay
    );

    // Weekly price movers — all assets, compared to start-of-week price
    const movers = Object.values(assets).map((asset) => {
      const startPriceEntry = asset.priceHistory
        .slice()
        .reverse()
        .find((p) => p.day <= startOfWeek);
      const weekStartPrice = startPriceEntry?.close ?? asset.currentPrice;
      const changePct = weekStartPrice > 0
        ? (asset.currentPrice - weekStartPrice) / weekStartPrice
        : 0;
      return { ticker: asset.ticker, name: asset.name, type: asset.type, changePct };
    });

    const stockMovers = movers.filter((m) => m.type === "stock").sort((a, b) => b.changePct - a.changePct);
    const cryptoMovers = movers.filter((m) => m.type === "crypto").sort((a, b) => b.changePct - a.changePct);

    const topStockGainer = stockMovers[0] ?? null;
    const topStockLoser = stockMovers[stockMovers.length - 1] ?? null;
    const topCryptoGainer = cryptoMovers[0] ?? null;
    const topCryptoLoser = cryptoMovers[cryptoMovers.length - 1] ?? null;

    return {
      weekNum,
      startOfWeek,
      startNetWorth,
      endNetWorth,
      nwChange,
      nwChangePct,
      snpWeekPct,
      alpha,
      weekTxs,
      weekEvents,
      topStockGainer,
      topStockLoser,
      topCryptoGainer,
      topCryptoLoser,
    };
  }, [currentDay, startDate, portfolio, assets, indexes, eventHistory]);

  const isUp = recap.nwChange >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-5 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">
                Week {recap.weekNum} Complete
              </div>
              <h2 className="text-lg font-mono font-bold text-white">
                Weekly Trading Recap
              </h2>
              <div className="text-xs text-gray-500 mt-0.5">
                {formatGameDate(startDate, recap.startOfWeek)} — {formatGameDate(startDate, currentDay)}
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xl ml-4">
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Net worth */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Portfolio</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-0.5">End of week</div>
                <div className="text-2xl font-mono font-bold text-white tabular-nums">
                  {formatCurrency(recap.endNetWorth)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-mono font-bold tabular-nums ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {isUp ? "+" : ""}{formatCurrency(recap.nwChange)}
                </div>
                <div className={`text-sm font-mono tabular-nums ${isUp ? "text-emerald-500" : "text-rose-500"}`}>
                  {formatPercent(recap.nwChangePct)}
                </div>
              </div>
            </div>
          </div>

          {/* vs Market */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">vs Market (SNP499)</div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xs text-gray-500 mb-1">Your Return</div>
                <div className={`text-sm font-mono font-bold tabular-nums ${recap.nwChangePct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatPercent(recap.nwChangePct)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">SNP499</div>
                <div className={`text-sm font-mono font-bold tabular-nums ${recap.snpWeekPct >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {formatPercent(recap.snpWeekPct)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Alpha</div>
                <div className={`text-sm font-mono font-bold tabular-nums ${recap.alpha >= 0 ? "text-yellow-400" : "text-rose-400"}`}>
                  {formatPercent(recap.alpha)}
                </div>
              </div>
            </div>
          </div>

          {/* Top movers */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Weekly Movers</div>
            <div className="space-y-2">
              {/* Stocks */}
              <div className="text-xs text-gray-600 mb-1">Stocks (Mon–Fri)</div>
              <div className="grid grid-cols-2 gap-2">
                {recap.topStockGainer && (
                  <div className="bg-emerald-950/60 border border-emerald-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-emerald-600 mb-0.5">Top Gainer</div>
                    <div className="font-mono font-bold text-white text-sm">{recap.topStockGainer.ticker}</div>
                    <div className="font-mono text-emerald-400 text-xs">{formatPercent(recap.topStockGainer.changePct)}</div>
                  </div>
                )}
                {recap.topStockLoser && recap.topStockLoser.ticker !== recap.topStockGainer?.ticker && (
                  <div className="bg-rose-950/60 border border-rose-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-rose-600 mb-0.5">Biggest Loser</div>
                    <div className="font-mono font-bold text-white text-sm">{recap.topStockLoser.ticker}</div>
                    <div className="font-mono text-rose-400 text-xs">{formatPercent(recap.topStockLoser.changePct)}</div>
                  </div>
                )}
              </div>
              {/* Crypto */}
              <div className="text-xs text-gray-600 mb-1 mt-2">Crypto (24/7)</div>
              <div className="grid grid-cols-2 gap-2">
                {recap.topCryptoGainer && (
                  <div className="bg-emerald-950/60 border border-emerald-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-emerald-600 mb-0.5">Top Gainer</div>
                    <div className="font-mono font-bold text-white text-sm">{recap.topCryptoGainer.ticker}</div>
                    <div className="font-mono text-emerald-400 text-xs">{formatPercent(recap.topCryptoGainer.changePct)}</div>
                  </div>
                )}
                {recap.topCryptoLoser && recap.topCryptoLoser.ticker !== recap.topCryptoGainer?.ticker && (
                  <div className="bg-rose-950/60 border border-rose-800/50 rounded-lg px-3 py-2">
                    <div className="text-xs text-rose-600 mb-0.5">Biggest Loser</div>
                    <div className="font-mono font-bold text-white text-sm">{recap.topCryptoLoser.ticker}</div>
                    <div className="font-mono text-rose-400 text-xs">{formatPercent(recap.topCryptoLoser.changePct)}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Trades this week */}
          {recap.weekTxs.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Trades This Week ({recap.weekTxs.length})
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {recap.weekTxs.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 w-8">{getShortDayName(startDate, tx.day)}</span>
                      <span className={tx.action === "BUY" ? "text-emerald-400" : "text-rose-400"}>
                        {tx.action}
                      </span>
                      <span className="text-white">{tx.ticker}</span>
                      <span className="text-gray-500">×{tx.quantity}</span>
                    </div>
                    <span className="text-gray-400 tabular-nums">
                      {formatCurrency(tx.totalValue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recap.weekTxs.length === 0 && (
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Trades This Week</div>
              <div className="text-sm text-gray-600">No trades placed this week.</div>
            </div>
          )}

          {/* Events this week */}
          {recap.weekEvents.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                Market Events ({recap.weekEvents.length})
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {recap.weekEvents.map((fe, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-base leading-none mt-0.5">{fe.event.icon}</span>
                    <div>
                      <span className="text-gray-300">{fe.event.headline}</span>
                      <span className="text-gray-600 ml-2">·</span>
                      <span className="text-gray-600 ml-2">{getShortDayName(startDate, fe.day)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekend note */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-3 text-xs text-gray-500 flex items-start gap-2">
            <span>📅</span>
            <span>
              Stock markets are closed Saturday &amp; Sunday — equity prices held flat over the weekend.
              Crypto markets trade 24/7.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 px-5 py-4 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 rounded-lg font-mono font-bold text-sm transition-colors border border-emerald-700 flex items-center justify-center gap-2"
          >
            <span>▶</span> Start Week {recap.weekNum + 1}
          </button>
        </div>
      </div>
    </div>
  );
}
