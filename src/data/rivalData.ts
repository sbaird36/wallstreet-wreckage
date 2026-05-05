export interface RivalDef {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  // weekly return bias: mean and standard deviation
  weeklyReturnMean: number;
  weeklyReturnStd: number;
}

export const RIVALS: RivalDef[] = [
  { id: "r1", name: "Chad Thunderbull",  emoji: "🐂", personality: "Aggressive",   weeklyReturnMean: 0.04,  weeklyReturnStd: 0.08 },
  { id: "r2", name: "Karen Bearsworth",  emoji: "🐻", personality: "Perma-Bear",   weeklyReturnMean: -0.01, weeklyReturnStd: 0.05 },
  { id: "r3", name: "Wesley Index",      emoji: "📊", personality: "Conservative", weeklyReturnMean: 0.015, weeklyReturnStd: 0.02 },
  { id: "r4", name: "Degen McApe",       emoji: "🦍", personality: "Degen",        weeklyReturnMean: 0.06,  weeklyReturnStd: 0.15 },
  { id: "r5", name: "Patricia Hedge",    emoji: "🌿", personality: "Hedger",       weeklyReturnMean: 0.02,  weeklyReturnStd: 0.03 },
  { id: "r6", name: "Rick Momentum",     emoji: "🚀", personality: "Momentum",     weeklyReturnMean: 0.035, weeklyReturnStd: 0.07 },
  { id: "r7", name: "Algo Sandra",       emoji: "🤖", personality: "Algorithmic",  weeklyReturnMean: 0.025, weeklyReturnStd: 0.04 },
  { id: "r8", name: "Boomer Bob",        emoji: "👴", personality: "Value",        weeklyReturnMean: 0.01,  weeklyReturnStd: 0.02 },
];
