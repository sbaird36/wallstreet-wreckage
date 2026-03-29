import type { Asset, MarketIndex } from "@/types";
import { INDEX_DEFINITIONS } from "@/data/indexes";

function constituentAvg(constituents: string[], assets: Record<string, Asset>): number {
  const prices = constituents
    .map((t) => assets[t]?.currentPrice ?? null)
    .filter((p): p is number => p !== null);
  if (prices.length === 0) return 1;
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}

/** Build the initial index records from starting asset prices. */
export function buildInitialIndexes(
  assets: Record<string, Asset>,
  currentDay: number
): Record<string, MarketIndex> {
  const indexes: Record<string, MarketIndex> = {};

  for (const def of INDEX_DEFINITIONS) {
    const baseAvgPrice = constituentAvg(def.constituents, assets);
    indexes[def.id] = {
      ...def,
      currentValue: def.startingValue,
      previousValue: def.startingValue,
      baseAvgPrice,
      history: [{ day: currentDay, value: def.startingValue }],
    };
  }

  return indexes;
}

/** Recompute all index values after a day advance. */
export function advanceIndexes(
  indexes: Record<string, MarketIndex>,
  newAssets: Record<string, Asset>,
  newDay: number
): Record<string, MarketIndex> {
  const result: Record<string, MarketIndex> = {};

  for (const [id, index] of Object.entries(indexes)) {
    const currentAvg = constituentAvg(index.constituents, newAssets);
    const newValue = index.startingValue * (currentAvg / index.baseAvgPrice);

    result[id] = {
      ...index,
      previousValue: index.currentValue,
      currentValue: newValue,
      history: [...index.history, { day: newDay, value: newValue }].slice(-365),
    };
  }

  return result;
}
