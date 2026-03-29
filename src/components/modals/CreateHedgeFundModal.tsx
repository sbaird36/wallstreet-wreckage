"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { FUND_STRATEGIES } from "@/data/hedgeFunds";
import { formatCurrency } from "@/utils/formatting";
import { getNetWorth } from "@/utils/calculations";

const FUND_EMOJIS = ["💎", "🦅", "🌊", "⚡", "🏔️", "🔱", "🌙", "🦁", "🧭", "🔥"];

interface Props {
  onClose: () => void;
}

export function CreateHedgeFundModal({ onClose }: Props) {
  const { state, dispatch } = useGame();
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<string>(FUND_STRATEGIES[0]);
  const [emoji, setEmoji] = useState(FUND_EMOJIS[0]);
  const netWorth = getNetWorth(state.portfolio, state.assets);

  function handleCreate() {
    if (!name.trim()) return;
    dispatch({
      type: "CREATE_HEDGE_FUND",
      payload: {
        name: name.trim(),
        strategy,
        emoji,
        foundedDay: state.currentDay,
        foundedNetWorth: netWorth,
      },
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 border border-yellow-700/60 rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-2xl shadow-yellow-900/20">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="text-xs text-yellow-500 uppercase tracking-widest mb-1">
              Achievement Unlocked
            </div>
            <h2 className="text-xl font-mono font-bold text-white">
              Found Your Own Hedge Fund
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-400 mb-5">
          With a portfolio of{" "}
          <span className="text-yellow-400 font-mono">{formatCurrency(netWorth)}</span>,
          you have earned the right to manage other people&apos;s money and take a percentage
          for the privilege. Welcome to high finance.
        </p>

        {/* Emoji picker */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">
            Fund Emblem
          </label>
          <div className="flex gap-2 flex-wrap">
            {FUND_EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`w-10 h-10 text-xl rounded-lg border transition-colors ${
                  emoji === e
                    ? "bg-yellow-900 border-yellow-600"
                    : "bg-gray-800 border-gray-700 hover:border-gray-500"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Fund name */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">
            Fund Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g. Apex Capital Management"
            maxLength={40}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-yellow-600 placeholder-gray-600"
          />
        </div>

        {/* Strategy */}
        <div className="mb-6">
          <label className="text-xs text-gray-400 mb-1 block uppercase tracking-wider">
            Investment Strategy
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {FUND_STRATEGIES.map((s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={`py-2 px-3 text-xs font-mono rounded border transition-colors text-left ${
                  strategy === s
                    ? "bg-yellow-900 border-yellow-600 text-yellow-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="w-full py-3 bg-yellow-800 hover:bg-yellow-700 disabled:bg-gray-800 disabled:text-gray-600 text-yellow-100 rounded-lg font-mono font-bold text-sm transition-colors border border-yellow-600 disabled:border-gray-700"
        >
          {emoji} Found {name.trim() || "Your Fund"}
        </button>
      </div>
    </div>
  );
}
