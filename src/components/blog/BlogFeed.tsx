"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGame } from "@/context/GameContext";
import type { BlogPost, BlogPostFlair } from "@/types";

const FLAIR_STYLES: Record<BlogPostFlair, string> = {
  DD:         "bg-blue-900/60 text-blue-300 border-blue-700",
  News:       "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  Discussion: "bg-gray-800 text-gray-300 border-gray-600",
  Meme:       "bg-purple-900/60 text-purple-300 border-purple-700",
  YOLO:       "bg-orange-900/60 text-orange-300 border-orange-700",
  Shitpost:   "bg-rose-900/60 text-rose-300 border-rose-700",
};

function verificationStatus(post: BlogPost, currentDay: number) {
  if (currentDay - post.day < 2) return null; // too recent to know
  return post.isReal ? "VERIFIED" : "UNVERIFIED";
}

function PostCard({ post }: { post: BlogPost }) {
  const { state, dispatch } = useGame();
  const [expanded, setExpanded] = useState(false);
  const status = verificationStatus(post, state.currentDay);
  const netScore = post.upvotes - post.downvotes;

  function vote(v: "UP" | "DOWN") {
    dispatch({
      type: "VOTE_BLOG_POST",
      payload: { postId: post.id, vote: post.playerVote === v ? null : v },
    });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors">
      <div className="flex gap-0">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 px-3 py-3 bg-gray-950/60 border-r border-gray-800 min-w-[48px]">
          <button
            onClick={() => vote("UP")}
            className={`text-sm transition-colors ${post.playerVote === "UP" ? "text-orange-400" : "text-gray-600 hover:text-orange-400"}`}
          >
            ▲
          </button>
          <span className={`text-xs font-mono font-bold tabular-nums ${netScore > 0 ? "text-orange-400" : netScore < 0 ? "text-blue-400" : "text-gray-500"}`}>
            {netScore >= 1000 ? `${(netScore / 1000).toFixed(1)}k` : netScore}
          </span>
          <button
            onClick={() => vote("DOWN")}
            className={`text-sm transition-colors ${post.playerVote === "DOWN" ? "text-blue-400" : "text-gray-600 hover:text-blue-400"}`}
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

            {/* Verification badge — only shown after 2 days */}
            {status === "VERIFIED" && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-emerald-900/50 text-emerald-400 border-emerald-700">
                ✓ VERIFIED
              </span>
            )}
            {status === "UNVERIFIED" && (
              <span className="text-xs px-1.5 py-0.5 rounded border font-mono bg-gray-800 text-gray-500 border-gray-700">
                ✗ UNVERIFIED
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
            <div className="mt-2 text-xs text-gray-300 leading-relaxed border-t border-gray-800 pt-2">
              {post.body}
            </div>
          )}

          {/* Footer */}
          <div className="mt-1.5 flex items-center gap-3 text-xs text-gray-600">
            <span>u/{post.author}</span>
            <span>·</span>
            <span>Day {post.day}</span>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="hover:text-gray-400 transition-colors"
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

export function BlogFeed() {
  const { state } = useGame();
  const { blogFeed, currentDay } = state;
  const [tickerFilter, setTickerFilter] = useState<string | null>(null);
  const [flairFilter, setFlairFilter] = useState<BlogPostFlair | null>(null);
  const [daysShown, setDaysShown] = useState(5);

  // Unique tickers mentioned across all posts
  const mentionedTickers = useMemo(() => {
    const t = new Set<string>();
    blogFeed.forEach((p) => p.linkedTickers.forEach((tk) => t.add(tk)));
    return Array.from(t).sort();
  }, [blogFeed]);

  const filtered = useMemo(() => {
    return [...blogFeed]
      .filter((p) => {
        if (tickerFilter && !p.linkedTickers.includes(tickerFilter)) return false;
        if (flairFilter && p.flair !== flairFilter) return false;
        if (currentDay - p.day >= daysShown) return false;
        return true;
      })
      .sort((a, b) => b.day - a.day || b.upvotes - a.upvotes);
  }, [blogFeed, tickerFilter, flairFilter, daysShown, currentDay]);

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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-mono font-bold text-white text-lg">r/WallStreetWreckage</h1>
            <p className="text-xs text-gray-500 mt-1">
              The internet&apos;s finest financial misinformation, curated daily.
              <span className="text-yellow-600 ml-2">80% of posts are FUD. You figure out which.</span>
            </p>
          </div>
          <div className="text-right text-xs text-gray-600">
            <div className="font-mono text-gray-400">{blogFeed.length.toLocaleString()}</div>
            <div>total posts</div>
          </div>
        </div>

        {/* Verification legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-gray-800 text-xs">
          <span className="text-gray-500">After 2 days:</span>
          <span className="text-emerald-400 font-mono">✓ VERIFIED = real news</span>
          <span className="text-gray-500 font-mono">✗ UNVERIFIED = FUD</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 mb-4">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mr-1">Flair:</span>
          <button
            onClick={() => setFlairFilter(null)}
            className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${!flairFilter ? "bg-gray-700 border-gray-500 text-white" : "border-gray-700 text-gray-500 hover:text-gray-300"}`}
          >
            All
          </button>
          {allFlairs.map((f) => (
            <button
              key={f}
              onClick={() => setFlairFilter(flairFilter === f ? null : f)}
              className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${flairFilter === f ? "bg-gray-700 border-gray-500 text-white" : "border-gray-700 text-gray-500 hover:text-gray-300"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {mentionedTickers.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center mt-2 pt-2 border-t border-gray-800">
            <span className="text-xs text-gray-500 font-mono uppercase tracking-wider mr-1">Ticker:</span>
            <button
              onClick={() => setTickerFilter(null)}
              className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${!tickerFilter ? "bg-gray-700 border-gray-500 text-white" : "border-gray-700 text-gray-500 hover:text-gray-300"}`}
            >
              All
            </button>
            {mentionedTickers.slice(0, 20).map((t) => (
              <button
                key={t}
                onClick={() => setTickerFilter(tickerFilter === t ? null : t)}
                className={`text-xs px-2 py-1 rounded border font-mono transition-colors ${tickerFilter === t ? "bg-blue-800 border-blue-600 text-white" : "border-gray-700 text-gray-500 hover:text-blue-400"}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feed */}
      {blogFeed.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <div className="text-3xl mb-3">📭</div>
          <div className="text-gray-400 text-sm">No posts yet.</div>
          <div className="text-gray-600 text-xs mt-1">Advance a day to see the community react to market events.</div>
        </div>
      ) : byDay.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center text-gray-500 text-sm">
          No posts match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {byDay.map(([day, posts]) => (
            <div key={day}>
              <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="border-b border-gray-800 flex-1" />
                <span>{day === currentDay ? "TODAY" : `Day ${day}`} · {posts.length} posts</span>
                <span className="border-b border-gray-800 flex-1" />
              </div>
              <div className="space-y-2">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}

          {/* Load more */}
          <button
            onClick={() => setDaysShown((d) => d + 7)}
            className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 border border-gray-800 hover:border-gray-700 rounded-lg transition-colors font-mono"
          >
            Load older posts ↓
          </button>
        </div>
      )}
    </div>
  );
}
