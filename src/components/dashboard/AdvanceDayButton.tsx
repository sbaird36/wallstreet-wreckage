"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { selectEventsForDay } from "@/engine/eventEngine";
import { computeNewPrices } from "@/engine/priceEngine";
import { advanceIndexes } from "@/engine/indexEngine";
import { getDayName, isWeekend } from "@/utils/dateUtils";
import { generateBlogPosts } from "@/engine/blogEngine";

export function AdvanceDayButton() {
  const { state, dispatch } = useGame();
  const [advancing, setAdvancing] = useState(false);

  const currentDayName = getDayName(state.startDate, state.currentDay);
  const nextDay = state.currentDay + 1;
  const nextIsWeekend = isWeekend(state.startDate, nextDay);
  const nextDayName = getDayName(state.startDate, nextDay);

  async function handleAdvance() {
    setAdvancing(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    const { events, newCooldowns, newVolatilityOverrides } =
      selectEventsForDay(state, nextIsWeekend);

    const newAssets = computeNewPrices(
      state.assets,
      events,
      state.currentDay,
      newVolatilityOverrides,
      nextIsWeekend
    );

    const newIndexes = advanceIndexes(state.indexes, newAssets, state.currentDay + 1);
    const newBlogPosts = generateBlogPosts(state.currentDay + 1, events, state.assets);

    dispatch({
      type: "ADVANCE_DAY",
      payload: {
        newAssets,
        events,
        volatilityOverrides: newVolatilityOverrides,
        newCooldowns,
        newIndexes,
        newBlogPosts,
      },
    });

    setAdvancing(false);
  }

  return (
    <div className="flex items-center gap-5">
      <button
        onClick={handleAdvance}
        disabled={advancing}
        className={`
          px-5 py-2 rounded border font-mono font-bold text-xs uppercase tracking-widest
          transition-all duration-150 flex items-center gap-2
          ${
            advancing
              ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
              : nextIsWeekend
              ? "bg-gray-800 border-blue-700/70 text-blue-400 hover:bg-gray-700 hover:border-blue-600 active:scale-95"
              : "bg-blue-700 border-blue-600 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-900/40 active:scale-95"
          }
        `}
      >
        {advancing ? (
          <>
            <span className="animate-spin inline-block">◌</span>
            Processing…
          </>
        ) : (
          <>
            <span>▶</span>
            Advance to {nextDayName}
          </>
        )}
      </button>

      <div className="border-l border-gray-800 pl-5">
        <div className="text-sm font-mono font-bold text-white">{currentDayName}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          Day {state.currentDay}
          {nextIsWeekend && (
            <span className="ml-2 text-blue-500/80">· Markets close after today</span>
          )}
        </div>
      </div>
    </div>
  );
}
