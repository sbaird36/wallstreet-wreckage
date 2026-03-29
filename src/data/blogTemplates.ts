import type { BlogPostFlair, EventCategory } from "@/types";

export const WSB_USERNAMES = [
  "DiamondHandsDave99",
  "NotFinancialAdvice__",
  "WallStreetWarrior420",
  "BearGangPrestige",
  "RocketShipRonaldo",
  "CrayonEaterDeluxe",
  "TendiesOrTears",
  "YoloMcYoloface",
  "JustAveragingDown",
  "DefinitelyNotInsider",
  "StonkWhisperer",
  "TechnicalAnalysisKing",
  "BullishUntilBankrupt",
  "GainPornAddict",
  "ActuallyImBillAckman",
  "WentToBusinessSchool",
  "ReadAWhitepaperOnce",
  "ChartPatternHunter",
  "NeverSellingEver",
  "MarginCallSurvivor",
  "BreakEvenByQ4Maybe",
  "BoughtTheDipAndFell",
  "AllInOneTicker",
  "HodlAndPray",
  "PaperHandsPeterPan",
  "RetiredAt30_NotReally",
  "BuyHighSellLow_Pro",
  "BoomerInDisguise",
  "MomentumMike88",
  "QuantModelBro",
  "FundamentalsFred",
  "MacroMaven2000",
  "OptionsGamblerXL",
  "LeveragedToTheMoon",
  "ShortSellerAnonymous",
  "ValueInvestorVibes",
  "ThetaGangRepresent",
  "VIXWhisperer",
  "DeltaHedgerBro",
  "SectorRotationKing",
  "EarningsWhisperer",
  "DividendDadEnergy",
  "SwingTraderSally",
  "ScalpingSimon",
  "PositionSizingPro",
  "StopLossIsForWimps",
  "GoldenCrossGuru",
  "SupportAndResistance",
  "FibonacciFrederica",
  "RSIOverloadedRob",
];

export const AUTHOR_FLAIRS = [
  "🦍 Ape",
  "🐂 Bull Gang",
  "🐻 Bear Gang",
  "💎 Diamond Hands",
  "🚀 Rocket Fuel",
  "📊 DD Specialist",
  "🎰 Gambler",
  "📉 Stonk Expert",
  "🔮 Analyst",
  "💀 Bag Holder",
  "🤡 Loss Porn",
  "🧠 Big Brain",
  "👁️ Sees Everything",
  "🌙 Moon Mission",
  "🏦 Definitely Employed",
];

// ── FUD Post Templates (80% of posts) ─────────────────────────────────────────

export const FUD_BULLISH_TITLES = [
  "{ticker} just broke out of consolidation — this is your last chance to buy",
  "DD: Why {ticker} is the most undervalued stock on this market right now",
  "I put my entire savings into {ticker}. Here is my thesis. 🚀🚀🚀",
  "{ticker} to the MOON. Here is the technical analysis that wall street doesn't want you to see",
  "Why every hedge fund is quietly accumulating {ticker} right now",
  "My {ticker} position is down 40% and I'm averaging down. Not worried.",
  "The short squeeze on {ticker} is imminent. Full analysis inside.",
  "Retiring early thanks to {ticker}. Here's what I know that Wall Street doesn't.",
  "{ticker} CEO just bought $5M in shares on the open market 👀 (bullish)",
  "I've been tracking {ticker} for 3 years. Now is the time. This is the dip.",
  "{ticker} is this generation's best investment and everyone is sleeping on it",
  "Bought {ticker} at open today. Price target is 3x from here. Math inside.",
  "The fundamentals for {ticker} have never been stronger. Deep dive.",
  "Why I'm 100% in {ticker} and not losing sleep about it",
  "Pattern recognition: {ticker} is setting up exactly like NVDUH did in 2023",
];

export const FUD_BULLISH_BODIES = [
  "Okay so I've been doing my research for the past 3 days (and by research I mean reading posts here and looking at a chart) and I am EXTREMELY bullish on {ticker}. The fundamentals are strong (I don't fully understand what that means but it sounds right). My price target is {price_high}. This is not financial advice but please buy this stock so my position goes up. 🚀🚀🚀",

  "Not gonna lie I just put my entire emergency fund into {ticker} at market open. My wife doesn't know yet. The chart looks like it's about to go absolutely vertical and I've seen enough of these setups to know what's coming. I've been trading for 8 months so I have significant experience. I'll update this post with gains. EDIT: She found out.",

  "I work adjacent to someone who knows someone who works near the {company} campus. I can't say much but the vibes are GOOD. Loading up on {ticker} before the announcement that I also can't mention. Not insider trading because I technically don't know anything specific. Definitely not financial advice but I would be buying more if I had more money.",

  "The chart on {ticker} is forming a perfect cup-and-handle pattern. I've identified a breakout level at approximately {price_high} and the volume confirms this interpretation. Do not take this as financial advice. Do take this as a signal to YOLO your savings into calls expiring this week. The risk/reward is incredible.",

  "Everyone sleeping on {ticker} right now. The company has fundamentals that other companies don't have. Their growth rate is growing at a rate that is faster than before. Management is experienced (I checked LinkedIn). Their market opportunity is large (source: I think so). Price target: very high. This is the floor.",
];

