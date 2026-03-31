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
  "BagHolderAnonymous",
  "FOMOFightingFrank",
  "AlphaSeekingAlex",
  "TendiesTactician",
  "RetailVsWallSt",
  "GapFillGareth",
  "SqueezeDetector",
  "BullTrapBrian",
  "WeeklyExpiry Watcher",
  "OvernightGapGambler",
  "EarningsRoulettePro",
  "HighConvictionHannah",
  "3xLeverageLarry",
  "SpreadTradingSylvia",
  "AllCashAllCrash",
  "DeepValueDennis",
  "GrowthAtAnyPrice",
  "ConfirmationBiasCal",
  "OverfittedModel",
  "NakedCallNancy",
  "IronCondorIrving",
  "MoonOrBust2024",
  "StopHuntingStephen",
  "FloatShorterFlo",
  "CatalystCalvin",
  "BreakoutBetty",
  "ReversalRajesh",
  "ConsolidationCarlos",
  "LiquidationLouise",
  "SentimentShiftSam",
  "PremarketPanic",
  "AfterHoursAlison",
  "MarginCallMarcus",
  "PivotPointPriya",
  "HammerCandleHector",
  "TombstoneDojiTom",
  "VolumeProfileVictor",
  "OrderFlowOliver",
  "IchimokuIan",
  "BollingerBandBob",
  "MACDCrossoverMike",
  "StochasticSteve",
  "WilliamsPercentRandy",
  "ParabolicSARPaula",
  "PivotRangePete",
  "RelativeStrengthRita",
  "BetaChaser",
  "AlphaGenerator69",
  "SmartMoneyTracker",
  "DumbMoneyDave",
  "InsiderMimicker",
  "CopytradeCarrie",
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
  "🎯 Price Target Prophet",
  "🔥 YOLO Veteran",
  "🧮 Spreadsheet Nerd",
  "📰 News Reactor",
  "🥇 Tendies Collector",
  "🐍 Short Seller",
  "🦅 Eagle Eye",
  "🧩 Pattern Spotter",
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
  "{ticker} just printed the most beautiful green candle I've ever seen",
  "Everyone panicking about {ticker} is going to feel really dumb next month",
  "My financial advisor told me to sell {ticker}. I fired my financial advisor.",
  "Just averaged down on {ticker} for the 5th time. This is the bottom, trust me.",
  "{company} just poached the CFO from their largest competitor. Read between the lines.",
  "{ticker} is literally the easiest buy right now and no one is talking about it",
  "Stop listening to analysts on {ticker}. They have been wrong six times in a row.",
  "This is the {ticker} DD that every permabear needs to read",
  "I sold my car to buy more {ticker}. My wife said that was too far. She's wrong.",
  "{ticker} weekly chart is clean. You know what to do.",
  "Technically {ticker} has never been this undervalued relative to sector comps. Ever.",
  "Why I'm the most bullish person on this forum on {ticker} right now",
  "Just read the {company} annual report cover to cover. Load up.",
  "{ticker} gap fill imminent. Position accordingly. Not financial advice.",
  "My grandfather's investment club just bought {ticker}. When grandpa buys, you buy.",
  "{company} insider filed a Form 4 buy this morning. Wake up.",
  "Every pullback in {ticker} has been a gift. This is another gift.",
  "{ticker} analyst day was quietly the most bullish thing I've seen this year",
  "Institutions are loading {ticker} quietly. Check the dark pool data.",
  "The risk/reward on {ticker} right now is the best I've seen in 18 months.",
];

