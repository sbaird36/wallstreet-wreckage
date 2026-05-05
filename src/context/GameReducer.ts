import type { GameState, GameAction, Holding, TraderSkills } from "@/types";
import { getNetWorth } from "@/utils/calculations";
import { getNewlyUnlockedContacts } from "@/engine/contactEngine";
import { generateDailyChallenges, checkTradeChallenges, checkDayChallenges } from "@/engine/challengeEngine";
import { MILESTONES } from "@/data/milestoneData";
import { getDayOfWeek, getWeekNumber } from "@/utils/dateUtils";
import { checkAchievements, buildNewAchievements } from "@/engine/achievementEngine";
import { computeAllRivalNetWorths } from "@/engine/rivalEngine";
import { generateJournalEntry } from "@/engine/journalEngine";
import { ACHIEVEMENTS } from "@/data/achievementData";

// ── Organic skill XP ──────────────────────────────────────────────────────────
// Accumulate XP through performance; crossing thresholds auto-levels the skill.
const XP_UP   = 20;  // XP needed to gain 1 organic level (~30–50 qualifying actions)
const XP_DOWN = -10; // XP needed to lose 1 organic level

const DEFAULT_SKILLS: TraderSkills = { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0, riskManagement: 0, marketTiming: 0 };

function applySkillXP(
  skills: TraderSkills,
  xp: TraderSkills,
  deltas: Partial<TraderSkills>
): { skills: TraderSkills; xp: TraderSkills } {
  const newXP = { ...xp };
  const newSkills = { ...skills };
  for (const k of Object.keys(deltas) as (keyof TraderSkills)[]) {
    newXP[k] += deltas[k] ?? 0;
  }
  for (const k of Object.keys(newSkills) as (keyof TraderSkills)[]) {
    if (newXP[k] >= XP_UP && newSkills[k] < 5) {
      newSkills[k] += 1;
      newXP[k] = 0;
    } else if (newXP[k] <= XP_DOWN && newSkills[k] > 0) {
      newSkills[k] -= 1;
      newXP[k] = 0;
    }
  }
  return { skills: newSkills, xp: newXP };
}

// ── XP & skill-point helpers ──────────────────────────────────────────────────
function xpThresholdForLevel(n: number): number {
  return Math.floor(100 * Math.pow(1.5, n));
}

function skillPointsEarnedFromXP(totalXp: number): number {
  let points = 0;
  let spent = 0;
  while (spent + xpThresholdForLevel(points) <= totalXp) {
    spent += xpThresholdForLevel(points);
    points++;
  }
  return points;
}

