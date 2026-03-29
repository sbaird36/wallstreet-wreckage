import type { MarketEvent, Asset, Sector } from "@/types";

// ─── Company Recommendations ──────────────────────────────────────────────────

export interface CompanyRecommendation {
  ticker: string;
  name: string;
  type: "stock" | "crypto";
  href: string;
  signal: "bullish" | "bearish" | "watch";
  reason: string;
}

/** Sectors that benefit from bullish macro/market events */
const GROWTH_SECTORS: Sector[] = ["Technology", "Electric Vehicles", "E-Commerce", "Space", "Streaming", "Fintech"];
/** Sectors that hold up better during bearish macro events */
const DEFENSIVE_SECTORS: Sector[] = ["Healthcare", "Banking", "Fast Food", "Retail"];

function assetHref(asset: Asset): string {
  return asset.type === "stock" ? `/stock/${asset.ticker}` : `/crypto/${asset.ticker}`;
}

/**
 * Returns a list of specific companies to watch given a fired event and the
 * current game assets. Logic is:
 *   - Specific ticker targets → those companies
 *   - Sector targets → all companies in the affected sectors
 *   - All-crypto events → all crypto assets
 *   - All-stock events → growth stocks for bullish, defensive for bearish
 *   - Broad world/market events → sector-based rotation suggestions
 */
export function getCompanyRecommendations(
  event: MarketEvent,
  assets: Record<string, Asset>
): CompanyRecommendation[] {
  const allAssets = Object.values(assets);
  const isBullish = event.sentiment === "BULLISH" || event.sentiment === "VERY_BULLISH";
  const isBearish = event.sentiment === "BEARISH" || event.sentiment === "VERY_BEARISH";
  const signal: CompanyRecommendation["signal"] = isBullish ? "bullish" : isBearish ? "bearish" : "watch";

  // 1. Specific tickers targeted by the event
  if (event.effect.targetTickers?.length) {
    return event.effect.targetTickers
      .map((t) => assets[t])
      .filter(Boolean)
      .map((a) => ({
        ticker: a.ticker,
        name: a.name,
        type: a.type,
        href: assetHref(a),
        signal,
        reason: isBullish ? "Direct beneficiary — check for entry opportunity"
          : isBearish ? "Directly impacted — review your position"
          : "High volatility expected — monitor closely",
      }));
  }

  // 2. Sector-targeted events
  if (event.effect.targetSectors?.length) {
    const sectors = new Set(event.effect.targetSectors);
    const sectorAssets = allAssets
      .filter((a) => a.type === "stock" && sectors.has(a.sector))
      .map((a) => ({
        ticker: a.ticker,
        name: a.name,
        type: a.type as "stock",
        href: assetHref(a),
        signal,
        reason: isBullish
          ? `${(a as Extract<Asset, { type: "stock" }>).sector} sector tailwind — consider building a position`
          : isBearish
          ? `${(a as Extract<Asset, { type: "stock" }>).sector} sector headwind — consider reducing exposure`
          : `In affected ${(a as Extract<Asset, { type: "stock" }>).sector} sector — expect increased volatility`,
      }));
    return sectorAssets;
  }

  // 3. All-crypto event
  if (event.effect.targetType === "crypto") {
    return allAssets
      .filter((a) => a.type === "crypto")
      .map((a) => ({
        ticker: a.ticker,
        name: a.name,
        type: "crypto" as const,
        href: assetHref(a),
        signal,
        reason: isBullish ? "Crypto-wide tailwind — all tokens benefit"
          : isBearish ? "Crypto-wide sell-off expected — review all crypto positions"
          : "Elevated volatility across all crypto",
      }));
  }

  // 4. All-stock market event
  if (event.effect.targetType === "stock") {
    const targetSectors = isBullish ? GROWTH_SECTORS : isBearish ? DEFENSIVE_SECTORS : GROWTH_SECTORS;
    return allAssets
      .filter((a) => a.type === "stock" && targetSectors.includes((a as Extract<Asset, { type: "stock" }>).sector))
      .slice(0, 6)
      .map((a) => ({
        ticker: a.ticker,
        name: a.name,
        type: "stock" as const,
        href: assetHref(a),
        signal,
        reason: isBullish
          ? "Growth sector — outperforms in broad market rallies"
          : isBearish
          ? "Defensive sector — holds up better during market downturns"
          : "Watch for rotation opportunities",
      }));
  }

  // 5. Broad world / market event — no targetType
  if (event.category === "WORLD" || event.category === "MARKET") {
    const focusSectors = isBullish ? GROWTH_SECTORS : isBearish ? DEFENSIVE_SECTORS : [];
    if (focusSectors.length === 0) return [];
    return allAssets
      .filter((a) => a.type === "stock" && focusSectors.includes((a as Extract<Asset, { type: "stock" }>).sector))
      .slice(0, 5)
      .map((a) => ({
        ticker: a.ticker,
        name: a.name,
        type: "stock" as const,
        href: assetHref(a),
        signal,
        reason: isBullish
          ? "Benefits from positive macro environment"
          : "More defensive during macro uncertainty",
      }));
  }

  return [];
}