export const FUD_BULLISH_BODIES = [
  "Okay so I've been doing my research for the past 3 days (and by research I mean reading posts here and looking at a chart) and I am EXTREMELY bullish on {ticker}. The fundamentals are strong (I don't fully understand what that means but it sounds right). My price target is {price_high}. This is not financial advice but please buy this stock so my position goes up. 🚀🚀🚀",

  "Not gonna lie I just put my entire emergency fund into {ticker} at market open. My wife doesn't know yet. The chart looks like it's about to go absolutely vertical and I've seen enough of these setups to know what's coming. I've been trading for 8 months so I have significant experience. I'll update this post with gains. EDIT: She found out.",

  "I work adjacent to someone who knows someone who works near the {company} campus. I can't say much but the vibes are GOOD. Loading up on {ticker} before the announcement that I also can't mention. Not insider trading because I technically don't know anything specific. Definitely not financial advice but I would be buying more if I had more money.",

  "The chart on {ticker} is forming a perfect cup-and-handle pattern. I've identified a breakout level at approximately {price_high} and the volume confirms this interpretation. Do not take this as financial advice. Do take this as a signal to YOLO your savings into calls expiring this week. The risk/reward is incredible.",

  "Everyone sleeping on {ticker} right now. The company has fundamentals that other companies don't have. Their growth rate is growing at a rate that is faster than before. Management is experienced (I checked LinkedIn). Their market opportunity is large (source: I think so). Price target: very high. This is the floor.",

  "I spent my Sunday doing a deep dive on {ticker}. I pulled up 14 different charts, cross-referenced three earnings transcripts, and read competitor 10-Ks. My conclusion: the market is wrong. The stock should be at {price_high} and the only reason it isn't is that most people are not paying attention. I am paying attention. Heavily.",

  "Every time {ticker} has pulled back more than 12%, it has recovered within 6 weeks and made new highs. I have checked this. I have a spreadsheet. The spreadsheet says buy. I am going to trust the spreadsheet over the feelings I have when looking at today's red number. The spreadsheet has never had feelings and that is its strength.",

  "Real talk: I put in {price_high} as my price target before I did the analysis. Then I did the analysis and the analysis confirmed {price_high}. Some people call this confirmation bias. I call it accuracy. The difference is minor and probably doesn't matter. {ticker} is going up.",

  "Someone I trust told me that someone they trust is buying {ticker} in large quantities. I cannot share who or why without violating something. What I can tell you is that when the people I trust are buying, I am buying. I have now bought. I am sharing this here because that is what this community is for.",

  "Update on my {ticker} average-down campaign: I have now averaged down 7 times. My average cost basis is [REDACTED] because I do not want to be mocked. What I can tell you is that my conviction has never been higher and that the number of shares I now own is 'a lot.' Price target unchanged. Will report back.",
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
  "How {ticker} goes to zero in 5 steps — a thread",
  "{company}'s accounting gives me serious vibes and I said what I said",
  "Something doesn't add up at {company}. Follow the cash.",
  "{ticker} short interest is spiking for a reason. Shorts know something.",
  "The growth story at {ticker} is over. Here is the data.",
  "I asked a {company} engineer what was really going on. You should sit down.",
  "{ticker} insiders have sold more in the last 3 months than the previous 2 years combined",
  "Real talk: {company}'s market share is collapsing and the annual report obscures it",
  "{ticker} technical breakdown confirmed. This is not a drill.",
  "My short thesis on {ticker} has a 12-month target of {price_low}",
  "Why {company}'s guidance is the most misleading document in finance right now",
  "Every metric at {company} is deteriorating except the ones they highlight",
  "{ticker} is priced for perfection and perfection is not coming",
  "{company} CEO hasn't bought a single share in 2 years. He knows.",
  "Forensic accounting deep dive on {company}: what the auditors appear to have missed",
  "{ticker} death cross confirmed. Next support is {price_low}.",
  "Wake up: {company} is burning cash faster than it's generating it",
  "The channel checks on {ticker} are the worst I've seen in 5 years",
  "I lost $180k being long {ticker}. Here's what I missed and what you're missing.",
  "{ticker} is going to have the worst earnings in 3 years. I can feel it in the charts.",
];

