import type { GameState, GameAction, Holding } from "@/types";
import { getNetWorth } from "@/utils/calculations";
import { getNewlyUnlockedContacts } from "@/engine/contactEngine";

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

      return {
        ...state,
        currentDay: newDay,
        assets: newAssets,
        activeEvents: events,
        eventHistory: newHistory,
        portfolio: newPortfolio,
        volatilityOverrides,
        recentEventCooldowns: newCooldowns,
        indexes: newIndexes,
        blogFeed: verifiedFeed,
        playerFollowerCount: newFollowerCount,
        playerVerifiedPostCount: (state.playerVerifiedPostCount ?? 0) + newVerifications,
        playerWrongPostCount: (state.playerWrongPostCount ?? 0) + newWrongPredictions,
      };
    }

    case "EXECUTE_TRADE": {
      const tx = action.payload;
      const holdings = { ...state.portfolio.holdings };
      let cash = state.portfolio.cash;

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

      return {
        ...state,
        pendingTrade: null,
        portfolio: {
          ...state.portfolio,
          cash,
          holdings,
          transactions: [...state.portfolio.transactions, tx],
        },
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

        s = {
          ...s,
          currentDay: newDay,
          assets: day.newAssets,
          activeEvents: day.events,
          eventHistory: [...s.eventHistory, ...day.events],
          portfolio: newPortfolio,
          volatilityOverrides: day.volatilityOverrides,
          recentEventCooldowns: day.newCooldowns,
          indexes: day.newIndexes,
          blogFeed: updatedFeed,
          contactTips: updatedTips,
          playerFollowerCount: day.newFollowerCount,
          playerVerifiedPostCount: (s.playerVerifiedPostCount ?? 0) + newVerifications,
          playerWrongPostCount: (s.playerWrongPostCount ?? 0) + newWrongPredictions,
        };
      }
      return s;
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
      };

    default:
      return state;
  }
}