// ─── Earnings Alerts ──────────────────────────────────────────────────────────

export interface EarningsAlert {
  ticker: string;
  name: string;
  earningsDay: number;
  daysAway: number;
  href: string;
}

/**
 * Returns stocks with earnings releasing within the next `windowDays` game days.
 */
export function getUpcomingEarnings(
  assets: Record<string, Asset>,
  currentDay: number,
  windowDays = 7
): EarningsAlert[] {
  return Object.values(assets)
    .filter((a): a is Extract<Asset, { type: "stock" }> => a.type === "stock")
    .filter((a) => a.earningsDay > currentDay && a.earningsDay <= currentDay + windowDays)
    .sort((a, b) => a.earningsDay - b.earningsDay)
    .map((a) => ({
      ticker: a.ticker,
      name: a.name,
      earningsDay: a.earningsDay,
      daysAway: a.earningsDay - currentDay,
      href: `/stock/${a.ticker}`,
    }));
}

export interface EventEducation {
  mechanism: string;   // Why this type of event moves markets
  watchFor: string;    // What traders should look for as a result
  traderTip: string;   // Actionable guidance
}

/**
 * Generates educational context for a market event based on its
 * category, sentiment, and target type — without requiring a
 * hand-written description per event.
 */
export function getEventEducation(event: MarketEvent): EventEducation {
  const { category, sentiment, effect } = event;
  const isVeryBullish = sentiment === "VERY_BULLISH";
  const isBullish = sentiment === "BULLISH" || isVeryBullish;
  const isVeryBearish = sentiment === "VERY_BEARISH";
  const isBearish = sentiment === "BEARISH" || isVeryBearish;
  const isMixed = sentiment === "MIXED";
  const targetsCrypto = effect.targetType === "crypto";
  const targetsStocks = effect.targetType === "stock";
  const targetsSpecific = (effect.targetTickers?.length ?? 0) > 0;
  const targetsSector = (effect.targetSectors?.length ?? 0) > 0;

  // WORLD events
  if (category === "WORLD") {
    if (isBullish) {
      return {
        mechanism: "Major positive macro events reduce uncertainty and encourage risk-taking. Investors feel more confident putting money to work across all asset classes.",
        watchFor: "Broad market rallies often lift all sectors, but technology and financials tend to outperform in optimistic conditions.",
        traderTip: "Broad macro tailwinds are best captured through diversified exposure rather than single stock bets. Consider positions across multiple sectors.",
      };
    }
    if (isBearish) {
      return {
        mechanism: "Global disruptions increase uncertainty — the market's biggest enemy. When investors can't model the future, they reduce risk exposure and sell equities.",
        watchFor: "In broad market sell-offs, defensive sectors (healthcare, consumer staples) typically hold up better than growth and technology.",
        traderTip: "During macro uncertainty, consider reducing high-P/E growth positions and moving toward companies with strong balance sheets and consistent earnings.",
      };
    }
    return {
      mechanism: "Complex global events create winners and losers simultaneously. Capital rotates rapidly as investors try to identify which sectors benefit and which suffer.",
      watchFor: "Look for secondary effects — who are the indirect beneficiaries or victims? These overlooked moves often present the best opportunities.",
      traderTip: "In mixed macro events, avoid reacting immediately. Wait 1-2 days for the dust to settle before positioning, as initial reactions are often overcorrected.",
    };
  }

  // MARKET events
  if (category === "MARKET") {
    if (isBullish) {
      return {
        mechanism: "Positive market-wide catalysts — like rate cuts or new liquidity — lower the cost of capital and increase the present value of future earnings, pushing all stocks higher.",
        watchFor: "Growth stocks (high P/E, high beta) tend to benefit most from positive market-wide events. They have longer earnings horizons, so lower discount rates help them disproportionately.",
        traderTip: "Market-wide rallies reward being fully invested. If you've been holding cash waiting for a dip, broad bullish signals suggest deploying it.",
      };
    }
    if (isBearish) {
      return {
        mechanism: "Market-wide negative events tighten credit, increase the cost of capital, or reduce investor confidence — all of which compress valuations across every sector.",
        watchFor: "High-beta, high-P/E stocks fall fastest in market downturns. Low-beta stocks with strong earnings power are more resilient.",
        traderTip: "Don't average down into falling markets without a clear catalyst for recovery. Assess whether the market-wide pressure is temporary (Fed action) or structural (recession).",
      };
    }
    return {
      mechanism: "Mixed market-wide signals create confusion about the future direction, leading to volatile two-way trading as bulls and bears fight for control.",
      watchFor: "High volatility during mixed signals can create short-term trading opportunities, but increases the risk of whipsaws. Stops are important.",
      traderTip: "Mixed signals are a poor time to take large new positions. Reduce size, widen stop losses, and wait for clarity before committing capital.",
    };
  }

  // SECTOR events
  if (category === "SECTOR") {
    if (targetsSector) {
      const sectors = effect.targetSectors ?? [];
      const sectorList = sectors.join(" and ");
      if (isBullish) {
        return {
          mechanism: `Positive developments within ${sectorList} create a rising tide that lifts related companies. Sector-specific tailwinds often run longer than single-stock moves because they affect the entire industry's fundamentals.`,
          watchFor: `All companies in the ${sectorList} sector benefit, but leaders with the strongest margins and market position tend to outperform during sector bull runs.`,
          traderTip: `Consider spreading exposure across multiple ${sectorList} stocks rather than concentrating in one. Sector ETFs are one way to capture broad sector moves in real investing.`,
        };
      }
      if (isBearish) {
        return {
          mechanism: `Negative sector events create headwinds for every company in ${sectorList}. Even fundamentally strong companies in a troubled sector get dragged down as investors reduce sector exposure.`,
          watchFor: `When a sector faces structural headwinds, the weakest players (high debt, thin margins) tend to fall fastest and furthest. Industry leaders often recover first.`,
          traderTip: `Sector-wide bad news is often a reason to reduce, not eliminate, exposure. The best companies in a challenged sector often emerge stronger when conditions improve.`,
        };
      }
    }
    return {
      mechanism: "Sector-level events affect the competitive dynamics of an entire industry, creating relative winners and losers within the same space.",
      watchFor: "When a sector event is mixed, look for which specific companies have differentiated positioning — quality often outperforms during periods of sector confusion.",
      traderTip: "Sector rotation is a key institutional strategy. When sectors diverge, consider rotating from weakness to strength rather than holding losers hoping for recovery.",
    };
  }

  // COMPANY events
  if (category === "COMPANY") {
    if (targetsSpecific) {
      if (isBullish) {
        return {
          mechanism: "Positive company-specific news — earnings beats, product launches, contracts — directly improves the fundamental value investors assign to the stock. The market reprices accordingly.",
          watchFor: "After a strong positive catalyst, watch whether the stock 'holds the move' in subsequent days. A stock that holds gains after good news suggests strong underlying demand.",
          traderTip: "Company-specific catalysts often have multi-day momentum. If you missed the initial spike, a retest of the breakout level can offer a second, lower-risk entry point.",
        };
      }
      if (isBearish) {
        return {
          mechanism: "Company-specific bad news forces investors to downgrade their earnings expectations. Lower expected earnings = lower fair value = lower stock price. The speed of the decline often reflects how surprising the news was.",
          watchFor: "After a sharp drop, check if the company's competitors are being affected. Sometimes bad news for one company reveals an industry-wide problem.",
          traderTip: "Avoid 'catching a falling knife' on company-specific disasters. Wait for the selling to exhaust itself (look for RSI below 30 and declining volume) before considering a contrarian entry.",
        };
      }
      return {
        mechanism: "Ambiguous company news creates uncertainty that increases volatility without a clear direction. Buyers and sellers have opposing interpretations of the same information.",
        watchFor: "After mixed news, the stock's initial reaction often reverses within 1-2 days as the market recalibrates. The eventual direction often reveals the market's true interpretation.",
        traderTip: "Mixed company news is often a reason to watch rather than act. Let the market's verdict play out before committing to a directional bet.",
      };
    }
  }

  // CRYPTO events
  if (category === "CRYPTO") {
    if (targetsCrypto || targetsSpecific) {
      if (isBullish) {
        return {
          mechanism: "Positive crypto catalysts — regulatory clarity, institutional adoption, protocol upgrades — expand the addressable market and attract new capital. Crypto markets move faster than equities; information gets priced in within hours.",
          watchFor: "Crypto rallies often spread from Bitcoin to Ethereum, then to smaller altcoins ('altcoin season'). The sequence matters — early movers often stall while altcoins catch up.",
          traderTip: "Crypto momentum can be explosive but short-lived. Consider taking partial profits after 20-30% gains, letting the remainder run with a trailing stop.",
        };
      }
      if (isBearish) {
        return {
          mechanism: "Negative crypto events — hacks, regulatory bans, exchange failures — erode trust across the entire ecosystem. Unlike stocks, crypto has no earnings or dividends to anchor valuation, so sentiment drives price more directly.",
          watchFor: "In crypto sell-offs, Bitcoin typically falls less than altcoins. Smaller coins can fall 50-80% when major crypto events trigger broad panic.",
          traderTip: "Crypto drawdowns can be severe and fast. If you're not willing to stomach a 40-50% decline, ensure position size reflects that. 'Not your keys, not your coins' — hardware wallets protect against exchange failures.",
        };
      }
      return {
        mechanism: "Mixed crypto events create extreme short-term volatility as the market tries to price in competing forces. Crypto markets trade 24/7, so volatility doesn't pause for weekends.",
        watchFor: "After major mixed crypto events, expect elevated volatility for several days. Options (in real markets) spike on these events as traders pay up for downside protection.",
        traderTip: "During crypto uncertainty, scale down position size. The risk of being wrong is amplified when the underlying asset is already highly volatile.",
      };
    }
  }

  // MEME events
  if (category === "MEME") {
    return {
      mechanism: "Market sentiment and psychological factors create self-fulfilling price movements. When enough investors believe something is bullish or bearish, their collective action makes it so — at least temporarily. This is called reflexivity.",
      watchFor: "Sentiment-driven moves often reverse sharply once the narrative fades. The bigger and faster the sentiment move, the more likely a mean-reversion trade in the opposite direction.",
      traderTip: "Don't trade against strong sentiment — 'the market can stay irrational longer than you can stay solvent.' But also don't buy at the peak of euphoria. Wait for momentum to show the first signs of fading.",
    };
  }

  // Fallback
  return {
    mechanism: "Market events affect prices by changing investors' expectations about future earnings, risk, or the broader economic environment.",
    watchFor: "After any significant event, track how the affected stocks react over the following 2-3 days. The quality of the follow-through reveals the true market interpretation.",
    traderTip: "React to the market's reaction, not just the news itself. A stock that barely falls on terrible news is showing hidden strength.",
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  WORLD: "Global Macro Event",
  MARKET: "Market-Wide Event",
  SECTOR: "Sector Event",
  COMPANY: "Company Event",
  CRYPTO: "Crypto Market Event",
  MEME: "Sentiment Event",
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}
