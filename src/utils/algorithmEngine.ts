import type { Asset, FiredEvent, BlogPost } from "@/types";
import { rsi, sma } from "@/utils/technicals";

// ─── Config ──────────────────────────────────────────────────────────────────

export type AlgorithmWeights = {
  technical: number;      // RSI + moving averages  (0-5)
  analyst: number;        // simulated analyst rating (0-5)
  blogSentiment: number;  // community posts & verified news (0-5)
  momentum: number;       // recent price performance (0-5)
  events: number;         // recent market & world events (0-5)
};

export type RiskProfile = "conservative" | "balanced" | "aggressive";

export type AlgorithmConfig = {
  weights: AlgorithmWeights;
  riskProfile: RiskProfile;
  includeStocks: boolean;
  includeCrypto: boolean;
  topN: number;
};

export const DEFAULT_CONFIG: AlgorithmConfig = {
  weights: {
    technical: 3,
    analyst: 2,
    blogSentiment: 1,
    momentum: 2,
    events: 3,
  },
  riskProfile: "balanced",
  includeStocks: true,
  includeCrypto: false,
  topN: 10,
};

// ─── Factor scoring ───────────────────────────────────────────────────────────

function technicalScore(asset: Asset): number | null {
  const closes = asset.priceHistory.map((p) => p.close);
  if (closes.length < 5) return null;

  const rsiVal = rsi(closes);
  let rsiPart = 50;
  if (rsiVal !== null) {
    // Oversold < 30 → buying opportunity (high score); overbought > 70 → avoid (low score)
    if (rsiVal < 20) rsiPart = 88;
    else if (rsiVal < 30) rsiPart = 78;
    else if (rsiVal < 40) rsiPart = 65;
    else if (rsiVal < 50) rsiPart = 57;
    else if (rsiVal < 60) rsiPart = 50;
    else if (rsiVal < 70) rsiPart = 38;
    else if (rsiVal < 80) rsiPart = 25;
    else rsiPart = 14;
  }

  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  let maPart = 50;
  if (sma20 !== null) {
    if (asset.currentPrice > sma20) maPart += 15;
    else maPart -= 15;
  }
  if (sma20 !== null && sma50 !== null) {
    if (sma20 > sma50) maPart += 10;
    else maPart -= 10;
  }
  maPart = Math.max(0, Math.min(100, maPart));

  return rsiVal !== null ? rsiPart * 0.55 + maPart * 0.45 : maPart;
}

function analystScore(asset: Asset): number {
  const closes = asset.priceHistory.map((p) => p.close);
  const rsiVal = rsi(closes);
  // Replicate the analystRating logic inline to avoid circular deps
  // trend > 0 = bullish leaning; combine with RSI for a rating
  const trend = asset.trend ?? 0;
  let base = 50 + trend * 2000; // trend ≈ 0.005 maps to ~60
  if (rsiVal !== null) {
    if (rsiVal < 30) base += 15;
    else if (rsiVal > 70) base -= 15;
  }
  return Math.max(0, Math.min(100, base));
}

function momentumScore(asset: Asset, lookbackDays = 5): number {
  const history = asset.priceHistory;
  if (history.length < 2) return 50;
  const idx = Math.max(0, history.length - 1 - lookbackDays);
  const past = history[idx].close;
  const change = (asset.currentPrice - past) / past;
  // -20% → 0, 0% → 50, +20% → 100
  return Math.max(0, Math.min(100, 50 + change * 250));
}

