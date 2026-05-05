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

// ============================================================
// Advisor Types
// ============================================================

export interface AdvisorSkills {
  stockPicking: number;    // 0-10: accuracy on stock direction tips
  cryptoKnowledge: number; // 0-10: accuracy on crypto tips
  riskManagement: number;  // 0-10: quality of bearish / downside warnings
  marketTiming: number;    // 0-10: frequency + quality of hot tips
}

export interface Advisor {
  id: string;
  name: string;
  title: string;
  bio: string;
  emoji: string;
  skills: AdvisorSkills;
  weeklyFee: number;
  specialty: string; // "General" | Sector | "Crypto"
}

export interface HiredAdvisor {
  advisor: Advisor;
  hiredOnDay: number;
  currentSkills: AdvisorSkills; // drifts weekly
}

export interface AdvisorEmail {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorEmoji: string;
  day: number;
  subject: string;
  body: string;
  tickers: string[];
  tipDirection: "bullish" | "bearish" | null;
  isRead: boolean;
  type: "weekly" | "hot_tip";
}

// ============================================================
// Trader Progression
// ============================================================

export interface TraderSkills {
  blogLiteracy: number;      // 0-5: identify real vs fake posts
  analystAcuity: number;     // 0-5: analyst pick insight & accuracy
  algorithmMastery: number;  // 0-5: stock-picking algorithm upgrades
  eventReading: number;      // 0-5: world/market event awareness
  riskManagement: number;    // 0-5: risk/drawdown awareness
  marketTiming: number;      // 0-5: entry/exit timing
}

// ============================================================
// Achievement Types
// ============================================================

export interface Achievement {
  id: string;
  unlockedOnDay: number;
  xpAwarded: number;
}

// ============================================================
// NPC Rival Types
// ============================================================

export interface NpcRival {
  id: string;
  name: string;
  emoji: string;
  personality: string; // e.g. "Aggressive", "Conservative"
  weeklyNetWorth: number; // computed each week
}

// ============================================================
// Sector Play Types
// ============================================================

export interface SectorPlay {
  id: string;
  sector: string;
  tickers: string[];
  startDay: number;
  completed: boolean;
  won: boolean | null; // null = active, true/false = resolved
  resolvedDay: number | null;
}

// ============================================================
// Research Purchase Types
// ============================================================

export type ResearchType = "earnings_preview" | "insider_flow" | "macro_report" | "sentiment_scan";

export interface ResearchPurchase {
  id: string;
  type: ResearchType;
  ticker: string | null;
  purchasedDay: number;
  cost: number;
  result: string; // human-readable result text
  direction: "bullish" | "bearish" | "neutral" | null;
}

// ============================================================
// Weekly Journal Types
// ============================================================

export interface JournalEntry {
  weekNumber: number;
  startDay: number;
  endDay: number;
  netWorthStart: number;
  netWorthEnd: number;
  changePct: number;
  tradeCount: number;
  bestTrade: { ticker: string; returnPct: number } | null;
  worstTrade: { ticker: string; returnPct: number } | null;
  narrative: string; // auto-generated summary sentence
  challengesCompleted: number;
  achievementsUnlocked: string[];
}

export type ChallengeType =
  | "make_trade"
  | "buy_penny"
  | "buy_crypto"
  | "sell_profit"
  | "big_win"
  | "hold_diversified"
  | "portfolio_up";