export const FUD_BEARISH_BODIES = [
  "I don't usually post but I worked at {company} for 2 years and some things I saw don't add up. Not saying the stock is going to zero but I'm not NOT saying that either. Do your own research. Or don't. But maybe do. I've moved my money out and into a stable ETF and a small amount of gold which I store in my garage.",

  "The chart on {ticker} is giving me serious bear market vibes. I've drawn a head and shoulders pattern that clearly indicates we're about to see a major move down. Yes I drew the lines myself. Yes that's still valid analysis. Short target is {price_low}. I've been short since {price_high} so I have significant conviction (and losses, currently).",

  "Look, I'm going to be real with you. I've been analyzing {ticker} for six weeks and the more I dig, the worse it looks. The earnings quality is low. The guidance is suspect. The CEO has a history of 'strategic pivots' which is corporate for 'things aren't working.' I have a position in puts. This is not financial advice because I am not financially advised myself.",

  "{ticker} insiders sold $12M in stock last quarter. 'Pre-planned 10b5-1 programs' they say. Sure. Coincidentally right before what could be a very bad earnings report. I have no specific knowledge of the earnings. I just have a pattern recognition that tells me this smells. Short it. Or don't. I'm already short.",

  "Let me tell you why {ticker} is going to zero. Step 1: Competition. Step 2: Margins. Step 3: The thing I can't explain but I feel strongly about. Step 4: Chart. If you understand these four points you understand my thesis. My price target is {price_low} but honestly it could be lower. Not financial advice but I've told my parents to sell.",

  "Three months ago I posted my short thesis on {ticker}. People called me an idiot. The stock is down 22% since that post. I am not posting this to say I told you so, but I am definitely posting this so you know that I told you so. My updated target is {price_low}. I have added to my position. The thesis remains intact. The idiots remain quiet.",

  "I pulled apart {company}'s last three quarterly filings. Revenue is being recognized faster than cash is being collected. Accounts receivable is growing 3x revenue. Either they have the world's most patient customers or something is being pulled forward. I am not saying it is fraud. I am saying I would not be long while asking these questions.",

  "The {ticker} bull thesis requires you to believe: (1) that competition doesn't intensify, (2) that margins don't compress, (3) that the macro cooperates, (4) that management executes perfectly, and (5) that the multiple stays elevated. I have been investing for 11 years. All five things do not happen simultaneously. Short.",

  "I asked the most honest person I know at {company} how things were going. They said 'fine' and then looked at a wall for 3 seconds. I've known this person for 8 years. They have never looked at a wall before. I bought puts. I cannot explain this in a securities filing but I can explain it to you here on this forum.",

  "Real talk: the {company} app store reviews over the last 6 months are a disaster. The product is getting worse. Users are noticing. Analysts apparently don't check app store reviews. I check app store reviews. One star reviews are up 40% quarter over quarter. This will show up in churn numbers. You've been warned.",
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
  "Day 47 of holding {ticker}: it is still the same price. I have learned nothing.",
  "{ticker} is doing what {ticker} does. No further comment at this time.",
  "What if {ticker} just goes sideways forever? Asking for me.",
  "My entire {ticker} position is up $3.14. Might buy a coffee.",
  "I refreshed the {ticker} chart 400 times today. Still the same chart.",
  "What is the vibe check on {ticker}? Mine is currently: confused.",
  "Just noticed I have been holding {ticker} since before my last haircut",
  "Three friends' opinions on {ticker}: three different answers. I remain lost.",
  "{ticker} chart looks like an EKG and I am not sure if that is good or bad",
  "Breaking: {ticker} still exists. More updates as the situation develops.",
  "Genuinely unsure if {ticker} will go up or down. Posted this to document the uncertainty.",
  "My {ticker} thesis was: 'vibes.' I am updating that to: 'slightly different vibes.'",
  "I have been on both sides of the {ticker} trade. Currently on my least-favorite side.",
  "The {company} earnings call transcript is 40 pages and I understood 2 of them",
  "Someone explain {ticker} to me like I'm 12 because the 13 year old explanation isn't working",
];

export const FUD_NEUTRAL_BODIES = [
  "Me: I will only invest money I can afford to lose. Also me at 2am: *{ticker} chart open* *retirement account login in another tab* *sweating*",

  "Asked my golden retriever whether to buy {ticker}. He wagged his tail which I'm interpreting as bullish. I'm now 40% in {ticker}. His track record is 3-2 since I started consulting him, which is better than my analyst subscription.",

  "I've been holding {ticker} for 6 months. It went down 30%. Then up 15%. Then down 20%. I haven't slept properly since February. My doctor says my cortisol is 'concerning.' {ticker} is 'fine' according to one Reddit post I found at 3am. I am fine. We are both fine.",

  "My investment thesis for {ticker} was: 'vibes.' It was going up when I bought it. That seemed like a good sign. It is no longer going up. The vibes have changed. I remain in position because selling would mean accepting that my thesis was 'vibes.' I will update when the vibes return.",

  "Hot take and I know people will disagree: {ticker} is either going to be worth a lot more or a lot less than it is currently. I've done the analysis and I can't see it going sideways. This is based on gut feeling and one bar chart I misread. I own shares. Not financial advice. Good luck everyone.",

  "{ticker} update for anyone following my journey: still holding. Down 18%. My wife has stopped asking. My dog sits with me while I look at the chart, which I interpret as moral support. The chart itself has not provided moral support. Current status: committed. Thesis: unchanged. Resolve: wavering slightly.",

  "I don't understand {company}'s business model fully. I bought {ticker} anyway. This is fine. The stock doesn't know I don't understand it. The stock just goes up and down based on things I read about later. I have decided to be surprised in whatever direction this goes. This is my investment strategy and I am sticking to it.",

  "Things I know about {ticker}: (1) I own some. (2) It costs money. (3) There is a chart that shows its price history. (4) The price history features both up and down movements. Things I don't know: everything else. Current conviction level: 6 out of 10. Current position size: too large for a 6.",

  "PORTFOLIO UPDATE: {ticker} is flat. Everything else is also flat. I am flat. We are all flat together. Markets closed at basically where they opened. I watched for 7 hours. I have nothing to show for this emotionally or financially. Tomorrow I will do the same thing. This is investing.",

  "Someone in my real life asked me what {ticker} was and why I kept mentioning it. I tried to explain. They looked concerned by the time I finished. They asked if I was 'doing okay.' I said yes. They didn't seem fully convinced. {ticker} is still in my portfolio. I am still doing okay. Probably.",
];

// ── YOLO / Degenerate Post Templates ──────────────────────────────────────────

