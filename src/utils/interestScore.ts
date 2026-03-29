import type { Portfolio, MarketIndex } from "@/types";

const STARTING_CAPITAL = 10_000;
const HEDGE_FUND_THRESHOLD = 50_000_000;

/**
 * Computes an "interest score" from 0–100 representing how much the
 * hedge fund community cares about your track record.
 *
 * Deliberately slow — designed so the first quarter of trading generates
 * zero interest, and meaningful scores only emerge after sustained
 * outperformance over many months.
 *
 * Factors:
 *  - Hard gate: no score before day 63 (one trading quarter)
 *  - Positive alpha vs SNP499 required to build any score (up to 70 pts)
 *  - Track record multiplier: ramps from 0 (day 63) to 1.0 (day 504 ≈ 2 years)
 *  - Portfolio size — bigger AUM adds credibility (up to 30 pts, also gated)
 */
export function computeInterestScore(
  portfolio: Portfolio,
  netWorth: number,
  snp499: MarketIndex | undefined,
  currentDay: number
): number {
  // Hard gate: zero interest for the first quarter of trading
  if (currentDay < 63) return 0;

  // Portfolio total return since game start
  const portfolioReturn = (netWorth - STARTING_CAPITAL) / STARTING_CAPITAL;

  // Market return since game start
  let marketReturn = 0;
  if (snp499 && snp499.startingValue > 0) {
    marketReturn = (snp499.currentValue - snp499.startingValue) / snp499.startingValue;
  }

  // Alpha (outperformance over market) — must be positive to build any score
  const alpha = portfolioReturn - marketReturn;
  if (alpha <= 0) return 0;

  // Track record multiplier: 0 at day 63, reaches 1.0 at day 504 (≈ 2 years).
  // This means even perfect alpha is heavily discounted until you have real history.
  const trackRecord = Math.min((currentDay - 63) / 441, 1.0);

  // Alpha contribution (up to 70 pts):
  // Requires substantial sustained alpha — 87.5% alpha fully maxes this out.
  // At 10% alpha you get 8 raw pts; at 25% you get 20 raw pts.
  const alphaScore = Math.min(alpha * 80, 70);

  // Size contribution (up to 30 pts): log scale, same as before.
  // Only starts to matter once you have meaningful AUM.
  const sizeScore =
    netWorth > STARTING_CAPITAL
      ? Math.min(
          (Math.log10(netWorth / STARTING_CAPITAL) /
            Math.log10(HEDGE_FUND_THRESHOLD / STARTING_CAPITAL)) *
            30,
          30
        )
      : 0;

  return Math.min(Math.max((alphaScore + sizeScore) * trackRecord, 0), 100);
}

export function canFoundHedgeFund(netWorth: number): boolean {
  return netWorth >= HEDGE_FUND_THRESHOLD;
}

export { HEDGE_FUND_THRESHOLD };
