"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { formatCurrency } from "@/utils/formatting";

interface Props {
  onClose: () => void;
}

export function SaveLoadModal({ onClose }: Props) {
  const { state, saveGame, loadGame, deleteGame, resetGame, getSaveMetadata, saveSlotsLoaded } =
    useGame();
  const router = useRouter();
  const slots = getSaveMetadata();
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function handleSave(slotId: number) {
    saveGame(slotId);
    onClose();
  }

  function handleLoad(slotId: number) {
    if (loadGame(slotId)) onClose();
  }

  function handleDelete(slotId: number) {
    deleteGame(slotId);
    setConfirmDelete(null);
  }

  function handleReset() {
    resetGame();
    setConfirmReset(false);
    onClose();
    router.push("/");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-[#0f1221] border border-white/[0.07] rounded-xl p-4 sm:p-6 w-full max-w-md shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-mono font-bold text-white">
            Save / Load Game
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="text-xs text-slate-400 mb-4">
          Your game auto-saves every turn. Use manual slots for long-term checkpoints.
        </div>

        {!saveSlotsLoaded ? (
          <div className="text-center py-6 text-sm text-slate-400 font-mono">
            Loading saves...
          </div>
        ) : (
          <div className="space-y-3">
            {[1, 2, 3].map((slotId) => {
              const meta = slots[slotId - 1];
              const isConfirmingDelete = confirmDelete === slotId;

              return (
                <div
                  key={slotId}
                  className="bg-[#151c2f] border border-white/[0.07] rounded-xl p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-400 mb-1">Slot {slotId}</div>
                      {meta ? (
                        <div>
                          <div className="text-sm text-white font-mono truncate">
                            {meta.playerName}
                          </div>
                          <div className="text-xs text-slate-300">
                            Day {meta.currentDay} · {formatCurrency(meta.netWorth)} net worth
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
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
                        <div className="text-sm text-slate-500 italic">Empty slot</div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {state.gameStarted && (
                        <button
                          onClick={() => handleSave(slotId)}
                          className="text-xs px-3 py-1.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-300 rounded border border-emerald-700 transition-colors whitespace-nowrap"
                        >
                          Save Here
                        </button>
                      )}
                      {meta && !isConfirmingDelete && (
                        <>
                          <button
                            onClick={() => handleLoad(slotId)}
                            className="text-xs px-3 py-1.5 bg-blue-900 hover:bg-blue-800 text-blue-300 rounded border border-blue-700 transition-colors whitespace-nowrap"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => setConfirmDelete(slotId)}
                            className="text-xs px-3 py-1.5 bg-[#151c2f] hover:bg-red-900 text-slate-400 hover:text-red-400 rounded border border-white/[0.07] hover:border-red-800 transition-colors whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {meta && isConfirmingDelete && (
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-red-400 text-center whitespace-nowrap">
                            Are you sure?
                          </div>
                          <button
                            onClick={() => handleDelete(slotId)}
                            className="text-xs px-3 py-1.5 bg-red-900 hover:bg-red-800 text-red-300 rounded border border-red-700 transition-colors whitespace-nowrap"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs px-3 py-1.5 bg-[#151c2f] hover:bg-slate-700 text-slate-400 rounded border border-white/[0.07] transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reset game — only when a game is active */}
        {state.gameStarted && (
          <div className="mt-4 pt-4 border-t border-white/[0.07]">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2 text-xs text-slate-500 hover:text-red-400 border border-white/[0.07] hover:border-red-900 rounded-xl transition-colors font-mono"
              >
                Abandon current game and start fresh
              </button>
            ) : (
              <div className="bg-red-950/40 border border-red-900/60 rounded-lg p-3">
                <div className="text-sm text-red-400 font-mono mb-1">
                  Reset game?
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  All unsaved progress will be lost. Manual save slots are kept.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-1.5 text-xs bg-red-900 hover:bg-red-800 text-red-300 rounded border border-red-700 transition-colors font-mono"
                  >
                    Yes, reset
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 text-xs bg-[#151c2f] hover:bg-slate-700 text-slate-400 rounded border border-white/[0.07] transition-colors font-mono"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
