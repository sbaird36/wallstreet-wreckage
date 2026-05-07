import type { Asset, BlogPost, FiredEvent } from "@/types";

export interface Signal {
  icon: string;
  label: string;
  color: string;
  bg: string;
  key: string; // stable key for filtering
}

export function getSignals(
  asset: Asset,
  activeEvents: FiredEvent[],
  currentDay: number,
  blogFeed: BlogPost[]
): Signal[] {
  const signals: Signal[] = [];

  // ── Active market events affecting this ticker ──────────────────────
  for (const fe of activeEvents) {
    if (!fe.affectedTickers.includes(asset.ticker)) continue;
    const s = fe.event.sentiment;
    const isBull = s === "VERY_BULLISH" || s === "BULLISH";
    const isBear = s === "VERY_BEARISH" || s === "BEARISH";
    signals.push({
      icon: fe.event.icon,
      label: fe.event.headline,
      key: isBull ? "event_bull" : isBear ? "event_bear" : "event_mixed",
      color: isBull ? "text-emerald-300" : isBear ? "text-rose-300" : "text-yellow-300",
      bg: isBull
        ? "bg-emerald-950/70 border-emerald-700/50"
        : isBear
        ? "bg-rose-950/70 border-rose-700/50"
        : "bg-yellow-950/70 border-yellow-700/50",
    });
  }

  // ── Earnings coming up (stocks only, within 5 days) ─────────────────
  if (asset.type === "stock") {
    const dayInCycle = ((currentDay - 1) % 90) + 1;
    const daysUntil = ((asset.earningsDay - dayInCycle + 90) % 90);
    if (daysUntil <= 5 && daysUntil > 0) {
      signals.push({
        icon: "📣",
        label: `Earnings in ${daysUntil} day${daysUntil > 1 ? "s" : ""}`,
        key: "earnings",
        color: "text-yellow-300",
        bg: "bg-yellow-950/70 border-yellow-700/50",
      });
    } else if (daysUntil === 0) {
      signals.push({
        icon: "📣",
        label: "Earnings today",
        key: "earnings",
        color: "text-yellow-200",
        bg: "bg-yellow-900/70 border-yellow-600/60",
      });
    }
  }

  // ── Daily price direction ────────────────────────────────────────────
  if (asset.previousPrice > 0) {
    const dailyChg = (asset.currentPrice - asset.previousPrice) / asset.previousPrice;
    if (dailyChg >= 0.04) {
      signals.push({
        icon: "🚀",
        label: `Up ${(dailyChg * 100).toFixed(1)}% today`,
        key: "surging",
        color: "text-emerald-300",
        bg: "bg-emerald-950/70 border-emerald-700/50",
      });
    } else if (dailyChg >= 0.015) {
      signals.push({
        icon: "📈",
        label: `Up ${(dailyChg * 100).toFixed(1)}% today`,
        key: "rising",
        color: "text-emerald-400",
        bg: "bg-emerald-950/60 border-emerald-800/40",
      });
    } else if (dailyChg <= -0.04) {
      signals.push({
        icon: "🔻",
        label: `Down ${(Math.abs(dailyChg) * 100).toFixed(1)}% today`,
        key: "crashing",
        color: "text-rose-300",
        bg: "bg-rose-950/70 border-rose-700/50",
      });
    } else if (dailyChg <= -0.015) {
      signals.push({
        icon: "📉",
        label: `Down ${(Math.abs(dailyChg) * 100).toFixed(1)}% today`,
        key: "falling",
        color: "text-rose-400",
        bg: "bg-rose-950/60 border-rose-800/40",
      });
    }
  }

  // ── High volatility ──────────────────────────────────────────────────
  const volThreshold = asset.type === "crypto" ? 0.12 : 0.07;
  const extremeThreshold = asset.type === "crypto" ? 0.16 : 0.10;
  if (asset.volatility >= extremeThreshold) {
    signals.push({
      icon: "⚡",
      label: "Extreme volatility",
      key: "extreme_vol",
      color: "text-amber-300",
      bg: "bg-amber-950/70 border-amber-700/50",
    });
  } else if (asset.volatility >= volThreshold) {
    signals.push({
      icon: "🌊",
      label: "High volatility",
      key: "high_vol",
      color: "text-amber-400",
      bg: "bg-amber-950/50 border-amber-800/40",
    });
  }

  // ── Structural trend bias ────────────────────────────────────────────
  if (asset.trend >= 0.001) {
    signals.push({
      icon: "☀️",
      label: "Strong upward trend bias",
      key: "uptrend",
      color: "text-emerald-400",
      bg: "bg-emerald-950/50 border-emerald-800/40",
    });
  } else if (asset.trend <= -0.001) {
    signals.push({
      icon: "🌧️",
      label: "Downward trend bias",
      key: "downtrend",
      color: "text-rose-400",
      bg: "bg-rose-950/50 border-rose-800/40",
    });
  }

  // ── WSB / blog trending ──────────────────────────────────────────────
  const recentPosts = blogFeed.filter(
    (p) => p.linkedTickers.includes(asset.ticker) && p.day >= currentDay - 2
  );
  if (recentPosts.length > 0) {
    const totalUpvotes = recentPosts.reduce((s, p) => s + p.upvotes, 0);
    const totalDownvotes = recentPosts.reduce((s, p) => s + p.downvotes, 0);
    const netScore = totalUpvotes - totalDownvotes;
    const postCount = recentPosts.length;

    if (netScore >= 30 || postCount >= 3) {
      signals.push({
        icon: "🔥",
        label: `WSB is talking — ${postCount} post${postCount > 1 ? "s" : ""}, net score ${netScore > 0 ? "+" : ""}${netScore}`,
        key: "wsb_hot",
        color: "text-orange-300",
        bg: "bg-orange-950/70 border-orange-700/50",
      });
    } else if (netScore >= 10 || postCount >= 2) {
      signals.push({
        icon: "💬",
        label: `Mentioned in ${postCount} recent WSB post${postCount > 1 ? "s" : ""}`,
        key: "wsb_buzz",
        color: "text-blue-300",
        bg: "bg-blue-950/60 border-blue-700/50",
      });
    } else if (netScore < -10) {
      signals.push({
        icon: "🗑️",
        label: `WSB is bearish — ${postCount} post${postCount > 1 ? "s" : ""}, net score ${netScore}`,
        key: "wsb_bear",
        color: "text-rose-400",
        bg: "bg-rose-950/50 border-rose-800/40",
      });
    } else {
      signals.push({
        icon: "💬",
        label: `Mentioned in a recent WSB post`,
        key: "wsb_buzz",
        color: "text-slate-300",
        bg: "bg-[#151c2f]/70 border-white/[0.07]",
      });
    }
  }

  return signals;
}

// All possible signal filter options shown as pills
export const SIGNAL_FILTERS: { key: string; icon: string; label: string }[] = [
  { key: "surging",    icon: "🚀", label: "Surging"       },
  { key: "rising",     icon: "📈", label: "Rising"        },
  { key: "crashing",   icon: "🔻", label: "Crashing"      },
  { key: "falling",    icon: "📉", label: "Falling"       },
  { key: "wsb_hot",    icon: "🔥", label: "WSB Hot"       },
  { key: "wsb_buzz",   icon: "💬", label: "WSB Buzz"      },
  { key: "earnings",   icon: "📣", label: "Earnings Soon" },
  { key: "extreme_vol",icon: "⚡", label: "Extreme Vol"   },
  { key: "high_vol",   icon: "🌊", label: "High Vol"      },
  { key: "uptrend",    icon: "☀️", label: "Uptrend"       },
  { key: "downtrend",  icon: "🌧️", label: "Downtrend"     },
  { key: "event_bull", icon: "📰", label: "Bullish Event" },
  { key: "event_bear", icon: "📰", label: "Bearish Event" },
];
