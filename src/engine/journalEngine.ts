import type { GameState, JournalEntry } from "@/types";

function generateNarrative(
  tradeDelta: number,
  tradeCount: number,
  bestTicker: string | null,
  bestPct: number | null,
  worstTicker: string | null,
  worstPct: number | null,
): string {
  const performance = tradeDelta > 0 ? "green" : tradeDelta < 0 ? "red" : "flat";

  const openers: Record<string, string[]> = {
    green: [
      "Solid week.",
      "The market cooperated this week.",
      "A profitable run.",
      "Strong showing this week.",
    ],
    red: [
      "Tough week.",
      "The market had other plans.",
      "A week to forget — or learn from.",
      "Not every week goes your way.",
    ],
    flat: [
      "Quiet week.",
      "The market moved sideways.",
      "Mostly a holding week.",
    ],
  };

  const opener = openers[performance][Math.floor(Math.random() * openers[performance].length)];
  const parts: string[] = [opener];

  if (tradeCount === 0) {
    parts.push("No trades placed — a patience play.");
  } else if (tradeCount === 1) {
    parts.push("One trade placed.");
  } else {
    parts.push(`${tradeCount} trades placed.`);
  }

  if (bestTicker && bestPct !== null && bestPct > 0.05) {
    parts.push(`Best call: ${bestTicker} (+${(bestPct * 100).toFixed(1)}%).`);
  }
  if (worstTicker && worstPct !== null && worstPct < -0.05) {
    parts.push(`Hardest hit: ${worstTicker} (${(worstPct * 100).toFixed(1)}%).`);
  }

  return parts.join(" ");
}

export function generateJournalEntry(
  state: GameState,
  weekNumber: number,
  startDay: number,
  endDay: number,
  netWorthStart: number,
  netWorthEnd: number,
  achievementsThisWeek: string[],
): JournalEntry {
  const weekTxs = state.portfolio.transactions.filter(
    (t) => t.day >= startDay && t.day <= endDay
  );

  // Find best and worst sells this week
  const weekSells = weekTxs.filter((t) => t.action === "SELL");
  let bestTrade: { ticker: string; returnPct: number } | null = null;
  let worstTrade: { ticker: string; returnPct: number } | null = null;

  for (const sell of weekSells) {
    // Find most recent buy of same ticker before this sell
    const priorBuys = state.portfolio.transactions.filter(
      (t) => t.action === "BUY" && t.ticker === sell.ticker && t.timestamp < sell.timestamp
    );
    if (priorBuys.length === 0) continue;
    const avgCost = priorBuys.reduce((s, b) => s + b.pricePerUnit * b.quantity, 0) /
      priorBuys.reduce((s, b) => s + b.quantity, 0);
    const returnPct = (sell.pricePerUnit - avgCost) / avgCost;

    if (bestTrade === null || returnPct > bestTrade.returnPct) {
      bestTrade = { ticker: sell.ticker, returnPct };
    }
    if (worstTrade === null || returnPct < worstTrade.returnPct) {
      worstTrade = { ticker: sell.ticker, returnPct };
    }
  }

  const changePct = netWorthStart > 0 ? (netWorthEnd - netWorthStart) / netWorthStart : 0;
  const challengesCompleted = (state.dailyChallenges ?? [])
    .filter((c) => c.day >= startDay && c.day <= endDay && c.completed).length;

  return {
    weekNumber,
    startDay,
    endDay,
    netWorthStart,
    netWorthEnd,
    changePct,
    tradeCount: weekTxs.length,
    bestTrade,
    worstTrade,
    narrative: generateNarrative(
      netWorthEnd - netWorthStart,
      weekTxs.length,
      bestTrade?.ticker ?? null,
      bestTrade?.returnPct ?? null,
      worstTrade?.ticker ?? null,
      worstTrade?.returnPct ?? null,
    ),
    challengesCompleted,
    achievementsUnlocked: achievementsThisWeek,
  };
}
