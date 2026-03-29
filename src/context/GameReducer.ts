import type { GameState, GameAction, Holding } from "@/types";
import { getNetWorth } from "@/utils/calculations";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "ADVANCE_DAY": {
      const { newAssets, events, volatilityOverrides, newCooldowns, newIndexes, newBlogPosts } = action.payload;
      const newDay = state.currentDay + 1;
      const newHistory = [...state.eventHistory, ...events];

      const newPortfolio = {
        ...state.portfolio,
        netWorthHistory: [
          ...state.portfolio.netWorthHistory,
          { day: newDay, netWorth: getNetWorth(state.portfolio, newAssets) },
        ],
      };

      // Keep rolling blog feed (last 60 days max to avoid unbounded growth)
      const updatedFeed = [...state.blogFeed, ...newBlogPosts].slice(-720);

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
        blogFeed: updatedFeed,
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

    default:
      return state;
  }
}