export const FUD_BEARISH_TITLES = [
  "{ticker} is a house of cards. Full short thesis inside.",
  "Warning: Something is very wrong at {company}. I used to work there.",
  "{ticker} insiders selling en masse. What do they know?",
  "I called {ticker}'s last drop. Here's why it's going lower.",
  "{ticker}'s balance sheet is a disaster hiding in plain sight",
  "Why I'm loading puts on {ticker} before the next earnings",
  "{company}'s core business is deteriorating faster than anyone admits",
  "Death cross confirmed on {ticker}. Time to exit.",
  "{ticker} short thesis: overvalued by 80%, here's the math",
  "The bull case for {ticker} has completely fallen apart",
  "Former {company} employee here — what the filings don't show you",
  "{ticker} is the next Enron. I've done the analysis. Short it.",
  "Red flags everywhere in {ticker}. Here's what I found.",
  "Why I closed my {ticker} position and you should too",
  "{ticker} CFO just exercised all their options and sold. Draw your own conclusions.",
];

export const FUD_BEARISH_BODIES = [
  "I don't usually post but I worked at {company} for 2 years and some things I saw don't add up. Not saying the stock is going to zero but I'm not NOT saying that either. Do your own research. Or don't. But maybe do. I've moved my money out and into a stable ETF and a small amount of gold which I store in my garage.",

  "The chart on {ticker} is giving me serious bear market vibes. I've drawn a head and shoulders pattern that clearly indicates we're about to see a major move down. Yes I drew the lines myself. Yes that's still valid analysis. Short target is {price_low}. I've been short since {price_high} so I have significant conviction (and losses, currently).",

  "Look, I'm going to be real with you. I've been analyzing {ticker} for six weeks and the more I dig, the worse it looks. The earnings quality is low. The guidance is suspect. The CEO has a history of 'strategic pivots' which is corporate for 'things aren't working.' I have a position in puts. This is not financial advice because I am not financially advised myself.",

  "{ticker} insiders sold $12M in stock last quarter. 'Pre-planned 10b5-1 programs' they say. Sure. Coincidentally right before what could be a very bad earnings report. I have no specific knowledge of the earnings. I just have a pattern recognition that tells me this smells. Short it. Or don't. I'm already short.",

  "Let me tell you why {ticker} is going to zero. Step 1: Competition. Step 2: Margins. Step 3: The thing I can't explain but I feel strongly about. Step 4: Chart. If you understand these four points you understand my thesis. My price target is {price_low} but honestly it could be lower. Not financial advice but I've told my parents to sell.",
];

export const FUD_NEUTRAL_TITLES = [
  "Rate my portfolio: it's all {ticker}",
  "Is anyone else holding {ticker} through this volatility or am I alone",
  "{ticker} technical analysis (I drew some lines on a chart)",
  "Bought {ticker} because the name sounds like a winner. Update inside.",
  "Me explaining to my wife why I bought more {ticker} 💀",
  "What's everyone's {ticker} position? I need to feel better about mine",
  "Hot take: {ticker} is either going to 10x or zero. No in between.",
  "I asked my dog whether to buy {ticker}. He barked. I'm in.",
  "My honest DD on {ticker} (I only read the headline, not the full report)",
  "Not selling {ticker}. Not buying more {ticker}. Just vibing with my losses.",
];

export const FUD_NEUTRAL_BODIES = [
  "Me: I will only invest money I can afford to lose. Also me at 2am: *{ticker} chart open* *retirement account login in another tab* *sweating*",

  "Asked my golden retriever whether to buy {ticker}. He wagged his tail which I'm interpreting as bullish. I'm now 40% in {ticker}. His track record is 3-2 since I started consulting him, which is better than my analyst subscription.",

  "I've been holding {ticker} for 6 months. It went down 30%. Then up 15%. Then down 20%. I haven't slept properly since February. My doctor says my cortisol is 'concerning.' {ticker} is 'fine' according to one Reddit post I found at 3am. I am fine. We are both fine.",

  "My investment thesis for {ticker} was: 'vibes.' It was going up when I bought it. That seemed like a good sign. It is no longer going up. The vibes have changed. I remain in position because selling would mean accepting that my thesis was 'vibes.' I will update when the vibes return.",

  "Hot take and I know people will disagree: {ticker} is either going to be worth a lot more or a lot less than it is currently. I've done the analysis and I can't see it going sideways. This is based on gut feeling and one bar chart I misread. I own shares. Not financial advice. Good luck everyone.",
];

// ── Real Post Templates (20% of posts, tied to actual events) ─────────────────