function eventScore(
  ticker: string,
  eventHistory: FiredEvent[],
  currentDay: number,
  lookback = 10
): number | null {
  const recent = eventHistory.filter(
    (e) => e.affectedTickers.includes(ticker) && currentDay - e.day <= lookback
  );
  if (recent.length === 0) return null;

  const scores = recent.map((e) => {
    const mult = e.actualMultipliers[ticker] ?? 1;
    // mult=0.8 → 0, mult=1.0 → 50, mult=1.2 → 100
    return Math.max(0, Math.min(100, ((mult - 0.8) / 0.4) * 100));
  });
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function blogSentimentScore(
  ticker: string,
  blogFeed: BlogPost[],
  currentDay: number,
  lookback = 7
): number | null {
  const posts = blogFeed.filter(
    (p) =>
      p.linkedTickers.includes(ticker) && currentDay - p.day <= lookback
  );
  if (posts.length === 0) return null;

  let weightedScore = 0;
  let totalWeight = 0;

  for (const post of posts) {
    const net = post.upvotes - post.downvotes;
    // Verified real posts carry 3× weight vs FUD
    const w = post.isReal ? 3 : 1;
    // net votes: -5000=0, 0=50, +5000=100
    const voteSignal = Math.max(0, Math.min(100, 50 + (net / 5000) * 50));
    weightedScore += voteSignal * w;
    totalWeight += w;
  }

  return totalWeight > 0 ? weightedScore / totalWeight : null;
}

// ─── Risk profile modifier ────────────────────────────────────────────────────

function applyRisk(asset: Asset, score: number, profile: RiskProfile): number {
  const isSpeculative =
    asset.type === "stock" && (asset as { sector?: string }).sector === "Speculative";

  // Volatility proxy: daily % move
  const dailyVol =
    asset.previousPrice > 0
      ? Math.abs(asset.currentPrice - asset.previousPrice) / asset.previousPrice
      : 0;

  switch (profile) {
    case "conservative":
      if (isSpeculative) return score * 0.25;   // severely discount penny stocks
      if (dailyVol > 0.05) return score * 0.7;  // discount high vol
      return score * 1.05;                       // slight boost for stability
    case "aggressive":
      if (isSpeculative) return score * 1.4;    // bonus for speculative
      if (dailyVol > 0.05) return score * 1.15; // reward volatility
      return score;
    default:
      return score; // balanced: no adjustment
  }
}

// ─── Recommendation label ─────────────────────────────────────────────────────

export type Recommendation = "STRONG BUY" | "BUY" | "HOLD" | "WEAK" | "AVOID";

export function getRecommendation(score: number): Recommendation {
  if (score >= 72) return "STRONG BUY";
  if (score >= 58) return "BUY";
  if (score >= 44) return "HOLD";
  if (score >= 30) return "WEAK";
  return "AVOID";
}

export const RECOMMENDATION_STYLES: Record<
  Recommendation,
  { bg: string; text: string; border: string }
> = {
  "STRONG BUY": { bg: "bg-emerald-900",  text: "text-emerald-300",  border: "border-emerald-600" },
  "BUY":        { bg: "bg-green-900",    text: "text-green-300",    border: "border-green-600"   },
  "HOLD":       { bg: "bg-yellow-900",   text: "text-yellow-300",   border: "border-yellow-600"  },
  "WEAK":       { bg: "bg-orange-900",   text: "text-orange-300",   border: "border-orange-600"  },
  "AVOID":      { bg: "bg-rose-900",     text: "text-rose-300",     border: "border-rose-600"    },
};

// ─── Main export ──────────────────────────────────────────────────────────────

export type FactorScores = {
  technical: number | null;
  analyst: number | null;
  blogSentiment: number | null;
  momentum: number | null;
  events: number | null;
};

export type AssetScore = {
  ticker: string;
  totalScore: number;
  factorScores: FactorScores;
  recommendation: Recommendation;
};

export function runAlgorithm(
  assets: Record<string, Asset>,
  eventHistory: FiredEvent[],
  blogFeed: BlogPost[],
  config: AlgorithmConfig,
  currentDay: number
): AssetScore[] {
  const { weights, riskProfile, includeStocks, includeCrypto, topN } = config;

  const allWeightsZero = Object.values(weights).every((w) => w === 0);
  if (allWeightsZero || (!includeStocks && !includeCrypto)) return [];

  const results: AssetScore[] = [];

  for (const asset of Object.values(assets)) {
    if (asset.type === "stock" && !includeStocks) continue;
    if (asset.type === "crypto" && !includeCrypto) continue;

    const factorScores: FactorScores = {
      technical:     weights.technical     > 0 ? technicalScore(asset)                                      : null,
      analyst:       weights.analyst       > 0 ? analystScore(asset)                                        : null,
      blogSentiment: weights.blogSentiment > 0 ? blogSentimentScore(asset.ticker, blogFeed, currentDay)     : null,
      momentum:      weights.momentum      > 0 ? momentumScore(asset)                                       : null,
      events:        weights.events        > 0 ? eventScore(asset.ticker, eventHistory, currentDay)         : null,
    };

    // Weighted average — only count factors that have data
    let weightedSum = 0;
    let activeWeight = 0;

    const keys = Object.keys(weights) as (keyof AlgorithmWeights)[];
    for (const key of keys) {
      const score = factorScores[key];
      const w = weights[key];
      if (score !== null && w > 0) {
        weightedSum += score * w;
        activeWeight += w;
      }
    }

    if (activeWeight === 0) continue;

    let total = weightedSum / activeWeight;
    total = applyRisk(asset, total, riskProfile);
    total = Math.max(0, Math.min(100, total));

    results.push({
      ticker: asset.ticker,
      totalScore: total,
      factorScores,
      recommendation: getRecommendation(total),
    });
  }

  return results.sort((a, b) => b.totalScore - a.totalScore).slice(0, topN);
}
