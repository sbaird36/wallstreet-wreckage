"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { selectEventsForDay } from "@/engine/eventEngine";
import { computeNewPrices } from "@/engine/priceEngine";
import { advanceIndexes } from "@/engine/indexEngine";
import { getDayName, getDayOfWeek, isWeekend } from "@/utils/dateUtils";
import { generateBlogPosts } from "@/engine/blogEngine";
import { generateContactTips } from "@/engine/contactEngine";
import {
  computeFollowerCount,
  computeNpcVotesOnPlayerPosts,
  computePlayerPostMultipliers,
  applyPlayerInfluenceToAssets,
} from "@/engine/playerInfluenceEngine";
import { getNetWorth } from "@/utils/calculations";
import type { GameState, Asset, FiredEvent, VolatilityOverride, MarketIndex, BlogPost, ContactTip } from "@/types";

type WeekDayPayload = {
  newAssets: Record<string, Asset>;
  events: FiredEvent[];
  volatilityOverrides: Record<string, VolatilityOverride>;
  newCooldowns: Record<string, number>;
  newIndexes: Record<string, MarketIndex>;
  newBlogPosts: BlogPost[];
  contactTips: ContactTip[];
  newFollowerCount: number;
  npcVotesOnPlayerPosts: { postId: string; votes: number }[];
  weeklySkillPoints: number;
};

