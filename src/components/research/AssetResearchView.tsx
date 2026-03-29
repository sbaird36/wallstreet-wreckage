"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { PriceChart } from "@/components/ui/PriceChart";
import { ChangeIndicator } from "@/components/ui/ChangeIndicator";
import { SectorBadge, TypeBadge } from "@/components/ui/Badge";
import {
  getPriceChangePercent,
  getMarketCap,
  getHoldingValue,
  getHoldingPnL,
  getHoldingPnLPercent,
} from "@/utils/calculations";
import {
  formatCurrency,
  formatPrice,
  formatLargeNumber,
  formatPercent,
} from "@/utils/formatting";
import {
  sma,
  rsi,
  atr,
  highLow52Week,
  avgVolume,
  beta,
} from "@/utils/technicals";
import {
  computeAnalystCoverage,
  hasAnalystAccess,
  ANALYST_FIRMS,
  ANALYST_SINGLE_COST,
  ANALYST_SUB_COST,
  ANALYST_SUB_DAYS,
  type AnalystRating,
} from "@/utils/analystEngine";

interface Props {
  ticker: string;
}

const RATING_STYLES: Record<AnalystRating, { bg: string; text: string; border: string }> = {
  "STRONG BUY":  { bg: "bg-emerald-900", text: "text-emerald-300", border: "border-emerald-600" },
  "BUY":         { bg: "bg-green-900",   text: "text-green-300",   border: "border-green-600"   },
  "HOLD":        { bg: "bg-yellow-900",  text: "text-yellow-300",  border: "border-yellow-600"  },
  "SELL":        { bg: "bg-orange-900",  text: "text-orange-300",  border: "border-orange-600"  },
  "STRONG SELL": { bg: "bg-rose-900",    text: "text-rose-300",    border: "border-rose-600"    },
};

function MetricRow({
  label,
  value,
  sub,
  valueClass = "text-white",
  explanation,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
  explanation?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-800 last:border-0">
      <div className="flex items-start justify-between py-2">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">{label}</span>
          {explanation && (
            <button
              onClick={() => setOpen((v) => !v)}
              className={`text-xs w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                open
                  ? "bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200"
              }`}
              title="What is this?"
            >
              ?
            </button>
          )}
        </div>
        <div className="text-right">
          <div className={`text-xs font-mono tabular-nums ${valueClass}`}>{value}</div>
          {sub && <div className="text-xs text-gray-600 mt-0.5">{sub}</div>}
        </div>
      </div>
      {open && explanation && (
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg px-3 py-2 mb-2 text-xs text-blue-200 leading-relaxed">
          {explanation}
        </div>
      )}
    </div>
  );
}

