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
import {
  generateAdvisorPool,
  generateAdvisorHotTips,
  generateWeeklyAdvisorEmails,
  driftAdvisorSkills,
  calcTotalWeeklyFee,
  getAdvisorWeekNumber,
} from "@/engine/advisorEngine";
import { getNetWorth } from "@/utils/calculations";
import type { GameState, Asset, FiredEvent, VolatilityOverride, MarketIndex, BlogPost, ContactTip, AdvisorEmail, AdvisorSkills, Advisor } from "@/types";

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
  advisorHotTips: AdvisorEmail[];
  advisorWeeklyEmails: AdvisorEmail[];
  newAdvisorPool: Advisor[] | null;
  advisorSkillUpdates: Array<{ id: string; skills: AdvisorSkills }>;
  weeklyAdvisorFee: number;
};

export function AdvanceDayButton({ compact = false }: { compact?: boolean }) {
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

    // ── Advisor engine ───────────────────────────────────────────────────
    const isMonday = getDayOfWeek(state.startDate, targetDay) === 1;
    const advisorHotTips = generateAdvisorHotTips(state, targetDay);
    const advisorWeeklyEmails = isMonday ? generateWeeklyAdvisorEmails(state, targetDay) : [];
    const advisorSkillUpdates = isMonday ? driftAdvisorSkills(state.hiredAdvisors ?? []) : [];
    const weeklyAdvisorFee = isMonday ? calcTotalWeeklyFee(state.hiredAdvisors ?? []) : 0;
    const currentWeek = getAdvisorWeekNumber(targetDay);
    const poolNeedsRefresh = isMonday && currentWeek !== (state.advisorPoolWeek ?? 0);
    const newAdvisorPool = poolNeedsRefresh
      ? generateAdvisorPool(currentWeek, (state.hiredAdvisors ?? []).map((h) => h.advisor.id))
      : null;

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
        advisorHotTips,
        advisorWeeklyEmails,
        newAdvisorPool,
        advisorSkillUpdates,
        weeklyAdvisorFee,
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

      // Advisor engine for this day
      const isMon = getDayOfWeek(state.startDate, targetDay) === 1;
      const dayAdvisorHotTips = generateAdvisorHotTips(threaded, targetDay);
      const dayAdvisorWeeklyEmails = isMon ? generateWeeklyAdvisorEmails(threaded, targetDay) : [];
      const daySkillUpdates = isMon ? driftAdvisorSkills(threaded.hiredAdvisors ?? []) : [];
      const dayWeeklyFee = isMon ? calcTotalWeeklyFee(threaded.hiredAdvisors ?? []) : 0;
      const dayWeek = getAdvisorWeekNumber(targetDay);
      const poolRefresh = isMon && dayWeek !== (threaded.advisorPoolWeek ?? 0);
      const dayAdvisorPool = poolRefresh
        ? generateAdvisorPool(dayWeek, (threaded.hiredAdvisors ?? []).map((h) => h.advisor.id))
        : null;

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
        advisorHotTips: dayAdvisorHotTips,
        advisorWeeklyEmails: dayAdvisorWeeklyEmails,
        newAdvisorPool: dayAdvisorPool,
        advisorSkillUpdates: daySkillUpdates,
        weeklyAdvisorFee: dayWeeklyFee,
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

  // ── Compact mode (embedded in TopNav) ────────────────────────────────
  if (compact) {
    return (
      <div className="relative flex items-center gap-2">
        {/* Advance button */}
        <button
          onClick={handleAdvanceDay}
          disabled={advancing}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-all duration-150 active:scale-95
            ${advancing
              ? "bg-[#151c2f] border-white/[0.07] text-slate-500 cursor-not-allowed"
              : nextIsWeekend
              ? "bg-[#151c2f] border-blue-700/70 text-blue-400 hover:bg-[#1e2a45] hover:border-blue-600"
              : "bg-blue-700 border-blue-600 text-white hover:bg-blue-600"
            }
          `}
        >
          {advancing ? (
            <span className="animate-spin inline-block">◌</span>
          ) : (
            <span>▶</span>
          )}
          <span className="hidden sm:inline">
            {advancing ? "Processing…" : `Advance to ${nextDayName}`}
          </span>
          <span className="sm:hidden">
            {advancing ? "…" : nextDayName}
          </span>
        </button>

        {/* Day info */}
        <div className="hidden md:flex flex-col leading-none">
          <span className="text-xs font-mono font-semibold text-white">{currentDayName}</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Day {state.currentDay}</span>
        </div>

        {/* Skip to Monday */}
        {!advancing && (
          <button
            onClick={() => setConfirmWeek((v) => !v)}
            title={`Skip ${daysToNextMonday} days to ${nextMondayName}`}
            className="hidden md:flex items-center px-2 py-1.5 rounded border text-xs text-slate-400 border-white/[0.07] hover:text-slate-200 hover:border-white/20 transition-colors"
          >
            ⏩
          </button>
        )}

        {/* Confirmation dropdown */}
        {confirmWeek && (
          <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-[#0f1221] border border-yellow-700/60 rounded-xl px-4 py-3 shadow-xl shadow-black/60 flex flex-col gap-3">
            <div>
              <div className="text-xs font-semibold text-yellow-400 mb-1">
                Skip {daysToNextMonday} day{daysToNextMonday !== 1 ? "s" : ""} to {nextMondayName}?
              </div>
              <div className="text-xs text-slate-400">
                All market events and price movements will still occur — simulated at once. A weekly recap will follow.
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAdvanceWeek}
                className="flex-1 text-xs px-3 py-1.5 bg-yellow-800 hover:bg-yellow-700 text-yellow-200 rounded border border-yellow-600 transition-colors font-medium"
              >
                Yes, skip ahead
              </button>
              <button
                onClick={() => setConfirmWeek(false)}
                className="text-xs px-3 py-1.5 bg-[#151c2f] hover:bg-[#1e2a45] text-slate-400 hover:text-slate-200 rounded border border-white/[0.07] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Full mode (standalone panel) ──────────────────────────────────────
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
                ? "bg-[#151c2f] border-white/[0.07] text-slate-500 cursor-not-allowed"
                : nextIsWeekend
                ? "bg-[#151c2f] border-blue-700/70 text-blue-400 hover:bg-slate-700 hover:border-blue-600 active:scale-95"
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
        <div className="border-l border-white/[0.07] pl-3 sm:pl-5">
          <div className="text-sm font-mono font-bold text-white">{currentDayName}</div>
          <div className="text-xs text-slate-400 mt-0.5">
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
            className="text-xs px-3 py-2 rounded border font-mono text-slate-400 border-white/[0.07] hover:text-slate-300 hover:border-white/20 transition-colors whitespace-nowrap hidden sm:flex items-center gap-1.5"
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
          className="sm:hidden text-xs px-3 py-2 rounded border font-mono text-slate-400 border-white/[0.07] hover:text-slate-300 hover:border-white/20 transition-colors flex items-center gap-1.5 w-fit"
        >
          <span>⏩</span>
          <span>Skip to Monday</span>
        </button>
      )}

      {/* Confirmation prompt */}
      {confirmWeek && (
        <div className="bg-[#151c2f] border border-yellow-700/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-xs font-mono text-yellow-400 font-bold mb-0.5">
              Skip {daysToNextMonday} day{daysToNextMonday !== 1 ? "s" : ""} to {nextMondayName}?
            </div>
            <div className="text-xs text-slate-300">
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
              className="text-xs px-3 py-2 bg-[#151c2f] hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded border border-white/[0.07] transition-colors font-mono"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
