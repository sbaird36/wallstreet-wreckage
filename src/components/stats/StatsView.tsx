"use client";

import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import { ANALYST_SUB_DAYS } from "@/utils/analystEngine";

const STARTING_CAPITAL = 10_000;

// ── helpers ──────────────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  valueClass = "text-white",
  sub,
}: {
  label: string;
  value: string;
  valueClass?: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
      <span className="text-xs text-gray-500 font-mono">{label}</span>
      <div className="text-right">
        <span className={`text-xs font-mono font-bold ${valueClass}`}>{value}</span>
        {sub && <div className="text-xs text-gray-600 font-mono">{sub}</div>}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
        <span className="text-base">{icon}</span>
        <h2 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ── Trading section ───────────────────────────────────────────────────────────

function TradingStats() {
  const { state } = useGame();
  const { transactions, holdings } = state.portfolio;

  const stats = useMemo(() => {
    const buys = transactions.filter((t) => t.action === "BUY");
    const sells = transactions.filter((t) => t.action === "SELL");
    const uniqueTickers = new Set(transactions.map((t) => t.ticker));
    const totalBuyValue = buys.reduce((s, t) => s + t.totalValue, 0);
    const totalSellValue = sells.reduce((s, t) => s + t.totalValue, 0);
    return { buys: buys.length, sells: sells.length, uniqueTickers: uniqueTickers.size, totalBuyValue, totalSellValue };
  }, [transactions]);

  const holdingPnl = useMemo(() => {
    return Object.values(holdings).map((h) => {
      const asset = state.assets[h.ticker];
      if (!asset) return null;
      const currentValue = asset.currentPrice * h.quantity;
      const pnl = currentValue - h.totalCostBasis;
      const pct = h.totalCostBasis > 0 ? pnl / h.totalCostBasis : 0;
      return { ticker: h.ticker, name: asset.name, pnl, pct, currentValue, avgCost: h.averageCostBasis, currentPrice: asset.currentPrice, qty: h.quantity };
    }).filter(Boolean) as { ticker: string; name: string; pnl: number; pct: number; currentValue: number; avgCost: number; currentPrice: number; qty: number }[];
  }, [holdings, state.assets]);

  const winners = holdingPnl.filter((h) => h.pnl > 0).length;
  const losers = holdingPnl.filter((h) => h.pnl < 0).length;
  const totalUnrealizedPnl = holdingPnl.reduce((s, h) => s + h.pnl, 0);
  const best = holdingPnl.sort((a, b) => b.pct - a.pct)[0];
  const worst = holdingPnl.sort((a, b) => a.pct - b.pct)[0];

  return (
    <SectionCard title="Trading Activity" icon="📈">
      <div className="space-y-0">
        <StatRow label="Total Trades" value={`${stats.buys + stats.sells}`} sub={`${stats.buys} buys · ${stats.sells} sells`} />
        <StatRow label="Unique Tickers Traded" value={`${stats.uniqueTickers}`} />
        <StatRow label="Total Buy Volume" value={formatCurrency(stats.totalBuyValue)} />
        <StatRow label="Total Sell Volume" value={formatCurrency(stats.totalSellValue)} />
        <StatRow
          label="Realised Net (sells − buys)"
          value={formatCurrency(stats.totalSellValue - stats.totalBuyValue)}
          valueClass={stats.totalSellValue - stats.totalBuyValue >= 0 ? "text-emerald-400" : "text-red-400"}
        />
      </div>

      {holdingPnl.length > 0 && (
        <>
          <div className="mt-4 mb-2 text-xs text-gray-600 font-mono uppercase tracking-wider">Open Positions</div>
          <div className="space-y-0">
            <StatRow
              label="Positions in profit"
              value={`${winners} / ${holdingPnl.length}`}
              valueClass="text-emerald-400"
            />
            <StatRow
              label="Positions at a loss"
              value={`${losers} / ${holdingPnl.length}`}
              valueClass={losers > 0 ? "text-red-400" : "text-gray-500"}
            />
            <StatRow
              label="Total unrealised P&L"
              value={formatCurrency(totalUnrealizedPnl)}
              valueClass={totalUnrealizedPnl >= 0 ? "text-emerald-400" : "text-red-400"}
            />
            {best && (
              <StatRow
                label="Best open position"
                value={`${best.ticker} ${formatPercent(best.pct)}`}
                valueClass="text-emerald-400"
              />
            )}
            {worst && worst.ticker !== best?.ticker && (
              <StatRow
                label="Worst open position"
                value={`${worst.ticker} ${formatPercent(worst.pct)}`}
                valueClass="text-red-400"
              />
            )}
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ── Open positions table ──────────────────────────────────────────────────────

function OpenPositions() {
  const { state } = useGame();
  const { holdings } = state.portfolio;

  const rows = useMemo(() => {
    return Object.values(holdings).map((h) => {
      const asset = state.assets[h.ticker];
      if (!asset) return null;
      const currentValue = asset.currentPrice * h.quantity;
      const pnl = currentValue - h.totalCostBasis;
      const pct = h.totalCostBasis > 0 ? pnl / h.totalCostBasis : 0;
      return { ticker: h.ticker, name: asset.name, qty: h.quantity, avgCost: h.averageCostBasis, currentPrice: asset.currentPrice, currentValue, pnl, pct };
    })
      .filter(Boolean)
      .sort((a, b) => b!.pct - a!.pct) as { ticker: string; name: string; qty: number; avgCost: number; currentPrice: number; currentValue: number; pnl: number; pct: number }[];
  }, [holdings, state.assets]);

  if (rows.length === 0) return null;

  return (
    <SectionCard title="Open Positions" icon="💼">
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-gray-600 uppercase tracking-wider">
              <th className="text-left pb-2 pr-3">Ticker</th>
              <th className="text-right pb-2 pr-3">Qty</th>
              <th className="text-right pb-2 pr-3">Avg Cost</th>
              <th className="text-right pb-2 pr-3">Price</th>
              <th className="text-right pb-2 pr-3">Value</th>
              <th className="text-right pb-2">P&L</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((r) => (
              <tr key={r.ticker}>
                <td className="py-2 pr-3">
                  <div className="text-white font-bold">{r.ticker}</div>
                  <div className="text-gray-600 truncate max-w-[100px]">{r.name}</div>
                </td>
                <td className="py-2 pr-3 text-right text-gray-300">{r.qty.toLocaleString()}</td>
                <td className="py-2 pr-3 text-right text-gray-400">${r.avgCost.toFixed(2)}</td>
                <td className="py-2 pr-3 text-right text-gray-300">${r.currentPrice.toFixed(2)}</td>
                <td className="py-2 pr-3 text-right text-gray-300">{formatCurrency(r.currentValue)}</td>
                <td className="py-2 text-right">
                  <div className={r.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {r.pnl >= 0 ? "+" : ""}{formatCurrency(r.pnl)}
                  </div>
                  <div className={`text-xs ${r.pct >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {r.pct >= 0 ? "+" : ""}{(r.pct * 100).toFixed(2)}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

// ── Blog & reputation section ─────────────────────────────────────────────────

function BlogStats() {
  const { state } = useGame();
  const total = state.playerPostCount ?? 0;
  const verified = state.playerVerifiedPostCount ?? 0;
  const wrong = state.playerWrongPostCount ?? 0;
  const unresolved = total - verified - wrong;
  const accuracy = verified + wrong > 0 ? (verified / (verified + wrong)) * 100 : null;
  const followers = state.playerFollowerCount ?? 0;

  return (
    <SectionCard title="Blog & Reputation" icon="✍️">
      <div className="space-y-0">
        <StatRow label="Total Posts" value={`${total}`} />
        <StatRow
          label="Verified predictions ✓"
          value={`${verified}`}
          valueClass="text-emerald-400"
          sub={total > 0 ? `${((verified / Math.max(total, 1)) * 100).toFixed(0)}% of posts` : undefined}
        />
        <StatRow
          label="Wrong calls ✗"
          value={`${wrong}`}
          valueClass={wrong > 0 ? "text-red-400" : "text-gray-500"}
          sub={total > 0 ? `${((wrong / Math.max(total, 1)) * 100).toFixed(0)}% of posts` : undefined}
        />
        <StatRow
          label="Pending / untickered"
          value={`${unresolved}`}
          valueClass="text-gray-500"
        />
        {accuracy !== null && (
          <StatRow
            label="Prediction accuracy"
            value={`${accuracy.toFixed(1)}%`}
            valueClass={accuracy >= 60 ? "text-emerald-400" : accuracy >= 40 ? "text-yellow-400" : "text-red-400"}
          />
        )}
      </div>

      {/* Accuracy bar */}
      {verified + wrong > 0 && (
        <div className="mt-3">
          <div className="flex h-2 rounded-full overflow-hidden gap-px">
            <div
              className="bg-emerald-600 rounded-l-full transition-all"
              style={{ width: `${(verified / (verified + wrong)) * 100}%` }}
            />
            <div
              className="bg-red-700 rounded-r-full transition-all"
              style={{ width: `${(wrong / (verified + wrong)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
            <span>✓ {verified} correct</span>
            <span>{wrong} wrong ✗</span>
          </div>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">Followers</span>
          <span className={`text-sm font-mono font-bold ${followers >= 50 ? "text-blue-400" : "text-gray-400"}`}>
            {followers.toLocaleString()}
          </span>
        </div>
        {followers >= 50 && (
          <div className="text-xs text-emerald-500 font-mono mt-1 text-right">
            📈 Posts are moving prices
          </div>
        )}
        {followers > 0 && followers < 50 && (
          <div className="text-xs text-gray-600 font-mono mt-1 text-right">
            {50 - followers} more until posts move prices
          </div>
        )}
        {followers === 0 && (
          <div className="text-xs text-gray-700 font-mono mt-1 text-right">
            Followers unlock after sustained alpha vs SNP499
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ── Analyst section ───────────────────────────────────────────────────────────

function AnalystStats() {
  const { state } = useGame();
  const { analystUnlocks, analystSubscription, assets } = state;

  const subActive = analystSubscription
    ? state.currentDay - analystSubscription.purchasedDay < ANALYST_SUB_DAYS
    : false;
  const subDaysLeft = analystSubscription
    ? Math.max(0, ANALYST_SUB_DAYS - (state.currentDay - analystSubscription.purchasedDay))
    : 0;

  const unlockedRows = useMemo(() => {
    return analystUnlocks.map((ticker) => {
      const asset = assets[ticker];
      if (!asset) return null;
      const startPrice = asset.priceHistory[0]?.close ?? asset.currentPrice;
      const pct = startPrice > 0 ? (asset.currentPrice - startPrice) / startPrice : 0;
      return { ticker, name: asset.name, currentPrice: asset.currentPrice, pct };
    }).filter(Boolean) as { ticker: string; name: string; currentPrice: number; pct: number }[];
  }, [analystUnlocks, assets]);

  const hasAny = analystUnlocks.length > 0 || analystSubscription;

  return (
    <SectionCard title="Analyst Reports" icon="🔬">
      {!hasAny && (
        <div className="text-xs text-gray-600 font-mono text-center py-4">
          No analyst reports purchased yet.<br />
          Individual unlocks cost $100 · Weekly all-access $10,000.
        </div>
      )}

      {/* Subscription status */}
      {analystSubscription && (
        <div className={`flex items-center justify-between rounded px-3 py-2 mb-3 border text-xs font-mono ${
          subActive
            ? "bg-emerald-900/30 border-emerald-800 text-emerald-400"
            : "bg-gray-800 border-gray-700 text-gray-500"
        }`}>
          <span>All-Access Subscription</span>
          <span>{subActive ? `${subDaysLeft}d remaining` : "Expired"}</span>
        </div>
      )}

      {/* Individual unlocks */}
      {unlockedRows.length > 0 && (
        <>
          <div className="text-xs text-gray-600 font-mono uppercase tracking-wider mb-2">
            Individual Unlocks ({unlockedRows.length})
          </div>
          <div className="space-y-1">
            {unlockedRows.map((r) => (
              <div key={r.ticker} className="flex items-center justify-between py-1.5 border-b border-gray-800 last:border-0">
                <div>
                  <span className="text-xs font-mono font-bold text-white">{r.ticker}</span>
                  <span className="text-xs text-gray-600 font-mono ml-2 truncate">{r.name}</span>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-xs font-mono text-gray-300">${r.currentPrice.toFixed(2)}</div>
                  <div className={`text-xs font-mono ${r.pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {r.pct >= 0 ? "▲" : "▼"} {Math.abs(r.pct * 100).toFixed(1)}% since start
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </SectionCard>
  );
}

// ── Net worth summary ─────────────────────────────────────────────────────────

function NetWorthSummary() {
  const { state } = useGame();
  const netWorth = getNetWorth(state.portfolio, state.assets);
  const totalReturn = (netWorth - STARTING_CAPITAL) / STARTING_CAPITAL;
  const snp499 = state.indexes["snp499"];
  const marketReturn = snp499 && snp499.startingValue > 0
    ? (snp499.currentValue - snp499.startingValue) / snp499.startingValue
    : null;
  const alpha = marketReturn !== null ? totalReturn - marketReturn : null;

  return (
    <SectionCard title="Performance Summary" icon="💰">
      <StatRow
        label="Net Worth"
        value={formatCurrency(netWorth)}
        valueClass="text-white"
      />
      <StatRow
        label="Starting Capital"
        value={formatCurrency(STARTING_CAPITAL)}
        valueClass="text-gray-400"
      />
      <StatRow
        label="Total Return"
        value={`${totalReturn >= 0 ? "+" : ""}${(totalReturn * 100).toFixed(2)}%`}
        valueClass={totalReturn >= 0 ? "text-emerald-400" : "text-red-400"}
        sub={`${formatCurrency(netWorth - STARTING_CAPITAL)} absolute`}
      />
      {marketReturn !== null && (
        <StatRow
          label="SNP499 Return"
          value={`${marketReturn >= 0 ? "+" : ""}${(marketReturn * 100).toFixed(2)}%`}
          valueClass="text-gray-400"
        />
      )}
      {alpha !== null && (
        <StatRow
          label="Alpha vs SNP499"
          value={`${alpha >= 0 ? "+" : ""}${(alpha * 100).toFixed(2)}%`}
          valueClass={alpha > 0 ? "text-emerald-400" : "text-red-400"}
          sub={alpha > 0 ? "Outperforming" : "Underperforming"}
        />
      )}
      <StatRow label="Days Played" value={`${state.currentDay}`} valueClass="text-gray-400" />
      <StatRow label="Cash on Hand" value={formatCurrency(state.portfolio.cash)} valueClass="text-emerald-400" />
    </SectionCard>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function StatsView() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-2">Player Statistics</div>

      {/* Top row: performance + trading */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NetWorthSummary />
        <TradingStats />
      </div>

      {/* Open positions full width */}
      <OpenPositions />

      {/* Blog + analyst */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BlogStats />
        <AnalystStats />
      </div>
    </div>
  );
}
