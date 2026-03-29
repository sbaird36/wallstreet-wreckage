"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import { ChangeIndicator } from "@/components/ui/ChangeIndicator";
import { SectorBadge, TypeBadge } from "@/components/ui/Badge";
import { formatPrice, formatPercent } from "@/utils/formatting";
import { getPriceChangePercent } from "@/utils/calculations";
import {
  runAlgorithm,
  getRecommendation,
  RECOMMENDATION_STYLES,
  DEFAULT_CONFIG,
  type AlgorithmConfig,
  type AlgorithmWeights,
  type RiskProfile,
  type AssetScore,
  type FactorScores,
} from "@/utils/algorithmEngine";

// ─── Weight Selector ─────────────────────────────────────────────────────────

function WeightSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-7 h-7 text-xs font-mono rounded border transition-colors ${
            value === n
              ? "bg-blue-700 border-blue-500 text-white"
              : value > 0 && n <= value
              ? "bg-blue-900/60 border-blue-700 text-blue-300"
              : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

// ─── Factor config rows ───────────────────────────────────────────────────────

const FACTOR_META: {
  key: keyof AlgorithmWeights;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    key: "technical",
    label: "Technical Analysis",
    icon: "📈",
    description: "RSI oversold/overbought signals and moving average crossovers (20-day vs 50-day).",
  },
  {
    key: "analyst",
    label: "Analyst Rating",
    icon: "🏦",
    description: "Simulated consensus analyst ratings derived from price trend and momentum.",
  },
  {
    key: "momentum",
    label: "Price Momentum",
    icon: "⚡",
    description: "Recent 5-day price performance — rewards stocks showing strong upward moves.",
  },
  {
    key: "events",
    label: "Market Events",
    icon: "🌐",
    description: "Scores the impact of recent world and market events on each ticker (last 10 days).",
  },
  {
    key: "blogSentiment",
    label: "Community Sentiment",
    icon: "💬",
    description: "Weighs verified news and community upvotes on r/WallStreetWreckage (last 7 days). Verified posts count 3× more than FUD.",
  },
];

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;

  const color =
    score >= 72 ? "#34d399"
    : score >= 58 ? "#4ade80"
    : score >= 44 ? "#facc15"
    : score >= 30 ? "#fb923c"
    : "#f43f5e";

  return (
    <svg width="44" height="44" className="flex-shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="#1a3248" strokeWidth="4" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 22 22)"
      />
      <text
        x="22"
        y="26"
        textAnchor="middle"
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
        fill={color}
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}

// ─── Factor bar ───────────────────────────────────────────────────────────────

function FactorBar({
  label,
  score,
  weight,
}: {
  label: string;
  score: number | null;
  weight: number;
}) {
  if (weight === 0 || score === null) return null;

  const pct = Math.round(score);
  const color =
    pct >= 65 ? "bg-emerald-500"
    : pct >= 45 ? "bg-yellow-500"
    : "bg-rose-500";

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-28 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-mono text-gray-400 w-7 text-right tabular-nums">{pct}</span>
    </div>
  );
}

// ─── Result card ─────────────────────────────────────────────────────────────