export const FUD_YOLO_TITLES = [
  "YOLO'ing my entire account into {ticker} calls. Updates to follow. Or silence. One of those.",
  "Asked my wife if I could put the mortgage into {ticker}. She said no. Put it in anyway.",
  "100% of my net worth is now {ticker}. Diversification is for people who don't believe.",
  "{ticker} weeklies printing. I am the smartest person alive. Update in 4 days.",
  "I took out a personal loan to buy {ticker} and I need you all to believe in me right now",
  "Going all-in on {ticker} 0DTE calls. Either I'm posting gains or I'm posting from prison.",
  "Sold my crypto to buy {ticker} options. One degenerate gamble for another. Upgrade.",
  "Position size: inappropriate. Conviction level: extremely high. Sleep: none. {ticker} to the moon.",
  "{ticker} or death. That's the thesis. That's the whole DD. Calls purchased.",
  "Just discovered {ticker} exists. Already bought the maximum amount of calls. GM everyone.",
  "My therapist said I need to work on impulse control. I bought {ticker} calls instead of doing that.",
  "Last week I swore off options. This week I YOLO'd into {ticker}. Next week is anyone's guess.",
  "Not a financial advisor. Not an adult really. All-in on {ticker}. Let's get it.",
  "I have done zero research on {ticker}. Bought $50,000 in calls. This is the way.",
  "{ticker} ripping. I am in. I am not asking questions. I am experiencing emotions.",
];

export const FUD_YOLO_BODIES = [
  "So here's the situation. I have been watching {ticker} for a week. The line goes up. I have purchased a significant amount of options expiring at the end of this week. My wife says I have a problem. My broker says I have a margin account. Both things can be true. Updates to follow when I am either rich or explaining this to a financial counselor.",

  "Not gonna sugarcoat it: I put money I don't have into {ticker} options that expire in 3 days. Am I scared? Yes. Am I going to close the position? Absolutely not. I have attached a screenshot of my position that I will not be updating unless it goes up. If it goes down I will never speak of this again and will quietly move on with my life.",

  "The position is in. {ticker} calls, strike price optimistic, expiry aggressive. I have prayed once and refreshed the app 43 times. The math on the risk/reward is either very good or I don't understand math, which is possible. My cat is watching me with what I interpret as judgment. I'm holding. Hands are diamonds. Brain is... operating.",

  "Update from my {ticker} yolo: it is currently up. I am not selling. This is a mistake I will either celebrate or learn from. I have screenshots in case of celebrations. I have a draft excuse in case of a learning experience. The draft excuse begins 'the market was irrational.' That's the whole excuse. Holding.",

  "I know what you're thinking: this is reckless. And you're right. But I've thought about it and the difference between reckless and visionary is timing. If {ticker} goes up I was visionary. If it goes down I was reckless. I don't know which one I am yet. The market closes in 90 minutes. I will update everyone with the verdict.",
];

// ── Meme / Shitpost Templates ─────────────────────────────────────────────────

export const FUD_MEME_TITLES = [
  "🚀🚀🚀 {ticker} 🚀🚀🚀",
  "{ticker} chart be like: 📈📉📈📉📈 (I am financially ruined)",
  "Bears on {ticker} rn: 🤡",
  "When {ticker} dips 3% and you're 300% in 💀",
  "My {ticker} position: 🙏. The market: 🖕.",
  "Me before {ticker}: 😊. Me after {ticker}: 🥲.",
  "{ticker} is just a number and numbers are fake and money is fake and nothing is real",
  "Nobody: \nAbsolutely nobody: \nMe: buys more {ticker}",
  "We are so back (in {ticker}). This is the bottom. Probably.",
  "{ticker} doing a lil something something 👀",
  "POV: you bought {ticker} and now you're watching CNBC",
  "Not selling {ticker} even if it goes to {price_low}. Especially then actually.",
  "Theory: {ticker} is being suppressed by people who don't want me to be rich",
  "The audacity of {ticker} to be down on the day I'm watching it most closely",
  "My wife's boyfriend thinks {ticker} is a bad investment. He's wrong and also I don't care.",
];

export const FUD_MEME_BODIES = [
  "🦍💎🙌🚀 that's it. that's the post. {ticker} forever. not selling. eat the loss. buy the dip. hold the line. we're all in this together. I don't know what I'm doing. {ticker}.",

  "{ticker} down 4%? Fine. Down 8%? Buying more. Down 15%? This is a gift from the market gods and I am accepting this gift with both hands and also borrowed money. Down 25%? Look I respect the process. Down 40%? My position has technically been corrected but my conviction has not. The position size is now 'generational wealth or nothing.'",

  "Chart update: went up. I was right. Also went down. I was shaken but remained. Now it is going up again. I feel this vindicates the entire journey. My therapist disagrees but she doesn't have {ticker}. Checkmate. Holding.",

  "BREAKING: {ticker} exists and is a stock that can be purchased. ALSO BREAKING: I have purchased it. FURTHER UPDATES: the price has moved. IN CONCLUSION: I have feelings about this. END OF REPORT.",

  "My financial strategy for {ticker} is as follows: Step 1: Buy. Step 2: Check price. Step 3: Have feelings. Step 4: Repeat Steps 2-3 at 2am. Step 5: Do not sell under any circumstances including but not limited to: bad news, worse news, family intervention, or the stock going to zero. Step 6: Retire early (unclear mechanism, will sort this out later).",
];