function gainSkillPoints(
  currentXp: number,
  gained: number,
  currentSkillPoints: number
): { newXp: number; newSkillPoints: number } {
  const newXp = currentXp + gained;
  const before = skillPointsEarnedFromXP(currentXp);
  const after = skillPointsEarnedFromXP(newXp);
  return { newXp, newSkillPoints: currentSkillPoints + (after - before) };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADVANCE_DAY": {
      const {
        newAssets, events, volatilityOverrides, newCooldowns, newIndexes,
        newBlogPosts, newFollowerCount, npcVotesOnPlayerPosts,
      } = action.payload;
      const newDay = state.currentDay + 1;
      const newHistory = [...state.eventHistory, ...events];

      const newPortfolio = {
        ...state.portfolio,
        netWorthHistory: [
          ...state.portfolio.netWorthHistory,
          { day: newDay, netWorth: getNetWorth(state.portfolio, newAssets) },
        ],
      };

      // Apply NPC votes to player posts in the feed
      const voteMap: Record<string, number> = {};
      for (const { postId, votes } of npcVotesOnPlayerPosts) {
        voteMap[postId] = (voteMap[postId] ?? 0) + votes;
      }
      // Build feed with NPC votes applied
      const feedWithVotes = [...state.blogFeed, ...newBlogPosts]
        .map((p) => voteMap[p.id] ? { ...p, upvotes: p.upvotes + voteMap[p.id] } : p)
        .slice(-720);

      // Verify player posts that are exactly 2 days old and have a linked ticker
      let newVerifications = 0;
      let newWrongPredictions = 0;
      const verifiedFeed = feedWithVotes.map((post) => {
        if (!post.isPlayerPost || post.isReal || post.isPredictionWrong || newDay - post.day !== 2 || post.linkedTickers.length === 0) return post;
        const ticker = post.linkedTickers[0];
        const asset = newAssets[ticker];
        if (!asset) return post;
        const priceAtPost = asset.priceHistory.find((p) => p.day === post.day)?.close;
        if (priceAtPost === undefined) return post;
        if (asset.currentPrice > priceAtPost) {
          newVerifications++;
          return { ...post, isReal: true };
        } else {
          newWrongPredictions++;
          return { ...post, isPredictionWrong: true };
        }
      });

      // Organic blogLiteracy XP from post verification
      const blogXPDelta = newVerifications * 0.4 - newWrongPredictions * 0.2;
      const { skills: newTraderSkills, xp: newTraderSkillsXP } = applySkillXP(
        state.traderSkills ?? DEFAULT_SKILLS,
        state.traderSkillsXP ?? DEFAULT_SKILLS,
        { blogLiteracy: blogXPDelta }
      );

      // Wild blog price boost: apply 8x volatility overrides for wild-boosted posts
      const newVolOverrides = { ...volatilityOverrides };
      for (const post of newBlogPosts) {
        if (post.source === "wildcat" && post.isReal && post.isWildBoosted) {
          for (const ticker of post.linkedTickers) {
            newVolOverrides[ticker] = { multiplier: 8, expiresOnDay: newDay + 3 };
          }
        }
      }

      // Influence: daily portfolio performance
      const prevNetWorth = state.portfolio.netWorthHistory.slice(-1)[0]?.netWorth ?? state.portfolio.cash;
      const curNetWorth = getNetWorth(state.portfolio, newAssets);
      const dailyReturn = prevNetWorth > 0 ? (curNetWorth - prevNetWorth) / prevNetWorth : 0;
      const performanceDelta = dailyReturn > 0.005 ? 3 : dailyReturn < -0.005 ? -1.5 : 0;

      // Influence: blog post verification
      const blogInfluenceDelta = newVerifications * 30 - newWrongPredictions * 12;

      const newInfluence = Math.max(0, (state.playerInfluence ?? 0) + performanceDelta + blogInfluenceDelta);

      // ── Advisor emails + skill drift + fee deduction ───────────────────
      const {
        advisorHotTips = [],
        advisorWeeklyEmails = [],
        newAdvisorPool,
        advisorSkillUpdates = [],
        weeklyAdvisorFee = 0,
      } = action.payload;

      const incomingAdvisorEmails = [...advisorWeeklyEmails, ...advisorHotTips];
      const updatedAdvisorEmails = [
        ...(state.advisorEmails ?? []),
        ...incomingAdvisorEmails,
      ].slice(-200);

      // Apply skill drift updates
      const updatedHired = (state.hiredAdvisors ?? []).map((h) => {
        const update = advisorSkillUpdates.find((u) => u.id === h.advisor.id);
        return update ? { ...h, currentSkills: update.skills } : h;
      });

      // Deduct weekly advisor fees
      const cashAfterFees = Math.max(0, (newPortfolio.cash ?? 0) - weeklyAdvisorFee);
      const portfolioAfterFees = weeklyAdvisorFee > 0
        ? { ...newPortfolio, cash: cashAfterFees }
        : newPortfolio;

      // ── Milestone check ───────────────────────────────────────────────
      const currentNetWorth = getNetWorth(portfolioAfterFees, newAssets);
      const unlockedMilestones = state.unlockedMilestones ?? [];
      let newUnlockedMilestones = [...unlockedMilestones];
      let pendingMilestone = state.pendingMilestone;
      let milestoneXP = 0;

      const newlyHitMilestones = MILESTONES.filter(
        (m) => currentNetWorth >= m.netWorthThreshold && !unlockedMilestones.includes(m.id)
      );
      if (newlyHitMilestones.length > 0) {
        for (const m of newlyHitMilestones) {
          newUnlockedMilestones.push(m.id);
          milestoneXP += m.xpReward;
        }
        // Show the highest threshold milestone
        const highest = newlyHitMilestones.sort((a, b) => b.netWorthThreshold - a.netWorthThreshold)[0];
        pendingMilestone = highest.id;
      }

      // ── Weekly profit XP (replaces old skill point) ───────────────────
      const isMonday = getDayOfWeek(state.startDate, newDay) === 1;
      let weeklyXP = 0;
      if (isMonday) {
        const weekStart = newDay - 7;
        const weekStartEntry = state.portfolio.netWorthHistory.slice().reverse().find(e => e.day <= weekStart);
        const weekStartNW = weekStartEntry?.netWorth ?? (state.portfolio.netWorthHistory[0]?.netWorth ?? 10000);
        if (currentNetWorth > weekStartNW) weeklyXP = 40;
      }

      // ── Day challenges check (portfolio-based) + generate tomorrow's ──
      const holdingCount = Object.keys(portfolioAfterFees.holdings).length;
      const prevDayNW = state.portfolio.netWorthHistory.slice(-1)[0]?.netWorth ?? portfolioAfterFees.cash;
      const portfolioUpToday = currentNetWorth > prevDayNW;
      const updatedChallengesDay = checkDayChallenges(
        state.dailyChallenges ?? [],
        state.currentDay,  // challenges are for the day being completed
        holdingCount,
        portfolioUpToday,
      );

      // XP + cash from day-based challenges
      let dayChallengeXP = 0;
      let dayChallengeCash = 0;
      {
        const justCompleted = updatedChallengesDay.filter((c, i) => {
          const prev = (state.dailyChallenges ?? [])[i];
          return c.completed && prev && !prev.completed;
        });
        for (const c of justCompleted) {
          dayChallengeXP += c.xpReward;
          dayChallengeCash += c.cashReward;
        }
      }

      // Generate challenges for the NEW day
      const newDayChallenges = generateDailyChallenges(newDay);
      const allChallenges = [
        ...updatedChallengesDay.filter(c => c.day !== newDay),
        ...newDayChallenges,
      ].slice(-30);

      // Total XP from day events (before achievements)
      const totalDayXP = milestoneXP + weeklyXP + dayChallengeXP;

      // ── Achievement checking ───────────────────────────────────────────────
      const dayAchievementIds = checkAchievements(state, null, newDay);
      const dayAchievementXP = dayAchievementIds.reduce((sum, id) => {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        return sum + (def?.xpReward ?? 0);
      }, 0);
      const dayAchievementObjects = buildNewAchievements(dayAchievementIds, newDay);

      // ── Perfect week achievement (Monday) ─────────────────────────────
      const perfectWeekIds: string[] = [];
      if (isMonday) {
        const weekStart = newDay - 7;
        const weekSells = state.portfolio.transactions.filter(
          (t) => t.action === "SELL" && t.day >= weekStart && t.day < newDay
        );
        if (weekSells.length >= 3) {
          const allWon = (state.tradeStreak ?? 0) >= weekSells.length;
          const alreadyHas = (state.achievements ?? []).some(a => a.id === "perfect_week");
          if (allWon && !alreadyHas) {
            perfectWeekIds.push("perfect_week");
          }
        }
      }
      const perfectWeekObjects = buildNewAchievements(perfectWeekIds, newDay);
      const perfectWeekXP = perfectWeekIds.reduce((sum, id) => {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        return sum + (def?.xpReward ?? 0);
      }, 0);

      const allNewAchievementIds = [...dayAchievementIds, ...perfectWeekIds];
      const allNewAchievementObjects = [...dayAchievementObjects, ...perfectWeekObjects];
      const allNewAchievementXP = dayAchievementXP + perfectWeekXP;

      // ── Rival net worths update (weekly) ──────────────────────────────
      const weekNum = getWeekNumber(state.startDate, newDay);
      const newRivalNetWorths = isMonday ? computeAllRivalNetWorths(weekNum) : (state.rivalNetWorths ?? {});

      // ── Detect new sector plays from current holdings ─────────────────
      const currentHoldings = Object.values(portfolioAfterFees.holdings);
      const sectorGroups: Record<string, string[]> = {};
      for (const holding of currentHoldings) {
        const asset = newAssets[holding.ticker];
        if (!asset || asset.type !== "stock") continue;
        const sector = (asset as { sector: string }).sector;
        if (!sectorGroups[sector]) sectorGroups[sector] = [];
        sectorGroups[sector].push(holding.ticker);
      }

      let currentSectorPlays = [...(state.activeSectorPlays ?? [])];
      for (const [sector, tickers] of Object.entries(sectorGroups)) {
        if (tickers.length >= 3) {
          const alreadyActive = currentSectorPlays.some(
            (p) => !p.completed && p.sector === sector
          );
          if (!alreadyActive) {
            currentSectorPlays.push({
              id: `sp_${newDay}_${sector}`,
              sector,
              tickers: tickers.slice(0, 3),
              startDay: newDay,
              completed: false,
              won: null,
              resolvedDay: null,
            });
          }
        }
      }

      // ── Sector play checks ────────────────────────────────────────────
      const updatedSectorPlays = currentSectorPlays.map((play) => {
        if (play.completed) return play;
        if (newDay - play.startDay < 5) return play; // need at least 5 days
        // Check if all tickers are up from when the play started
        const allUp = play.tickers.every((ticker) => {
          const asset = newAssets[ticker];
          if (!asset) return false;
          const startEntry = asset.priceHistory.find((p) => p.day === play.startDay);
          if (!startEntry) return false;
          return asset.currentPrice > startEntry.close;
        });
        if (allUp) {
          return { ...play, completed: true, won: true, resolvedDay: newDay };
        }
        // Expire after 10 days
        if (newDay - play.startDay >= 10) {
          return { ...play, completed: true, won: false, resolvedDay: newDay };
        }
        return play;
      });

      // Check for sector_master achievement
      const wonASectorPlay = updatedSectorPlays.some(
        (p) => p.won === true && !(state.activeSectorPlays ?? []).find((op) => op.id === p.id && op.won === true)
      );
      const sectorMasterIds: string[] = [];
      if (wonASectorPlay && !(state.achievements ?? []).some(a => a.id === "sector_master")) {
        sectorMasterIds.push("sector_master");
      }

      // ── Journal entry (Monday) ────────────────────────────────────────
      let newJournal = state.weeklyJournal ?? [];
      if (isMonday) {
        const weekStart = newDay - 7;
        const weekStartNW = state.portfolio.netWorthHistory.slice().reverse().find(e => e.day <= weekStart)?.netWorth ?? 10000;
        const weekEndNW = currentNetWorth;
        const journalEntry = generateJournalEntry(
          state,
          weekNum - 1, // just-completed week number
          weekStart,
          newDay - 1,
          weekStartNW,
          weekEndNW,
          allNewAchievementIds,
        );
        newJournal = [...newJournal, journalEntry].slice(-52); // keep ~1 year
      }

      // ── Recalculate XP with all day-advance sources ───────────────────
      const totalAdvanceXP = totalDayXP + allNewAchievementXP + perfectWeekXP;
      const { newXp: finalAdvXp, newSkillPoints: finalAdvSP } = gainSkillPoints(
        state.xp ?? 0,
        totalAdvanceXP,
        state.skillPoints ?? 0,
      );

      const portfolioWithDayCash = dayChallengeCash > 0
        ? { ...portfolioAfterFees, cash: portfolioAfterFees.cash + dayChallengeCash }
        : portfolioAfterFees;

      return {
        ...state,
        currentDay: newDay,
        assets: newAssets,
        activeEvents: events,
        eventHistory: newHistory,
        portfolio: portfolioWithDayCash,
        volatilityOverrides: newVolOverrides,
        recentEventCooldowns: newCooldowns,
        indexes: newIndexes,
        blogFeed: verifiedFeed,
        playerFollowerCount: newFollowerCount,
        playerVerifiedPostCount: (state.playerVerifiedPostCount ?? 0) + newVerifications,
        playerWrongPostCount: (state.playerWrongPostCount ?? 0) + newWrongPredictions,
        skillPoints: finalAdvSP,
        traderSkills: newTraderSkills,
        traderSkillsXP: newTraderSkillsXP,
        playerInfluence: newInfluence,
        advisorEmails: updatedAdvisorEmails,
        hiredAdvisors: updatedHired,
        advisorPool: newAdvisorPool ?? (state.advisorPool ?? []),
        advisorPoolWeek: newAdvisorPool ? Math.ceil(newDay / 7) : (state.advisorPoolWeek ?? 0),
        xp: finalAdvXp,
        dailyChallenges: allChallenges,
        unlockedMilestones: newUnlockedMilestones,
        pendingMilestone,
        achievements: [...(state.achievements ?? []), ...allNewAchievementObjects],
        pendingAchievements: [...(state.pendingAchievements ?? []), ...allNewAchievementIds],
        rivalNetWorths: newRivalNetWorths,
        weeklyJournal: newJournal,
        activeSectorPlays: updatedSectorPlays,
      };
    }

    case "EXECUTE_TRADE": {
      const tx = action.payload;
      const holdings = { ...state.portfolio.holdings };
      let cash = state.portfolio.cash;

      // Organic XP deltas for sells (computed before holdings are mutated)
      let tradeXPDeltas: Partial<TraderSkills> = {};
      if (tx.action === "SELL") {
        const preSellHolding = holdings[tx.ticker];
        if (preSellHolding) {
          const returnPct = (tx.pricePerUnit - preSellHolding.averageCostBasis) / preSellHolding.averageCostBasis;
          const isWin = returnPct >= 0.05;
          const isLoss = returnPct <= -0.05;
          if (isWin || isLoss) {
            const algoDelta = isWin ? 0.3 : -0.15;
            tradeXPDeltas.algorithmMastery = algoDelta;
            // analystAcuity if the stock had an analyst unlock or active subscription
            if (state.analystUnlocks.includes(tx.ticker) || state.analystSubscription) {
              tradeXPDeltas.analystAcuity = algoDelta;
            }
            // eventReading if there are active market events
            if ((state.activeEvents ?? []).length > 0) {
              tradeXPDeltas.eventReading = isWin ? 0.15 : -0.08;
            }
          }
        }
      }

      if (tx.action === "BUY") {
        cash -= tx.totalValue;
        const existing = holdings[tx.ticker];
        if (existing) {
          const newQty = existing.quantity + tx.quantity;
          const newTotalCost = existing.totalCostBasis + tx.totalValue;
          holdings[tx.ticker] = {
            ...existing,
            quantity: newQty,
            totalCostBasis: newTotalCost,
            averageCostBasis: newTotalCost / newQty,
          };
        } else {
          const newHolding: Holding = {
            ticker: tx.ticker,
            assetType: tx.assetType,
            quantity: tx.quantity,
            averageCostBasis: tx.pricePerUnit,
            totalCostBasis: tx.totalValue,
          };
          holdings[tx.ticker] = newHolding;
        }
      } else {
        // SELL
        cash += tx.totalValue;
        const existing = holdings[tx.ticker];
        if (existing) {
          const newQty = existing.quantity - tx.quantity;
          if (newQty <= 0) {
            delete holdings[tx.ticker];
          } else {
            const soldCostBasis =
              (tx.quantity / existing.quantity) * existing.totalCostBasis;
            holdings[tx.ticker] = {
              ...existing,
              quantity: newQty,
              totalCostBasis: existing.totalCostBasis - soldCostBasis,
              averageCostBasis:
                (existing.totalCostBasis - soldCostBasis) / newQty,
            };
          }
        }
      }

      // ── Streak + XP from sell ─────────────────────────────────────────
      let xpGained = 0;
      let newTradeStreak = state.tradeStreak ?? 0;
      let newBestStreak = state.bestTradeStreak ?? 0;
      let lastTradeResult: GameState["lastTradeResult"] = state.lastTradeResult;

      if (tx.action === "SELL") {
        const preSell = state.portfolio.holdings[tx.ticker];
        const returnPct = preSell
          ? (tx.pricePerUnit - preSell.averageCostBasis) / preSell.averageCostBasis
          : 0;
        const profitDollars = preSell
          ? (tx.pricePerUnit - preSell.averageCostBasis) * tx.quantity
          : 0;

        if (returnPct > 0) {
          newTradeStreak += 1;
          newBestStreak = Math.max(newBestStreak, newTradeStreak);
          const streakBonus = Math.min(newTradeStreak, 5) * 5;
          if (returnPct >= 0.50) xpGained = 75 + streakBonus;
          else if (returnPct >= 0.20) xpGained = 40 + streakBonus;
          else xpGained = 15 + streakBonus;
        } else {
          newTradeStreak = 0;
        }

        void profitDollars; // suppress unused variable warning
      }

      // ── Challenge completion from this trade ─────────────────────────
      const preSellHoldingForChallenge = state.portfolio.holdings[tx.ticker];
      const returnPctForChallenge = preSellHoldingForChallenge && tx.action === "SELL"
        ? (tx.pricePerUnit - preSellHoldingForChallenge.averageCostBasis) / preSellHoldingForChallenge.averageCostBasis
        : null;
      const asset = state.assets[tx.ticker];
      const isPenny = asset ? ((asset as { sector?: string }).sector === "Speculative" || asset.currentPrice < 5) : false;
      const prevCompletedCount = (state.dailyChallenges ?? []).filter(c => c.day === state.currentDay && c.completed).length;
      const updatedChallenges = checkTradeChallenges(
        state.dailyChallenges ?? [],
        state.currentDay,
        tx.action,
        tx.assetType,
        isPenny,
        returnPctForChallenge,
      );
      const newCompletedCount = updatedChallenges.filter(c => c.day === state.currentDay && c.completed).length;
      const newlyCompleted = newCompletedCount - prevCompletedCount;

      // XP + cash from newly completed challenges
      let challengeXP = 0;
      let challengeCashReward = 0;
      if (newlyCompleted > 0) {
        const justCompleted = updatedChallenges.filter((c, i) => {
          const prev = (state.dailyChallenges ?? [])[i];
          return c.completed && prev && !prev.completed;
        });
        for (const c of justCompleted) {
          challengeXP += c.xpReward;
          challengeCashReward += c.cashReward;
        }
      }

      const totalXPGained = xpGained + challengeXP;

      // ── Achievement checking ───────────────────────────────────────────
      const newAchievementIds = checkAchievements(
        { ...state, tradeStreak: newTradeStreak },
        tx,
        state.currentDay,
      );
      const achievementXP = newAchievementIds.reduce((sum, id) => {
        const def = ACHIEVEMENTS.find((a) => a.id === id);
        return sum + (def?.xpReward ?? 0);
      }, 0);
      const newAchievementObjects = buildNewAchievements(newAchievementIds, state.currentDay);

      // Single gainSkillPoints call including all XP sources
      const { newXp, newSkillPoints } = gainSkillPoints(state.xp ?? 0, totalXPGained + achievementXP, state.skillPoints ?? 0);

      if (tx.action === "SELL" && xpGained > 0) {
        const preSell = state.portfolio.holdings[tx.ticker];
        lastTradeResult = {
          returnPct: preSell ? (tx.pricePerUnit - preSell.averageCostBasis) / preSell.averageCostBasis : 0,
          profitDollars: preSell ? (tx.pricePerUnit - preSell.averageCostBasis) * tx.quantity : 0,
          ticker: tx.ticker,
          xpGained: totalXPGained + achievementXP,
          streakCount: newTradeStreak,
          challengesCompleted: newlyCompleted,
        };
      }

      const { skills: tradeSkills, xp: tradeXP } = Object.keys(tradeXPDeltas).length > 0
        ? applySkillXP(state.traderSkills ?? DEFAULT_SKILLS, state.traderSkillsXP ?? DEFAULT_SKILLS, tradeXPDeltas)
        : { skills: state.traderSkills ?? DEFAULT_SKILLS, xp: state.traderSkillsXP ?? DEFAULT_SKILLS };

      return {
        ...state,
        pendingTrade: null,
        portfolio: {
          ...state.portfolio,
          cash: cash + challengeCashReward,
          holdings,
          transactions: [...state.portfolio.transactions, tx],
        },
        traderSkills: tradeSkills,
        traderSkillsXP: tradeXP,
        xp: newXp,
        skillPoints: newSkillPoints,
        tradeStreak: newTradeStreak,
        bestTradeStreak: newBestStreak,
        dailyChallenges: updatedChallenges,
        lastTradeResult,
        achievements: [...(state.achievements ?? []), ...newAchievementObjects],
        pendingAchievements: [...(state.pendingAchievements ?? []), ...newAchievementIds],
      };
    }

    case "SET_PENDING_TRADE":
      return { ...state, pendingTrade: action.payload };

    case "CANCEL_TRADE":
      return { ...state, pendingTrade: null };

    case "LOAD_GAME":
      return { ...action.payload };

    case "NEW_GAME":
      return { ...action.payload.initialState };

    case "UNLOCK_ANALYST_STOCK": {
      const { ticker } = action.payload;
      if (state.analystUnlocks.includes(ticker)) return state;
      if (state.portfolio.cash < 100) return state;
      return {
        ...state,
        analystUnlocks: [...state.analystUnlocks, ticker],
        portfolio: { ...state.portfolio, cash: state.portfolio.cash - 100 },
      };
    }

    case "BUY_ANALYST_SUBSCRIPTION": {
      if (state.portfolio.cash < 10_000) return state;
      return {
        ...state,
        analystSubscription: { purchasedDay: state.currentDay },
        portfolio: { ...state.portfolio, cash: state.portfolio.cash - 10_000 },
      };
    }

    case "VOTE_BLOG_POST": {
      const { postId, vote } = action.payload;
      const updatedFeed = state.blogFeed.map((post) => {
        if (post.id !== postId) return post;
        const prev = post.playerVote;
        let upvotes = post.upvotes;
        let downvotes = post.downvotes;
        // Undo previous vote
        if (prev === "UP") upvotes--;
        if (prev === "DOWN") downvotes--;
        // Apply new vote
        if (vote === "UP") upvotes++;
        if (vote === "DOWN") downvotes++;
        return { ...post, playerVote: vote, upvotes, downvotes };
      });
      return { ...state, blogFeed: updatedFeed };
    }

    case "POST_BLOG_POST": {
      const post = action.payload;
      const newCount = (state.playerPostCount ?? 0) + 1;

      // Check if posting this unlocks a new contact
      const newContactIds: string[] = getNewlyUnlockedContacts(
        state.contacts ?? [],
        newCount
      );

      return {
        ...state,
        blogFeed: [...state.blogFeed, post].slice(-720),
        playerPostCount: newCount,
        contacts: [...(state.contacts ?? []), ...newContactIds],
      };
    }

    case "ADD_CONTACT_TIPS": {
      const incoming = action.payload;
      if (!incoming.length) return state;
      return {
        ...state,
        contactTips: [...(state.contactTips ?? []), ...incoming].slice(-200),
      };
    }

    case "MARK_TIPS_READ":
      return {
        ...state,
        contactTips: (state.contactTips ?? []).map((t) => ({ ...t, isRead: true })),
      };

    case "DISMISS_CONTACT_TIP": {
      const { tipId } = action.payload;
      return {
        ...state,
        contactTips: (state.contactTips ?? []).filter((t) => t.id !== tipId),
      };
    }

    case "ADVANCE_MULTIPLE_DAYS": {
      let s = state;
      for (const day of action.payload.days) {
        const newDay = s.currentDay + 1;
        const newPortfolio = {
          ...s.portfolio,
          netWorthHistory: [
            ...s.portfolio.netWorthHistory,
            { day: newDay, netWorth: getNetWorth(s.portfolio, day.newAssets) },
          ],
        };
        const updatedTips =
          day.contactTips.length > 0
            ? [...(s.contactTips ?? []), ...day.contactTips].slice(-200)
            : s.contactTips ?? [];

        // Apply NPC votes to player posts
        const voteMap: Record<string, number> = {};
        for (const { postId, votes } of day.npcVotesOnPlayerPosts) {
          voteMap[postId] = (voteMap[postId] ?? 0) + votes;
        }
        const feedWithVotes = [...s.blogFeed, ...day.newBlogPosts]
          .map((p) => voteMap[p.id] ? { ...p, upvotes: p.upvotes + voteMap[p.id] } : p)
          .slice(-720);

        // Verify player posts that are exactly 2 days old and have a linked ticker
        let newVerifications = 0;
        let newWrongPredictions = 0;
        const updatedFeed = feedWithVotes.map((post) => {
          if (!post.isPlayerPost || post.isReal || post.isPredictionWrong || newDay - post.day !== 2 || post.linkedTickers.length === 0) return post;
          const ticker = post.linkedTickers[0];
          const asset = day.newAssets[ticker];
          if (!asset) return post;
          const priceAtPost = asset.priceHistory.find((p) => p.day === post.day)?.close;
          if (priceAtPost === undefined) return post;
          if (asset.currentPrice > priceAtPost) {
            newVerifications++;
            return { ...post, isReal: true };
          } else {
            newWrongPredictions++;
            return { ...post, isPredictionWrong: true };
          }
        });

        const blogXPDelta = newVerifications * 0.4 - newWrongPredictions * 0.2;
        const { skills: multiSkills, xp: multiXP } = applySkillXP(
          s.traderSkills ?? DEFAULT_SKILLS,
          s.traderSkillsXP ?? DEFAULT_SKILLS,
          { blogLiteracy: blogXPDelta }
        );

        // Wild blog price boost: apply 8x volatility overrides for wild-boosted posts
        const multiVolOverrides = { ...day.volatilityOverrides };
        for (const post of day.newBlogPosts) {
          if (post.source === "wildcat" && post.isReal && post.isWildBoosted) {
            for (const ticker of post.linkedTickers) {
              multiVolOverrides[ticker] = { multiplier: 8, expiresOnDay: newDay + 3 };
            }
          }
        }

        // Influence: daily portfolio performance
        const prevNW = s.portfolio.netWorthHistory.slice(-1)[0]?.netWorth ?? s.portfolio.cash;
        const curNW = getNetWorth(s.portfolio, day.newAssets);
        const dailyRet = prevNW > 0 ? (curNW - prevNW) / prevNW : 0;
        const perfDelta = dailyRet > 0.005 ? 3 : dailyRet < -0.005 ? -1.5 : 0;
        const blogInfDelta = newVerifications * 30 - newWrongPredictions * 12;
        const multiInfluence = Math.max(0, (s.playerInfluence ?? 0) + perfDelta + blogInfDelta);

        // Advisor emails + fees + skill drift
        const multiAdvisorEmails = [
          ...(s.advisorEmails ?? []),
          ...(day.advisorWeeklyEmails ?? []),
          ...(day.advisorHotTips ?? []),
        ].slice(-200);

        const multiHired = (s.hiredAdvisors ?? []).map((h) => {
          const update = (day.advisorSkillUpdates ?? []).find((u) => u.id === h.advisor.id);
          return update ? { ...h, currentSkills: update.skills } : h;
        });

        const fee = day.weeklyAdvisorFee ?? 0;
        const multiCash = Math.max(0, newPortfolio.cash - fee);
        const multiPortfolio = fee > 0 ? { ...newPortfolio, cash: multiCash } : newPortfolio;

        // XP: weekly profit bonus + milestone check
        const multiNW = getNetWorth(multiPortfolio, day.newAssets);
        const multiIsMonday = getDayOfWeek(state.startDate, newDay) === 1;
        let multiXPGain = 0;
        if (multiIsMonday) {
          const mwStart = newDay - 7;
          const mwEntry = s.portfolio.netWorthHistory.slice().reverse().find(e => e.day <= mwStart);
          const mwNW = mwEntry?.netWorth ?? (s.portfolio.netWorthHistory[0]?.netWorth ?? 10000);
          if (multiNW > mwNW) multiXPGain = 40;
        }
        const multiNewMilestones = MILESTONES.filter(m => multiNW >= m.netWorthThreshold && !(s.unlockedMilestones ?? []).includes(m.id));
        for (const m of multiNewMilestones) multiXPGain += m.xpReward;
        const multiUnlocked = [...(s.unlockedMilestones ?? []), ...multiNewMilestones.map(m => m.id)];
        const multiPending = multiNewMilestones.length > 0
          ? multiNewMilestones.sort((a, b) => b.netWorthThreshold - a.netWorthThreshold)[0].id
          : s.pendingMilestone;
        const { newXp: mXp, newSkillPoints: mSP } = gainSkillPoints(s.xp ?? 0, multiXPGain, s.skillPoints ?? 0);
        const multiChallenges = generateDailyChallenges(newDay);

        s = {
          ...s,
          currentDay: newDay,
          assets: day.newAssets,
          activeEvents: day.events,
          eventHistory: [...s.eventHistory, ...day.events],
          portfolio: multiPortfolio,
          volatilityOverrides: multiVolOverrides,
          recentEventCooldowns: day.newCooldowns,
          indexes: day.newIndexes,
          blogFeed: updatedFeed,
          contactTips: updatedTips,
          playerFollowerCount: day.newFollowerCount,
          playerVerifiedPostCount: (s.playerVerifiedPostCount ?? 0) + newVerifications,
          playerWrongPostCount: (s.playerWrongPostCount ?? 0) + newWrongPredictions,
          skillPoints: mSP,
          traderSkills: multiSkills,
          traderSkillsXP: multiXP,
          playerInfluence: multiInfluence,
          advisorEmails: multiAdvisorEmails,
          hiredAdvisors: multiHired,
          advisorPool: day.newAdvisorPool ?? (s.advisorPool ?? []),
          advisorPoolWeek: day.newAdvisorPool ? Math.ceil(newDay / 7) : (s.advisorPoolWeek ?? 0),
          xp: mXp,
          unlockedMilestones: multiUnlocked,
          pendingMilestone: multiPending,
          dailyChallenges: multiChallenges,
          achievements: [...(s.achievements ?? [])],
          pendingAchievements: s.pendingAchievements ?? [],
          rivalNetWorths: multiIsMonday ? computeAllRivalNetWorths(Math.ceil(newDay / 7)) : (s.rivalNetWorths ?? {}),
          activeSectorPlays: s.activeSectorPlays ?? [],
          researchPurchases: s.researchPurchases ?? [],
          weeklyJournal: s.weeklyJournal ?? [],
        };
      }
      return s;
    }

    case "BUY_PREMIUM_BLOG": {
      if (state.portfolio.cash < 5000) return state;
      return {
        ...state,
        premiumBlogSubscription: { purchasedDay: state.currentDay },
        portfolio: { ...state.portfolio, cash: state.portfolio.cash - 5000 },
      };
    }

    case "SPEND_POINT_ON_INFLUENCE": {
      if ((state.skillPoints ?? 0) < 1) return state;
      return {
        ...state,
        skillPoints: (state.skillPoints ?? 0) - 1,
        playerInfluence: (state.playerInfluence ?? 0) + 15,
      };
    }

    case "UPGRADE_SKILL": {
      const { skill } = action.payload;
      const UPGRADE_COSTS = [4, 8, 16, 28, 44]; // cost to go from level N to N+1
      const currentLevel = (state.traderSkills ?? {})[skill] ?? 0;
      if (currentLevel >= 5) return state;
      const cost = UPGRADE_COSTS[currentLevel];
      if ((state.skillPoints ?? 0) < cost) return state;
      return {
        ...state,
        skillPoints: (state.skillPoints ?? 0) - cost,
        traderSkills: {
          ...(state.traderSkills ?? DEFAULT_SKILLS),
          [skill]: currentLevel + 1,
        },
      };
    }

    case "REFRESH_ADVISOR_POOL":
      return {
        ...state,
        advisorPool: action.payload.pool,
        advisorPoolWeek: Math.ceil(state.currentDay / 7),
      };

    case "HIRE_ADVISOR": {
      const { advisor } = action.payload;
      if (state.portfolio.cash < advisor.weeklyFee) return state;
      // Don't hire duplicates
      if ((state.hiredAdvisors ?? []).some((h) => h.advisor.id === advisor.id)) return state;
      const hired = {
        advisor,
        hiredOnDay: state.currentDay,
        currentSkills: { ...advisor.skills },
      };
      return {
        ...state,
        hiredAdvisors: [...(state.hiredAdvisors ?? []), hired],
        advisorPool: (state.advisorPool ?? []).filter((a) => a.id !== advisor.id),
        portfolio: { ...state.portfolio, cash: state.portfolio.cash - advisor.weeklyFee },
      };
    }

    case "FIRE_ADVISOR": {
      const { advisorId } = action.payload;
      return {
        ...state,
        hiredAdvisors: (state.hiredAdvisors ?? []).filter((h) => h.advisor.id !== advisorId),
      };
    }

    case "MARK_ADVISOR_EMAILS_READ":
      return {
        ...state,
        advisorEmails: (state.advisorEmails ?? []).map((e) => ({ ...e, isRead: true })),
      };

    case "DISMISS_ADVISOR_EMAIL": {
      const { emailId } = action.payload;
      return {
        ...state,
        advisorEmails: (state.advisorEmails ?? []).filter((e) => e.id !== emailId),
      };
    }

    case "DISMISS_MILESTONE":
      return { ...state, pendingMilestone: null };

    case "DISMISS_TRADE_RESULT":
      return { ...state, lastTradeResult: null };

    case "DISMISS_ACHIEVEMENTS":
      return { ...state, pendingAchievements: [] };

    case "BUY_RESEARCH": {
      const purchase = action.payload;
      if (state.portfolio.cash < purchase.cost) return state;
      return {
        ...state,
        portfolio: { ...state.portfolio, cash: state.portfolio.cash - purchase.cost },
        researchPurchases: [...(state.researchPurchases ?? []), purchase],
      };
    }

    case "COMPLETE_SECTOR_PLAY": {
      const { id, won, resolvedDay } = action.payload;
      return {
        ...state,
        activeSectorPlays: (state.activeSectorPlays ?? []).map((p) =>
          p.id === id ? { ...p, completed: true, won, resolvedDay } : p
        ),
      };
    }

    case "RESET_GAME":
      return {
        currentDay: 1,
        startDate: "2026-01-05",
        assets: {},
        portfolio: {
          cash: 10_000,
          holdings: {},
          transactions: [],
          netWorthHistory: [],
        },
        playerName: "",
        activeEvents: [],
        eventHistory: [],
        recentEventCooldowns: {},
        volatilityOverrides: {},
        pendingTrade: null,
        gameStarted: false,
        indexes: {},
        blogFeed: [],
        analystUnlocks: [],
        analystSubscription: null,
        contacts: [],
        contactTips: [],
        playerPostCount: 0,
        playerFollowerCount: 0,
        playerVerifiedPostCount: 0,
        playerWrongPostCount: 0,
        skillPoints: 0,
        traderSkills: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0, riskManagement: 0, marketTiming: 0 },
        traderSkillsXP: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0, riskManagement: 0, marketTiming: 0 },
        playerInfluence: 0,
        premiumBlogSubscription: null,
        advisorPool: [],
        hiredAdvisors: [],
        advisorEmails: [],
        advisorPoolWeek: 0,
        xp: 0,
        tradeStreak: 0,
        bestTradeStreak: 0,
        dailyChallenges: [],
        unlockedMilestones: [],
        pendingMilestone: null,
        lastTradeResult: null,
        achievements: [],
        pendingAchievements: [],
        rivalNetWorths: {},
        activeSectorPlays: [],
        researchPurchases: [],
        weeklyJournal: [],
      };

    default:
      return state;
  }
}
