import type { GameState, GameAction, Holding, TraderSkills } from "@/types";
import { getNetWorth } from "@/utils/calculations";
import { getNewlyUnlockedContacts } from "@/engine/contactEngine";

// ── Organic skill XP ──────────────────────────────────────────────────────────
// Accumulate XP through performance; crossing thresholds auto-levels the skill.
const XP_UP   = 20;  // XP needed to gain 1 organic level (~30–50 qualifying actions)
const XP_DOWN = -10; // XP needed to lose 1 organic level

const DEFAULT_SKILLS: TraderSkills = { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 };

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

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADVANCE_DAY": {
      const {
        newAssets, events, volatilityOverrides, newCooldowns, newIndexes,
        newBlogPosts, newFollowerCount, npcVotesOnPlayerPosts, weeklySkillPoints,
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

      return {
        ...state,
        currentDay: newDay,
        assets: newAssets,
        activeEvents: events,
        eventHistory: newHistory,
        portfolio: newPortfolio,
        volatilityOverrides: newVolOverrides,
        recentEventCooldowns: newCooldowns,
        indexes: newIndexes,
        blogFeed: verifiedFeed,
        playerFollowerCount: newFollowerCount,
        playerVerifiedPostCount: (state.playerVerifiedPostCount ?? 0) + newVerifications,
        playerWrongPostCount: (state.playerWrongPostCount ?? 0) + newWrongPredictions,
        skillPoints: (state.skillPoints ?? 0) + weeklySkillPoints,
        traderSkills: newTraderSkills,
        traderSkillsXP: newTraderSkillsXP,
        playerInfluence: newInfluence,
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

      const { skills: tradeSkills, xp: tradeXP } = Object.keys(tradeXPDeltas).length > 0
        ? applySkillXP(state.traderSkills ?? DEFAULT_SKILLS, state.traderSkillsXP ?? DEFAULT_SKILLS, tradeXPDeltas)
        : { skills: state.traderSkills ?? DEFAULT_SKILLS, xp: state.traderSkillsXP ?? DEFAULT_SKILLS };

      return {
        ...state,
        pendingTrade: null,
        portfolio: {
          ...state.portfolio,
          cash,
          holdings,
          transactions: [...state.portfolio.transactions, tx],
        },
        traderSkills: tradeSkills,
        traderSkillsXP: tradeXP,
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

    case "CREATE_HEDGE_FUND":
      return { ...state, playerHedgeFund: action.payload };

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

        s = {
          ...s,
          currentDay: newDay,
          assets: day.newAssets,
          activeEvents: day.events,
          eventHistory: [...s.eventHistory, ...day.events],
          portfolio: newPortfolio,
          volatilityOverrides: multiVolOverrides,
          recentEventCooldowns: day.newCooldowns,
          indexes: day.newIndexes,
          blogFeed: updatedFeed,
          contactTips: updatedTips,
          playerFollowerCount: day.newFollowerCount,
          playerVerifiedPostCount: (s.playerVerifiedPostCount ?? 0) + newVerifications,
          playerWrongPostCount: (s.playerWrongPostCount ?? 0) + newWrongPredictions,
          skillPoints: (s.skillPoints ?? 0) + day.weeklySkillPoints,
          traderSkills: multiSkills,
          traderSkillsXP: multiXP,
          playerInfluence: multiInfluence,
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
          ...(state.traderSkills ?? { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 }),
          [skill]: currentLevel + 1,
        },
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
        playerHedgeFund: null,
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
        traderSkills: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 },
        traderSkillsXP: { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0 },
        playerInfluence: 0,
        premiumBlogSubscription: null,
      };

    default:
      return state;
  }
}
