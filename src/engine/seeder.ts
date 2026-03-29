import type { Asset, Stock, Crypto, GameState } from "@/types";
import { INITIAL_STOCKS, STARTING_PRICES, PENNY_STOCKS, PENNY_STOCK_PRICES } from "@/data/stocks";
import { INITIAL_CRYPTOS, STARTING_CRYPTO_PRICES } from "@/data/cryptos";
import { generatePriceHistory } from "./priceEngine";
import { buildInitialIndexes } from "./indexEngine";

const HISTORY_DAYS = 90;
const STARTING_CASH = 10_000;
const ROCKET_COUNT = 5;

export function buildInitialAssets(): Record<string, Asset> {
  const assets: Record<string, Asset> = {};

  for (const stockDef of INITIAL_STOCKS) {
    const startPrice = STARTING_PRICES[stockDef.ticker];
    const history = generatePriceHistory(
      startPrice,
      stockDef.volatility,
      stockDef.trend,
      HISTORY_DAYS
    );

    const stock: Stock = {
      ...stockDef,
      currentPrice: startPrice,
      previousPrice: startPrice,
      priceHistory: history,
    };
    assets[stock.ticker] = stock;
  }

  // Randomly pick 5 penny stocks as "rockets" — high positive trend.
  // The rest are slow bleeders with negative trend.
  const shuffledPenny = [...PENNY_STOCKS].sort(() => Math.random() - 0.5);
  const rocketTickers = new Set(shuffledPenny.slice(0, ROCKET_COUNT).map((s) => s.ticker));

  for (const stockDef of PENNY_STOCKS) {
    const isRocket = rocketTickers.has(stockDef.ticker);
    // Rockets: 0.008–0.014 daily trend (strong upward, but still volatile)
    // Bleeders: -0.002 to -0.005 daily trend (slow decay toward zero)
    const trend = isRocket
      ? 0.008 + Math.random() * 0.006
      : -(0.002 + Math.random() * 0.003);

    const startPrice = PENNY_STOCK_PRICES[stockDef.ticker];
    const history = generatePriceHistory(startPrice, stockDef.volatility, trend, HISTORY_DAYS);

    const stock: Stock = {
      ...stockDef,
      trend,
      currentPrice: startPrice,
      previousPrice: startPrice,
      priceHistory: history,
    };
    assets[stock.ticker] = stock;
  }

  for (const cryptoDef of INITIAL_CRYPTOS) {
    const startPrice = STARTING_CRYPTO_PRICES[cryptoDef.ticker];
    const history = generatePriceHistory(
      startPrice,
      cryptoDef.volatility,
      cryptoDef.trend,
      HISTORY_DAYS
    );

    const crypto: Crypto = {
      ...cryptoDef,
      currentPrice: startPrice,
      previousPrice: startPrice,
      priceHistory: history,
    };
    assets[crypto.ticker] = crypto;
  }

  return assets;
}

export function buildInitialGameState(playerName: string): GameState {
  const assets = buildInitialAssets();
  const startNetWorth = STARTING_CASH;
  const indexes = buildInitialIndexes(assets, 1);

  return {
    currentDay: 1,
    startDate: "2026-01-05",
    assets,
    portfolio: {
      cash: STARTING_CASH,
      holdings: {},
      transactions: [],
      netWorthHistory: [{ day: 1, netWorth: startNetWorth }],
    },
    playerName,
    activeEvents: [],
    eventHistory: [],
    recentEventCooldowns: {},
    volatilityOverrides: {},
    pendingTrade: null,
    gameStarted: true,
    indexes,
    playerHedgeFund: null,
    blogFeed: [],
    analystUnlocks: [],
    analystSubscription: null,
    contacts: [],
    contactTips: [],
    playerPostCount: 0,
  };
}
