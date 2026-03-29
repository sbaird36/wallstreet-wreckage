import type { Portfolio, Asset, Holding } from "@/types";

export function getNetWorth(portfolio: Portfolio, assets: Record<string, Asset>): number {
  let total = portfolio.cash;
  for (const [ticker, holding] of Object.entries(portfolio.holdings)) {
    const asset = assets[ticker];
    if (asset) {
      total += holding.quantity * asset.currentPrice;
    }
  }
  return total;
}

export function getHoldingValue(holding: Holding, assets: Record<string, Asset>): number {
  const asset = assets[holding.ticker];
  if (!asset) return 0;
  return holding.quantity * asset.currentPrice;
}

export function getHoldingPnL(holding: Holding, assets: Record<string, Asset>): number {
  return getHoldingValue(holding, assets) - holding.totalCostBasis;
}

export function getHoldingPnLPercent(holding: Holding, assets: Record<string, Asset>): number {
  if (holding.totalCostBasis === 0) return 0;
  return getHoldingPnL(holding, assets) / holding.totalCostBasis;
}

export function getPriceChange(asset: Asset): number {
  return asset.currentPrice - asset.previousPrice;
}

export function getPriceChangePercent(asset: Asset): number {
  if (asset.previousPrice === 0) return 0;
  return (asset.currentPrice - asset.previousPrice) / asset.previousPrice;
}

export function getMarketCap(asset: Asset): number {
  if (asset.type === "stock") {
    return asset.currentPrice * asset.sharesOutstanding;
  }
  if (asset.type === "crypto") {
    return asset.currentPrice * asset.circulatingSupply;
  }
  return 0;
}
