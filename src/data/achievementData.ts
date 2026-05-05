export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  // used for display grouping
  category: "trading" | "streak" | "social" | "portfolio" | "exploration";
}

export const ACHIEVEMENTS: AchievementDef[] = [
  // Trading
  { id: "first_trade",    title: "First Blood",       description: "Make your first trade",                        emoji: "🩸", xpReward: 30,  category: "trading" },
  { id: "first_win",      title: "First Win",         description: "Close a position at a profit",                 emoji: "✅", xpReward: 40,  category: "trading" },
  { id: "big_winner",     title: "Big Winner",        description: "Sell a position for 50%+ profit",              emoji: "🎯", xpReward: 100, category: "trading" },
  { id: "ten_bagger",     title: "10-Bagger",         description: "Achieve a 10x return on a single position",    emoji: "🚀", xpReward: 250, category: "trading" },
  { id: "day_trader",     title: "Day Trader",        description: "Make 3 or more trades in a single day",        emoji: "⚡", xpReward: 50,  category: "trading" },
  { id: "diversified",    title: "Diversified",       description: "Hold 5 or more different assets at once",      emoji: "🌐", xpReward: 60,  category: "trading" },
  { id: "sector_master",  title: "Sector Play",       description: "Win a 3-stock sector combo",                   emoji: "🏭", xpReward: 80,  category: "trading" },
  { id: "diamond_hands",  title: "Diamond Hands",     description: "Hold a position for 10+ days",                 emoji: "💎", xpReward: 75,  category: "trading" },
  { id: "knife_catcher",  title: "Knife Catcher",     description: "Buy a stock that dropped 20%+ this week",      emoji: "🔪", xpReward: 60,  category: "trading" },
  { id: "penny_player",   title: "Penny Pincher",     description: "Buy 5 different penny stocks",                 emoji: "💰", xpReward: 55,  category: "trading" },
  // Streaks
  { id: "streak_3",       title: "On Fire",           description: "Win 3 trades in a row",                        emoji: "🔥", xpReward: 40,  category: "streak" },
  { id: "streak_5",       title: "Hot Streak",        description: "Win 5 trades in a row",                        emoji: "🔥🔥", xpReward: 75, category: "streak" },
  { id: "streak_10",      title: "Unstoppable",       description: "Win 10 trades in a row",                       emoji: "💥", xpReward: 150, category: "streak" },
  { id: "perfect_week",   title: "Perfect Week",      description: "All sells profitable in one week (min 3)",     emoji: "⭐", xpReward: 100, category: "streak" },
  // Social
  { id: "first_post",     title: "WSB Debut",         description: "Submit your first blog post",                  emoji: "✍️", xpReward: 20,  category: "social" },
  { id: "verified_5",     title: "Verified Caller",   description: "Get 5 verified post predictions",              emoji: "✓",  xpReward: 80,  category: "social" },
  { id: "followers_500",  title: "Rising Star",       description: "Reach 500 followers",                          emoji: "📣", xpReward: 75,  category: "social" },
  { id: "followers_1000", title: "WSB Legend",        description: "Reach 1,000 followers",                        emoji: "👑", xpReward: 150, category: "social" },
  // Portfolio
  { id: "doubled_up",     title: "Doubled Up",        description: "Net worth reached $20,000",                    emoji: "📈", xpReward: 50,  category: "portfolio" },
  { id: "challenge_10",   title: "Challenge Hunter",  description: "Complete 10 daily challenges",                 emoji: "🏹", xpReward: 80,  category: "exploration" },
  { id: "researcher",     title: "Researcher",        description: "Purchase 3 research reports",                  emoji: "🔬", xpReward: 60,  category: "exploration" },
  { id: "hired_advisor",  title: "Power Move",        description: "Hire your first financial advisor",            emoji: "👔", xpReward: 40,  category: "exploration" },
];