export interface DailyChallenge {
  id: string;
  day: number;
  type: ChallengeType;
  description: string;
  xpReward: number;
  cashReward: number;
  completed: boolean;
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
  blogFeed: BlogPost[];
  analystUnlocks: string[];                       // individual ticker unlocks ($100 each)
  analystSubscription: AnalystSubscription | null; // weekly all-access ($5,000/week)
  contacts: string[];          // unlocked contact IDs
  contactTips: ContactTip[];   // tips received from contacts
  playerPostCount: number;          // total posts submitted by the player
  playerFollowerCount: number;      // NPC followers earned from trading performance
  playerVerifiedPostCount: number;  // player posts whose ticker prediction came true
  playerWrongPostCount: number;     // player posts whose ticker prediction was wrong
  skillPoints: number;              // unspent trader skill points
  traderSkills: TraderSkills;       // current skill levels (0-5 each)
  traderSkillsXP: TraderSkills;     // organic XP per skill (float); ±10/-5 auto-levels
  playerInfluence: number;
  premiumBlogSubscription: { purchasedDay: number } | null;
  advisorPool: Advisor[];
  hiredAdvisors: HiredAdvisor[];
  advisorEmails: AdvisorEmail[];
  advisorPoolWeek: number;
  // XP & progression
  xp: number;
  tradeStreak: number;
  bestTradeStreak: number;
  dailyChallenges: DailyChallenge[];
  unlockedMilestones: string[];
  pendingMilestone: string | null;
  lastTradeResult: {
    returnPct: number;
    profitDollars: number;
    ticker: string;
    xpGained: number;
    streakCount: number;
    challengesCompleted: number;
  } | null;

  // Achievements
  achievements: Achievement[];
  pendingAchievements: string[]; // achievement IDs to show notification

  // NPC Rivals
  rivalNetWorths: Record<string, number>; // rivalId -> current net worth

  // Sector plays
  activeSectorPlays: SectorPlay[];

  // Research
  researchPurchases: ResearchPurchase[];

  // Journal
  weeklyJournal: JournalEntry[];
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
  isPredictionWrong?: boolean;  // player post whose ticker went the wrong direction
  source: "wsb" | "premium" | "wildcat";
  isWildBoosted?: boolean;
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
        advisorHotTips?: AdvisorEmail[];
        advisorWeeklyEmails?: AdvisorEmail[];
        newAdvisorPool?: Advisor[] | null;
        advisorSkillUpdates?: Array<{ id: string; skills: AdvisorSkills }>;
        weeklyAdvisorFee?: number;
      };
    }
  | { type: "REFRESH_ADVISOR_POOL"; payload: { pool: Advisor[] } }
  | { type: "HIRE_ADVISOR"; payload: { advisor: Advisor } }
  | { type: "FIRE_ADVISOR"; payload: { advisorId: string } }
  | { type: "MARK_ADVISOR_EMAILS_READ" }
  | { type: "DISMISS_ADVISOR_EMAIL"; payload: { emailId: string } }
  | { type: "EXECUTE_TRADE"; payload: Transaction }
  | { type: "SET_PENDING_TRADE"; payload: PendingTrade | null }
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "NEW_GAME"; payload: { playerName: string; initialState: GameState } }
  | { type: "CANCEL_TRADE" }
  | { type: "VOTE_BLOG_POST"; payload: { postId: string; vote: "UP" | "DOWN" | null } }
  | { type: "UNLOCK_ANALYST_STOCK"; payload: { ticker: string } }
  | { type: "BUY_ANALYST_SUBSCRIPTION" }
  | { type: "POST_BLOG_POST"; payload: BlogPost }
  | { type: "ADD_CONTACT_TIPS"; payload: ContactTip[] }
  | { type: "MARK_TIPS_READ" }
  | { type: "DISMISS_CONTACT_TIP"; payload: { tipId: string } }
  | { type: "RESET_GAME" }
  | { type: "UPGRADE_SKILL"; payload: { skill: keyof TraderSkills } }
  | { type: "BUY_PREMIUM_BLOG" }
  | { type: "SPEND_POINT_ON_INFLUENCE" }
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
          advisorHotTips?: AdvisorEmail[];
          advisorWeeklyEmails?: AdvisorEmail[];
          newAdvisorPool?: Advisor[] | null;
          advisorSkillUpdates?: Array<{ id: string; skills: AdvisorSkills }>;
          weeklyAdvisorFee?: number;
        }>;
      };
    }
  | { type: "DISMISS_MILESTONE" }
  | { type: "DISMISS_TRADE_RESULT" }
  | { type: "DISMISS_ACHIEVEMENTS" }
  | { type: "BUY_RESEARCH"; payload: ResearchPurchase }
  | { type: "COMPLETE_SECTOR_PLAY"; payload: { id: string; won: boolean; resolvedDay: number } };
