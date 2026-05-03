// Raw pools for procedural advisor generation

export const ADVISOR_FIRST_NAMES = [
  "Warren", "Charles", "Janet", "Ray", "Peter", "Cathie", "Bill", "Michael",
  "Sandra", "Victor", "Helena", "Douglas", "Priya", "Marcus", "Elaine",
  "Chad", "Yolo", "Diamond", "Wen", "Sergei", "Brenda", "Knox", "Felicity",
];

export const ADVISOR_LAST_NAMES = [
  "Prattle", "Mundane", "Fiscally", "Dalio Jr.", "Lynch-Pin", "Woodsworth",
  "Ackermann", "Burry-ish", "Greenwald", "Merriweather", "Goldstein",
  "McTendies", "Hands", "Lambo", "Moonski", "Cashflow", "Buffoon",
  "Quant", "Stonks", "Vix", "Sharpe", "Beta", "Sigma",
];

export const ADVISOR_TITLES_BY_TIER: Record<1 | 2 | 3, string[]> = {
  1: [
    "Junior Analyst",
    "Market Enthusiast",
    "Self-Taught Trader",
    "Financial Blogger",
    "Part-Time Advisor",
    "Discount Strategist",
    "Retail Investor",
    "Newsletter Writer",
  ],
  2: [
    "Senior Portfolio Analyst",
    "Sector Specialist",
    "Quantitative Strategist",
    "Fund Manager",
    "Technical Analyst",
    "Market Strategist",
    "Risk Consultant",
  ],
  3: [
    "Chief Investment Officer",
    "Managing Director",
    "Hedge Fund Veteran",
    "Wall Street Legend",
    "Alpha Generator",
    "Elite Market Maker",
  ],
};

export const ADVISOR_BIOS_BY_SPECIALTY: Record<string, string[]> = {
  General: [
    "A generalist with a nose for value. Sometimes right, always opinionated.",
    "Applies a 'common sense' framework to markets that occasionally makes sense.",
    "Reads every earnings report on the toilet. Has strong opinions about all of them.",
    "Former insurance actuary who now applies actuarial math to stock picks with debatable results.",
    "Believes markets are 90% psychology. Whether that helps their picks is unclear.",
  ],
  Technology: [
    "Covers tech stocks almost exclusively. Owns seven screens and a standing desk.",
    "Former software engineer turned analyst. Understands technology, less so valuation.",
    "Tracks tech earnings like a hawk. Has a spreadsheet with over 400 tabs.",
    "Believes every company is a tech company if you squint hard enough.",
  ],
  Crypto: [
    "Deep in the crypto rabbit hole. Speaks fluent blockchain. Sleeps four hours.",
    "Has been 'this close' to calling every major crypto move for three years.",
    "All-in on Web3. Still not entirely sure what it means but very bullish.",
    "Tracks crypto dominance charts hourly. Their on-chain analysis is either genius or noise.",
  ],
  "Electric Vehicles": [
    "Obsessed with EV adoption curves. Has a model for every scenario.",
    "Believes internal combustion engines are already dead. Prices stocks accordingly.",
  ],
  Banking: [
    "Former bank examiner who now rates banks from the outside. Highly suspicious of all of them.",
    "Tracks interest rate spreads religiously. Puts you to sleep explaining why that matters.",
  ],
  Healthcare: [
    "Has a medical background and very strong views on drug approval pipelines.",
    "Reads FDA filings for fun. Highly opinionated, occasionally correct.",
  ],
  "Fast Food": [
    "Tracks same-store sales data with unusual intensity. Eats at every chain for 'research.'",
  ],
  Space: [
    "Believes space is the next trillion-dollar market. Has been saying this since 2018.",
  ],
  Fintech: [
    "Thinks every traditional bank will be disrupted. Frequently correct, poor at timing.",
  ],
  Speculative: [
    "Specializes in high-risk, high-reward plays. Win rate is low. Return potential is astronomical.",
    "Says 'asymmetric upside' a lot. Sometimes it's even true.",
  ],
  "Social Media": [
    "Tracks engagement metrics and monetization trends obsessively. Always on their phone.",
  ],
  "E-Commerce": [
    "Has a proprietary model for predicting online retail trends. Built in Excel. Very complex.",
  ],
  Streaming: [
    "Tracks subscriber counts and churn rates like their life depends on it.",
  ],
  Retail: [
    "Walks every mall in a 50-mile radius for 'channel checks.' Surprisingly effective.",
  ],
  Entertainment: [
    "Box office data, streaming metrics, live event revenue — if it entertains, they track it.",
  ],
  Automotive: [
    "Deep into auto industry cycles, dealer inventories, and OEM margins. Dry but accurate.",
  ],
};

