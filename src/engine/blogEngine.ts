import type { BlogPost, BlogPostFlair, FiredEvent, Asset } from "@/types";
import {
  WSB_USERNAMES,
  FUD_BULLISH_TITLES,
  FUD_BULLISH_BODIES,
  FUD_BEARISH_TITLES,
  FUD_BEARISH_BODIES,
  FUD_NEUTRAL_TITLES,
  FUD_NEUTRAL_BODIES,
  FUD_YOLO_TITLES,
  FUD_YOLO_BODIES,
  FUD_MEME_TITLES,
  FUD_MEME_BODIES,
  REAL_TITLES,
  REAL_BODIES,
  FLAIR_BY_CATEGORY,
  PREMIUM_USERNAMES,
  PREMIUM_FUD_TITLES,
  PREMIUM_FUD_BODIES,
  PREMIUM_REAL_TITLES,
  PREMIUM_REAL_BODIES,
  WILDCAT_USERNAMES,
  WILDCAT_TITLES,
  WILDCAT_BODIES,
  WILDCAT_REAL_TITLES,
  WILDCAT_REAL_BODIES,
} from "@/data/blogTemplates";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

function wsbVotes(): { upvotes: number; downvotes: number } {
  const roll = Math.random();
  if (roll < 0.1) {
    return { upvotes: 2000 + Math.floor(Math.random() * 8000), downvotes: Math.floor(Math.random() * 200) };
  } else if (roll < 0.3) {
    return { upvotes: 500 + Math.floor(Math.random() * 1500), downvotes: Math.floor(Math.random() * 100) };
  } else {
    return { upvotes: 5 + Math.floor(Math.random() * 200), downvotes: Math.floor(Math.random() * 30) };
  }
}

function premiumVotes(): { upvotes: number; downvotes: number } {
  // Professional tone — higher baselines, lower viral ceiling
  const roll = Math.random();
  if (roll < 0.05) {
    return { upvotes: 3000 + Math.floor(Math.random() * 5000), downvotes: Math.floor(Math.random() * 100) };
  } else if (roll < 0.25) {
    return { upvotes: 800 + Math.floor(Math.random() * 2000), downvotes: Math.floor(Math.random() * 80) };
  } else {
    return { upvotes: 100 + Math.floor(Math.random() * 700), downvotes: Math.floor(Math.random() * 50) };
  }
}

function wildcatVotes(): { upvotes: number; downvotes: number } {
  // Wild viral ceiling — some posts can hit 20k-50k
  const roll = Math.random();
  if (roll < 0.05) {
    return { upvotes: 20000 + Math.floor(Math.random() * 30000), downvotes: Math.floor(Math.random() * 2000) };
  } else if (roll < 0.15) {
    return { upvotes: 5000 + Math.floor(Math.random() * 10000), downvotes: Math.floor(Math.random() * 500) };
  } else if (roll < 0.35) {
    return { upvotes: 500 + Math.floor(Math.random() * 3000), downvotes: Math.floor(Math.random() * 200) };
  } else {
    return { upvotes: 10 + Math.floor(Math.random() * 300), downvotes: Math.floor(Math.random() * 50) };
  }
}

function generateRealPost(fired: FiredEvent, day: number, idx: number): BlogPost {
  const category = fired.event.category;
  const tickers = fired.affectedTickers;
  const ticker = tickers[0] ?? "MKTX";
  const flairOptions: BlogPostFlair[] = FLAIR_BY_CATEGORY[category] ?? ["News"];

  const titleTemplates = REAL_TITLES[category] ?? REAL_TITLES["MARKET"];
  const bodyTemplates = REAL_BODIES[category] ?? REAL_BODIES["MARKET"];

  const vars = {
    ticker,
    company: ticker,
    sector: fired.event.effect.targetSectors?.[0] ?? "this sector",
  };

  const title = fillTemplate(pick(titleTemplates), vars);
  const body = fillTemplate(pick(bodyTemplates), vars);

  return {
    id: `day${day}_real_${idx}`,
    day,
    flair: pick(flairOptions),
    title,
    body,
    author: pick(WSB_USERNAMES),
    ...wsbVotes(),
    playerVote: null,
    isReal: true,
    linkedEventId: fired.event.id,
    linkedTickers: tickers.slice(0, 4),
    source: "wsb",
  };
}