function RSIGauge({ value }: { value: number | null }) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (value === null) {
    return <span className="text-gray-500 text-xs">Insufficient data (need 14+ days)</span>;
  }

  const pct = value / 100;
  const color = value < 30 ? "#34d399" : value > 70 ? "#f43f5e" : "#facc15";
  const label = value < 30 ? "Oversold" : value > 70 ? "Overbought" : "Neutral";
  const interpretation =
    value < 30
      ? "RSI below 30 signals the stock may be oversold — it has fallen too fast and a bounce is possible. This can be a buying opportunity, but confirm with other indicators first."
      : value > 70
      ? "RSI above 70 signals the stock may be overbought — it has risen quickly and buyers may be exhausted. A pullback becomes more likely, but strong stocks can stay overbought for extended periods."
      : "RSI between 30–70 is neutral territory — neither overbought nor oversold. Momentum is balanced and the stock is in a 'normal' trading range.";

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full relative">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct * 100}%`,
                background: "linear-gradient(to right, #34d399, #facc15, #f43f5e)",
                clipPath: `inset(0 ${100 - pct * 100}% 0 0)`,
              }}
            />
            <div className="absolute top-0 left-[30%] w-px h-full bg-gray-600" />
            <div className="absolute top-0 left-[70%] w-px h-full bg-gray-600" />
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5">
          <span className="text-xs font-mono tabular-nums" style={{ color }}>
            {value.toFixed(1)}
          </span>
          <span className="text-xs text-gray-500">({label})</span>
          <button
            onClick={() => setShowExplanation((v) => !v)}
            className={`text-xs w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              showExplanation
                ? "bg-blue-700 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            ?
          </button>
        </div>
      </div>
      <div className="flex justify-between text-xs text-gray-700 mb-1">
        <span>Oversold &lt;30</span>
        <span>Neutral</span>
        <span>&gt;70 Overbought</span>
      </div>
      {showExplanation && (
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg px-3 py-2 mt-1 text-xs text-blue-200 leading-relaxed space-y-1.5">
          <p><strong className="text-blue-300">What is RSI?</strong> The Relative Strength Index (RSI) measures the speed and size of recent price changes on a 0–100 scale. It's calculated using 14 days of closing prices by default.</p>
          <p><strong className="text-blue-300">Right now:</strong> {interpretation}</p>
          <p className="text-blue-300/70">Tip: RSI works best when combined with other signals. A stock can stay overbought or oversold for days or weeks during strong trends.</p>
        </div>
      )}
    </div>
  );
}

export function AssetResearchView({ ticker }: Props) {
  const { state, dispatch } = useGame();
  const [quantity, setQuantity] = useState<string>("1");
  const [tradeAction, setTradeAction] = useState<"BUY" | "SELL">("BUY");

  const asset = state.assets[ticker];
  const holding = state.portfolio.holdings[ticker];

  // ── Technical calculations ─────────────────────────────────
  const technicals = useMemo(() => {
    if (!asset) return null;

    const closes = asset.priceHistory.map((p) => p.close);
    const rsiVal = rsi(closes);
    const sma20 = sma(closes, 20);
    const sma50 = sma(closes, 50);
    const sma200 = sma(closes, 200);
    const atrVal = atr(asset.priceHistory);
    const hl52 = highLow52Week(asset.priceHistory);
    const avgVol = avgVolume(asset.priceHistory);
    // Beta vs the broad SNP499 index
    const snpIndex = state.indexes["snp499"];
    let betaVal: number | null = null;
    if (snpIndex && snpIndex.history.length > 14) {
      const snpCloses = snpIndex.history.map((h) => h.value);
      betaVal = beta(closes, snpCloses);
    }

    // MA trend signal
    let maTrend: "BULLISH" | "BEARISH" | "NEUTRAL" = "NEUTRAL";
    if (sma20 !== null && sma50 !== null) {
      if (sma20 > sma50 && asset.currentPrice > sma20) maTrend = "BULLISH";
      else if (sma20 < sma50 && asset.currentPrice < sma20) maTrend = "BEARISH";
    }

    // EPS (fake): price / P/E  (stocks only)
    const eps =
      asset.type === "stock" && asset.peRatio > 0
        ? asset.currentPrice / asset.peRatio
        : null;

    return {
      rsiVal, sma20, sma50, sma200, atrVal, hl52, avgVol, betaVal,
      maTrend, eps,
    };
  }, [asset, state.indexes]);

  if (!asset || !technicals) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-4">🤷</div>
        <div>Asset &quot;{ticker}&quot; not found.</div>
        <Link href="/dashboard" className="text-emerald-400 hover:underline mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const changePct = getPriceChangePercent(asset);
  const marketCap = getMarketCap(asset);
  const relatedEvents = state.eventHistory.filter((e) =>
    e.affectedTickers.includes(ticker)
  );

  // ── Analyst coverage ────────────────────────────────────────
  const analystUnlocks = state.analystUnlocks ?? [];
  const analystSubscription = state.analystSubscription ?? null;
  const analystAccess = hasAnalystAccess(
    ticker,
    analystUnlocks,
    analystSubscription,
    state.currentDay
  );
  const coverage = analystAccess
    ? computeAnalystCoverage(asset, state.eventHistory, state.currentDay)
    : null;
  const subActive =
    analystSubscription !== null &&
    state.currentDay - analystSubscription.purchasedDay < ANALYST_SUB_DAYS;
  const subDaysLeft = subActive
    ? ANALYST_SUB_DAYS - (state.currentDay - analystSubscription!.purchasedDay)
    : 0;

  const qty = parseFloat(quantity) || 0;

  function handleTrade() {
    if (qty <= 0) return;
    dispatch({
      type: "SET_PENDING_TRADE",
      payload: { ticker, action: tradeAction, quantity: qty, pricePerUnit: asset.currentPrice },
    });
  }

  // 52-week position (0 = at 52w low, 1 = at 52w high)
  const hl = technicals.hl52;
  const hlRange = hl.high - hl.low || 1;
  const hlPosition = (asset.currentPrice - hl.low) / hlRange;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      {/* Back */}
      <Link
        href="/dashboard"
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 w-fit"
      >
        ← Dashboard
      </Link>

      {/* ── Header ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl font-mono font-bold text-white">{ticker}</h1>
              <TypeBadge type={asset.type} />
              {asset.type === "stock" && <SectorBadge sector={asset.sector} />}
            </div>
            <div className="text-gray-400 text-sm">{asset.name}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono font-bold text-white tabular-nums">
              ${formatPrice(asset.currentPrice)}
            </div>
            <ChangeIndicator value={changePct} size="lg" />
            <div className="text-xs text-gray-500 mt-1">
              Prev close: ${formatPrice(asset.previousPrice)}
            </div>
          </div>
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-800">
          <QuickStat label="Market Cap" value={`$${formatLargeNumber(marketCap)}`} />
          <QuickStat
            label="Analyst Rating"
            value={analystAccess ? (coverage?.consensusRating ?? "—") : "🔒 Locked"}
            valueClass={analystAccess ? (coverage ? RATING_STYLES[coverage.consensusRating].text : "text-gray-400") : "text-amber-500"}
          />
          <QuickStat
            label="Consensus Target"
            value={analystAccess && coverage ? `$${formatPrice(coverage.consensusTarget)}` : "🔒 Locked"}
            sub={
              analystAccess && coverage
                ? coverage.consensusTarget > asset.currentPrice
                  ? `▲ ${formatPercent((coverage.consensusTarget - asset.currentPrice) / asset.currentPrice)} upside`
                  : `▼ ${formatPercent((asset.currentPrice - coverage.consensusTarget) / asset.currentPrice)} downside`
                : undefined
            }
          />
          <QuickStat
            label="Avg Daily Volume"
            value={`${(technicals.avgVol / 1_000_000).toFixed(1)}M`}
          />
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: chart + trade */}
        <div className="lg:col-span-2 space-y-4">

          {/* Price chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              Price History
            </h2>
            <PriceChart
              history={asset.priceHistory}
              currentPrice={asset.currentPrice}
              ticker={ticker}
              showVolume
              showMA
            />
          </div>

          {/* Trade panel */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              Trade {ticker}
            </h2>
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setTradeAction("BUY")}
                className={`flex-1 py-2 text-sm font-mono font-bold rounded border transition-colors ${
                  tradeAction === "BUY"
                    ? "bg-emerald-900 border-emerald-600 text-emerald-300"
                    : "border-gray-700 text-gray-500 hover:text-gray-300"
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => setTradeAction("SELL")}
                disabled={!holding || holding.quantity === 0}
                className={`flex-1 py-2 text-sm font-mono font-bold rounded border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  tradeAction === "SELL"
                    ? "bg-rose-900 border-rose-600 text-rose-300"
                    : "border-gray-700 text-gray-500 hover:text-gray-300"
                }`}
              >
                SELL
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end mb-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-gray-400">Quantity</label>
                  <button
                    onClick={() => {
                      if (tradeAction === "BUY") {
                        setQuantity(String(Math.floor(state.portfolio.cash / asset.currentPrice)));
                      } else {
                        setQuantity(String(holding?.quantity ?? 0));
                      }
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300"
                  >
                    Max
                  </button>
                </div>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={asset.type === "crypto" ? "0.0001" : "1"}
                  step={asset.type === "crypto" ? "0.0001" : "1"}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Total</div>
                <div className="font-mono text-white bg-gray-800 rounded px-3 py-2 border border-gray-700 tabular-nums text-sm">
                  {formatCurrency(qty * asset.currentPrice)}
                </div>
              </div>
              <button
                onClick={handleTrade}
                className={`w-full sm:w-auto px-6 py-2 rounded font-mono font-bold text-sm transition-colors ${
                  tradeAction === "BUY"
                    ? "bg-emerald-800 hover:bg-emerald-700 text-emerald-100"
                    : "bg-rose-800 hover:bg-rose-700 text-rose-100"
                }`}
              >
                {tradeAction === "BUY" ? "Buy" : "Sell"}
              </button>
            </div>
            <div className="text-xs text-gray-600">
              Cash available: {formatCurrency(state.portfolio.cash)}
              {holding && <> · Holding: {holding.quantity.toLocaleString()} {asset.type === "crypto" ? "coins" : "shares"}</>}
            </div>
          </div>

          {/* Company description */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              About {asset.name}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">{asset.description}</p>
          </div>

          {/* Related events */}
          {relatedEvents.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                Market Events ({relatedEvents.length})
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {[...relatedEvents].reverse().map((fired) => {
                  const mult = fired.actualMultipliers[ticker];
                  const isUp = mult >= 1;
                  return (
                    <div
                      key={`${fired.event.id}-${fired.day}`}
                      className={`flex items-start gap-3 p-2.5 rounded border ${
                        isUp
                          ? "bg-emerald-950/40 border-emerald-900"
                          : "bg-rose-950/40 border-rose-900"
                      }`}
                    >
                      <span className="text-base">{fired.event.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-300 truncate">{fired.event.headline}</div>
                        <div className="text-xs text-gray-500">Day {fired.day}</div>
                      </div>
                      <span
                        className={`text-xs font-mono tabular-nums whitespace-nowrap ${
                          isUp ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {isUp ? "+" : ""}{((mult - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: metrics sidebar */}
        <div className="space-y-4">

          {/* Your position */}
          {holding && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
                Your Position
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">
                    {asset.type === "crypto" ? "Coins" : "Shares"}
                  </div>
                  <div className="text-base font-mono font-bold text-white tabular-nums">
                    {holding.quantity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Avg Cost</div>
                  <div className="text-base font-mono font-bold text-white tabular-nums">
                    ${formatPrice(holding.averageCostBasis)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">Market Value</div>
                  <div className="text-base font-mono font-bold text-white tabular-nums">
                    {formatCurrency(getHoldingValue(holding, state.assets))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-0.5">P&amp;L</div>
                  <div
                    className={`text-base font-mono font-bold tabular-nums ${
                      getHoldingPnL(holding, state.assets) >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {getHoldingPnL(holding, state.assets) >= 0 ? "+" : ""}
                    {formatCurrency(getHoldingPnL(holding, state.assets))}
                  </div>
                  <ChangeIndicator value={getHoldingPnLPercent(holding, state.assets)} size="sm" />
                </div>
              </div>
            </div>
          )}

          {/* Analyst Coverage */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-gray-400 uppercase tracking-wider">
                Analyst Coverage
              </h2>
              {analystAccess && (
                <span className="text-xs font-mono text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded">
                  {subActive ? `SUB · ${subDaysLeft}d left` : "UNLOCKED"}
                </span>
              )}
            </div>

            {analystAccess && coverage ? (
              <div className="space-y-3">
                {/* Consensus summary */}
                <div className={`${RATING_STYLES[coverage.consensusRating].bg} ${RATING_STYLES[coverage.consensusRating].border} border rounded-lg p-3 text-center`}>
                  <div className="text-xs text-gray-400 mb-0.5">3-Firm Consensus</div>
                  <div className={`text-lg font-mono font-bold ${RATING_STYLES[coverage.consensusRating].text}`}>
                    {coverage.consensusRating}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target: ${formatPrice(coverage.consensusTarget)}
                  </div>
                </div>

                {/* Individual firm views */}
                {coverage.views.map((view) => {
                  const firm = ANALYST_FIRMS[view.firmId];
                  const style = RATING_STYLES[view.rating];
                  return (
                    <div key={view.firmId} className="border border-gray-800 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{firm.icon}</span>
                            <span className="text-xs font-mono font-bold text-white">{firm.shortName}</span>
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">{firm.focus}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}>
                            {view.rating}
                          </span>
                          <div className="text-xs font-mono text-gray-500 mt-1">
                            ${formatPrice(view.priceTarget)}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{view.rationale}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Paywall */
              <div>
                <div className="text-center py-4 mb-3">
                  <div className="text-3xl mb-2">🔒</div>
                  <div className="text-sm font-mono text-gray-300 mb-1">3 Analyst Firms Available</div>
                  <div className="text-xs text-gray-500 mb-3">
                    Get independent ratings from Apex Research, Momentum Capital Analytics, and Sentinel Risk Partners — each with their own methodology and price targets.
                  </div>
                  <div className="space-y-2 text-left text-xs text-gray-500 mb-4">
                    {Object.values(ANALYST_FIRMS).map((f) => (
                      <div key={f.id} className="flex items-center gap-2">
                        <span>{f.icon}</span>
                        <span className="text-gray-400 font-mono">{f.name}</span>
                        <span className="text-gray-600">· {f.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => dispatch({ type: "UNLOCK_ANALYST_STOCK", payload: { ticker } })}
                    disabled={state.portfolio.cash < ANALYST_SINGLE_COST}
                    className="w-full py-2.5 text-sm font-mono font-bold rounded-lg border transition-colors bg-blue-900 hover:bg-blue-800 border-blue-700 text-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Unlock This Stock — ${ANALYST_SINGLE_COST.toLocaleString()}
                  </button>
                  <button
                    onClick={() => dispatch({ type: "BUY_ANALYST_SUBSCRIPTION" })}
                    disabled={state.portfolio.cash < ANALYST_SUB_COST}
                    className="w-full py-2.5 text-sm font-mono font-bold rounded-lg border transition-colors bg-yellow-900/60 hover:bg-yellow-900 border-yellow-700 text-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Subscribe All — ${ANALYST_SUB_COST.toLocaleString()}/week
                  </button>
                  <div className="text-center text-xs text-gray-600">
                    Subscription covers all {Object.keys(state.assets).length} assets for {ANALYST_SUB_DAYS} days
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Technical Indicators */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              Technical Indicators
            </h2>

            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-2">RSI (14)</div>
              <RSIGauge value={technicals.rsiVal} />
            </div>

            <MATrendWidget
              trend={technicals.maTrend}
              currentPrice={asset.currentPrice}
              sma20={technicals.sma20}
              sma50={technicals.sma50}
            />

            <div className="divide-y divide-gray-800">
              <MetricRow
                label="20-day MA"
                value={technicals.sma20 ? `$${formatPrice(technicals.sma20)}` : "N/A"}
                sub={
                  technicals.sma20
                    ? asset.currentPrice > technicals.sma20
                      ? `▲ ${formatPercent((asset.currentPrice - technicals.sma20) / technicals.sma20, false)} above`
                      : `▼ ${formatPercent((technicals.sma20 - asset.currentPrice) / technicals.sma20, false)} below`
                    : undefined
                }
                valueClass={
                  technicals.sma20
                    ? asset.currentPrice > technicals.sma20 ? "text-emerald-400" : "text-rose-400"
                    : "text-gray-500"
                }
                explanation={`The 20-day Moving Average is the average closing price over the last 20 trading days. It smooths out short-term noise to show the recent trend.\n\nPrice above MA20 = short-term bullish momentum. Price below MA20 = short-term bearish pressure.\n\nTraders use MA20 as a dynamic support/resistance level. A stock bouncing off its MA20 in an uptrend is often a low-risk buy signal.`}
              />
              <MetricRow
                label="50-day MA"
                value={technicals.sma50 ? `$${formatPrice(technicals.sma50)}` : "N/A"}
                sub={
                  technicals.sma50
                    ? asset.currentPrice > technicals.sma50
                      ? `▲ ${formatPercent((asset.currentPrice - technicals.sma50) / technicals.sma50, false)} above`
                      : `▼ ${formatPercent((technicals.sma50 - asset.currentPrice) / technicals.sma50, false)} below`
                    : undefined
                }
                valueClass={
                  technicals.sma50
                    ? asset.currentPrice > technicals.sma50 ? "text-emerald-400" : "text-rose-400"
                    : "text-gray-500"
                }
                explanation={`The 50-day Moving Average represents the medium-term trend — roughly 10 weeks of trading.\n\nMany institutional investors use it as a benchmark: is the stock "healthy" (above MA50) or in a downtrend (below MA50)?\n\nWhen the 20-day MA crosses above the 50-day MA = Golden Cross (buy signal). When it crosses below = Death Cross (sell signal).`}
              />
              <MetricRow
                label="ATR (14)"
                value={technicals.atrVal ? `$${formatPrice(technicals.atrVal)}` : "N/A"}
                sub={
                  technicals.atrVal
                    ? `${formatPercent(technicals.atrVal / asset.currentPrice, false)} of price / day`
                    : undefined
                }
                explanation={`Average True Range (ATR) measures how much the stock typically moves each day in dollar terms. It's the best indicator of a stock's current volatility.\n\nHigh ATR = the stock swings widely — larger potential gains but larger potential losses per share.\n\nPractical use: If ATR is $5 and you only want to risk $500 on this trade, you should buy no more than 100 shares. ATR helps you size positions to match your risk tolerance.`}
              />
              <MetricRow
                label="Beta (vs SNP499)"
                value={technicals.betaVal !== null ? technicals.betaVal.toFixed(2) : "N/A"}
                sub={
                  technicals.betaVal !== null
                    ? technicals.betaVal > 1.2
                      ? "High market sensitivity"
                      : technicals.betaVal < 0.8
                      ? "Low market sensitivity"
                      : "Tracks market closely"
                    : undefined
                }
                explanation={`Beta measures how much this stock moves relative to the overall market (SNP499).\n\nBeta = 1.0: moves exactly with the market.\nBeta = 1.5: moves 50% more than the market (up or down).\nBeta = 0.5: moves half as much as the market.\nBeta < 0: moves opposite to the market (rare).\n\nHigh-beta stocks amplify returns in bull markets but amplify losses in bear markets. Low-beta stocks are more defensive.`}
              />
            </div>
          </div>

          {/* Fundamental Metrics */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              Fundamentals
            </h2>

            {/* 52-week range bar */}
            <FiftyTwoWeekRange
              low={hl.low}
              high={hl.high}
              current={asset.currentPrice}
              position={hlPosition}
            />

            <div className="divide-y divide-gray-800">
              <MetricRow
                label="Market Cap"
                value={`$${formatLargeNumber(marketCap)}`}
                explanation={`Market capitalization = current share price × total shares outstanding. It represents the total market value of the company.\n\nLarge-cap (>$10B): Established, stable, lower risk, slower growth.\nMid-cap ($2B–$10B): Balanced growth and risk.\nSmall-cap (<$2B): Higher growth potential but more volatile.\n\nMarket cap is better than price alone for comparing company sizes — a $5 stock with 10 billion shares is far larger than a $500 stock with 1 million shares.`}
              />
              <MetricRow
                label="Daily Volatility"
                value={formatPercent(asset.volatility, false)}
                sub="Base σ (annualized ~16x)"
                explanation={`This is the stock's base daily volatility (standard deviation of returns). It represents how much the price is expected to fluctuate on an average day.\n\nA 2% daily volatility means the stock might move ±2% on a typical day — though larger moves are possible.\n\nAnnualizing volatility: multiply by √252 (trading days per year) ≈ 16x. So 2% daily ≈ 32% annualized volatility — which is fairly high for a stock.`}
              />
              {asset.type === "stock" && (
                <>
                  <MetricRow
                    label="P/E Ratio"
                    value={asset.peRatio > 0 ? asset.peRatio.toFixed(1) : "N/A"}
                    sub={
                      asset.peRatio > 0
                        ? asset.peRatio > 50
                          ? "Growth premium"
                          : asset.peRatio < 15
                          ? "Value territory"
                          : "Fair value range"
                        : undefined
                    }
                    explanation={`The Price-to-Earnings (P/E) ratio tells you how much you pay for each dollar of annual profit.\n\nP/E = Share Price ÷ Earnings Per Share\n\nLow P/E (<15): "Value" territory — either cheap or slow-growth. Check if earnings are stable.\nFair P/E (15–30): Reflects moderate growth expectations.\nHigh P/E (>50): "Growth" premium — investors expect strong future earnings to justify the price.\n\nAlways compare P/E within the same sector. A P/E of 40 is normal for tech but expensive for banking.`}
                  />
                  {technicals.eps !== null && (
                    <MetricRow
                      label="EPS (est.)"
                      value={`$${technicals.eps.toFixed(2)}`}
                      explanation={`Earnings Per Share (EPS) is the company's net profit divided by the number of shares outstanding. It's the most fundamental measure of a company's profitability on a per-share basis.\n\nGrowing EPS over time is the #1 long-term driver of stock price appreciation.\n\nWhen companies "beat earnings" (report EPS above analyst estimates), the stock often jumps. "Missing" earnings often causes sharp declines — even if the company is still profitable.`}
                    />
                  )}
                  <MetricRow
                    label="Dividend Yield"
                    value={asset.dividendYield > 0 ? formatPercent(asset.dividendYield, false) : "None"}
                    explanation={`Dividend yield = Annual Dividend ÷ Share Price. It represents the cash income you receive just for holding the stock.\n\nA 3% yield means for every $1,000 invested, you receive $30/year in dividends, regardless of price movement.\n\nHigh yields (>5%) can signal: (1) a generous dividend policy, or (2) the price has fallen sharply because the business is struggling. Always check that the dividend is well-covered by earnings before buying for income.\n\nNo dividend is common for growth companies that reinvest profits instead.`}
                  />
                  <MetricRow
                    label="Shares Outstanding"
                    value={formatLargeNumber(asset.sharesOutstanding)}
                    explanation={`The total number of shares that have been issued by the company. Combined with the share price, this determines market cap.\n\nWhen companies issue new shares (dilution), each existing share becomes worth a smaller percentage of the company — generally negative for existing shareholders.\n\nWhen companies buy back their own shares (buybacks), the share count falls and each remaining share represents a larger ownership stake — generally positive.`}
                  />
                  <MetricRow
                    label="Next Earnings"
                    value={`Day ${asset.earningsDay}`}
                    sub={
                      asset.earningsDay > state.currentDay
                        ? `${asset.earningsDay - state.currentDay} days away`
                        : "Already passed"
                    }
                    explanation={`Public companies report earnings quarterly. In real markets, this is one of the most important events for any stock — the report reveals whether the company beat, met, or missed analyst expectations.\n\nStocks often "run up" in anticipation of good earnings, then sell off after even if the results are positive ("buy the rumor, sell the news").\n\nVolatility typically increases in the days before earnings — options traders price in the expected move, which can be 5–20% for smaller companies.`}
                  />
                </>
              )}
              {asset.type === "crypto" && (
                <>
                  <MetricRow
                    label="Circulating Supply"
                    value={formatLargeNumber(asset.circulatingSupply)}
                    explanation={`Circulating supply is the number of coins currently available in the market. Combined with price, it determines market cap.\n\nSupply is critical for crypto valuation. Fixed or decreasing supply (like Bitcoin's 21 million cap) is a deflationary feature that supports price under steady demand.\n\nUnlimited or rapidly-inflating supply dilutes value over time. Always check a coin's emission schedule when evaluating its long-term potential.`}
                  />
                  <MetricRow
                    label="All-Time High"
                    value={`$${formatPrice(asset.allTimeHigh)}`}
                    sub={`${formatPercent((asset.currentPrice - asset.allTimeHigh) / asset.allTimeHigh, false)} from ATH`}
                    valueClass={asset.currentPrice >= asset.allTimeHigh ? "text-emerald-400" : "text-rose-400"}
                    explanation={`The All-Time High (ATH) is the highest price the coin has ever reached. The distance from ATH tells you how deep in a potential "recovery" cycle the coin is.\n\nFar below ATH (>70% down) may suggest deep value — or that the coin has lost its narrative.\nApproaching ATH often creates resistance as early buyers take profits.\nBreaking above ATH with volume is one of the strongest bullish signals in crypto — it means every single person who ever bought is now in profit, removing sell pressure.`}
                  />
                  <MetricRow
                    label="Market Dominance"
                    value={`${asset.dominancePercent.toFixed(1)}%`}
                    explanation={`Market dominance is this coin's share of the total crypto market cap. Bitcoin's dominance (roughly 45–60% historically) is the main benchmark.\n\nHigh/rising dominance: This coin is attracting a larger share of crypto investment — often a sign of strength relative to alternatives.\nFalling dominance: Capital is rotating away into other coins.\n\nBitcoin dominance falling broadly often signals the start of "altcoin season," where smaller coins outperform significantly.`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MATrendWidget({
  trend,
  currentPrice,
  sma20,
  sma50,
}: {
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  currentPrice: number;
  sma20: number | null;
  sma50: number | null;
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  const explanation =
    trend === "BULLISH"
      ? "Price is above both the 20-day and 50-day MAs, and the faster MA (20) is above the slower MA (50). This 'stacked' alignment is a bullish structure — all three timeframes agree the trend is up."
      : trend === "BEARISH"
      ? "Price is below both MAs and the 20-day MA is below the 50-day MA. This bearish alignment indicates the short, medium, and current price trend all point down."
      : "The MAs are mixed or crossing — the trend is transitioning. This is often a period of consolidation before the next directional move.";

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs text-gray-500">MA Trend Signal</span>
        <button
          onClick={() => setShowExplanation((v) => !v)}
          className={`text-xs w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
            showExplanation
              ? "bg-blue-700 text-white"
              : "bg-gray-700 text-gray-400 hover:bg-gray-600"
          }`}
        >
          ?
        </button>
      </div>
      <span
        className={`text-xs font-mono px-2 py-0.5 rounded border ${
          trend === "BULLISH"
            ? "bg-emerald-900 text-emerald-300 border-emerald-700"
            : trend === "BEARISH"
            ? "bg-rose-900 text-rose-300 border-rose-700"
            : "bg-gray-800 text-gray-400 border-gray-700"
        }`}
      >
        {trend}
      </span>
      <div className="text-xs text-gray-600 mt-1">
        Price {currentPrice > (sma20 ?? 0) ? "above" : "below"} MA20
        {sma20 && sma50
          ? ` · MA20 ${sma20 > sma50 ? "above" : "below"} MA50`
          : ""}
      </div>
      {showExplanation && (
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg px-3 py-2 mt-2 text-xs text-blue-200 leading-relaxed space-y-1.5">
          <p><strong className="text-blue-300">What is the MA Trend Signal?</strong> This combines the relationship between the current price, the 20-day MA, and the 50-day MA to produce a single trend reading.</p>
          <p><strong className="text-blue-300">Right now:</strong> {explanation}</p>
          <p className="text-blue-300/70">A Golden Cross (20-day crossing above 50-day) is one of the most widely-followed buy signals in technical analysis. The Death Cross (20-day crossing below 50-day) is its bearish counterpart.</p>
        </div>
      )}
    </div>
  );
}

function FiftyTwoWeekRange({
  low,
  high,
  current,
  position,
}: {
  low: number;
  high: number;
  current: number;
  position: number;
}) {
  const [showExplanation, setShowExplanation] = useState(false);
  const pctFromLow = ((current - low) / (high - low || 1)) * 100;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>52-Wk Low</span>
        <div className="flex items-center gap-1">
          <span>52-Wk Range</span>
          <button
            onClick={() => setShowExplanation((v) => !v)}
            className={`text-xs w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
              showExplanation
                ? "bg-blue-700 text-white"
                : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            ?
          </button>
        </div>
        <span>52-Wk High</span>
      </div>
      <div className="relative h-2 bg-gray-800 rounded-full overflow-visible">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-rose-700 to-emerald-600 rounded-full"
          style={{ width: "100%" }}
          aria-hidden
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-gray-900 shadow"
          style={{ left: `${position * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs font-mono tabular-nums mt-1">
        <span className="text-rose-400">${formatPrice(low)}</span>
        <span className="text-gray-400">${formatPrice(current)} ({pctFromLow.toFixed(0)}% of range)</span>
        <span className="text-emerald-400">${formatPrice(high)}</span>
      </div>
      {showExplanation && (
        <div className="bg-blue-950/40 border border-blue-900/50 rounded-lg px-3 py-2 mt-2 text-xs text-blue-200 leading-relaxed space-y-1.5">
          <p><strong className="text-blue-300">What is the 52-week range?</strong> This shows the lowest and highest prices over the past year. The white dot shows where the current price sits within that range.</p>
          <p><strong className="text-blue-300">How to use it:</strong> Near the 52-week low may signal value — but verify the business is intact. Near the 52-week high shows strength and momentum. Breaking to a new 52-week high on heavy volume is one of the most reliable bullish technical signals.</p>
          <p className="text-blue-300/70">Many institutional investors automatically buy dips toward the 52-week low and sell into strength near the 52-week high — creating self-fulfilling support and resistance.</p>
        </div>
      )}
    </div>
  );
}

function QuickStat({
  label,
  value,
  sub,
  valueClass = "text-white",
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-3">
      <div className="text-xs text-gray-500 mb-0.5">{label}</div>
      <div className={`text-sm font-mono font-bold tabular-nums ${valueClass}`}>{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}
