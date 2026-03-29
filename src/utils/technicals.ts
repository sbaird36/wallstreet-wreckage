import type { PricePoint } from "@/types";

/** Simple Moving Average over last `period` prices */
export function sma(closes: number[], period: number): number | null {
  if (closes.length < period) return null;
  const slice = closes.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

/** SMA at every point in the series — null until enough data */
export function smaHistory(closes: number[], period: number): (number | null)[] {
  return closes.map((_, i) => {
    if (i < period - 1) return null;
    const slice = closes.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
}

/** RSI (Wilder's method, 14-day) */
export function rsi(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null;
  const changes = closes.slice(1).map((p, i) => p - closes[i]);
  const recent = changes.slice(-period);

  let avgGain = 0;
  let avgLoss = 0;
  for (const c of recent) {
    if (c > 0) avgGain += c;
    else avgLoss += Math.abs(c);
  }
  avgGain /= period;
  avgLoss /= period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** Average True Range (14-day) */
export function atr(history: PricePoint[], period = 14): number | null {
  if (history.length < period + 1) return null;
  const trs: number[] = [];
  for (let i = 1; i < history.length; i++) {
    const { high, low } = history[i];
    const prevClose = history[i - 1].close;
    trs.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));
  }
  const recent = trs.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / period;
}

/** 52-week (252 trading day) high and low */
export function highLow52Week(history: PricePoint[]): { high: number; low: number } {
  const recent = history.slice(-252);
  if (recent.length === 0) return { high: 0, low: 0 };
  return {
    high: Math.max(...recent.map((p) => p.high)),
    low: Math.min(...recent.map((p) => p.low)),
  };
}

/** Average daily volume */
export function avgVolume(history: PricePoint[], period = 20): number {
  const recent = history.slice(-period);
  if (recent.length === 0) return 0;
  return recent.reduce((a, b) => a + b.volume, 0) / recent.length;
}

/**
 * Beta — how this asset moves relative to a market series.
 * Both series are daily closing prices.
 * Returns null if insufficient data.
 */
export function beta(assetCloses: number[], marketCloses: number[]): number | null {
  const len = Math.min(assetCloses.length, marketCloses.length) - 1;
  if (len < 14) return null;

  const stockR = Array.from({ length: len }, (_, i) =>
    (assetCloses[i + 1] - assetCloses[i]) / assetCloses[i]
  );
  const mktR = Array.from({ length: len }, (_, i) =>
    (marketCloses[i + 1] - marketCloses[i]) / marketCloses[i]
  );

  const meanS = stockR.reduce((a, b) => a + b, 0) / len;
  const meanM = mktR.reduce((a, b) => a + b, 0) / len;

  let cov = 0;
  let varM = 0;
  for (let i = 0; i < len; i++) {
    cov += (stockR[i] - meanS) * (mktR[i] - meanM);
    varM += (mktR[i] - meanM) ** 2;
  }
  if (varM === 0) return null;
  return cov / varM;
}

export type AnalystRating = "STRONG BUY" | "BUY" | "HOLD" | "SELL" | "STRONG SELL";

/** Simulated analyst consensus from RSI + trend */
export function analystRating(
  rsiVal: number | null,
  trend: number
): AnalystRating {
  if (rsiVal === null) return "HOLD";
  if (rsiVal < 30 && trend > 0.0005) return "STRONG BUY";
  if (rsiVal < 42 && trend >= 0) return "BUY";
  if (rsiVal > 70 && trend < -0.0002) return "STRONG SELL";
  if (rsiVal > 58 && trend <= 0) return "SELL";
  return "HOLD";
}

/** Simulated price target — trend extrapolated 90 days with noise */
export function priceTarget(currentPrice: number, trend: number): number {
  const growth = Math.exp(trend * 90);
  return currentPrice * growth * (0.95 + Math.random() * 0.1);
}
