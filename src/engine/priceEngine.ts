import type { Asset, PricePoint, FiredEvent, VolatilityOverride } from "@/types";
import { gaussianRandom, randomBetween } from "@/utils/math";

function computeNewPrice(
  asset: Asset,
  currentDay: number,
  eventMultiplier: number,
  volatilityOverrides: Record<string, VolatilityOverride>
): number {
  const override = volatilityOverrides[asset.ticker];
  const volMultiplier =
    override && override.expiresOnDay > currentDay ? override.multiplier : 1.0;

  const vol = asset.volatility * volMultiplier;
  const shock = gaussianRandom(0, vol);
  const drift = asset.trend;

  // Geometric Brownian Motion: dS = S*(mu*dt + sigma*dW)
  const baseNewPrice = asset.currentPrice * Math.exp(drift + shock);
  const finalPrice = baseNewPrice * eventMultiplier;

  // Hard floor: price can't go below 1¢
  return Math.max(0.01, finalPrice);
}

function generateOHLC(
  prevClose: number,
  newClose: number,
  volatility: number,
  day: number
): PricePoint {
  const open = prevClose;
  const high = Math.max(open, newClose) * (1 + randomBetween(0, volatility * 0.5));
  const low = Math.min(open, newClose) * (1 - randomBetween(0, volatility * 0.5));
  const baseVolume = 1_000_000 + Math.random() * 5_000_000;
  const changeMagnitude = Math.abs(newClose - open) / open;
  const volume = Math.round(baseVolume * (1 + changeMagnitude * 20));

  return {
    day,
    open: Math.max(0.01, open),
    high: Math.max(open, newClose, high),
    low: Math.min(open, newClose, low),
    close: newClose,
    volume,
  };
}

export function computeNewPrices(
  assets: Record<string, Asset>,
  firedEvents: FiredEvent[],
  currentDay: number,
  volatilityOverrides: Record<string, VolatilityOverride>,
  isWeekend: boolean = false
): Record<string, Asset> {
  // Build a multiplier map from fired events
  const eventMultipliers: Record<string, number> = {};
  for (const firedEvent of firedEvents) {
    for (const ticker of firedEvent.affectedTickers) {
      const existing = eventMultipliers[ticker] ?? 1.0;
      const mult = firedEvent.actualMultipliers[ticker] ?? 1.0;
      eventMultipliers[ticker] = existing * mult;
    }
  }

  const newAssets: Record<string, Asset> = {};

  for (const [ticker, asset] of Object.entries(assets)) {
    // Stock markets are closed on weekends — price stays flat
    if (isWeekend && asset.type === "stock") {
      const flatBar: PricePoint = {
        day: currentDay + 1,
        open: asset.currentPrice,
        high: asset.currentPrice,
        low: asset.currentPrice,
        close: asset.currentPrice,
        volume: 0,
      };
      newAssets[ticker] = {
        ...asset,
        previousPrice: asset.currentPrice,
        priceHistory: [...asset.priceHistory, flatBar].slice(-365),
      };
      continue;
    }

    const eventMult = eventMultipliers[ticker] ?? 1.0;
    const newPrice = computeNewPrice(asset, currentDay, eventMult, volatilityOverrides);
    const newOHLC = generateOHLC(asset.currentPrice, newPrice, asset.volatility, currentDay + 1);

    // Mild mean reversion on trend every 30 days
    let newTrend = asset.trend;
    if (currentDay % 30 === 0) {
      newTrend = asset.trend * 0.9;
    }

    newAssets[ticker] = {
      ...asset,
      trend: newTrend,
      previousPrice: asset.currentPrice,
      currentPrice: newPrice,
      priceHistory: [...asset.priceHistory, newOHLC].slice(-365), // Keep 1 year max
    };
  }

  return newAssets;
}

/** Generate synthetic historical price data going back `days` before game start */
export function generatePriceHistory(
  startPrice: number,
  volatility: number,
  trend: number,
  days: number
): PricePoint[] {
  const history: PricePoint[] = [];
  let price = startPrice;

  // Walk backward to find starting price, then forward to fill history
  // First, compute what price would have been `days` ago
  for (let i = days; i >= 1; i--) {
    price = price / Math.exp(trend + gaussianRandom(0, volatility));
    price = Math.max(0.01, price);
  }

  // Now walk forward building history
  for (let day = -days + 1; day <= 0; day++) {
    const prevPrice = price;
    const shock = gaussianRandom(0, volatility);
    price = price * Math.exp(trend + shock);
    price = Math.max(0.01, price);

    const point = generateOHLC(prevPrice, price, volatility, day);
    history.push(point);
  }

  return history;
}