// ── Real Post Templates (20% of posts, tied to actual events) ─────────────────

export const REAL_TITLES: Record<string, string[]> = {
  COMPANY: [
    "Breaking news affecting {ticker} — what it means for your position",
    "Major development at {company}: analysis and implications",
    "{ticker} moving on real news today — here's the breakdown",
    "Confirmed: significant event at {company} — price impact analysis",
    "I've verified this: real catalyst affecting {ticker} today",
    "{company} news confirmed — what long-term holders should know",
    "Not speculation: real fundamental change at {company}",
    "Actual DD on today's {company} news — the signal vs. the noise",
  ],
  WORLD: [
    "Global macro event impacting markets — {ticker} exposure analysis",
    "World news moving the market today — which stocks to watch",
    "International development creating real opportunities — {ticker} among them",
    "Macro event analysis: sectors to watch in the next few days",
    "Geopolitical development confirmed — how it affects {ticker}",
    "Real macro catalyst today — here's the honest breakdown",
    "World event with genuine market implications — read before trading",
    "Cross-border economic shift — {ticker} sector implications",
  ],
  MARKET: [
    "Market-wide signal today — real analysis, not speculation",
    "Confirmed market catalyst — here's what's actually moving prices",
    "Today's market event explained: cause, effect, and trade setup",
    "Market structure event confirmed — what it means for your holdings",
    "Actual data behind today's broad market move",
    "Not a meme: real market conditions are shifting today",
    "Confirmed systemic catalyst — broad portfolio implications",
    "Market-wide event breakdown — here is what matters and what doesn't",
  ],
  SECTOR: [
    "Sector-wide development confirmed — all related stocks affected",
    "Real news hitting the {sector} sector today — trade implications",
    "Sector catalyst confirmed: {ticker} and peers seeing real movement",
    "Industry event analysis: what's actually happening in this sector",
    "Confirmed sector shift — {ticker} positioned well/poorly for it",
    "Real sector fundamental change — who wins and who doesn't",
    "Cross-sector event with confirmed {ticker} exposure",
    "Industry-wide news: verified catalyst with lasting implications",
  ],
  CRYPTO: [
    "Confirmed crypto catalyst today — {ticker} and the broader market",
    "Real development in digital assets — price action explained",
    "Crypto market event confirmed — here's what's actually happening",
    "On-chain data and confirmed news: {ticker} analysis",
    "Verified blockchain event — what it means for {ticker} price",
    "Not hopium: real confirmed catalyst in the crypto space today",
    "Regulatory or technical event confirmed in crypto — {ticker} exposed",
    "Macro crypto shift confirmed — {ticker} implications laid out",
  ],
  MEME: [
    "The {ticker} situation explained — what's actually driving it",
    "Confirmed: momentum building in {ticker} — real data inside",
    "Why everyone's talking about {ticker} right now (real analysis)",
    "Sentiment confirmed: {ticker} is the real trade of the day",
    "Behind the {ticker} move: actual catalyst, not just Reddit",
    "Verified reason for {ticker} action today — don't miss this",
    "Real signal in {ticker} — separating fact from noise",
    "Confirmed fundamental behind the {ticker} social media buzz",
  ],
};

