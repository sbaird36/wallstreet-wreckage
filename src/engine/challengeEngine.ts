import type { DailyChallenge, ChallengeType } from "@/types";

const CHALLENGE_POOL: Array<{ type: ChallengeType; description: string; xpReward: number; cashReward: number }> = [
  { type: "make_trade",       description: "Make any trade today",                  xpReward: 25,  cashReward: 0 },
  { type: "buy_penny",        description: "Buy a penny stock",                     xpReward: 40,  cashReward: 100 },
  { type: "buy_crypto",       description: "Buy any cryptocurrency",                xpReward: 30,  cashReward: 0 },
  { type: "sell_profit",      description: "Sell a position at a profit",            xpReward: 50,  cashReward: 0 },
  { type: "big_win",          description: "Sell for 10%+ profit",                  xpReward: 100, cashReward: 250 },
  { type: "hold_diversified", description: "Hold 3 or more different assets",        xpReward: 35,  cashReward: 0 },
  { type: "portfolio_up",     description: "End the day with your portfolio up",     xpReward: 60,  cashReward: 0 },
];

// Seeded RNG based on day
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateDailyChallenges(day: number): DailyChallenge[] {
  const rng = seededRandom(day * 31337);
  const pool = [...CHALLENGE_POOL];
  const chosen: typeof CHALLENGE_POOL = [];
  // Pick 3 unique types
  while (chosen.length < 3 && pool.length > 0) {
    const idx = Math.floor(rng() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen.map((c, i) => ({
    id: `challenge_${day}_${i}`,
    day,
    ...c,
    completed: false,
  }));
}

// Check which trade-based challenges complete on this trade action
export function checkTradeChallenges(
  challenges: DailyChallenge[],
  tradeDay: number,
  tradeAction: "BUY" | "SELL",
  assetType: "stock" | "crypto",
  isPenny: boolean,
  returnPct: number | null,  // null for buys
): DailyChallenge[] {
  return challenges.map((c) => {
    if (c.completed || c.day !== tradeDay) return c;
    let complete = false;
    if (c.type === "make_trade") complete = true;
    if (c.type === "buy_penny" && tradeAction === "BUY" && isPenny) complete = true;
    if (c.type === "buy_crypto" && tradeAction === "BUY" && assetType === "crypto") complete = true;
    if (c.type === "sell_profit" && tradeAction === "SELL" && returnPct !== null && returnPct > 0) complete = true;
    if (c.type === "big_win" && tradeAction === "SELL" && returnPct !== null && returnPct >= 0.10) complete = true;
    return complete ? { ...c, completed: true } : c;
  });
}

// Check portfolio/day-based challenges at day advance
export function checkDayChallenges(
  challenges: DailyChallenge[],
  currentDay: number,
  holdingCount: number,
  portfolioUp: boolean,
): DailyChallenge[] {
  return challenges.map((c) => {
    if (c.completed || c.day !== currentDay) return c;
    let complete = false;
    if (c.type === "hold_diversified" && holdingCount >= 3) complete = true;
    if (c.type === "portfolio_up" && portfolioUp) complete = true;
    return complete ? { ...c, completed: true } : c;
  });
}
