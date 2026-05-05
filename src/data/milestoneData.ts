export interface MilestoneDefinition {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  netWorthThreshold: number;
  xpReward: number;
}

export const MILESTONES: MilestoneDefinition[] = [
  { id: "m_15k",  title: "Making Moves",       subtitle: "Net worth hit $15,000",    emoji: "📈", netWorthThreshold: 15_000,    xpReward: 50  },
  { id: "m_25k",  title: "Getting Serious",    subtitle: "Net worth hit $25,000",    emoji: "🎯", netWorthThreshold: 25_000,    xpReward: 75  },
  { id: "m_50k",  title: "Hedge Fund Baby",    subtitle: "Net worth hit $50,000",    emoji: "🏦", netWorthThreshold: 50_000,    xpReward: 100 },
  { id: "m_75k",  title: "Wolf of Wall St",    subtitle: "Net worth hit $75,000",    emoji: "🐺", netWorthThreshold: 75_000,    xpReward: 125 },
  { id: "m_100k", title: "Six Figures",         subtitle: "Net worth hit $100,000",   emoji: "💰", netWorthThreshold: 100_000,   xpReward: 150 },
  { id: "m_250k", title: "Quarter Mil Club",   subtitle: "Net worth hit $250,000",   emoji: "🚀", netWorthThreshold: 250_000,   xpReward: 200 },
  { id: "m_500k", title: "Exit Liquidity",     subtitle: "Net worth hit $500,000",   emoji: "💎", netWorthThreshold: 500_000,   xpReward: 250 },
  { id: "m_1m",   title: "Millionaire",        subtitle: "Net worth hit $1,000,000", emoji: "🎰", netWorthThreshold: 1_000_000, xpReward: 500 },
];
