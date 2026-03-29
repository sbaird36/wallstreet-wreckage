import type { BlogPost, BlogPostFlair, FiredEvent, Asset } from "@/types";
import {
  WSB_USERNAMES,
  AUTHOR_FLAIRS,
  FUD_BULLISH_TITLES,
  FUD_BULLISH_BODIES,
  FUD_BEARISH_TITLES,
  FUD_BEARISH_BODIES,
  FUD_NEUTRAL_TITLES,
  FUD_NEUTRAL_BODIES,
  REAL_TITLES,
  REAL_BODIES,
  FLAIR_BY_CATEGORY,
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

function fakeVotes(): { upvotes: number; downvotes: number } {
  const roll = Math.random();
  if (roll < 0.1) {
    // viral post
    return { upvotes: 2000 + Math.floor(Math.random() * 8000), downvotes: Math.floor(Math.random() * 200) };
  } else if (roll < 0.3) {
    return { upvotes: 500 + Math.floor(Math.random() * 1500), downvotes: Math.floor(Math.random() * 100) };
  } else {
    return { upvotes: 5 + Math.floor(Math.random() * 200), downvotes: Math.floor(Math.random() * 30) };
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
    ...fakeVotes(),
    playerVote: null,
    isReal: true,
    linkedEventId: fired.event.id,
    linkedTickers: tickers.slice(0, 4),
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

  if (roll < 0.35) {
    title = fillTemplate(pick(FUD_BULLISH_TITLES), vars);
    body = fillTemplate(pick(FUD_BULLISH_BODIES), vars);
    flair = pick(["DD", "YOLO", "Discussion"] as BlogPostFlair[]);
  } else if (roll < 0.70) {
    title = fillTemplate(pick(FUD_BEARISH_TITLES), vars);
    body = fillTemplate(pick(FUD_BEARISH_BODIES), vars);
    flair = pick(["DD", "Discussion", "Shitpost"] as BlogPostFlair[]);
  } else {
    title = fillTemplate(pick(FUD_NEUTRAL_TITLES), vars);
    body = fillTemplate(pick(FUD_NEUTRAL_BODIES), vars);
    flair = pick(["Meme", "Shitpost", "Discussion"] as BlogPostFlair[]);
  }

  return {
    id: `day${day}_fud_${idx}`,
    day,
    flair,
    title,
    body,
    author: pick(WSB_USERNAMES),
    ...fakeVotes(),
    playerVote: null,
    isReal: false,
    linkedEventId: null,
    linkedTickers: [ticker],
  };
}

export function generateBlogPosts(
  day: number,
  firedEvents: FiredEvent[],
  assets: Record<string, Asset>
): BlogPost[] {
  const assetList = Object.values(assets);
  const posts: BlogPost[] = [];

  // One real post per fired event (capped at 3 to avoid flooding)
  const eventsToPost = firedEvents.slice(0, 3);
  for (let i = 0; i < eventsToPost.length; i++) {
    posts.push(generateRealPost(eventsToPost[i], day, i));
  }

  // Fill to 9–13 total with FUD
  const target = 9 + Math.floor(Math.random() * 5);
  const fudCount = Math.max(0, target - posts.length);
  for (let i = 0; i < fudCount; i++) {
    posts.push(generateFudPost(day, i, assetList));
  }

  return shuffle(posts);
}
