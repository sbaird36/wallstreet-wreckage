"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { formatCurrency, formatPrice } from "@/utils/formatting";
import { nanoid } from "nanoid";
import type { Transaction } from "@/types";

// Simple ID generator without nanoid dependency
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function TradeModal() {
  const { state, dispatch } = useGame();
  const { pendingTrade, assets, portfolio } = state;
  const [action, setAction] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<string>("1");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (pendingTrade) {
      setAction(pendingTrade.action);
      setQuantity(String(pendingTrade.quantity));
      setError("");
    }
  }, [pendingTrade]);

  if (!pendingTrade) return null;

  const asset = assets[pendingTrade.ticker];
  if (!asset) return null;

  const qty = parseFloat(quantity) || 0;
  const totalCost = qty * asset.currentPrice;
  const holding = portfolio.holdings[pendingTrade.ticker];
  const maxBuy = Math.floor(portfolio.cash / asset.currentPrice);
  const maxSell = holding?.quantity ?? 0;

  function validate(): string {
    if (isNaN(qty) || qty <= 0) return "Enter a valid quantity.";
    // For crypto allow fractional, for stocks require whole numbers
    if (asset.type === "stock" && qty !== Math.floor(qty))
      return "Stocks require whole share quantities.";
    if (action === "BUY") {
      if (totalCost > portfolio.cash) return "Insufficient cash.";
    } else {
      if (qty > maxSell)
        return `You only own ${maxSell} shares.`;
    }
    return "";
  }

  function handleSubmit() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const tx: Transaction = {
      id: generateId(),
      day: state.currentDay,
      ticker: pendingTrade!.ticker,
      assetType: asset.type,
      action,
      quantity: qty,
      pricePerUnit: asset.currentPrice,
      totalValue: totalCost,
      timestamp: Date.now(),
    };

    dispatch({ type: "EXECUTE_TRADE", payload: tx });
  }

  function handleMaxClick() {
    if (action === "BUY") {
      setQuantity(String(maxBuy));
    } else {
      setQuantity(String(maxSell));
    }
  }

  function getPresetValue(pct: number): string {
    if (action === "BUY") {
      const raw = (portfolio.cash * pct) / asset.currentPrice;
      return asset.type === "crypto"
        ? String(Math.floor(raw * 10000) / 10000)
        : String(Math.floor(raw));
    } else {
      const raw = maxSell * pct;
      return asset.type === "crypto"
        ? String(Math.floor(raw * 10000) / 10000)
        : String(Math.floor(raw));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => dispatch({ type: "CANCEL_TRADE" })}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-mono font-bold text-white">
              {pendingTrade.ticker}
            </h2>
            <div className="text-sm text-gray-400">{asset.name}</div>
          </div>
          <button
            onClick={() => dispatch({ type: "CANCEL_TRADE" })}
            className="text-gray-500 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Price */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4 text-center">
          <div className="text-xs text-gray-400 mb-0.5">Current Price</div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            ${formatPrice(asset.currentPrice)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Cash available: {formatCurrency(portfolio.cash)}
            {holding && (
              <> · Holding: {holding.quantity.toLocaleString()} {asset.type === 'crypto' ? 'coins' : 'shares'}</>
            )}
          </div>
        </div>

        {/* Buy / Sell toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700 mb-4">
          <button
            onClick={() => { setAction("BUY"); setError(""); }}
            className={`flex-1 py-2 text-sm font-mono font-bold transition-colors ${
              action === "BUY"
                ? "bg-emerald-900 text-emerald-300"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => { setAction("SELL"); setError(""); }}
            disabled={!holding || maxSell === 0}
            className={`flex-1 py-2 text-sm font-mono font-bold transition-colors ${
              action === "SELL"
                ? "bg-rose-900 text-rose-300"
                : "text-gray-500 hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
            }`}
          >
            SELL
          </button>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-gray-400">
              Quantity ({asset.type === "crypto" ? "coins" : "shares"})
            </label>
            <button
              onClick={handleMaxClick}
              className="text-xs text-emerald-400 hover:text-emerald-300"
            >
              Max ({action === "BUY" ? maxBuy : maxSell})
            </button>
          </div>
          {/* Quick preset buttons */}
          <div className="flex gap-1.5 mb-2">
            {([0.25, 0.5, 0.75, 1] as const).map((pct) => {
              const label = pct === 1 ? "MAX" : `${pct * 100}%`;
              return (
                <button
                  key={pct}
                  onClick={() => { setQuantity(getPresetValue(pct)); setError(""); }}
                  className="flex-1 py-1.5 text-xs font-mono rounded border border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 hover:bg-gray-800 transition-colors"
                >
                  {label}
                </button>
              );
            })}
          </div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => { setQuantity(e.target.value); setError(""); }}
            min={asset.type === "crypto" ? "0.0001" : "1"}
            step={asset.type === "crypto" ? "0.0001" : "1"}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-gray-500"
          />
        </div>

        {/* Total */}
        <div className="bg-gray-800 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Total {action === "BUY" ? "Cost" : "Proceeds"}</span>
            <span className="text-lg font-mono font-bold text-white tabular-nums">
              {formatCurrency(totalCost)}
            </span>
          </div>
          {action === "BUY" && (
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Cash after</span>
              <span className={`text-xs font-mono tabular-nums ${portfolio.cash - totalCost < 0 ? "text-rose-400" : "text-gray-400"}`}>
                {formatCurrency(portfolio.cash - totalCost)}
              </span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-xs text-rose-400 mb-3 bg-rose-950 border border-rose-800 rounded p-2">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className={`w-full py-3 rounded-lg font-mono font-bold text-sm transition-all active:scale-98 ${
            action === "BUY"
              ? "bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-600"
              : "bg-rose-800 hover:bg-rose-700 text-rose-100 border border-rose-600"
          }`}
        >
          {action === "BUY" ? "Confirm Buy" : "Confirm Sell"}{" "}
          {qty > 0 && `· ${formatCurrency(totalCost)}`}
        </button>
      </div>
    </div>
  );
}