export const REAL_BODIES: Record<string, string[]> = {
  COMPANY: [
    "I've been following {company} closely and today's development is significant. This is a real, confirmed event — not speculation. Based on the price action and the nature of the news, I'd expect volatility to continue for the next 2-3 days. Whether you're long or short, adjust your position sizing accordingly. This one is real.",
    "Sharing this because I've seen a lot of FUD about {ticker} today and I want to give you actual information. The news is confirmed. The impact on the stock is likely to be sustained, not a one-day event. Do your own research, but don't let the noise crowd out the signal on this one.",
    "Today's {company} news is verified and material. I cross-referenced the primary source, checked the SEC filings, and verified the financial impact independently. This isn't a rumor or a forum post — it is real news. The price action is justified and likely to continue.",
    "Most people on this forum are posting opinions. Today I am posting facts about {company}. The event is confirmed, the financial impact is quantifiable, and the stock's reaction is proportional. I have no position but I would be adding one if the risk/reward matches my style.",
  ],
  WORLD: [
    "Real macro event today. Not speculating. The broad market impact is confirmed and {ticker} is one of the affected names based on its sector exposure. In environments like this, I look for companies with strong balance sheets and pricing power. Worth reviewing your portfolio composition right now.",
    "Unlike most posts here, this is based on actual confirmed news. The world event today has real market implications. Historically, events like this create sector rotation opportunities. The signal is clear if you look past the noise.",
    "I've been covering macro events for years and today's development is the kind that produces multi-week market reactions, not a one-day spike. {ticker} is in the affected sector. Position sizing and hedging decisions should account for continued volatility.",
    "International economic data confirmed this morning changes the picture for {ticker} and similar companies. This isn't speculation — I'm reading the primary source and telling you what it says. Adjust your models.",
  ],
  MARKET: [
    "I know everyone here loves speculation but today's market event is real and confirmed. This isn't me trying to move a position — I want people to have accurate information for once on this forum. The catalyst is genuine. The price impact is likely to persist. Trade accordingly.",
    "Real market catalyst today, confirmed. Not FUD. Not a pump. Just actual news with actual implications. This affects broad market positioning so review your beta exposure. Not all moves are created equal — this one is fundamentally driven.",
    "Market-wide structural event confirmed today. These don't happen often. When they do the reaction plays out over days not hours. I'm not going to speculate on direction because I don't know. I am going to tell you that today's news is real and worth reading the primary source on.",
    "Today's market event has been confirmed by multiple sources I trust. I've seen a lot of people here dismissing it as noise. It is not noise. It is the kind of fundamental shift that reprices risk assets. Adjust your assumptions accordingly.",
  ],
  SECTOR: [
    "Sector news is confirmed today. This is a real development affecting {ticker} and similar companies. The fundamental case for the sector move is clear. For once I'm not going to say 'not financial advice' because this is just actual news. But still, do your own research.",
    "Real sector catalyst confirmed. I've verified this through multiple sources. The impact on {ticker} and peers is likely to be sustained across multiple days. Sector events like this tend to create divergence between fundamentally strong and weak companies. Choose your positions wisely.",
    "The sector news today is verified and I've traced it back to the primary regulatory or industry source. This isn't a rumor. {ticker} is exposed in a way that most people aren't modeling correctly yet. Sharing because I believe this forum deserves actual information sometimes.",
    "Confirmed sector-wide development today. I've been in this sector for several years and this kind of structural event is rare. It affects pricing, margins, and competitive dynamics simultaneously. {ticker} sits in an interesting position relative to peers. Worth reading carefully.",
  ],
  CRYPTO: [
    "Confirmed crypto event today — not speculation, not hopium. Real development with real market implications for {ticker} and the broader digital asset space. In my experience, genuine catalysts like this tend to have multi-day momentum. Position accordingly.",
    "I'm sharing this because I want actual signal on this forum for once. Today's crypto development is confirmed and significant. {ticker} exposure is real. The move is fundamentally justified, not just sentiment-driven. This is one to watch carefully.",
    "On-chain data and confirmed news together today are the most reliable combo in crypto analysis. Both are pointing the same direction for {ticker}. I won't tell you which direction because I don't give trading advice, but the signals are aligned and verified.",
    "Regulatory event in crypto confirmed today. These matter more than most forum posts acknowledge. The implications for {ticker} are direct and quantifiable. I have done the math. The math is not great / is quite good. Do your own version of the math.",
  ],
  MEME: [
    "Okay yes there's a lot of energy around {ticker} right now but I want to give you the actual reason. Confirmed: there's a real catalyst behind today's move, not just vibes. That said, momentum events like this can overshoot significantly in both directions. Have a plan.",
    "Unlike most posts in here, I'm telling you this is real. The {ticker} situation today has a confirmed underlying catalyst. It's not just people here deciding to move the price. There's actual fundamental news. That changes the risk profile significantly.",
    "I know this looks like a meme play but I've actually done the work on {ticker} and there's a real fundamental here most people are missing because they're focused on the social media angle. The underlying news is verified. The technical setup is clean. Both matter.",
    "Before you chase {ticker} today, read this: the move is partially real catalyst, partially momentum. I've verified the real part. The momentum part is yours to judge. Just don't go in thinking it's all fundamentals or all meme — it's both, and that's actually the most interesting kind.",
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

// ── Premium Blog (WealthWatch Insider) — professional analyst tone ─────────────

export const PREMIUM_USERNAMES = [
  "JohnRothstein_CFA",
  "AnalystAlpha_HQ",
  "ResearchDeskPro",
  "MarketStructure_Mike",
  "CapitalAllocationQ",
  "TierOneResearch",
  "ConsensusBuster",
  "FundamentalEdge",
  "InstitutionalView",
  "QuantResearchGrp",
  "SectorDivergence",
  "EstimateRevisionPro",
  "CatalystTrackerHQ",
  "RiskAdjustedReturn",
  "AlphaGenerationLtd",
  "MacroThesisDesk",
  "EarningsModeler99",
  "ValuationFramework",
  "PositionMonitor_HQ",
  "CapitalMarketsView",
];

export const PREMIUM_FUD_TITLES = [
  "Initiating coverage on {ticker} with a cautious outlook — price target {price_low}",
  "Valuation analysis: {ticker} appears materially overextended at current levels",
  "Channel checks on {company} suggest sequential deterioration in core metrics",
  "Revisiting our {ticker} model: consensus estimates appear optimistic",
  "Risk-adjusted analysis: {ticker} offers unfavorable reward relative to downside",
  "Sentiment divergence on {ticker}: institutional positioning vs. retail narrative",
  "Earnings quality review: {company} revenue recognition warrants scrutiny",
  "Updating {ticker} price target to {price_low} on deteriorating fundamentals",
  "Proprietary survey data signals weakening demand trends at {company}",
  "Structural headwinds for {ticker}: a framework for the next 12 months",
  "Forensic accounting review of {company}: three items investors should examine",
  "Compressing multiples: why {ticker} is vulnerable to a re-rating lower",
  "Insider activity at {company} and what the pattern historically implies",
  "Market share data for {company} shows sequential deterioration — analysis inside",
  "Consensus is wrong on {ticker}: here is the bear case the street is missing",
];

export const PREMIUM_FUD_BODIES = [
  "Our analysis of {company}'s most recent filing reveals a pattern in accounts receivable that has historically preceded earnings misses. Specifically, DSO has expanded 14 days quarter-over-quarter — a metric that tends to lead revenue shortfalls by 1-2 quarters. We are revising our revenue estimate 8% below consensus. Price target: {price_low}. Risk: earlier-than-expected stabilization in demand.",

  "Following channel checks with three industry participants, we believe consensus estimates for {company} embed an optimistic recovery timeline. Our analysis suggests demand normalization is progressing at roughly half the pace the street models. This is not a call on management quality — {company} is well-run — but on the pace of the end-market cycle. We remain underweight relative to benchmark.",

  "The valuation on {ticker} now incorporates a multiple expansion that we believe is not supported by the underlying earnings trajectory. At current levels, the stock prices in 18 months of execution flawlessly. Our base case is that execution will be adequate, not flawless. The difference between flawless and adequate, when priced into a high-multiple growth stock, is material. We are cautious.",

  "Updated model for {company} following last week's data points: (1) gross margin pressure appears more persistent than guided, (2) capex trajectory suggests capacity additions are being delayed, (3) management commentary on the call contained subtle but notable language shifts. None of these are individually conclusive. Together they warrant reducing exposure ahead of the next reporting cycle.",

  "Our proprietary tracking of job postings at {company} shows a 31% reduction in engineering roles over the past 90 days. Historically, this precedes an R&D headcount adjustment that typically accompanies a product cycle pause. We are not alarmed but we are cautious. The current price implies a product cycle acceleration that our leading indicators do not yet support.",
];

export const PREMIUM_REAL_TITLES = [
  "Confirmed catalyst at {company}: price target raised to {price_high} — full analysis",
  "Breaking institutional development at {ticker}: what the data shows",
  "Upgrading {ticker} to Overweight: verified catalysts align with our thesis",
  "Proprietary channel check confirms {company} beat expectations — upgrading",
  "Institutional flow data and confirmed news support {ticker} at current levels",
  "Event-driven analysis: {company} development supports higher valuation",
  "Coverage update: {ticker} — confirmed catalyst warrants model revision",
  "Sector signal confirmed: {ticker} is the preferred name in the space today",
];

export const PREMIUM_REAL_BODIES = [
  "Following confirmation of today's {company} development, we are revising our model upward. Our updated price target of {price_high} reflects a 12-month horizon and incorporates the full run-rate benefit of the announced catalyst. We have spoken with two industry contacts who corroborate the magnitude of the impact. Our conviction is high. We are upgrading to Overweight.",

  "This morning's confirmed news on {ticker} aligns precisely with the catalyst scenario we outlined in our prior note. The market's initial reaction appears to underestimate the duration of the tailwind. Our DCF analysis suggests the current price does not fully incorporate the medium-term benefit. We are adding to our model position and raising our price target.",
];

// ── ApeStation (Wildcat Blog) — 95% fake, 5% real (huge pumps) ───────────────

export const WILDCAT_USERNAMES = [
  "MOON_OR_RUIN_69",
  "FullSendFinance",
  "NeverSelling4Real",
  "DiamondSpine420",
  "RocketFuelOnly",
  "ApeNotLeave",
  "LiquidateMePlease",
  "10xOrCrying",
  "BetTheFarm2024",
  "GainsPornDirector",
  "NotYourFinAdvisor",
  "CallsOnEverything",
  "MarginMaximalist",
  "SirHoldsALot",
  "GreenDayOrGrief",
  "100xOrBust_Real",
  "FOMOIndustriesLLC",
  "BuyTheRumourSell",
  "StillHoldingStill",
  "GoingToTheMOON",
];

export const WILDCAT_TITLES = [
  "🚀🚀 {ticker} IS GOING TO OBLITERATE YOUR ENTIRE CONCEPT OF WEALTH 🚀🚀",
  "I SOLD EVERYTHING AND BOUGHT {ticker} AND I HAVE NEVER FELT MORE ALIVE",
  "{ticker} shorts are going to get DESTROYED and I want to be there when it happens 💀",
  "CALLING IT NOW: {ticker} 10x in 30 days. screenshot this. SCREENSHOT THIS.",
  "Not financial advice but {ticker} is literally printing money and you are sleeping 😤",
  "The establishment DOESN'T WANT YOU buying {ticker} right now. That's how you know.",
  "{ticker} is setting up the most beautiful squeeze I have seen in 3 years of losing money",
  "I WENT ALL IN ON {ticker} CALLS. My hands are PURE DIAMOND. My brain is SMOOTH.",
  "If you're not holding {ticker} right now you are CHOOSING to stay poor. I said it.",
  "The {ticker} short thesis is: I am afraid. The long thesis is: 🚀🚀🚀🚀🚀",
  "{ticker} dip buyers are going to be eating tendies while shorts cry. Trust the process.",
  "MAXIMUM YOLO: {ticker}. Strike: aggressive. Expiry: soon. Conviction: infinite.",
  "Something is BREWING with {ticker} and I can feel it in my BONES. Bones have never lied.",
  "{ticker} chart literally looks like a rocket ship with rocket emojis around it. SENDING IT.",
  "I showed my {ticker} thesis to three people. Two laughed. One put in more than me. We're winning.",
];

export const WILDCAT_BODIES = [
  "LOOK I don't have a spreadsheet. I don't have a DCF. I have VIBES and 14 years of LOSING MONEY that has taught me to recognize when something is about to go absolutely VERTICAL. {ticker} is that thing right now. The chart is clean. The shorts are sweating. I am ALL IN. If I am wrong I will post my loss porn without complaint. If I am right I will post from my yacht.",

  "Listen to me very carefully: {ticker} is the trade of the year and everyone is sleeping on it because they're too busy doing 'analysis' and 'research' and 'not gambling with money they need.' I have none of those constraints. I have calls. I have conviction. I have a support group chat called 'Please Do Not Do This' that I have muted. SENDING IT. 🚀",

  "The {ticker} short interest is INSANE. These people are going to get VAPORIZED and I am going to watch it happen with popcorn and a very large position. Have I done research? Define research. Have I read the ticker name correctly multiple times? Yes. Am I going to cry if this goes wrong? Possibly. Am I doing it anyway? ABSOLUTELY. All in.",

  "OKAY SO: I know I said {ticker} was going to 5x last week and it went down 8% instead. I know that. I remember. What I want you to focus on is not that, but on the NEW setup which is even better than the old setup which I was wrong about. The new setup is different because of vibes. New price target: very high. New conviction: maximum. I have learned nothing.",

  "If {ticker} doesn't absolutely MOON from here I will personally apologize to every bear I have called a clown. That's my commitment. That's the bet. My position is larger than my therapist would recommend. My therapist doesn't know about my position. My position is GOING UP. Let's go. 🚀🚀🚀",
];

export const WILDCAT_REAL_TITLES = [
  "🚨🚨 {ticker} JUST GOT HIT WITH THE MOST REAL NEWS I HAVE EVER SEEN 🚨🚨",
  "NOT CLICKBAIT: {ticker} catalyst is CONFIRMED and it is MASSIVE 🚀🚀🚀",
  "THE {ticker} NEWS IS REAL. I VERIFIED IT. LOAD UP BEFORE THE NORMIES SEE IT.",
  "BREAKING AND CONFIRMED: {ticker} is about to SEND IT based on REAL events 🔥🔥",
  "This is NOT a drill — {ticker} has a VERIFIED catalyst and the price hasn't moved YET",
];

export const WILDCAT_REAL_BODIES = [
  "I KNOW I post a lot of garbage but THIS ONE IS REAL. I checked. Multiple times. The {ticker} news that dropped today is CONFIRMED and the market has NOT priced it in yet. I have never been more certain of anything in my degenerate trading career. This is the one. LOAD UP before the institutions see this. I am telling everyone I know. I am sending this to my mother. SHE IS BUYING {ticker}. 🚀🚀🚀",

  "Not gonna lie I thought this was FUD at first too. But I actually checked this time. The {ticker} development is CONFIRMED REAL. Every source I have (I have two sources, they are reliable) says this is legit. The stock hasn't moved yet because the mainstream hasn't caught on. This is the window. I have maximized my position. If you trust me even 10% you should at minimum look at this. THIS IS THE ONE.",
];
