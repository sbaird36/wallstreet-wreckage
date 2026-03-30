import type { GameState, Asset, Portfolio, MarketIndex } from "@/types";
import { randomBetween } from "@/utils/math";

// Followers needed before posts have any price effect
const FOLLOWER_PRICE_THRESHOLD = 50;
// Hard cap on per-ticker price influence per day (2%)
const MAX_PRICE_INFLUENCE = 0.02;

const STARTING_CAPITAL = 10_000;

// ─── Follower count (performance-based) ──────────────────────────────────────

/**
 * Computes an absolute follower count based on trading performance vs the
 * SNP499 market index. Mirrors the hedge fund interest score system — no
 * followers before one quarter of play, and meaningful counts only emerge
 * after sustained outperformance over multiple quarters.
 *
 * Hard gate: day 63 (one quarter)
 * Positive alpha required — underperforming the market gives zero followers
 * Track record ramp: 0 at day 63, full at day 756 (~3 years) — slower than
 *   hedge fund interest to reflect how long financial credibility takes to build
 *
 * Follower scale (exponential):
 *   score=15 → ~56 followers  (just over the price-influence threshold)
 *   score=40 → ~1,000 followers
 *   score=50 → ~3,162 followers
 *   score=100 → ~1,000,000 followers
 */
export function computeFollowerCount(
  portfolio: Portfolio,
  netWorth: number,
  snp499: MarketIndex | undefined,
  currentDay: number
): number {
  if (currentDay < 63) return 0;

  const portfolioReturn = (netWorth - STARTING_CAPITAL) / STARTING_CAPITAL;

  let marketReturn = 0;
  if (snp499 && snp499.startingValue > 0) {
    marketReturn = (snp499.currentValue - snp499.startingValue) / snp499.startingValue;
  }

  const alpha = portfolioReturn - marketReturn;
  if (alpha <= 0) return 0;

  // Track record: 0 at day 63, reaches 1.0 at day 756 (3 years of trading)
  const trackRecord = Math.min((currentDay - 63) / 693, 1.0);

  // Alpha-only score — followers reflect performance, not portfolio size
  const alphaScore = Math.min(alpha * 80, 70);
  const score = alphaScore * trackRecord;

  if (score <= 0) return 0;

  // Exponential conversion: score/20 + 1 as the exponent
  return Math.round(Math.pow(10, score / 20 + 1.0));
}

// ─── NPC upvotes on player posts ─────────────────────────────────────────────

/**
 * Returns upvote increments to apply to player posts today.
 * A fraction of your followers will upvote each active post, making popular
 * posts naturally rise through the feed over several days.
 */
export function computeNpcVotesOnPlayerPosts(
  state: GameState,
  day: number
): Array<{ postId: string; votes: number }> {
  const followers = state.playerFollowerCount ?? 0;
  if (followers === 0) return [];

  const activePosts = (state.blogFeed ?? []).filter(
    (p) => p.isPlayerPost && p.day <= day && day - p.day <= 5
  );
  if (activePosts.length === 0) return [];

  const result: Array<{ postId: string; votes: number }> = [];

  for (const post of activePosts) {
    const ageDays = day - post.day;
    const ageDecay = Math.max(0, 1 - ageDays * 0.22);

    // Engagement rate: caps at ~30% of followers, scales with reach
    const engagementRate = Math.min(0.3, followers / 400) * ageDecay;
    if (engagementRate < 0.01) continue;

    // Random engagement roll — not every day every follower acts
    if (Math.random() > engagementRate * 3) continue;

    const votes = Math.max(1, Math.round(
      followers * engagementRate * randomBetween(0.04, 0.12)
    ));
    result.push({ postId: post.id, votes });
  }

  return result;
}

// ─── Price influence ──────────────────────────────────────────────────────────

/**
 * Returns additional price multipliers (as fractional additions, e.g. 0.008 = +0.8%)
 * for tickers mentioned in recent influential player posts.
 *
 * Scale:
 *   50  followers: ~0.05% max (essentially noise)
 *   100 followers: ~0.10%
 *   500 followers: ~0.50%
 *  1000 followers: ~1.00%
 *  2000 followers: ~2.00% (hard cap)
 *
 * Flair modifiers:
 *   YOLO: ×1.5  DD: ×1.2  Meme: ×1.0  Discussion: ×0.7  Shitpost: ×0.3
 */
export function computePlayerPostMultipliers(
  state: GameState,
  day: number
): Record<string, number> {
  const followers = state.playerFollowerCount ?? 0;
  if (followers < FOLLOWER_PRICE_THRESHOLD) return {};

  const FLAIR_WEIGHT: Record<string, number> = {
    YOLO: 1.5,
    DD: 1.2,
    Meme: 1.0,
    News: 1.0,
    Discussion: 0.7,
    Shitpost: 0.3,
  };

  const influentialPosts = (state.blogFeed ?? []).filter(
    (p) =>
      p.isPlayerPost &&
      p.linkedTickers.length > 0 &&
      p.day <= day &&
      day - p.day <= 3
  );

  if (influentialPosts.length === 0) return {};

  const result: Record<string, number> = {};

  // Base influence scales from 0 at 50 followers to MAX_PRICE_INFLUENCE at 2000
  const baseInfluence =
    Math.min(MAX_PRICE_INFLUENCE, ((followers - 50) / 1950) * MAX_PRICE_INFLUENCE);

  for (const post of influentialPosts) {
    const netScore = post.upvotes - post.downvotes;
    if (netScore <= 0) continue; // negative sentiment doesn't pump

    const ageDays = day - post.day;
    const ageDecay = Math.max(0, 1 - ageDays * 0.38);
    const scoreBoost = Math.min(2.5, 1 + netScore / 30);
    const flairWeight = FLAIR_WEIGHT[post.flair] ?? 1.0;

    const influence = baseInfluence * scoreBoost * ageDecay * flairWeight;

    for (const ticker of post.linkedTickers) {
      if (state.assets[ticker]) {
        result[ticker] = Math.min(
          MAX_PRICE_INFLUENCE,
          (result[ticker] ?? 0) + influence
        );
      }
    }
  }

  return result;
}

// ─── Apply multipliers to computed assets ────────────────────────────────────

/**
 * Applies player-post price influence to an already-computed set of assets.
 * Call this *after* computeNewPrices so normal market dynamics happen first.
 */
export function applyPlayerInfluenceToAssets(
  assets: Record<string, Asset>,
  multipliers: Record<string, number>
): Record<string, Asset> {
  if (Object.keys(multipliers).length === 0) return assets;

  const result = { ...assets };

  for (const [ticker, additiveMult] of Object.entries(multipliers)) {
    const asset = result[ticker];
    if (!asset) continue;

    const adjustedPrice = asset.currentPrice * (1 + additiveMult);
    const history = [...asset.priceHistory];

    // Patch the close of the last OHLC bar to match the adjusted price
    if (history.length > 0) {
      const last = history[history.length - 1];
      history[history.length - 1] = {
        ...last,
        close: adjustedPrice,
        high: Math.max(last.high, adjustedPrice),
      };
    }

    result[ticker] = {
      ...asset,
      currentPrice: adjustedPrice,
      priceHistory: history,
    };
  }

  return result;
}
