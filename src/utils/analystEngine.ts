/**
 * analystEngine.ts
 *
 * Three independent analyst firms, each with a distinct methodology.
 * Ratings are fully dynamic — recomputed from current price history and events
 * every time they're needed, so they respond to market/company/world changes.
 */

import type { Asset, FiredEvent } from "@/types";
import { rsi, sma, atr, highLow52Week } from "@/utils/technicals";
import { formatPrice, formatPercent } from "@/utils/formatting";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnalystRating = "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";

export type AnalystFirmId = "apex" | "momentum" | "sentinel";

export interface AnalystFirm {
  id: AnalystFirmId;
  name: string;
  shortName: string;
  focus: string;
  icon: string;
  description: string;
}

export interface AnalystView {
  firmId: AnalystFirmId;
  rating: AnalystRating;
  score: number;       // 0–100 internal score
  priceTarget: number;
  rationale: string;  // 1–2 sentence explanation
}

export interface AnalystCoverage {
  views: [AnalystView, AnalystView, AnalystView];
  consensusRating: AnalystRating;
  consensusScore: number;
  consensusTarget: number;
}

// ─── Firm definitions ─────────────────────────────────────────────────────────

export const ANALYST_FIRMS: Record<AnalystFirmId, AnalystFirm> = {
  apex: {
    id: "apex",
    name: "Apex Research Group",
    shortName: "Apex",
    focus: "Fundamental Analysis",
    icon: "🏛️",
    description: "Focuses on long-term fundamentals: P/E ratio, dividend yield, trend sustainability, and sector positioning.",
  },
  momentum: {
    id: "momentum",
    name: "Momentum Capital Analytics",
    shortName: "MCA",
    focus: "Technical & Price Action",
    icon: "⚡",
    description: "Follows price momentum and technical signals: RSI, moving average crossovers, 52-week positioning, and volatility patterns.",
  },
  sentinel: {
    id: "sentinel",
    name: "Sentinel Risk Partners",
    shortName: "Sentinel",
    focus: "Event-Driven & Risk",
    icon: "🛡️",
    description: "Tracks macro and company-specific events, assessing their impact on risk-adjusted return potential.",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreToRating(score: number): AnalystRating {
  if (score >= 72) return "STRONG BUY";
  if (score >= 58) return "BUY";
  if (score >= 44) return "HOLD";
  if (score >= 30) return "SELL";
  return "STRONG SELL";
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

// ─── Apex Research Group — Fundamentals ──────────────────────────────────────

function apexScore(asset: Asset): { score: number; target: number; rationale: string } {
  let score = 50;
  const notes: string[] = [];

  const isSpeculative =
    asset.type === "stock" && (asset as { sector?: string }).sector === "Speculative";

  // Long-term trend (asset.trend ≈ -0.005 to +0.012)
  const trendContrib = clamp(50 + asset.trend * 3000, 0, 100);
  score = score * 0.4 + trendContrib * 0.6;

  if (asset.type === "stock") {
    const stock = asset as Extract<Asset, { type: "stock" }>;

    // P/E ratio signal
    if (stock.peRatio === 0) {
      // No earnings — speculative / pre-profit
      score -= 18;
      notes.push("No reported earnings; the company operates at a loss.");
    } else if (stock.peRatio < 12) {
      score += 14;
      notes.push(`P/E of ${stock.peRatio.toFixed(1)} sits in deep value territory.`);
    } else if (stock.peRatio < 25) {
      score += 5;
      notes.push(`P/E of ${stock.peRatio.toFixed(1)} reflects a reasonable valuation.`);
    } else if (stock.peRatio < 50) {
      score -= 5;
      notes.push(`P/E of ${stock.peRatio.toFixed(1)} carries a growth premium.`);
    } else {
      score -= 14;
      notes.push(`P/E of ${stock.peRatio.toFixed(1)} prices in aggressive growth expectations.`);
    }

    // Dividend yield
    if (stock.dividendYield > 0.03) {
      score += 8;
      notes.push(`Dividend yield of ${formatPercent(stock.dividendYield, false)} provides income support.`);
    } else if (stock.dividendYield > 0) {
      score += 3;
      notes.push(`Small dividend yield adds modest income support.`);
    }

    // Speculative penalty
    if (isSpeculative) {
      score -= 20;
      notes.push("Apex avoids speculative micro-caps with no established fundamentals.");
    }
  } else {
    // Crypto: Apex is generally skeptical
    score -= 12;
    notes.push("Apex applies a speculative premium to crypto assets, reflecting regulatory uncertainty.");
  }

  score = clamp(score);

  // Price target: fundamental value based on 180-day trend projection
  const target = asset.currentPrice * (1 + asset.trend * 180);

  const rationale =
    notes.length > 0
      ? notes.slice(0, 2).join(" ")
      : "Fundamentals appear in line with sector peers.";

  return { score, target: Math.max(0.01, target), rationale };
}

// ─── Momentum Capital Analytics — Technical / Price Action ───────────────────

function momentumScore(asset: Asset): { score: number; target: number; rationale: string } {
  const closes = asset.priceHistory.map((p) => p.close);
  const notes: string[] = [];
  let score = 50;

  if (closes.length < 5) {
    return {
      score: 50,
      target: asset.currentPrice,
      rationale: "Insufficient price history for technical analysis.",
    };
  }

  // RSI signal (primary)
  const rsiVal = rsi(closes);
  if (rsiVal !== null) {
    if (rsiVal < 25) {
      score += 28;
      notes.push(`RSI at ${rsiVal.toFixed(1)} — deeply oversold, potential reversal setup.`);
    } else if (rsiVal < 35) {
      score += 18;
      notes.push(`RSI at ${rsiVal.toFixed(1)} signals oversold conditions.`);
    } else if (rsiVal < 45) {
      score += 8;
      notes.push(`RSI at ${rsiVal.toFixed(1)} shows mild bearish pressure easing.`);
    } else if (rsiVal <= 55) {
      notes.push(`RSI at ${rsiVal.toFixed(1)} is neutral.`);
    } else if (rsiVal <= 65) {
      score -= 5;
      notes.push(`RSI at ${rsiVal.toFixed(1)} shows moderate buying momentum.`);
    } else if (rsiVal <= 75) {
      score -= 15;
      notes.push(`RSI at ${rsiVal.toFixed(1)} — overbought, buyers may be exhausted.`);
    } else {
      score -= 25;
      notes.push(`RSI at ${rsiVal.toFixed(1)} — severely overbought, high reversal risk.`);
    }
  }

  // MA crossover (secondary)
  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);
  if (sma20 !== null && sma50 !== null) {
    if (sma20 > sma50 && asset.currentPrice > sma20) {
      score += 12;
      notes.push("Golden cross setup: price above both MA20 and MA50.");
    } else if (sma20 < sma50 && asset.currentPrice < sma20) {
      score -= 12;
      notes.push("Death cross alignment: price below MA20 and MA50.");
    } else if (asset.currentPrice > sma20) {
      score += 5;
    } else {
      score -= 5;
    }
  }

  // 52-week positioning
  const hl = highLow52Week(asset.priceHistory);
  if (hl.high > hl.low) {
    const pos = (asset.currentPrice - hl.low) / (hl.high - hl.low);
    if (pos > 0.85) {
      score -= 8;
    } else if (pos < 0.2) {
      score += 10;
      notes.push("Trading near 52-week lows — potential mean reversion candidate.");
    }
  }

  score = clamp(score);

  // Price target: MA50 as base, adjusted by RSI momentum
  let target = sma50 ?? asset.currentPrice;
  if (rsiVal !== null && rsiVal < 40) target *= 1.08; // oversold bounce target
  if (rsiVal !== null && rsiVal > 65) target *= 0.95; // pullback target

  const rationale = notes.slice(0, 2).join(" ") || "Price action is in a neutral consolidation range.";

  return { score, target: Math.max(0.01, target), rationale };
}

// ─── Sentinel Risk Partners — Event-Driven & Risk ────────────────────────────

function sentinelScore(
  asset: Asset,
  eventHistory: FiredEvent[],
  currentDay: number
): { score: number; target: number; rationale: string } {
  const notes: string[] = [];
  let score = 50;

  // Recent events (last 12 days)
  const recentEvents = eventHistory.filter(
    (e) => e.affectedTickers.includes(asset.ticker) && currentDay - e.day <= 12
  );

  if (recentEvents.length > 0) {
    const avgMult =
      recentEvents.reduce((acc, e) => acc + (e.actualMultipliers[asset.ticker] ?? 1), 0) /
      recentEvents.length;

    const eventImpact = (avgMult - 1) * 100; // +10 = +10% avg event
    score += clamp(eventImpact * 4, -35, 35);

    if (avgMult > 1.05) {
      notes.push(
        `${recentEvents.length} recent event${recentEvents.length > 1 ? "s" : ""} had a net positive impact (avg +${(eventImpact).toFixed(1)}%).`
      );
    } else if (avgMult < 0.97) {
      notes.push(
        `${recentEvents.length} recent event${recentEvents.length > 1 ? "s" : ""} weighed on this ticker (avg ${(eventImpact).toFixed(1)}%).`
      );
    } else {
      notes.push(`Recent events had a broadly neutral impact on this ticker.`);
    }
  } else {
    notes.push("No significant market events affected this ticker in the past 12 days.");
  }

  // Volatility assessment (higher vol = higher risk = Sentinel is more cautious)
  const closes = asset.priceHistory.map((p) => p.close);
  const atrVal = atr(asset.priceHistory);
  if (atrVal !== null && asset.currentPrice > 0) {
    const atrPct = atrVal / asset.currentPrice;
    if (atrPct > 0.08) {
      score -= 12;
      notes.push(`Elevated daily ATR of ${formatPercent(atrPct, false)} raises risk-adjusted concern.`);
    } else if (atrPct < 0.02) {
      score += 6;
      notes.push(`Low volatility profile (ATR ${formatPercent(atrPct, false)}) supports a stable risk rating.`);
    }
  }

  // RSI extreme as a risk flag (overbought = event selloff risk)
  const rsiVal = rsi(closes);
  if (rsiVal !== null && rsiVal > 72) {
    score -= 8;
    notes.push("Technical overbought conditions increase the risk of a sharp event-triggered selloff.");
  } else if (rsiVal !== null && rsiVal < 28) {
    score += 8;
    notes.push("Oversold positioning may dampen further downside risk from future events.");
  }

  score = clamp(score);

  // Price target: event-adjusted from current price
  const targetMultiplier = recentEvents.length > 0
    ? recentEvents.reduce((acc, e) => acc + (e.actualMultipliers[asset.ticker] ?? 1), 0) / recentEvents.length
    : 1 + asset.trend * 60;
  const target = asset.currentPrice * (0.7 + targetMultiplier * 0.3);

  const rationale = notes.slice(0, 2).join(" ") || "Risk profile appears stable with no major event pressure.";

  return { score, target: Math.max(0.01, target), rationale };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function computeAnalystCoverage(
  asset: Asset,
  eventHistory: FiredEvent[],
  currentDay: number
): AnalystCoverage {
  const apexResult    = apexScore(asset);
  const momResult     = momentumScore(asset);
  const sentinelResult = sentinelScore(asset, eventHistory, currentDay);

  const views: [AnalystView, AnalystView, AnalystView] = [
    {
      firmId: "apex",
      rating: scoreToRating(apexResult.score),
      score: apexResult.score,
      priceTarget: apexResult.target,
      rationale: apexResult.rationale,
    },
    {
      firmId: "momentum",
      rating: scoreToRating(momResult.score),
      score: momResult.score,
      priceTarget: momResult.target,
      rationale: momResult.rationale,
    },
    {
      firmId: "sentinel",
      rating: scoreToRating(sentinelResult.score),
      score: sentinelResult.score,
      priceTarget: sentinelResult.target,
      rationale: sentinelResult.rationale,
    },
  ];

  const consensusScore = (apexResult.score + momResult.score + sentinelResult.score) / 3;
  const consensusTarget = (apexResult.target + momResult.target + sentinelResult.target) / 3;

  return {
    views,
    consensusRating: scoreToRating(consensusScore),
    consensusScore,
    consensusTarget,
  };
}

export function hasAnalystAccess(
  ticker: string,
  analystUnlocks: string[] | undefined | null,
  analystSubscription: { purchasedDay: number } | null | undefined,
  currentDay: number
): boolean {
  if (analystSubscription && currentDay - analystSubscription.purchasedDay < 7) return true;
  return (analystUnlocks ?? []).includes(ticker);
}

export const ANALYST_SINGLE_COST = 100;
export const ANALYST_SUB_COST = 10_000;
export const ANALYST_SUB_DAYS = 7;
