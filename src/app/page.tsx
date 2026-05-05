"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { buildInitialGameState } from "@/engine/seeder";

export default function HomePage() {
  const { state, dispatch, hasAutoSave, loadAutoSave, saveSlotsLoaded } = useGame();
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");

  useEffect(() => {
    if (state.gameStarted) {
      router.push("/dashboard");
    }
  }, [state.gameStarted, router]);

  const showContinue = saveSlotsLoaded && hasAutoSave();

  function handleNewGame() {
    if (!playerName.trim()) return;
    const initialState = buildInitialGameState(playerName.trim());
    dispatch({ type: "NEW_GAME", payload: { playerName: playerName.trim(), initialState } });
    router.push("/dashboard");
  }

  function handleContinue() {
    if (loadAutoSave()) {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="WallStreet Wreckage"
              width={560}
              height={315}
              priority
              className="w-full max-w-md"
            />
          </div>
          <p className="text-slate-300 text-sm">
            A turn-based day trading simulator where everything is fake
            but the emotional damage is real.
          </p>
        </div>

        {/* New game form */}
        <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-6 mb-4">
          <h2 className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">
            New Game
          </h2>
          <div className="mb-4">
            <label className="text-xs text-slate-300 mb-1 block">
              Your Name (will appear in leaderboard of shame)
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNewGame()}
              placeholder="Gordon Gecko Jr."
              maxLength={30}
              className="w-full bg-[#151c2f] border border-white/[0.07] rounded-lg px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-600 placeholder-slate-500"
            />
          </div>
          <div className="text-xs text-slate-400 mb-4">
            You start with{" "}
            <span className="text-emerald-400 font-mono">$10,000</span> in
            cash. Invest wisely. Or don&apos;t. We can&apos;t stop you.
          </div>
          <button
            onClick={handleNewGame}
            disabled={!playerName.trim()}
            className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:bg-[#151c2f] disabled:text-slate-500 text-emerald-100 rounded-lg font-mono font-bold text-sm transition-colors disabled:cursor-not-allowed"
          >
            Start Trading Career
          </button>
        </div>

        {/* Continue button */}
        {showContinue && (
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-[#151c2f] hover:bg-[#1e2a45] text-slate-200 rounded-xl border border-white/[0.07] font-mono text-sm transition-colors"
          >
            Continue Last Game
          </button>
        )}
      </div>
    </div>
  );
}