export function AdvanceDayButton() {
  const { state, dispatch } = useGame();
  const [advancing, setAdvancing] = useState(false);
  const [confirmWeek, setConfirmWeek] = useState(false);

  const currentDayName = getDayName(state.startDate, state.currentDay);
  const nextDay = state.currentDay + 1;
  const nextIsWeekend = isWeekend(state.startDate, nextDay);
  const nextDayName = getDayName(state.startDate, nextDay);

  // Days until next Monday
  const currentDow = getDayOfWeek(state.startDate, state.currentDay);
  const daysToNextMonday = ((1 - currentDow + 7) % 7) || 7;
  const nextMondayDay = state.currentDay + daysToNextMonday;
  const nextMondayName = getDayName(state.startDate, nextMondayDay);

  async function handleAdvanceDay() {
    setAdvancing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const targetDay = state.currentDay + 1;
    const { events, newCooldowns, newVolatilityOverrides } =
      selectEventsForDay(state, nextIsWeekend);

    let newAssets = computeNewPrices(
      state.assets,
      events,
      state.currentDay,
      newVolatilityOverrides,
      nextIsWeekend
    );

    // Apply player post price influence (only if threshold met)
    const playerMultipliers = computePlayerPostMultipliers(state, targetDay);
    newAssets = applyPlayerInfluenceToAssets(newAssets, playerMultipliers);

    const newIndexes = advanceIndexes(state.indexes, newAssets, targetDay);
    const hasPremiumBlog = state.premiumBlogSubscription !== null &&
      state.currentDay - state.premiumBlogSubscription.purchasedDay < 7;
    const newBlogPosts = generateBlogPosts(targetDay, events, state.assets, hasPremiumBlog);
    const newContactTips = generateContactTips(state, targetDay);
    const snp499 = newIndexes["snp499"];
    const netWorth = getNetWorth(state.portfolio, newAssets);
    const newFollowerCount = computeFollowerCount(state.portfolio, netWorth, snp499, targetDay, state.playerVerifiedPostCount ?? 0, state.playerWrongPostCount ?? 0);
    const npcVotesOnPlayerPosts = computeNpcVotesOnPlayerPosts(state, targetDay);
    const weeklySkillPoints = getDayOfWeek(state.startDate, targetDay) === 1 ? 1 : 0;

    dispatch({
      type: "ADVANCE_DAY",
      payload: {
        newAssets,
        events,
        volatilityOverrides: newVolatilityOverrides,
        newCooldowns,
        newIndexes,
        newBlogPosts,
        newFollowerCount,
        npcVotesOnPlayerPosts,
        weeklySkillPoints,
      },
    });

    if (newContactTips.length > 0) {
      dispatch({ type: "ADD_CONTACT_TIPS", payload: newContactTips });
    }

    setAdvancing(false);
  }

  async function handleAdvanceWeek() {
    setConfirmWeek(false);
    setAdvancing(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    // Thread state through each day so engines get correct cooldowns/history
    let threaded: GameState = { ...state };
    const days: WeekDayPayload[] = [];

    for (let i = 0; i < daysToNextMonday; i++) {
      const targetDay = threaded.currentDay + 1;
      const weekend = isWeekend(state.startDate, targetDay);

      const { events, newCooldowns, newVolatilityOverrides } =
        selectEventsForDay(threaded, weekend);

      let newAssets = computeNewPrices(
        threaded.assets,
        events,
        threaded.currentDay,
        newVolatilityOverrides,
        weekend
      );

      const playerMultipliers = computePlayerPostMultipliers(threaded, targetDay);
      newAssets = applyPlayerInfluenceToAssets(newAssets, playerMultipliers);

      const newIndexes = advanceIndexes(threaded.indexes, newAssets, targetDay);
      const hasPremiumBlog = threaded.premiumBlogSubscription !== null &&
        threaded.currentDay - threaded.premiumBlogSubscription.purchasedDay < 7;
      const newBlogPosts = generateBlogPosts(targetDay, events, threaded.assets, hasPremiumBlog);
      const contactTips = generateContactTips(threaded, targetDay);
      const snp499 = newIndexes["snp499"];
      const netWorth = getNetWorth(threaded.portfolio, newAssets);
      const newFollowerCount = computeFollowerCount(threaded.portfolio, netWorth, snp499, targetDay, threaded.playerVerifiedPostCount ?? 0, threaded.playerWrongPostCount ?? 0);
      const npcVotesOnPlayerPosts = computeNpcVotesOnPlayerPosts(threaded, targetDay);
      const weeklySkillPoints = getDayOfWeek(state.startDate, targetDay) === 1 ? 1 : 0;

      days.push({
        newAssets,
        events,
        volatilityOverrides: newVolatilityOverrides,
        newCooldowns,
        newIndexes,
        newBlogPosts,
        contactTips,
        newFollowerCount,
        npcVotesOnPlayerPosts,
        weeklySkillPoints,
      });

      // Simulate what the reducer will produce so the next iteration is correct
      threaded = {
        ...threaded,
        currentDay: targetDay,
        assets: newAssets,
        activeEvents: events,
        eventHistory: [...threaded.eventHistory, ...events],
        recentEventCooldowns: newCooldowns,
        volatilityOverrides: newVolatilityOverrides,
        indexes: newIndexes,
        blogFeed: [...threaded.blogFeed, ...newBlogPosts].slice(-720),
      };
    }

    dispatch({ type: "ADVANCE_MULTIPLE_DAYS", payload: { days } });
    setAdvancing(false);
  }

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      {/* Main controls row */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Advance Day */}
        <button
          onClick={handleAdvanceDay}
          disabled={advancing}
          className={`
            flex-1 sm:flex-none
            px-4 sm:px-5 py-3 sm:py-2 rounded border font-mono font-bold text-sm sm:text-xs uppercase tracking-widest
            transition-all duration-150 flex items-center justify-center sm:justify-start gap-2
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
              <span className="hidden sm:inline">Processing…</span>
            </>
          ) : (
            <>
              <span>▶</span>
              <span>
                <span className="hidden sm:inline">Advance to </span>
                {nextDayName}
              </span>
            </>
          )}
        </button>

        {/* Current day info */}
        <div className="border-l border-gray-800 pl-3 sm:pl-5">
          <div className="text-sm font-mono font-bold text-white">{currentDayName}</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Day {state.currentDay}
            {nextIsWeekend && (
              <span className="ml-2 text-blue-500/80">· Markets close after today</span>
            )}
          </div>
        </div>

        {/* Advance Week button */}
        {!advancing && (
          <button
            onClick={() => setConfirmWeek(true)}
            className="text-xs px-3 py-2 rounded border font-mono text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-600 transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5"
          >
            <span>⏩</span>
            <span>Skip to Mon</span>
          </button>
        )}
      </div>

      {/* Mobile: Skip to Monday button on its own row */}
      {!advancing && (
        <button
          onClick={() => setConfirmWeek(true)}
          className="sm:hidden text-xs px-3 py-2 rounded border font-mono text-gray-500 border-gray-700 hover:text-gray-300 hover:border-gray-600 transition-colors flex items-center gap-1.5 w-fit"
        >
          <span>⏩</span>
          <span>Skip to Monday</span>
        </button>
      )}

      {/* Confirmation prompt */}
      {confirmWeek && (
        <div className="bg-gray-800 border border-yellow-700/60 rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-xs font-mono text-yellow-400 font-bold mb-0.5">
              Skip {daysToNextMonday} day{daysToNextMonday !== 1 ? "s" : ""} to {nextMondayName}?
            </div>
            <div className="text-xs text-gray-400">
              All market events and price movements will still occur — just simulated at once.
              A weekly recap will follow.
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={handleAdvanceWeek}
              className="text-xs px-4 py-2 bg-yellow-800 hover:bg-yellow-700 text-yellow-200 rounded border border-yellow-600 transition-colors font-mono font-bold whitespace-nowrap"
            >
              Yes, skip ahead
            </button>
            <button
              onClick={() => setConfirmWeek(false)}
              className="text-xs px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 rounded border border-gray-600 transition-colors font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
