import type { ContactTier } from "@/types";

export interface ContactDef {
  id: string;
  name: string;
  username: string;
  emoji: string;
  tier: ContactTier;
  bio: string;
  specialty: string[];      // sectors or specific tickers
  tipAccuracy: number;      // 0–1, how often their direction is correct
  tipFrequency: number;     // 0–1, chance per day of sending a tip
  unlockAtPostCount: number; // number of player posts required to unlock
  tipMessages: {
    bullish: string[];
    bearish: string[];
  };
}

export const CONTACTS: ContactDef[] = [
  // ── Tier 1 — Noise ────────────────────────────────────────────────────────
  {
    id: "rupert_noise",
    name: "Rupert Haines",
    username: "RetailRupert",
    emoji: "🧢",
    tier: 1,
    bio: "Retired postal worker turned day trader. Watches CNBC all morning. More conviction than accuracy.",
    specialty: ["Technology", "Fast Food"],
    tipAccuracy: 0.45,
    tipFrequency: 0.55,
    unlockAtPostCount: 1,
    tipMessages: {
      bullish: [
        "Hey, saw your post — great stuff. Between us, {ticker} feels like it wants to go higher. Just a gut thing.",
        "My nephew works near a {ticker} office. Not saying anything specific but the cars in the parking lot looked expensive.",
        "Been watching {ticker} on and off. Something about the price action feels bullish to me. For what it's worth.",
        "Rupert here. {ticker} keeps bouncing off the same level. Feels like accumulation to me. Maybe nothing.",
        "I've seen this before with {ticker}. Always goes up after a quiet week. History rhymes.",
      ],
      bearish: [
        "Something feels off about {ticker} lately. Can't put my finger on it. Just a feeling.",
        "My neighbor sold his {ticker} last week. He's usually early, that's all I'll say.",
        "The charts on {ticker} look heavy to me. Like something's about to give. Not advice.",
        "Heard some rumblings about {ticker} at my trading group. Nothing confirmed but the mood wasn't great.",
        "I've been cooling on {ticker}. The story feels a bit tired. Maybe just me.",
      ],
    },
  },
  {
    id: "carla_amateur",
    name: "Carla Mendes",
    username: "ConfidentialCarla",
    emoji: "📰",
    tier: 1,
    bio: "Financial journalism dropout. Knows a lot of people. Filters information poorly.",
    specialty: ["Social Media", "Streaming", "E-Commerce"],
    tipAccuracy: 0.50,
    tipFrequency: 0.45,
    unlockAtPostCount: 3,
    tipMessages: {
      bullish: [
        "I was at an event last week and someone from {ticker}'s PR was there. Very upbeat. Very upbeat.",
        "A journalist friend of mine is working on a piece about {ticker}. She sounded impressed with what she found.",
        "I cover a lot of companies and the buzz around {ticker} right now is quietly positive. Take it how you like.",
        "Had coffee with someone who tracks {ticker}'s social metrics professionally. They mentioned engagement is up.",
        "Just a heads up — I keep hearing the name {ticker} in conversations I wasn't expecting. Could mean something.",
      ],
      bearish: [
        "I'm hearing some questions being asked about {ticker} that I wouldn't expect. Might be nothing.",
        "A journalist contact of mine just started looking into {ticker}. Those calls don't usually happen for good reasons.",
        "Off the record, I've heard some frustration from people who work adjacent to {ticker}. Culture issues apparently.",
        "A PR friend of mine turned down a contract with {ticker}. She didn't say why. She doesn't turn things down.",
        "Something is being written about {ticker}. I don't know the angle yet. Wanted you to be aware.",
      ],
    },
  },

  // ── Tier 2 — Signal ───────────────────────────────────────────────────────
  {
    id: "marcus_tech",
    name: "Marcus Vane",
    username: "MarcusVane_Tech",
    emoji: "💻",
    tier: 2,
    bio: "Ex-Goldman tech analyst. Left to 'start something.' Still reads every 10-K he can find. Reliable on tech.",
    specialty: ["Technology", "GGLE", "MCSFT", "NVDUH", "INTLL"],
    tipAccuracy: 0.65,
    tipFrequency: 0.35,
    unlockAtPostCount: 7,
    tipMessages: {
      bullish: [
        "My work on {ticker} puts the risk/reward significantly in the bull case right now. I'd be surprised if this doesn't move higher in the next week.",
        "I've built a channel check model for {ticker}. The numbers I'm seeing from resellers are meaningfully above consensus. You didn't hear it from me.",
        "Had a conversation with a former {ticker} employee. The product cycle they're entering is real and the market isn't pricing it correctly yet.",
        "The institutional flow on {ticker} this week was notable. Big hands are positioning. I watch this carefully.",
        "{ticker} setup right now reminds me of three situations I've tracked where the stock ran 25%+ over the following 2 weeks. Data-driven view, not a hunch.",
      ],
      bearish: [
        "I've been doing channel checks on {ticker} and I'm not liking what I'm seeing. Sales motion is slower than what's being communicated.",
        "My analysis of {ticker}'s earnings quality is flagging some things. Revenue recognition timing looks aggressive. Worth being cautious.",
        "The competitive dynamic in {ticker}'s core market is changing faster than consensus thinks. I've modeled this out and the margin implications aren't good.",
        "On {ticker}: I track enterprise software deals in this sector. The win rate I'm hearing about is deteriorating. Might show up in 6-8 weeks.",
        "Former colleagues at {ticker}'s largest customer just told me they're moving to a competitor for next year's contract. They represent ~8% of revenue.",
      ],
    },
  },
  {
    id: "diane_value",
    name: "Diane Rafferty",
    username: "ValueBenchDiane",
    emoji: "📊",
    tier: 2,
    bio: "CFA. 15 years running a value fund. Speaks only when she has conviction. Occasionally wrong but never noisy.",
    specialty: ["Banking", "Healthcare", "Retail", "JPMRG", "JNJJ", "WALMT", "CSTCO"],
    tipAccuracy: 0.68,
    tipFrequency: 0.28,
    unlockAtPostCount: 15,
    tipMessages: {
      bullish: [
        "I've been building a position in {ticker} quietly. At current prices the free cash flow yield is difficult to argue with. Not sharing this widely.",
        "The normalized earnings power of {ticker} is being obscured by one-time items that won't recur. Intrinsic value is materially above where it's trading.",
        "My DCF on {ticker} has the stock at a 30% discount to fair value if you use conservative assumptions. That margin of safety is unusual.",
        "{ticker}'s balance sheet is a fortress and the market is treating it like it's in distress. The disconnect is an opportunity.",
        "I rarely message about single names but {ticker} triggered every screen I use for high-quality-at-a-discount. Worth your attention.",
      ],
      bearish: [
        "I'm trimming {ticker}. The multiple has expanded past what the fundamentals support and I have a discipline around valuation.",
        "The quality metrics on {ticker} that I track — ROIC, FCF conversion, incremental margins — have all moved in the wrong direction for three quarters.",
        "I've covered {ticker} for a long time. When the CFO commentary sounds defensive rather than confident, it usually precedes a guide-down.",
        "{ticker}'s management has been making capital allocation decisions I wouldn't make. The acquisition pipeline concerns me. I'm out at these prices.",
        "Formal view on {ticker}: overvalued by roughly 20-25% on normalized earnings. Not a catalyst call, a valuation call. Could take a while to play out.",
      ],
    },
  },
  {
    id: "kyle_crypto",
    name: "Kyle Strand",
    username: "OnChainKyle",
    emoji: "🔗",
    tier: 2,
    bio: "Crypto native since 2014. Reads on-chain data, exchange flows, and whale wallets obsessively. Useful if crypto is your thing.",
    specialty: ["Crypto", "BTCX", "ETHR", "SOLX", "DOGGO", "PRPL"],
    tipAccuracy: 0.62,
    tipFrequency: 0.40,
    unlockAtPostCount: 25,
    tipMessages: {
      bullish: [
        "On-chain flows for {ticker} are the cleanest I've seen in months. Coins moving from exchanges to cold storage — accumulation signal.",
        "Large wallet clustering around {ticker} is pointing to a supply squeeze. I've seen this pattern precede significant moves three times this year.",
        "The derivatives funding rate on {ticker} just flipped. Combined with the on-chain data I'm seeing, the risk is to the upside.",
        "Whale wallets I track just accumulated {ticker} at scale. They move first, retail follows. You have a window.",
        "{ticker} social volume is ticking up but funding rates are still neutral. That combo — organic interest without leverage froth — is historically bullish.",
      ],
      bearish: [
        "Large {ticker} wallets have been moving coins onto exchanges in volume this week. That's usually pre-sell positioning.",
        "The funding rate on {ticker} perpetuals is extremely elevated. This level of leverage has resolved to the downside in 70% of historical cases I've tracked.",
        "Exchange inflows for {ticker} are spiking. When coins move to exchanges at this rate, sellers are staging inventory.",
        "I'm seeing smart money exit {ticker} quietly. The order flow is distinctive. I don't know the catalyst but they know something.",
        "{ticker} on-chain metrics are deteriorating — active addresses declining, transaction volume flat, miner distribution pressure. Proceed carefully.",
      ],
    },
  },

  // ── Tier 3 — Insider ──────────────────────────────────────────────────────
  {
    id: "anon_deepthroat",
    name: "Anonymous",
    username: "DeepThroat_Fin",
    emoji: "🕶️",
    tier: 3,
    bio: "Won't say who they are. Won't say where they work. Messages from a ProtonMail account. Always specific. Usually right.",
    specialty: ["GGLE", "APCT", "MCSFT", "NVDUH", "AMZUN", "TSLH"],
    tipAccuracy: 0.80,
    tipFrequency: 0.20,
    unlockAtPostCount: 40,
    tipMessages: {
      bullish: [
        "I need you to treat this with discretion. {ticker} is about to have a very good few days. Position before Thursday.",
        "Not going into specifics. {ticker}. Long. Before the week ends. That's all I can say.",
        "A deal involving {ticker} is closer than the market thinks. I can't say more. Make your own decision.",
        "I work near this information. {ticker} guidance revisions are coming. The kind that move the stock. This week.",
        "I've said too much already. {ticker}. Bullish. Significant. Confirm nothing. Act fast.",
      ],
      bearish: [
        "Sensitive information. {ticker} is about to have problems that aren't priced in. I'd be reducing exposure.",
        "I'm going to be careful how I say this. {ticker}. Something is coming that will pressure the stock. Soon.",
        "What I know about {ticker} right now is not public. What I can tell you: I wouldn't want to be long over the next week.",
        "Someone I know is moving risk off {ticker} at a senior level. Draw your own conclusions. Don't quote me.",
        "I can only say this once. {ticker} has a situation developing. The kind that doesn't resolve quickly or quietly.",
      ],
    },
  },
  {
    id: "elena_wallst",
    name: "Elena Cross",
    username: "WallStWhisper",
    emoji: "💼",
    tier: 3,
    bio: "20 years on the buy-side. Semi-retired. Still has all the old numbers in her phone. Contacts in every sector.",
    specialty: ["JPMRG", "FORDD", "TOYTO", "DISNY", "NFLUX", "FBRG"],
    tipAccuracy: 0.78,
    tipFrequency: 0.22,
    unlockAtPostCount: 40,
    tipMessages: {
      bullish: [
        "I've been in this business long enough to know when something is building. {ticker} is building. Get in early.",
        "Lunch today with someone who sits on the {ticker} board. Nothing explicit — just a sense. Very positive.",
        "I won't put this in writing beyond this message: {ticker} is going to surprise. I'm long and I almost never trade individual names anymore.",
        "My read on {ticker} based on conversations this week: the bears have no idea what's about to be announced. Positioning accordingly.",
        "Twenty years of pattern recognition says {ticker} is where you want to be this week. I trust the pattern.",
      ],
      bearish: [
        "Old friends at {ticker} are unusually quiet lately. In my experience, that quiet before an announcement is not the good kind.",
        "I was on a call this morning that touched on {ticker}. The sentiment from people who know was not positive. Not catastrophic — but not positive.",
        "Reducing {ticker} today. Not based on analysis — based on a conversation I can't describe. Sometimes you have to trust your network.",
        "The {ticker} story I've been hearing in private doesn't match the one they're telling publicly. I've seen this movie.",
        "I rarely say this but: if I had {ticker} exposure right now, I'd take it down. Something is coming that I don't think is priced in.",
      ],
    },
  },
];

// Returns the contact that should be unlocked at a given post count
export function getContactUnlockAtCount(postCount: number): ContactDef | null {
  // Unlocks happen at specific thresholds in order
  const sorted = [...CONTACTS].sort((a, b) => a.unlockAtPostCount - b.unlockAtPostCount);
  return sorted.find((c) => c.unlockAtPostCount === postCount) ?? null;
}

// All contacts whose threshold has been reached
export function getUnlockedContacts(unlockedIds: string[]): ContactDef[] {
  return CONTACTS.filter((c) => unlockedIds.includes(c.id));
}
