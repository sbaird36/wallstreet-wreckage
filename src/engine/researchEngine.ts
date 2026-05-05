import type { GameState, ResearchType } from "@/types";

export const RESEARCH_COSTS: Record<ResearchType, number> = {
  earnings_preview: 500,
  insider_flow: 1000,
  macro_report: 2000,
  sentiment_scan: 750,
};

export const RESEARCH_LABELS: Record<ResearchType, string> = {
  earnings_preview: "Earnings Preview",
  insider_flow: "Insider Flow Alert",
  macro_report: "Macro Report",
  sentiment_scan: "Sentiment Scan",
};

// Seeded PRNG
function seededRng(seed: number): () => number {
  let s = (seed ^ 0xcafebabe) >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateResearchResult(
  state: GameState,
  type: ResearchType,
  ticker: string | null,
  day: number,
): { result: string; direction: "bullish" | "bearish" | "neutral" | null } {
  const rng = seededRng(day * 9973 + (ticker ? ticker.charCodeAt(0) * 7 : 0) + type.charCodeAt(0));

  if (type === "earnings_preview" && ticker) {
    const asset = state.assets[ticker];
    if (!asset || asset.type !== "stock") {
      return { result: "No earnings data available for this asset.", direction: null };
    }
    const stock = asset as { trend?: number };
    // Use trend to determine earnings direction with some noise
    const isBullish = (stock.trend ?? 0) > 0 ? rng() > 0.3 : rng() > 0.7;
    const magnitude = isBullish
      ? ["slight beat", "solid beat", "massive beat"][Math.floor(rng() * 3)]
      : ["slight miss", "miss", "big miss"][Math.floor(rng() * 3)];
    return {
      result: `Earnings Preview for ${ticker}: Our sources suggest a ${magnitude} vs. consensus estimates. Analyst sentiment is ${isBullish ? "cautiously optimistic" : "concerned"}.`,
      direction: isBullish ? "bullish" : "bearish",
    };
  }

  if (type === "insider_flow" && ticker) {
    const asset = state.assets[ticker];
    if (!asset) return { result: "No data found for this ticker.", direction: null };
    const recentHistory = asset.priceHistory.slice(-3);
    const trend = recentHistory.length >= 2
      ? recentHistory[recentHistory.length - 1].close - recentHistory[0].close
      : 0;
    const isBullish = trend > 0 ? rng() > 0.25 : rng() > 0.65;
    const actions = isBullish
      ? ["significant accumulation", "unusual call option activity", "large block buys"]
      : ["distribution pattern", "put option spike", "insider selling pressure"];
    const action = actions[Math.floor(rng() * actions.length)];
    return {
      result: `Insider Flow for ${ticker}: Dark pool data shows ${action} over the last 48 hours. Smart money appears to be ${isBullish ? "loading up" : "de-risking"}.`,
      direction: isBullish ? "bullish" : "bearish",
    };
  }

  if (type === "macro_report") {
    const sectors = ["Technology", "Banking", "Healthcare", "Energy", "Consumer"];
    const sector = sectors[Math.floor(rng() * sectors.length)];
    const isBullish = rng() > 0.45;
    return {
      result: `Macro Report: Leading indicators point to ${isBullish ? "strength" : "headwinds"} in the ${sector} sector this week. Fed commentary suggests ${rng() > 0.5 ? "dovish" : "hawkish"} posture. Watch for volatility around mid-week macro releases.`,
      direction: isBullish ? "bullish" : "neutral",
    };
  }

  if (type === "sentiment_scan" && ticker) {
    const asset = state.assets[ticker];
    if (!asset) return { result: "No sentiment data for this ticker.", direction: null };
    const isBullish = (asset as { trend?: number }).trend ?? 0 > 0 ? rng() > 0.35 : rng() > 0.6;
    const volume = ["light", "moderate", "heavy"][Math.floor(rng() * 3)];
    return {
      result: `Sentiment Scan for ${ticker}: ${volume} social media volume detected. Tone is predominantly ${isBullish ? "bullish — users predicting upside" : "bearish — users expecting a dip"}. ${isBullish ? "Multiple WSB threads" : "Negative sentiment spreading"} in the last 24 hours.`,
      direction: isBullish ? "bullish" : "bearish",
    };
  }

  return { result: "Report data unavailable.", direction: null };
}
