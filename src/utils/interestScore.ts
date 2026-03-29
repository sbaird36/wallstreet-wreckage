import type { Portfolio, MarketIndex } from "@/types";

const STARTING_CAPITAL = 10_000;
const HEDGE_FUND_THRESHOLD = 50_000_000;

/**
 * Computes an "interest score" from 0–100 representing how much the
 * hedge fund community cares about your track record.
 *
 * Factors:
 *  - Alpha vs the SNP499 broad market (up to 70 pts)
 *  - Portfolio size — bigger AUM = more credibility (up to 30 pts)
 */
export function computeInterestScore(
  portfolio: Portfolio,
  netWorth: number,
  snp499: MarketIndex | undefined
): number {
  // Portfolio total return
  const portfolioReturn = (netWorth - STARTING_CAPITAL) / STARTING_CAPITAL;

  // Market return since game start
  let marketReturn = 0;
  if (snp499 && snp499.startingValue > 0) {
    marketReturn = (snp499.currentValue - snp499.startingValue) / snp499.startingValue;
  }

  // Alpha (outperformance over market)
  const alpha = portfolioReturn - marketReturn;

  // Alpha contribution: 100% alpha = 70 pts (capped)
  const alphaScore = Math.min(Math.max(alpha * 100, 0), 70);

  // Size contribution: log scale from $10k (0) → $50M (30)
  const sizeScore =
    netWorth > STARTING_CAPITAL
      ? Math.min(
          (Math.log10(netWorth / STARTING_CAPITAL) /
            Math.log10(HEDGE_FUND_THRESHOLD / STARTING_CAPITAL)) *
            30,
          30
        )
      : 0;

  return Math.min(Math.max(alphaScore + sizeScore, 0), 100);
}

export function canFoundHedgeFund(netWorth: number): boolean {
  return netWorth >= HEDGE_FUND_THRESHOLD;
}

export { HEDGE_FUND_THRESHOLD };
