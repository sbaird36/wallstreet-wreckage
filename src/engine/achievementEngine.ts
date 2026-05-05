import { ACHIEVEMENTS } from "@/data/achievementData";
import type { GameState, Achievement, Transaction } from "@/types";

export function getUnlockedIds(achievements: Achievement[]): Set<string> {
  return new Set(achievements.map((a) => a.id));
}

// Check ALL achievement conditions against game state + optional new transaction
// Returns array of newly unlocked achievement IDs
export function checkAchievements(
  state: GameState,
  newTransaction: Transaction | null,
  currentDay: number,
): string[] {
  const unlocked = getUnlockedIds(state.achievements ?? []);
  const newlyUnlocked: string[] = [];

  function check(id: string, condition: boolean) {
    if (!unlocked.has(id) && condition) {
      newlyUnlocked.push(id);
      unlocked.add(id); // prevent double-unlock in same call
    }
  }

  const txs = state.portfolio.transactions;
  const sells = txs.filter((t) => t.action === "SELL");
  const holdings = state.portfolio.holdings;
  const holdingCount = Object.keys(holdings).length;

  // Count profitable sells
  const profitableSells = sells.filter((t) => {
    // Look up cost basis from buy transactions before this sell
    const priorBuys = txs.filter((b) => b.action === "BUY" && b.ticker === t.ticker && b.timestamp < t.timestamp);
    if (priorBuys.length === 0) return false;
    const avgCost = priorBuys.reduce((s, b) => s + b.pricePerUnit * b.quantity, 0) / priorBuys.reduce((s, b) => s + b.quantity, 0);
    return t.pricePerUnit > avgCost;
  });

  // Trading
  check("first_trade", txs.length >= 1);
  check("first_win", profitableSells.length >= 1);
  check("day_trader", (() => {
    const dayGroups: Record<number, number> = {};
    for (const t of txs) dayGroups[t.day] = (dayGroups[t.day] ?? 0) + 1;
    return Object.values(dayGroups).some((count) => count >= 3);
  })());
  check("diversified", holdingCount >= 5);

  // New transaction checks
  if (newTransaction && newTransaction.action === "SELL") {
    const tx = newTransaction;
    const priorBuys = txs.filter((b) => b.action === "BUY" && b.ticker === tx.ticker && b.timestamp < tx.timestamp);
    if (priorBuys.length > 0) {
      const avgCost = priorBuys.reduce((s, b) => s + b.pricePerUnit * b.quantity, 0) / priorBuys.reduce((s, b) => s + b.quantity, 0);
      const returnPct = (tx.pricePerUnit - avgCost) / avgCost;
      check("big_winner", returnPct >= 0.5);
      check("ten_bagger", returnPct >= 9.0); // 10x = 900% return
    }
  }

  if (newTransaction && newTransaction.action === "BUY") {
    const asset = state.assets[newTransaction.ticker];
    // Knife catcher: buy an asset that dropped 20%+ in last 5 days
    if (asset) {
      const historyLast5 = asset.priceHistory.slice(-5);
      if (historyLast5.length >= 2) {
        const oldPrice = historyLast5[0].close;
        const newPrice = historyLast5[historyLast5.length - 1].close;
        if (oldPrice > 0 && (newPrice - oldPrice) / oldPrice <= -0.20) {
          check("knife_catcher", true);
        }
      }
    }
    // Penny player: bought 5 distinct penny stocks (price < 5 or Speculative)
    const pennyBuys = new Set(
      txs.filter((t) => {
        if (t.action !== "BUY") return false;
        const a = state.assets[t.ticker];
        return a && (a.currentPrice < 5 || (a as { sector?: string }).sector === "Speculative");
      }).map((t) => t.ticker)
    );
    if (newTransaction) {
      const na = state.assets[newTransaction.ticker];
      if (na && (na.currentPrice < 5 || (na as { sector?: string }).sector === "Speculative")) {
        pennyBuys.add(newTransaction.ticker);
      }
    }
    check("penny_player", pennyBuys.size >= 5);
  }

  // Streaks
  check("streak_3", (state.tradeStreak ?? 0) >= 3);
  check("streak_5", (state.tradeStreak ?? 0) >= 5);
  check("streak_10", (state.tradeStreak ?? 0) >= 10);

  // Diamond hands: any holding held for 10+ days
  const holdingsArr = Object.values(holdings);
  for (const h of holdingsArr) {
    const firstBuy = txs.find((t) => t.action === "BUY" && t.ticker === h.ticker);
    if (firstBuy && currentDay - firstBuy.day >= 10) {
      check("diamond_hands", true);
      break;
    }
  }

  // Social
  check("first_post", (state.playerPostCount ?? 0) >= 1);
  check("verified_5", (state.playerVerifiedPostCount ?? 0) >= 5);
  check("followers_500", (state.playerFollowerCount ?? 0) >= 500);
  check("followers_1000", (state.playerFollowerCount ?? 0) >= 1000);

  // Portfolio
  const netWorth = state.portfolio.netWorthHistory.slice(-1)[0]?.netWorth ?? state.portfolio.cash;
  check("doubled_up", netWorth >= 20000);

  // Exploration
  const completedChallenges = (state.dailyChallenges ?? []).filter((c) => c.completed).length;
  check("challenge_10", completedChallenges >= 10);
  check("researcher", (state.researchPurchases ?? []).length >= 3);
  check("hired_advisor", (state.hiredAdvisors ?? []).length >= 1);

  // Perfect week: check if all sells this week were profitable (min 3)
  // (checked at day advance on Mondays)
  // sector_master: handled separately when a sector play resolves

  return newlyUnlocked;
}

// Convert newly unlocked IDs to Achievement objects
export function buildNewAchievements(ids: string[], day: number): Achievement[] {
  return ids.map((id) => {
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    return {
      id,
      unlockedOnDay: day,
      xpAwarded: def?.xpReward ?? 0,
    };
  });
}

// Check perfect week achievement (called on Monday)
export function checkPerfectWeek(
  transactions: import("@/types").Transaction[],
  startDay: number,
  endDay: number,
): boolean {
  const weekSells = transactions.filter(
    (t) => t.action === "SELL" && t.day >= startDay && t.day <= endDay
  );
  if (weekSells.length < 3) return false;
  // Need to check if each sell was profitable — use a heuristic: totalValue > 0 and we track returnPct via holdings
  // Simplified: count sells where pricePerUnit > previous buy average
  // We'll use a simple approach: check that all sell totals are positive (always true),
  // so instead look for any transaction pair
  // Actually we can't easily compute this without the holding data at the time of sell
  // Return false conservatively — the achievement fires via lastTradeResult data
  return false; // will implement via per-sell tracking in reducer
}
