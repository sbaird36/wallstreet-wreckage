"use client";

import { useGame } from "@/context/GameContext";
import { formatCurrency } from "@/utils/formatting";

interface Props {
  onClose: () => void;
}

export function SaveLoadModal({ onClose }: Props) {
  const { saveGame, loadGame, getSaveMetadata } = useGame();
  const slots = getSaveMetadata();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-mono font-bold text-white">
            💾 Save / Load Game
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-gray-500 mb-4">
          Your game auto-saves every turn. Use manual slots for long-term
          checkpoints.
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((slotId) => {
            const meta = slots[slotId - 1];
            return (
              <div
                key={slotId}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 mb-1">
                      Slot {slotId}
                    </div>
                    {meta ? (
                      <div>
                        <div className="text-sm text-white font-mono">
                          {meta.playerName}
                        </div>
                        <div className="text-xs text-gray-400">
                          Day {meta.currentDay} ·{" "}
                          {formatCurrency(meta.netWorth)} net worth
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          Saved{" "}
                          {new Date(meta.savedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 italic">
                        Empty slot
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 ml-3">
                    <button
                      onClick={() => {
                        saveGame(slotId);
                        onClose();
                      }}
                      className="text-xs px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 rounded border border-emerald-700 transition-colors whitespace-nowrap"
                    >
                      Save Here
                    </button>
                    {meta && (
                      <button
                        onClick={() => {
                          if (loadGame(slotId)) onClose();
                        }}
                        className="text-xs px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded border border-blue-700 transition-colors whitespace-nowrap"
                      >
                        Load
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