function generateFudPost(day: number, idx: number, assets: Asset[]): BlogPost {
  const asset = pick(assets.filter((a) => a.type === "stock").length > 0
    ? assets.filter((a) => a.type === "stock")
    : assets);

  const ticker = asset.ticker;
  const company = asset.name;
  const price = asset.currentPrice;
  const priceHigh = (price * (1.3 + Math.random() * 0.7)).toFixed(2);
  const priceLow = (price * (0.3 + Math.random() * 0.3)).toFixed(2);

  const vars = { ticker, company, price: price.toFixed(2), price_high: priceHigh, price_low: priceLow };

  const roll = Math.random();
  let title: string;
  let body: string;
  let flair: BlogPostFlair;

  if (roll < 0.30) {
    title = fillTemplate(pick(FUD_BULLISH_TITLES), vars);
    body = fillTemplate(pick(FUD_BULLISH_BODIES), vars);
    flair = pick(["DD", "YOLO", "Discussion"] as BlogPostFlair[]);
  } else if (roll < 0.60) {
    title = fillTemplate(pick(FUD_BEARISH_TITLES), vars);
    body = fillTemplate(pick(FUD_BEARISH_BODIES), vars);
    flair = pick(["DD", "Discussion", "Shitpost"] as BlogPostFlair[]);
  } else if (roll < 0.75) {
    title = fillTemplate(pick(FUD_NEUTRAL_TITLES), vars);
    body = fillTemplate(pick(FUD_NEUTRAL_BODIES), vars);
    flair = pick(["Meme", "Shitpost", "Discussion"] as BlogPostFlair[]);
  } else if (roll < 0.90) {
    title = fillTemplate(pick(FUD_YOLO_TITLES), vars);
    body = fillTemplate(pick(FUD_YOLO_BODIES), vars);
    flair = pick(["YOLO", "Shitpost"] as BlogPostFlair[]);
  } else {
    title = fillTemplate(pick(FUD_MEME_TITLES), vars);
    body = fillTemplate(pick(FUD_MEME_BODIES), vars);
    flair = pick(["Meme", "Shitpost"] as BlogPostFlair[]);
  }

  return {
    id: `day${day}_fud_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(WSB_USERNAMES),
    ...wsbVotes(),
    playerVote: null,
    isReal: false,
    linkedEventId: null,
    linkedTickers: [ticker],
    source: "wsb",
  };
}

function generatePremiumFudPost(day: number, idx: number, assets: Asset[]): BlogPost {
  const stockAssets = assets.filter((a) => a.type === "stock");
  const asset = pick(stockAssets.length > 0 ? stockAssets : assets);
  const ticker = asset.ticker;
  const company = asset.name;
  const price = asset.currentPrice;
  const priceHigh = (price * (1.2 + Math.random() * 0.5)).toFixed(2);
  const priceLow = (price * (0.5 + Math.random() * 0.25)).toFixed(2);

  const vars = { ticker, company, price: price.toFixed(2), price_high: priceHigh, price_low: priceLow };
  const title = fillTemplate(pick(PREMIUM_FUD_TITLES), vars);
  const body = fillTemplate(pick(PREMIUM_FUD_BODIES), vars);
  const flair: BlogPostFlair = pick(["DD", "News", "Discussion"] as BlogPostFlair[]);

  return {
    id: `day${day}_premium_fud_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(PREMIUM_USERNAMES),
    ...premiumVotes(),
    playerVote: null,
    isReal: false,
    linkedEventId: null,
    linkedTickers: [ticker],
    source: "premium",
  };
}

