// ============================================================
// Asset Types
// ============================================================

export type AssetType = "stock" | "crypto";

export type Sector =
  | "Technology"
  | "Social Media"
  | "E-Commerce"
  | "Electric Vehicles"
  | "Streaming"
  | "Fast Food"
  | "Banking"
  | "Space"
  | "Crypto"
  | "Retail"
  | "Entertainment"
  | "Fintech"
  | "Healthcare"
  | "Automotive"
  | "Speculative";

export interface PricePoint {
  day: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BaseAsset {
  ticker: string;
  name: string;
  type: AssetType;
  description: string;
  priceHistory: PricePoint[];
  currentPrice: number;
  previousPrice: number;
  volatility: number;
  trend: number;
}

export interface Stock extends BaseAsset {
  type: "stock";
  sector: Sector;
  sharesOutstanding: number;
  peRatio: number;
  dividendYield: number;
  earningsDay: number;
}

export interface Crypto extends BaseAsset {
  type: "crypto";
  sector: "Crypto";
  circulatingSupply: number;
  allTimeHigh: number;
  dominancePercent: number;
}

export type Asset = Stock | Crypto;

// ============================================================
// Event Types
// ============================================================

export type EventCategory =
  | "WORLD"
  | "MARKET"
  | "SECTOR"
  | "COMPANY"
  | "CRYPTO"
  | "MEME";

export type EventSentiment =
  | "VERY_BULLISH"
  | "BULLISH"
  | "BEARISH"
  | "VERY_BEARISH"
  | "MIXED";

export interface EventEffect {
  targetTickers?: string[];
  targetSectors?: Sector[];
  targetType?: AssetType;
  priceMultiplierRange: [number, number];
  volatilityBoostDays: number;
  volatilityMultiplier: number;
}

export interface EventConditions {
  /** Multiply probability by this when recent market events have been net-bearish */
  ifRecentBearish?: number;
  /** Multiply probability by this when recent market events have been net-bullish */
  ifRecentBullish?: number;
  /** Do not fire this event before this game day */
  minDay?: number;
}

export interface MarketEvent {
  id: string;
  category: EventCategory;
  sentiment: EventSentiment;
  headline: string;
  body: string;
  effect: EventEffect;
  probability: number;
  cooldownDays: number;
  icon: string;
  conditions?: EventConditions;
}

export interface FiredEvent {
  day: number;
  event: MarketEvent;
  affectedTickers: string[];
  actualMultipliers: Record<string, number>;
}

// ============================================================
// Hedge Fund Types
// ============================================================

export interface PlayerHedgeFund {
  name: string;
  strategy: string;
  emoji: string;
  foundedDay: number;
  foundedNetWorth: number;
}

// ============================================================
// Market Index Types
// ============================================================

export interface MarketIndex {
  id: string;
  ticker: string;
  name: string;
  description: string;
  constituents: string[];         // asset tickers that compose this index
  currentValue: number;
  previousValue: number;
  startingValue: number;          // round "starting" level (e.g. 16400)
  baseAvgPrice: number;           // average constituent price at game start
  history: Array<{ day: number; value: number }>;
}

// ============================================================
// Portfolio Types
// ============================================================

export interface Holding {
  ticker: string;
  assetType: AssetType;
  quantity: number;
  averageCostBasis: number;
  totalCostBasis: number;
}

export interface Transaction {
  id: string;
  day: number;
  ticker: string;
  assetType: AssetType;
  action: "BUY" | "SELL";
  quantity: number;
  pricePerUnit: number;
  totalValue: number;
  timestamp: number;
}

export interface Portfolio {
  cash: number;
  holdings: Record<string, Holding>;
  transactions: Transaction[];
  netWorthHistory: Array<{ day: number; netWorth: number }>;
}

// ============================================================
// Game State
// ============================================================

export interface PendingTrade {
  ticker: string;
  action: "BUY" | "SELL";
  quantity: number;
  pricePerUnit: number;
}

export interface VolatilityOverride {
  multiplier: number;
  expiresOnDay: number;
}

export interface AnalystSubscription {
  purchasedDay: number;
}

export interface GameState {
  currentDay: number;
  startDate: string;
  assets: Record<string, Asset>;
  portfolio: Portfolio;
  playerName: string;
  activeEvents: FiredEvent[];
  eventHistory: FiredEvent[];
  recentEventCooldowns: Record<string, number>;
  volatilityOverrides: Record<string, VolatilityOverride>;
  pendingTrade: PendingTrade | null;
  gameStarted: boolean;
  indexes: Record<string, MarketIndex>;
  playerHedgeFund: PlayerHedgeFund | null;
  blogFeed: BlogPost[];
  analystUnlocks: string[];                       // individual ticker unlocks ($100 each)
  analystSubscription: AnalystSubscription | null; // weekly all-access ($5,000/week)
  contacts: string[];          // unlocked contact IDs
  contactTips: ContactTip[];   // tips received from contacts
  playerPostCount: number;     // total posts submitted by the player
  playerFollowerCount: number; // NPC followers accumulated from blog posts
}

export interface SaveSlot {
  slotId: number;
  savedAt: string;
  playerName: string;
  currentDay: number;
  netWorth: number;
  snapshot: GameState;
}

// ============================================================
// Blog Feed Types
// ============================================================

export type BlogPostFlair = "DD" | "News" | "Discussion" | "Meme" | "YOLO" | "Shitpost";

export interface BlogPost {
  id: string;
  day: number;
  flair: BlogPostFlair;
  title: string;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  playerVote: "UP" | "DOWN" | null;
  isReal: boolean;
  linkedEventId: string | null;
  linkedTickers: string[];
  isPlayerPost?: boolean;
}

// ============================================================
// Contacts / Tips Types
// ============================================================

export type ContactTier = 1 | 2 | 3;

export interface ContactTip {
  id: string;
  contactId: string;
  day: number;
  ticker: string;
  direction: "bullish" | "bearish";
  message: string;
  isRead: boolean;
}

// ============================================================
// Reducer Actions
// ============================================================

export type GameAction =
  | {
      type: "ADVANCE_DAY";
      payload: {
        newAssets: Record<string, Asset>;
        events: FiredEvent[];
        volatilityOverrides: Record<string, VolatilityOverride>;
        newCooldowns: Record<string, number>;
        newIndexes: Record<string, MarketIndex>;
        newBlogPosts: BlogPost[];
        newFollowerCount: number;
        npcVotesOnPlayerPosts: { postId: string; votes: number }[];
      };
    }
  | { type: "EXECUTE_TRADE"; payload: Transaction }
  | { type: "SET_PENDING_TRADE"; payload: PendingTrade | null }
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "NEW_GAME"; payload: { playerName: string; initialState: GameState } }
  | { type: "CANCEL_TRADE" }
  | { type: "CREATE_HEDGE_FUND"; payload: PlayerHedgeFund }
  | { type: "VOTE_BLOG_POST"; payload: { postId: string; vote: "UP" | "DOWN" | null } }
  | { type: "UNLOCK_ANALYST_STOCK"; payload: { ticker: string } }
  | { type: "BUY_ANALYST_SUBSCRIPTION" }
  | { type: "POST_BLOG_POST"; payload: BlogPost }
  | { type: "ADD_CONTACT_TIPS"; payload: ContactTip[] }
  | { type: "MARK_TIPS_READ" }
  | { type: "DISMISS_CONTACT_TIP"; payload: { tipId: string } }
  | { type: "RESET_GAME" }
  | {
      type: "ADVANCE_MULTIPLE_DAYS";
      payload: {
        days: Array<{
          newAssets: Record<string, Asset>;
          events: FiredEvent[];
          volatilityOverrides: Record<string, VolatilityOverride>;
          newCooldowns: Record<string, number>;
          newIndexes: Record<string, MarketIndex>;
          newBlogPosts: BlogPost[];
          contactTips: ContactTip[];
          newFollowerCount: number;
          npcVotesOnPlayerPosts: { postId: string; votes: number }[];
        }>;
      };
    };