function ResultCard({
  result,
  rank,
  weights,
}: {
  result: AssetScore;
  rank: number;
  weights: AlgorithmWeights;
}) {
  const { state, dispatch } = useGame();
  const asset = state.assets[result.ticker];
  if (!asset) return null;

  const rec = result.recommendation;
  const style = RECOMMENDATION_STYLES[rec];
  const changePct = getPriceChangePercent(asset);
  const href = asset.type === "stock" ? `/stock/${asset.ticker}` : `/crypto/${asset.ticker}`;

  function handleTrade() {
    dispatch({
      type: "SET_PENDING_TRADE",
      payload: {
        ticker: asset.ticker,
        action: "BUY",
        quantity: 1,
        pricePerUnit: asset.currentPrice,
      },
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
      {/* Top row */}
      <div className="flex items-start gap-3">
        {/* Rank + score ring */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <span className="text-xs font-mono text-gray-600">#{rank}</span>
          <ScoreRing score={result.totalScore} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <Link href={href} className="group flex items-center gap-2">
                <span className="font-mono font-bold text-white group-hover:text-blue-400 transition-colors">
                  {asset.ticker}
                </span>
                <TypeBadge type={asset.type} />
                {asset.type === "stock" && <SectorBadge sector={asset.sector} />}
              </Link>
              <div className="text-xs text-gray-500 truncate mt-0.5">{asset.name}</div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${style.bg} ${style.text} ${style.border}`}
              >
                {rec}
              </span>
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-mono font-bold text-white tabular-nums">
              ${formatPrice(asset.currentPrice)}
            </span>
            <ChangeIndicator value={changePct} size="sm" />
          </div>
        </div>

        {/* Trade button */}
        <button
          onClick={handleTrade}
          className="text-xs px-2 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 rounded border border-emerald-700 transition-colors flex-shrink-0 font-mono"
        >
          Trade
        </button>
      </div>

      {/* Factor bars */}
      <div className="mt-2.5 pt-2.5 border-t border-gray-800 space-y-1.5">
        {FACTOR_META.map((f) => (
          <FactorBar
            key={f.key}
            label={f.label}
            score={result.factorScores[f.key]}
            weight={weights[f.key]}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AlgorithmBuilder() {
  const { state } = useGame();
  const [config, setConfig] = useState<AlgorithmConfig>(DEFAULT_CONFIG);

  function setWeight(key: keyof AlgorithmWeights, value: number) {
    setConfig((c) => ({
      ...c,
      weights: { ...c.weights, [key]: value },
    }));
  }

  function setRisk(profile: RiskProfile) {
    setConfig((c) => ({ ...c, riskProfile: profile }));
  }

  const analystSub = state.analystSubscription;
  const subActive = analystSub !== null && state.currentDay - analystSub.purchasedDay < 7;

  const fullConfig = useMemo(
    () => ({
      ...config,
      analystUnlocks: state.analystUnlocks,
      analystSubscriptionDay: analystSub?.purchasedDay ?? null,
    }),
    [config, state.analystUnlocks, analystSub]
  );

  const results = useMemo(
    () =>
      runAlgorithm(
        state.assets,
        state.eventHistory,
        state.blogFeed,
        fullConfig,
        state.currentDay
      ),
    [state.assets, state.eventHistory, state.blogFeed, fullConfig, state.currentDay]
  );

  const analystCoverageCount = subActive
    ? Object.keys(state.assets).length
    : state.analystUnlocks.length;

  const totalWeight = Object.values(config.weights).reduce((a, b) => a + b, 0);
  const hasAnyAssetType = config.includeStocks || config.includeCrypto;

  const RISK_PROFILES: { value: RiskProfile; label: string; desc: string; color: string }[] = [
    {
      value: "conservative",
      label: "Conservative",
      desc: "Avoids speculative stocks and high volatility. Discounts penny stocks by 75%.",
      color: "border-blue-600 bg-blue-900/30 text-blue-300",
    },
    {
      value: "balanced",
      label: "Balanced",
      desc: "No adjustments — all assets scored equally on their factor data.",
      color: "border-yellow-600 bg-yellow-900/30 text-yellow-300",
    },
    {
      value: "aggressive",
      label: "Aggressive",
      desc: "Boosts speculative penny stocks and high-volatility plays by up to 40%.",
      color: "border-rose-600 bg-rose-900/30 text-rose-300",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-mono font-bold text-white text-lg flex items-center gap-2">
              <span>🤖</span> My Algorithm
            </h1>
            <p className="text-xs text-gray-500 mt-1 max-w-xl">
              Configure which signals your algorithm weighs, then watch the rankings update in real-time.
              Set any factor to <span className="text-white font-mono">0</span> to exclude it entirely.
              Adjust your risk profile to control how speculative plays are treated.
            </p>
          </div>
          <div className="text-right text-xs text-gray-600 font-mono">
            <div className="text-gray-400">{Object.values(state.assets).length} assets</div>
            <div>Day {state.currentDay}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* ── Left: Config panel ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Factor weights */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-4">
              Signal Weights
            </h2>
            <div className="space-y-4">
              {FACTOR_META.map((f) => (
                <div key={f.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{f.icon}</span>
                      <span className="text-sm text-white font-mono">{f.label}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {config.weights[f.key] === 0 ? (
                        <span className="text-gray-600">off</span>
                      ) : (
                        <span className="text-blue-400">{config.weights[f.key]}/5</span>
                      )}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2 leading-relaxed">{f.description}</p>
                  <WeightSelector
                    value={config.weights[f.key]}
                    onChange={(v) => setWeight(f.key, v)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Risk profile */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              Risk Profile
            </h2>
            <div className="space-y-2">
              {RISK_PROFILES.map((rp) => (
                <button
                  key={rp.value}
                  onClick={() => setRisk(rp.value)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    config.riskProfile === rp.value
                      ? rp.color
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  <div className="text-sm font-mono font-bold mb-0.5">{rp.label}</div>
                  <div className="text-xs opacity-75 leading-snug">{rp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Asset types */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              Asset Types
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig((c) => ({ ...c, includeStocks: !c.includeStocks }))}
                className={`flex-1 py-2 text-sm font-mono font-bold rounded border transition-colors ${
                  config.includeStocks
                    ? "bg-gray-700 border-gray-500 text-white"
                    : "bg-gray-800 border-gray-700 text-gray-500"
                }`}
              >
                Stocks
              </button>
              <button
                onClick={() => setConfig((c) => ({ ...c, includeCrypto: !c.includeCrypto }))}
                className={`flex-1 py-2 text-sm font-mono font-bold rounded border transition-colors ${
                  config.includeCrypto
                    ? "bg-amber-900 border-amber-700 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-500"
                }`}
              >
                Crypto
              </button>
            </div>
          </div>

          {/* Result count */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <h2 className="text-xs text-gray-400 uppercase tracking-wider mb-3">
              Top N Results
            </h2>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setConfig((c) => ({ ...c, topN: n }))}
                  className={`px-4 py-2 text-sm font-mono rounded border transition-colors ${
                    config.topN === n
                      ? "bg-gray-700 border-gray-500 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Results panel ── */}
        <div className="lg:col-span-3 space-y-3">

          {/* Analyst access notice */}
          {config.weights.analyst > 0 && (
            <div className={`rounded-lg border px-3 py-2 text-xs flex items-start gap-2 ${
              analystCoverageCount > 0
                ? "bg-blue-900/20 border-blue-800/50 text-blue-300"
                : "bg-amber-900/20 border-amber-800/50 text-amber-400"
            }`}>
              <span className="mt-0.5">{analystCoverageCount > 0 ? "🏛️" : "🔒"}</span>
              <span>
                {analystCoverageCount > 0
                  ? `Analyst data active for ${analystCoverageCount} asset${analystCoverageCount !== 1 ? "s" : ""}${subActive ? " (subscription)" : ""}. Unlocked tickers receive 3-firm consensus scoring.`
                  : `Analyst weight is set but you have no analyst coverage unlocked. Visit any stock page to unlock for $100, or subscribe for $5,000/week to cover all assets.`
                }
              </span>
            </div>
          )}

          {/* Results header */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Algorithm Output</div>
              {results.length > 0 && (
                <div className="text-xs text-gray-500 mt-0.5">
                  Top {results.length} picks · total signal weight{" "}
                  <span className="text-blue-400 font-mono">{totalWeight}</span>
                  {" "}· {config.riskProfile} risk
                </div>
              )}
            </div>

            {/* Weight breakdown pills */}
            <div className="flex flex-wrap gap-1">
              {FACTOR_META.filter((f) => config.weights[f.key] > 0).map((f) => (
                <span
                  key={f.key}
                  className="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/40 border border-blue-800/60 text-blue-400"
                >
                  {f.icon} {f.label.split(" ")[0]}:{config.weights[f.key]}
                </span>
              ))}
            </div>
          </div>

          {/* Edge cases */}
          {totalWeight === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3">🎚️</div>
              <div className="text-gray-400 text-sm">All signal weights are set to 0.</div>
              <div className="text-gray-600 text-xs mt-1">
                Increase at least one signal weight to generate picks.
              </div>
            </div>
          )}

          {totalWeight > 0 && !hasAnyAssetType && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3">📭</div>
              <div className="text-gray-400 text-sm">No asset types selected.</div>
              <div className="text-gray-600 text-xs mt-1">
                Enable Stocks and/or Crypto above.
              </div>
            </div>
          )}

          {totalWeight > 0 && hasAnyAssetType && results.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="text-3xl mb-3">📊</div>
              <div className="text-gray-400 text-sm">No data yet.</div>
              <div className="text-gray-600 text-xs mt-1">
                Advance a few days for the algorithm to have data to work with.
              </div>
            </div>
          )}

          {/* Result cards */}
          {results.map((r, i) => (
            <ResultCard
              key={r.ticker}
              result={r}
              rank={i + 1}
              weights={config.weights}
            />
          ))}

          {results.length > 0 && (
            <div className="text-center text-xs text-gray-700 font-mono py-2">
              — end of results —
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