function generatePremiumRealPost(fired: FiredEvent, day: number, idx: number): BlogPost {
  const tickers = fired.affectedTickers;
  const ticker = tickers[0] ?? "MKTX";
  const asset = { name: ticker, currentPrice: 100 };
  const priceHigh = (asset.currentPrice * (1.15 + Math.random() * 0.35)).toFixed(2);

  const vars = {
    ticker,
    company: ticker,
    price_high: priceHigh,
    sector: fired.event.effect.targetSectors?.[0] ?? "this sector",
  };

  const title = fillTemplate(pick(PREMIUM_REAL_TITLES), vars);
  const body = fillTemplate(pick(PREMIUM_REAL_BODIES), vars);
  const flair: BlogPostFlair = pick(["DD", "News"] as BlogPostFlair[]);

  return {
    id: `day${day}_premium_real_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(PREMIUM_USERNAMES),
    ...premiumVotes(),
    playerVote: null,
    isReal: true,
    linkedEventId: fired.event.id,
    linkedTickers: tickers.slice(0, 4),
    source: "premium",
  };
}

function generateWildcatFudPost(day: number, idx: number, assets: Asset[]): BlogPost {
  const asset = pick(assets);
  const ticker = asset.ticker;
  const vars = { ticker, company: asset.name };
  const title = fillTemplate(pick(WILDCAT_TITLES), vars);
  const body = fillTemplate(pick(WILDCAT_BODIES), vars);
  const flair: BlogPostFlair = pick(["YOLO", "Shitpost", "Meme"] as BlogPostFlair[]);

  return {
    id: `day${day}_wildcat_fud_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(WILDCAT_USERNAMES),
    ...wildcatVotes(),
    playerVote: null,
    isReal: false,
    linkedEventId: null,
    linkedTickers: [ticker],
    source: "wildcat",
  };
}

function generateWildcatRealPost(fired: FiredEvent, day: number, idx: number): BlogPost {
  const tickers = fired.affectedTickers;
  const ticker = tickers[0] ?? "MKTX";
  const vars = { ticker, company: ticker };
  const title = fillTemplate(pick(WILDCAT_REAL_TITLES), vars);
  const body = fillTemplate(pick(WILDCAT_REAL_BODIES), vars);
  const flair: BlogPostFlair = pick(["YOLO", "DD", "News"] as BlogPostFlair[]);

  return {
    id: `day${day}_wildcat_real_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(WILDCAT_USERNAMES),
    ...wildcatVotes(),
    playerVote: null,
    isReal: true,
    isWildBoosted: true,
    linkedEventId: fired.event.id,
    linkedTickers: tickers.slice(0, 4),
    source: "wildcat",
  };
}

export function generateBlogPosts(
  day: number,
  firedEvents: FiredEvent[],
  assets: Record<string, Asset>,
  hasPremiumBlog = false
): BlogPost[] {
  const assetList = Object.values(assets);
  const wsbPosts: BlogPost[] = [];
  const premiumPosts: BlogPost[] = [];
  const wildcatPosts: BlogPost[] = [];

  // ── WSB posts ────────────────────────────────────────────────
  // One real post per fired event (capped at 3)
  const eventsToPost = firedEvents.slice(0, 3);
  for (let i = 0; i < eventsToPost.length; i++) {
    wsbPosts.push(generateRealPost(eventsToPost[i], day, i));
  }
  // Fill to 9–13 total with FUD
  const wsbTarget = 9 + Math.floor(Math.random() * 5);
  const wsbFudCount = Math.max(0, wsbTarget - wsbPosts.length);
  for (let i = 0; i < wsbFudCount; i++) {
    wsbPosts.push(generateFudPost(day, i, assetList));
  }

  // ── Premium posts (only when subscribed) ────────────────────
  if (hasPremiumBlog) {
    const premiumTarget = 3 + Math.floor(Math.random() * 3); // 3-5 posts
    // 40% of premium posts are real (tied to events), 60% are fake
    let premiumRealUsed = 0;
    for (let i = 0; i < premiumTarget; i++) {
      const isReal = Math.random() < 0.4 && premiumRealUsed < firedEvents.length;
      if (isReal) {
        premiumPosts.push(generatePremiumRealPost(firedEvents[premiumRealUsed], day, i));
        premiumRealUsed++;
      } else {
        premiumPosts.push(generatePremiumFudPost(day, i, assetList));
      }
    }
  }

  // ── Wildcat posts (always generated) ─────────────────────────
  const wildcatTarget = 10 + Math.floor(Math.random() * 6); // 10-15 posts
  // 5% of wildcat posts are real with wild boost; rest are fake
  let wildcatRealUsed = 0;
  for (let i = 0; i < wildcatTarget; i++) {
    const isReal = Math.random() < 0.05 && wildcatRealUsed < firedEvents.length;
    if (isReal) {
      wildcatPosts.push(generateWildcatRealPost(firedEvents[wildcatRealUsed], day, i));
      wildcatRealUsed++;
    } else {
      wildcatPosts.push(generateWildcatFudPost(day, i, assetList));
    }
  }

  return [...shuffle(wsbPosts), ...shuffle(premiumPosts), ...shuffle(wildcatPosts)];
}