export const ADVISOR_EMOJIS = [
  "👔", "🎩", "📊", "💼", "🧠", "🔭", "📈", "🦅", "🦊", "🐂",
  "🐻", "🎯", "💡", "🔮", "🃏", "🌊", "⚡", "🧮", "🦁", "🐺",
];

// Weekly email body templates (use {name}, {tickers}, {direction})
export const WEEKLY_EMAIL_TEMPLATES_BULLISH = [
  `Morning. Markets look constructive this week. I'm watching {tickers} closely — the setup is favorable and I'd be a buyer on any dip. My conviction is moderate but the risk/reward is there.`,
  `Here's my weekly note. After reviewing the tape, {tickers} stand out as names worth accumulating. Nothing is certain, but the technicals and fundamentals are aligned. Position accordingly.`,
  `Quick update: {tickers} are on my radar with bullish bias. The macro backdrop isn't perfect, but these names have idiosyncratic catalysts. I'd be building a position.`,
  `This week I'm constructive on {tickers}. The narrative is shifting and I think the market is underappreciating the upside. Watch for volume confirmation before going heavy.`,
];

export const WEEKLY_EMAIL_TEMPLATES_BEARISH = [
  `Heads up — I'm cautious this week. {tickers} in particular look extended to me. I'd be trimming exposure or avoiding new longs here. Risk management first.`,
  `Weekly note: the risk/reward looks poor on {tickers}. I'd be careful adding exposure here. Cash is a position too.`,
  `Caution flag on {tickers} this week. The setup doesn't excite me and the downside looks larger than the upside. Consider reducing if you're overweight.`,
  `I'm defensively positioned this week. {tickers} have some concerning signals — I'd wait for a better entry or avoid entirely. Patience pays.`,
];

export const WEEKLY_EMAIL_TEMPLATES_NEUTRAL = [
  `Mixed picture this week. {tickers} are worth watching but I wouldn't size up yet. Let's see how things develop before committing.`,
  `Weekly update: nothing screaming at me either direction. {tickers} are interesting but I'd be patient. Markets are choppy and conviction is low.`,
  `Quiet week ahead potentially. I'm monitoring {tickers} but not pulling the trigger. Waiting for a clearer signal before acting.`,
];

// Hot tip email templates
export const HOT_TIP_BULLISH = [
  `Just a quick heads up — {ticker} crossed my radar today. I'm not usually one for hot tips, but this one feels real. Worth a look.`,
  `Something brewing in {ticker}. Can't say more but I'm watching it closely. You didn't hear this from me.`,
  `{ticker} just hit a trigger on my model. This kind of setup has worked before. I'd take a look today.`,
  `I've been watching {ticker} for a few days and it just did what I was waiting for. Bullish from here, in my view.`,
  `Quick note: {ticker} looks interesting right now. The timing feels right. My confidence is [SKILL_LEVEL], so weigh accordingly.`,
];

export const HOT_TIP_BEARISH = [
  `Just flagging {ticker} as one to avoid right now. Something doesn't smell right. I'd steer clear or trim exposure.`,
  `I wouldn't touch {ticker} here. The setup is unfavorable and I think there's more downside ahead. Consider this a warning.`,
  `{ticker} is showing some red flags in my analysis. Not a screaming sell, but I'd be cautious adding here.`,
  `Heads up on {ticker} — momentum has shifted and I'm not liking what I see. Proceed with caution.`,
];
