"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import type { BlogPost, BlogPostFlair } from "@/types";
import { PostComposer } from "@/components/blog/PostComposer";

const FLAIR_STYLES: Record<BlogPostFlair, string> = {
  DD:         "bg-blue-900/60 text-blue-300 border-blue-700",
  News:       "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  Discussion: "bg-[#151c2f] text-slate-200 border-slate-500",
  Meme:       "bg-purple-900/60 text-purple-300 border-purple-700",
  YOLO:       "bg-orange-900/60 text-orange-300 border-orange-700",
  Shitpost:   "bg-rose-900/60 text-rose-300 border-rose-700",
};

// Credibility heuristic scores per flair (observable signal, not isReal)
const FLAIR_CRED: Record<BlogPostFlair, number> = {
  DD: 3, News: 3, Discussion: 1, YOLO: 0, Meme: -1, Shitpost: -2,
};

function getCredibilityGrade(post: BlogPost, grades: 3 | 5): { label: string; color: string } {
  const netVotes = post.upvotes - post.downvotes;
  const voteScore = netVotes > 500 ? 2 : netVotes > 100 ? 1 : netVotes >= 0 ? 0 : netVotes > -100 ? -1 : -2;
  const total = FLAIR_CRED[post.flair] + voteScore;

  if (grades === 3) {
    if (total >= 3) return { label: "Credibility: High", color: "text-emerald-500 border-emerald-800 bg-emerald-900/20" };
    if (total >= 1) return { label: "Credibility: Medium", color: "text-yellow-500 border-yellow-800 bg-yellow-900/20" };
    return { label: "Credibility: Low", color: "text-red-500 border-red-800 bg-red-900/20" };
  } else {
    if (total >= 4) return { label: "Credibility: Very High", color: "text-emerald-400 border-emerald-700 bg-emerald-900/30" };
    if (total >= 2) return { label: "Credibility: High", color: "text-emerald-600 border-emerald-800 bg-emerald-900/20" };
    if (total >= 0) return { label: "Credibility: Medium", color: "text-yellow-500 border-yellow-800 bg-yellow-900/20" };
    if (total >= -2) return { label: "Credibility: Low", color: "text-orange-500 border-orange-800 bg-orange-900/20" };
    return { label: "Credibility: Very Low", color: "text-red-400 border-red-700 bg-red-900/30" };
  }
}

function verificationStatus(post: BlogPost, currentDay: number, literacy: number): "VERIFIED" | "UNVERIFIED" | null {
  // L5: immediate reveal
  if (literacy >= 5) return post.isReal ? "VERIFIED" : "UNVERIFIED";
  // L3+: reveal after 1 day instead of 2
  const revealDelay = literacy >= 3 ? 1 : 2;
  if (currentDay - post.day < revealDelay) return null;
  return post.isReal ? "VERIFIED" : "UNVERIFIED";
}

function PostCard({ post, literacy }: { post: BlogPost; literacy: number }) {
  const { state, dispatch } = useGame();
  const [expanded, setExpanded] = useState(false);
  const status = verificationStatus(post, state.currentDay, literacy);
  const netScore = post.upvotes - post.downvotes;

  // Blog Literacy credibility heuristic (shown on all posts at L1+)
  const credGrade = literacy >= 1 ? getCredibilityGrade(post, literacy >= 2 ? 5 : 3) : null;

  // L4+: warn about likely-fake posts before normal reveal window
  // Only applies when status isn't already revealed
  const showLikelyFakeWarning = literacy >= 4 && status === null && !post.isReal && !post.isPredictionWrong;

  function vote(v: "UP" | "DOWN") {
    dispatch({
      type: "VOTE_BLOG_POST",
      payload: { postId: post.id, vote: post.playerVote === v ? null : v },
    });
  }

  return (
    <div className={`rounded-xl overflow-hidden transition-colors ${post.isPlayerPost ? "bg-[#0f1221] border border-blue-900/60 hover:border-blue-800/80" : "bg-[#0f1221] border border-white/[0.07] hover:border-white/[0.07]"}`}>
      <div className="flex gap-0">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 px-3 py-3 bg-[#0a0a0f]/60 border-r border-white/[0.07] min-w-[48px]">
          <button
            onClick={() => vote("UP")}
            className={`text-sm transition-colors ${post.playerVote === "UP" ? "text-orange-400" : "text-slate-500 hover:text-orange-400"}`}
          >
            ▲
          </button>
          <span className={`text-xs font-mono font-bold tabular-nums ${netScore > 0 ? "text-orange-400" : netScore < 0 ? "text-blue-400" : "text-slate-400"}`}>
            {netScore >= 1000 ? `${(netScore / 1000).toFixed(1)}k` : netScore}
          </span>
          <button
            onClick={() => vote("DOWN")}
            className={`text-sm transition-colors ${post.playerVote === "DOWN" ? "text-blue-400" : "text-slate-500 hover:text-blue-400"}`}
          >
            ▼
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 min-w-0">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${FLAIR_STYLES[post.flair]}`}>
              {post.flair}
            </span>

            {/* Linked tickers */}
            {post.linkedTickers.map((t) => {
              const asset = state.assets[t];
              const href = asset ? `/${asset.type === "crypto" ? "crypto" : "stock"}/${t}` : "#";
              return (
                <Link
                  key={t}
                  href={href}
                  className="text-xs font-mono text-blue-400 hover:text-blue-300 bg-blue-900/20 border border-blue-800/40 px-1.5 py-0.5 rounded transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {t}
                </Link>
              );
            })}

            {/* Player post badge */}
            {post.isPlayerPost && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-blue-900/40 text-blue-400 border-blue-800">
                ✏ Your Post
              </span>
            )}

            {/* Price influence indicator */}
            {post.isPlayerPost &&
              post.linkedTickers.length > 0 &&
              (state.playerFollowerCount ?? 0) >= 50 && (
                <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-emerald-900/40 text-emerald-400 border-emerald-800">
                  📈 Moving market
                </span>
              )}

            {/* Wild boost badge */}
            {post.isWildBoosted && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-orange-900/50 text-orange-300 border-orange-700">
                🔥 WILD BOOST
              </span>
            )}

            {/* Blog Literacy L1+: credibility heuristic */}
            {credGrade && (
              <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${credGrade.color}`}>
                {credGrade.label}
              </span>
            )}

            {/* Blog Literacy L4+: likely-fake warning before reveal window */}
            {showLikelyFakeWarning && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-orange-900/50 text-orange-400 border-orange-700">
                ⚠ LIKELY FAKE
              </span>
            )}

            {/* Verification badge — timing depends on Blog Literacy level */}
            {status === "VERIFIED" && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-emerald-900/50 text-emerald-400 border-emerald-700">
                ✓ VERIFIED
              </span>
            )}
            {status === "UNVERIFIED" && !post.isPredictionWrong && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-[#151c2f] text-slate-400 border-white/[0.07]">
                ✗ UNVERIFIED
              </span>
            )}
            {post.isPredictionWrong && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-red-900/50 text-red-400 border-red-800">
                ✗ WRONG CALL
              </span>
            )}
          </div>

          {/* Title */}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-left w-full"
          >
            <div className="text-sm font-bold text-white leading-snug hover:text-blue-300 transition-colors">
              {post.title}
            </div>
          </button>

          {/* Expanded body */}
          {expanded && (
            <div className="mt-2 text-xs text-slate-200 leading-relaxed border-t border-white/[0.07] pt-2">
              {post.body}
            </div>
          )}

          {/* Footer */}
          <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-500">
            <span>u/{post.author}</span>
            <span>·</span>
            <span>Day {post.day}</span>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="hover:text-slate-300 transition-colors"
            >
              {expanded ? "collapse" : "read more"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main BlogFeed ────────────────────────────────────────────────────────────

type BlogSource = "wsb" | "premium" | "wildcat";

export function BlogFeed() {
  const { state, dispatch } = useGame();
  const { blogFeed, currentDay } = state;
  const literacy = state.traderSkills?.blogLiteracy ?? 0;
  const [tickerFilter, setTickerFilter] = useState<string | null>(null);
  const [flairFilter, setFlairFilter] = useState<BlogPostFlair | null>(null);
  const [daysShown, setDaysShown] = useState(5);
  const [activeBlogSource, setActiveBlogSource] = useState<BlogSource>("wsb");
  const [myPostsOnly, setMyPostsOnly] = useState(false);

  const hasPremiumBlog = state.premiumBlogSubscription !== null &&
    state.currentDay - (state.premiumBlogSubscription?.purchasedDay ?? 0) < 7;

  // Unique tickers mentioned across all posts in active source
  const mentionedTickers = useMemo(() => {
    const t = new Set<string>();
    blogFeed
      .filter((p) => (p.source ?? "wsb") === activeBlogSource)
      .forEach((p) => p.linkedTickers.forEach((tk) => t.add(tk)));
    return Array.from(t).sort();
  }, [blogFeed, activeBlogSource]);

  const filtered = useMemo(() => {
    return [...blogFeed]
      .filter((p) => {
        if ((p.source ?? "wsb") !== activeBlogSource) return false;
        if (myPostsOnly && !p.isPlayerPost) return false;
        if (tickerFilter && !p.linkedTickers.includes(tickerFilter)) return false;
        if (flairFilter && p.flair !== flairFilter) return false;
        if (!myPostsOnly && currentDay - p.day >= daysShown) return false;
        return true;
      })
      .sort((a, b) => b.day - a.day || b.upvotes - a.upvotes);
  }, [blogFeed, tickerFilter, flairFilter, daysShown, currentDay, activeBlogSource, myPostsOnly]);

  // Group by day
  const byDay = useMemo(() => {
    const groups = new Map<number, BlogPost[]>();
    for (const post of filtered) {
      const arr = groups.get(post.day) ?? [];
      arr.push(post);
      groups.set(post.day, arr);
    }
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const allFlairs: BlogPostFlair[] = ["DD", "News", "Discussion", "Meme", "YOLO", "Shitpost"];
  const myPostCount = blogFeed.filter((p) => p.isPlayerPost && (p.source ?? "wsb") === activeBlogSource).length;

  const wsbCount = blogFeed.filter((p) => (p.source ?? "wsb") === "wsb").length;
  const premiumCount = blogFeed.filter((p) => p.source === "premium").length;
  const wildcatCount = blogFeed.filter((p) => p.source === "wildcat").length;

  function handleBuyPremium() {
    dispatch({ type: "BUY_PREMIUM_BLOG" });
  }

  function handleSourceChange(src: BlogSource) {
    setActiveBlogSource(src);
    setMyPostsOnly(false);
    setTickerFilter(null);
    setFlairFilter(null);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Source tab navigation — horizontally scrollable on mobile */}
      <div className="overflow-x-auto mb-4">
        <div className="flex gap-2 min-w-max pb-1">
          {/* WSB tab */}
          <button
            onClick={() => handleSourceChange("wsb")}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-colors ${
              activeBlogSource === "wsb"
                ? "bg-cyan-900/40 border-cyan-700 text-cyan-300"
                : "bg-[#0f1221] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.07]"
            }`}
          >
            <span className="block">r/WallStreetWreckage</span>
            <span className="text-xs font-normal opacity-70">Free · 80% FUD</span>
          </button>

          {/* Premium tab */}
          <button
            onClick={() => handleSourceChange("premium")}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-colors ${
              activeBlogSource === "premium"
                ? "bg-amber-900/40 border-amber-700 text-amber-300"
                : "bg-[#0f1221] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.07]"
            }`}
          >
            <span className="block">WealthWatch Insider</span>
            <span className="text-xs font-normal opacity-70">
              {hasPremiumBlog ? "Subscribed · 60% FUD" : "$5,000/wk · 60% real"}
            </span>
          </button>

          {/* Wildcat tab */}
          <button
            onClick={() => handleSourceChange("wildcat")}
            className={`flex-shrink-0 px-4 py-2 rounded-xl border font-mono text-xs font-bold transition-colors ${
              activeBlogSource === "wildcat"
                ? "bg-orange-900/40 border-orange-700 text-orange-300"
                : "bg-[#0f1221] border-white/[0.07] text-slate-400 hover:text-slate-200 hover:border-white/[0.07]"
            }`}
          >
            <span className="block">ApeStation</span>
            <span className="text-xs font-normal opacity-70">Free · 95% chaos</span>
          </button>
        </div>
      </div>

      {/* Header — per source */}
      <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4 mb-4">
        {activeBlogSource === "wsb" && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-mono font-bold text-white text-lg">r/WallStreetWreckage</h1>
                <p className="text-xs text-slate-400 mt-1">
                  The internet&apos;s finest financial misinformation, curated daily.
                  <span className="text-yellow-600 ml-2">80% of posts are FUD. You figure out which.</span>
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div className="font-mono text-slate-300">{wsbCount.toLocaleString()}</div>
                <div>posts</div>
                {(state.playerFollowerCount ?? 0) > 0 && (
                  <div className="mt-1">
                    <span className="font-mono text-blue-400">{(state.playerFollowerCount ?? 0).toLocaleString()}</span>
                    <span className="ml-1">followers</span>
                  </div>
                )}
              </div>
            </div>
            {/* Verification legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/[0.07] text-xs">
              {literacy >= 5 ? (
                <span className="text-amber-400 font-mono">⚡ Truth Broker: Real/fake status shown immediately</span>
              ) : literacy >= 3 ? (
                <>
                  <span className="text-slate-400">After 1 day:</span>
                  <span className="text-emerald-400 font-mono">✓ VERIFIED = real news</span>
                  <span className="text-slate-400 font-mono">✗ UNVERIFIED = FUD</span>
                </>
              ) : (
                <>
                  <span className="text-slate-400">After 2 days:</span>
                  <span className="text-emerald-400 font-mono">✓ VERIFIED = real news</span>
                  <span className="text-slate-400 font-mono">✗ UNVERIFIED = FUD</span>
                </>
              )}
            </div>
          </>
        )}

        {activeBlogSource === "premium" && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-mono font-bold text-amber-300 text-lg">WealthWatch Insider</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Professional analyst research.
                  {hasPremiumBlog
                    ? <span className="text-amber-500 ml-2">40% of posts reflect real market events.</span>
                    : <span className="text-slate-500 ml-2">Subscribe for $5,000/week to unlock.</span>
                  }
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div className="font-mono text-amber-400">{premiumCount.toLocaleString()}</div>
                <div>posts</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-white/[0.07] text-xs">
              <span className="text-amber-600 font-mono">40% of posts here reflect real events — higher signal than WSB</span>
            </div>
          </>
        )}

        {activeBlogSource === "wildcat" && (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-mono font-bold text-orange-400 text-lg">ApeStation</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Maximum degeneracy. Free entry.
                  <span className="text-orange-600 ml-2">95% fabricated. The 5% that aren&apos;t move markets.</span>
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div className="font-mono text-orange-400">{wildcatCount.toLocaleString()}</div>
                <div>posts</div>
              </div>
            </div>
            {/* Warning banner */}
            <div className="mt-3 pt-3 border-t border-white/[0.07]">
              <div className="bg-orange-950/40 border border-orange-800/60 rounded px-3 py-2 text-xs text-orange-400 font-mono">
                ⚠ 95% of posts are fabricated. The 5% that aren&apos;t trigger extreme market moves via volatility multipliers.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Premium lock panel */}
      {activeBlogSource === "premium" && !hasPremiumBlog && (
        <div className="bg-[#0f1221] border border-amber-800/50 rounded-xl p-6 mb-4 text-center">
          <div className="text-3xl mb-3">🔒</div>
          <h2 className="font-mono font-bold text-amber-300 text-base mb-2">WealthWatch Insider</h2>
          <p className="text-sm text-slate-300 mb-4 max-w-sm mx-auto">
            Professional analyst research with 40% real event coverage.
            Higher signal-to-noise than the free feeds.
          </p>
          <div className="text-xs text-slate-400 font-mono mb-4">
            $5,000 / week · {state.portfolio.cash >= 5000
              ? <span className="text-emerald-400">You can afford this</span>
              : <span className="text-red-400">Need ${(5000 - state.portfolio.cash).toLocaleString()} more</span>
            }
          </div>
          <button
            onClick={handleBuyPremium}
            disabled={state.portfolio.cash < 5000}
            className={`px-6 py-2 rounded border font-mono font-bold text-sm transition-colors ${
              state.portfolio.cash >= 5000
                ? "bg-amber-900/40 border-amber-700 text-amber-300 hover:bg-amber-800/50 active:scale-95"
                : "bg-[#151c2f] border-white/[0.07] text-slate-500 cursor-not-allowed"
            }`}
          >
            Subscribe — $5,000/week
          </button>
        </div>
      )}

      {/* Post Composer — only on WSB tab */}
      {activeBlogSource === "wsb" && <PostComposer />}

      {/* Filters */}
      {(activeBlogSource !== "premium" || hasPremiumBlog) && (
        <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-3 mb-4">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 font-medium mr-1">Flair:</span>
            <button
              onClick={() => { setFlairFilter(null); setMyPostsOnly(false); }}
              className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${!flairFilter && !myPostsOnly ? "bg-[#1e2a45] border-white/[0.07] text-white" : "border-white/[0.07] text-slate-400 hover:text-slate-200"}`}
            >
              All
            </button>
            {allFlairs.map((f) => (
              <button
                key={f}
                onClick={() => { setFlairFilter(flairFilter === f ? null : f); setMyPostsOnly(false); }}
                className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${flairFilter === f && !myPostsOnly ? "bg-[#1e2a45] border-white/[0.07] text-white" : "border-white/[0.07] text-slate-400 hover:text-slate-200"}`}
              >
                {f}
              </button>
            ))}
            {activeBlogSource === "wsb" && myPostCount > 0 && (
              <button
                onClick={() => { setMyPostsOnly((v) => !v); setFlairFilter(null); }}
                className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${myPostsOnly ? "bg-blue-800 border-blue-600 text-blue-200" : "border-blue-800/50 text-blue-400 hover:border-blue-700 hover:text-blue-300"}`}
              >
                ✏ My Posts ({myPostCount})
              </button>
            )}
          </div>

          {mentionedTickers.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center mt-2 pt-2 border-t border-white/[0.07]">
              <span className="text-xs text-slate-400 font-medium mr-1">Ticker:</span>
              <button
                onClick={() => setTickerFilter(null)}
                className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${!tickerFilter ? "bg-[#1e2a45] border-white/[0.07] text-white" : "border-white/[0.07] text-slate-400 hover:text-slate-200"}`}
              >
                All
              </button>
              {mentionedTickers.slice(0, 20).map((t) => (
                <button
                  key={t}
                  onClick={() => setTickerFilter(tickerFilter === t ? null : t)}
                  className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${tickerFilter === t ? "bg-blue-800 border-blue-600 text-white" : "border-white/[0.07] text-slate-400 hover:text-blue-400"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feed */}
      {activeBlogSource === "premium" && !hasPremiumBlog ? null : blogFeed.filter((p) => (p.source ?? "wsb") === activeBlogSource).length === 0 ? (
        <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-8 text-center">
          <div className="text-3xl mb-3">📭</div>
          <div className="text-slate-300 text-sm">No posts yet.</div>
          <div className="text-slate-500 text-xs mt-1">Advance a day to see the community react to market events.</div>
        </div>
      ) : byDay.length === 0 && myPostsOnly ? (
        <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-8 text-center">
          <div className="text-3xl mb-3">✏️</div>
          <div className="text-slate-300 text-sm">No posts from you yet.</div>
          <div className="text-slate-500 text-xs mt-1">Write something above to share your take with the community.</div>
        </div>
      ) : byDay.length === 0 ? (
        <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-6 text-center text-slate-400 text-sm">
          No posts match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {byDay.map(([day, posts]) => (
            <div key={day}>
              <div className="text-xs font-mono text-slate-400 font-medium mb-2 flex items-center gap-2">
                <span className="border-b border-white/[0.07] flex-1" />
                <span>{day === currentDay ? "TODAY" : `Day ${day}`} · {posts.length} posts</span>
                <span className="border-b border-white/[0.07] flex-1" />
              </div>
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} literacy={literacy} />
                ))}
              </div>
            </div>
          ))}

          {/* Load more */}
          <button
            onClick={() => setDaysShown((d) => d + 7)}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 border border-white/[0.07] hover:border-white/[0.07] rounded-xl transition-colors font-mono"
          >
            Load older posts ↓
          </button>
        </div>
      )}
    </div>
  );
}
