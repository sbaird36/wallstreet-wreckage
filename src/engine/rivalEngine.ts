import { RIVALS } from "@/data/rivalData";

const STARTING_CAPITAL = 10_000;

// Seeded PRNG
function seededRandom(seed: number): () => number {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => {
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s = Math.imul(s ^ (s >>> 16), 0x45d9f3b);
    s ^= s >>> 16;
    return (s >>> 0) / 0xffffffff;
  };
}

function normalRandom(rng: () => number, mean: number, std: number): number {
  // Box-Muller transform
  const u1 = Math.max(1e-10, rng());
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + std * z;
}

// Compute rival net worth for a given week number (1-indexed)
export function computeRivalNetWorth(rivalId: string, weekNumber: number): number {
  const rival = RIVALS.find((r) => r.id === rivalId);
  if (!rival) return STARTING_CAPITAL;

  let netWorth = STARTING_CAPITAL;
  const rng = seededRandom(rivalId.charCodeAt(1) * 7919 + rivalId.charCodeAt(0) * 31);

  for (let w = 1; w <= weekNumber; w++) {
    const weekReturn = normalRandom(rng, rival.weeklyReturnMean, rival.weeklyReturnStd);
    // Clamp to -40% to +50% per week
    const clamped = Math.max(-0.4, Math.min(0.5, weekReturn));
    netWorth *= 1 + clamped;
    netWorth = Math.max(100, netWorth); // can't go below $100
  }

  return Math.round(netWorth * 100) / 100;
}

// Compute all rival net worths for a given week
export function computeAllRivalNetWorths(weekNumber: number): Record<string, number> {
  const result: Record<string, number> = {};
  for (const rival of RIVALS) {
    result[rival.id] = computeRivalNetWorth(rival.id, weekNumber);
  }
  return result;
}