export const REAL_TITLES: Record<string, string[]> = {
  COMPANY: [
    "Breaking news affecting {ticker} — what it means for your position",
    "Major development at {company}: analysis and implications",
    "{ticker} moving on real news today — here's the breakdown",
    "Confirmed: significant event at {company} — price impact analysis",
  ],
  WORLD: [
    "Global macro event impacting markets — {ticker} exposure analysis",
    "World news moving the market today — which stocks to watch",
    "International development creating real opportunities — {ticker} among them",
    "Macro event analysis: sectors to watch in the next few days",
  ],
  MARKET: [
    "Market-wide signal today — real analysis, not speculation",
    "Confirmed market catalyst — here's what's actually moving prices",
    "Today's market event explained: cause, effect, and trade setup",
    "Market structure event confirmed — what it means for your holdings",
  ],
  SECTOR: [
    "Sector-wide development confirmed — all related stocks affected",
    "Real news hitting the {sector} sector today — trade implications",
    "Sector catalyst confirmed: {ticker} and peers seeing real movement",
    "Industry event analysis: what's actually happening in this sector",
  ],
  CRYPTO: [
    "Confirmed crypto catalyst today — {ticker} and the broader market",
    "Real development in digital assets — price action explained",
    "Crypto market event confirmed — here's what's actually happening",
    "On-chain data and confirmed news: {ticker} analysis",
  ],
  MEME: [
    "The {ticker} situation explained — what's actually driving it",
    "Confirmed: momentum building in {ticker} — real data inside",
    "Why everyone's talking about {ticker} right now (real analysis)",
    "Sentiment confirmed: {ticker} is the real trade of the day",
  ],
};

export const REAL_BODIES: Record<string, string[]> = {
  COMPANY: [
    "I've been following {company} closely and today's development is significant. This is a real, confirmed event — not speculation. Based on the price action and the nature of the news, I'd expect volatility to continue for the next 2-3 days. Whether you're long or short, adjust your position sizing accordingly. This one is real.",
    "Sharing this because I've seen a lot of FUD about {ticker} today and I want to give you actual information. The news is confirmed. The impact on the stock is likely to be sustained, not a one-day event. Do your own research, but don't let the noise crowd out the signal on this one.",
  ],
  WORLD: [
    "Real macro event today. Not speculating. The broad market impact is confirmed and {ticker} is one of the affected names based on its sector exposure. In environments like this, I look for companies with strong balance sheets and pricing power. Worth reviewing your portfolio composition right now.",
    "Unlike most posts here, this is based on actual confirmed news. The world event today has real market implications. Historically, events like this create sector rotation opportunities. The signal is clear if you look past the noise.",
  ],
  MARKET: [
    "I know everyone here loves speculation but today's market event is real and confirmed. This isn't me trying to move a position — I want people to have accurate information for once on this forum. The catalyst is genuine. The price impact is likely to persist. Trade accordingly.",
    "Real market catalyst today, confirmed. Not FUD. Not a pump. Just actual news with actual implications. This affects broad market positioning so review your beta exposure. Not all moves are created equal — this one is fundamentally driven.",
  ],
  SECTOR: [
    "Sector news is confirmed today. This is a real development affecting {ticker} and similar companies. The fundamental case for the sector move is clear. For once I'm not going to say 'not financial advice' because this is just actual news. But still, do your own research.",
    "Real sector catalyst confirmed. I've verified this through multiple sources. The impact on {ticker} and peers is likely to be sustained across multiple days. Sector events like this tend to create divergence between fundamentally strong and weak companies. Choose your positions wisely.",
  ],
  CRYPTO: [
    "Confirmed crypto event today — not speculation, not hopium. Real development with real market implications for {ticker} and the broader digital asset space. In my experience, genuine catalysts like this tend to have multi-day momentum. Position accordingly.",
    "I'm sharing this because I want actual signal on this forum for once. Today's crypto development is confirmed and significant. {ticker} exposure is real. The move is fundamentally justified, not just sentiment-driven. This is one to watch carefully.",
  ],
  MEME: [
    "Okay yes there's a lot of energy around {ticker} right now but I want to give you the actual reason. Confirmed: there's a real catalyst behind today's move, not just vibes. That said, momentum events like this can overshoot significantly in both directions. Have a plan.",
    "Unlike most posts in here, I'm telling you this is real. The {ticker} situation today has a confirmed underlying catalyst. It's not just people here deciding to move the price. There's actual fundamental news. That changes the risk profile significantly.",
  ],
};

export const FLAIR_BY_CATEGORY: Record<string, BlogPostFlair[]> = {
  COMPANY: ["DD", "News", "Discussion"],
  WORLD: ["News", "Discussion"],
  MARKET: ["News", "DD"],
  SECTOR: ["DD", "News", "Discussion"],
  CRYPTO: ["DD", "News", "YOLO"],
  MEME: ["Meme", "YOLO", "Discussion"],
};
