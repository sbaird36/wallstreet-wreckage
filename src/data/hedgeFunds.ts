export interface HedgeFundDef {
  id: string;
  name: string;
  realAnalog: string;
  emoji: string;
  strategy: string;
  minScore: number; // 0–100 interest score required to unlock
  description: string;
  recruiterQuote: string; // what they say when interested
}

export const HEDGE_FUNDS: HedgeFundDef[] = [
  {
    id: "dunning_kruger",
    name: "Dunning-Kruger Capital",
    realAnalog: "Generic Boutique",
    emoji: "🧠",
    strategy: "Vibes-Based Macro",
    minScore: 4,
    description:
      "A small fund founded by three ex-stockbrokers who each describe themselves as 'a bit of a genius.' They accept anyone who can show a positive return, even accidental ones. Their pitch deck contains 14 spelling errors and a clip art bull.",
    recruiterQuote:
      "Hey, we noticed you made some money. We're not sure how, but we'd like to give you other people's money to do it again.",
  },
  {
    id: "acme_capital",
    name: "Acme Capital Partners",
    realAnalog: "Smaller Boutique",
    emoji: "📎",
    strategy: "Long/Short Equity",
    minScore: 14,
    description:
      "Acme Capital is a mid-sized fund that primarily invests in companies with names that sound like other companies. Their flagship strategy, 'Confusion Alpha,' has outperformed benchmarks every year they remember to measure it.",
    recruiterQuote:
      "Your returns are solid. Not spectacular, but solid. We could use someone like you in a role we'd describe as 'junior-ish.'",
  },
  {
    id: "sandbar_macro",
    name: "Sandbar Global Macro",
    realAnalog: "Caxton Associates",
    emoji: "🏖️",
    strategy: "Global Macro",
    minScore: 25,
    description:
      "Sandbar bets on entire economies going up or down, which is like betting on weather but with more Excel. Their chief economist once predicted a recession every year for 12 years and considers himself 1-for-12. Their fund is based in the Cayman Islands, officially for 'cultural reasons.'",
    recruiterQuote:
      "Your macro intuition is promising. We have an open analyst role. The hours are 'flexible,' which means constant.",
  },
  {
    id: "otter_creek",
    name: "Otter Creek Value Fund",
    realAnalog: "Baupost Group",
    emoji: "🦦",
    strategy: "Deep Value",
    minScore: 36,
    description:
      "Otter Creek seeks undervalued companies that the market has forgotten, overlooked, or deeply insulted. Their process involves reading every SEC filing ever published, which is why their analysts look the way they do. They have not taken on a new investor since 2008 and are proud of it.",
    recruiterQuote:
      "We don't reach out often. Your value instincts caught our attention. Come meet Seth — he doesn't bite, but he will quiz you on footnotes.",
  },
  {
    id: "viking_goblin",
    name: "Viking Goblin Investors",
    realAnalog: "Viking Global",
    emoji: "🧌",
    strategy: "Equity Long/Short",
    minScore: 46,
    description:
      "Viking Goblin runs a concentrated long/short book, meaning they bet heavily on specific companies going up and other specific companies going down, which is very confident of them. Their AUM is $45 billion, a number their founder describes as 'a good start.'",
    recruiterQuote:
      "We've been watching your book. The concentration and conviction show promise. We'd like to explore a PM role.",
  },
  {
    id: "ellipsoid",
    name: "Ellipsoid Management",
    realAnalog: "Elliott Management",
    emoji: "🔮",
    strategy: "Event-Driven / Activist",
    minScore: 56,
    description:
      "Ellipsoid buys large stakes in companies and then sends them letters demanding changes in a tone best described as 'threatening but technically polite.' They have forced the resignation of 14 CEOs and once caused an entire country to renegotiate its debt. Paul Singlet describes himself as 'a concerned investor.'",
    recruiterQuote:
      "Your returns show you're not afraid to be contrarian. We need people who can write a strongly-worded letter and mean it.",
  },
  {
    id: "point73",
    name: "Point73 Asset Management",
    realAnalog: "Point72",
    emoji: "📐",
    strategy: "Multi-Strategy",
    minScore: 64,
    description:
      "Point73 was founded after its predecessor, Point72, was banned from accepting outside money for two years following an insider trading settlement. They changed the name by one and consider the matter closed. Steve Cohain runs the fund and is famously intense, famously wealthy, and famously the owner of a sports team that loses in a different way each year.",
    recruiterQuote:
      "You've been flagged by our talent team. Your Sharpe ratio is in the top quartile of people we've tracked this cycle. Formal interview next week.",
  },
  {
    id: "millstone",
    name: "Millstone Management",
    realAnalog: "Millennium Management",
    emoji: "⚙️",
    strategy: "Multi-Strategy Quant",
    minScore: 72,
    description:
      "Millstone runs 300 independent portfolio manager pods, each competing against the others in a cage match of capital allocation. If your pod underperforms, it is 'restructured,' which is the polite word for dissolved. Izzy Engelsmann, the founder, has a simple rule: make money or leave. He has not clarified what 'leave' means.",
    recruiterQuote:
      "Our PM selection process has a 97% rejection rate. You've cleared the first round. The next four rounds are harder.",
  },
  {
    id: "citidal",
    name: "Citidal LLC",
    realAnalog: "Citadel",
    emoji: "🏰",
    strategy: "Multi-Strategy / Market Making",
    minScore: 80,
    description:
      "Citidal is run by Ken Grifton, who has made more money than several countries and uses it to buy art, sports teams, and politicians (allegedly the first two). Their market-making arm processes 30% of all U.S. retail trades, which regulators describe as 'fine, probably.' Their interview process includes a math test, a logic puzzle, and a staring contest.",
    recruiterQuote:
      "Ken reviewed your numbers personally. He does not do this often. You are invited to our Miami headquarters for a superday. Dress well.",
  },
  {
    id: "de_claw",
    name: "D.E. Claw & Co.",
    realAnalog: "D.E. Shaw",
    emoji: "🦞",
    strategy: "Systematic / Quant",
    minScore: 86,
    description:
      "D.E. Claw was founded by a computer scientist who realized markets were inefficient and had a computer agree with him. Their algorithms run on proprietary hardware in a data center the public is not allowed to know the location of. David E. Claw holds a PhD in theoretical computer science and considers it relevant to everything.",
    recruiterQuote:
      "Your pattern recognition is statistically anomalous. We'd like to understand it better, and if possible, automate it. Please bring your trading log.",
  },
  {
    id: "two_sigma_minus",
    name: "Two Sigma Minus One",
    realAnalog: "Two Sigma",
    emoji: "Σ",
    strategy: "Data-Driven Quant",
    minScore: 92,
    description:
      "Two Sigma Minus One believes markets are fundamentally a data problem that can be solved by enough data scientists with enough computers. They have hired 3,000 PhDs and are currently unsatisfied. Their returns are a secret. Their fees are not — 3-and-30, meaning they take 3% of your assets and 30% of profits, and thank you for asking.",
    recruiterQuote:
      "Our models flagged your return profile as statistically improbable without systematic edge. We would like to know what you know.",
  },
  {
    id: "bridgemuddier",
    name: "Bridgemuddier Associates",
    realAnalog: "Bridgewater Associates",
    emoji: "🌊",
    strategy: "Global Macro / Principles-Based",
    minScore: 97,
    description:
      "Bridgemuddier is the world's largest hedge fund by AUM and the most philosophical by word count. Founder Ray Dahlia has written a book called 'Principles' that employees are required to read, discuss, and agree with. Meetings are recorded. Disagreements are 'welcomed.' Performance is strong; retention is described as 'a dynamic process.'",
    recruiterQuote:
      "You have been identified as a potential 'believable person' — someone whose track record earns them the right to have opinions. Ray would like to meet you. He will ask hard questions.",
  },
];

export const FUND_STRATEGIES = [
  "Long/Short Equity",
  "Global Macro",
  "Quantitative",
  "Event-Driven",
  "Deep Value",
  "Multi-Strategy",
  "Growth Equity",
  "Distressed Assets",
  "Systematic Trend",
  "Statistical Arbitrage",
] as const;

export type FundStrategy = (typeof FUND_STRATEGIES)[number];
