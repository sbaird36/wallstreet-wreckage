"use client";

import { useState, useRef } from "react";
import { useGame } from "@/context/GameContext";
import type { BlogPost, BlogPostFlair } from "@/types";

const FLAIRS: BlogPostFlair[] = ["DD", "Discussion", "YOLO", "Meme", "Shitpost"];

const FLAIR_STYLES: Record<BlogPostFlair, string> = {
  DD:         "bg-blue-900/60 text-blue-300 border-blue-700",
  News:       "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  Discussion: "bg-[#151c2f] text-slate-200 border-slate-500",
  Meme:       "bg-purple-900/60 text-purple-300 border-purple-700",
  YOLO:       "bg-orange-900/60 text-orange-300 border-orange-700",
  Shitpost:   "bg-rose-900/60 text-rose-300 border-rose-700",
};

function getPlayerId(): string {
  if (typeof window === "undefined") return "anon";
  const key = "wallstreet_player_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `p_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

interface Props {
  onPosted?: () => void;
}

export function PostComposer({ onPosted }: Props) {
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState<BlogPostFlair>("Discussion");
  const [ticker, setTicker] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const tickers = Object.keys(state.assets).sort();

  function handleOpen() {
    setOpen(true);
    setTimeout(() => titleRef.current?.focus(), 50);
  }

  function handleCancel() {
    setOpen(false);
    setTitle("");
    setBody("");
    setFlair("Discussion");
    setTicker("");
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);

    const postId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const playerId = getPlayerId();
    const linkedTickers = ticker ? [ticker] : [];

    const post: BlogPost = {
      id: postId,
      day: state.currentDay,
      flair,
      title: title.trim(),
      body: body.trim(),
      author: state.playerName || "You",
      upvotes: 1,
      downvotes: 0,
      playerVote: "UP",
      isReal: false,
      linkedEventId: null,
      linkedTickers,
      isPlayerPost: true,
      source: "wsb",
    };

    // Add to game state immediately (optimistic)
    dispatch({ type: "POST_BLOG_POST", payload: post });

    // Save to DB (fire and forget — don't block UI)
    try {
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: postId,
          playerId,
          gameDay: state.currentDay,
          ticker: ticker || null,
          title: title.trim(),
          body: body.trim(),
          flair,
          author: state.playerName || "You",
        }),
      });
    } catch {
      // DB save failure is non-blocking — post is still in local state
    }

    setSubmitting(false);
    handleCancel();
    onPosted?.();
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="w-full bg-[#0f1221] border border-white/[0.07] hover:border-white/[0.07] rounded-xl p-3 text-left flex items-center gap-3 transition-colors group mb-4"
      >
        <div className="w-8 h-8 rounded-full bg-[#1e2a45] flex items-center justify-center text-sm flex-shrink-0">
          {state.playerName?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span className="text-sm text-slate-400 group-hover:text-slate-300 flex-1">
          Share your take with r/WallStreetWreckage…
        </span>
        <span className="text-xs text-blue-400 border border-blue-800 px-2 py-1 rounded font-mono">
          Post
        </span>
      </button>
    );
  }

  return (
    <div className="bg-[#0f1221] border border-blue-800/60 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center text-xs font-bold text-white">
            {state.playerName?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-xs font-mono text-blue-400">u/{state.playerName || "You"}</span>
        </div>
        <button onClick={handleCancel} className="text-slate-500 hover:text-slate-300 text-sm">✕</button>
      </div>

      {/* Flair picker */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {FLAIRS.map((f) => (
          <button
            key={f}
            onClick={() => setFlair(f)}
            className={`text-xs px-2 py-0.5 rounded border font-mono transition-colors ${
              flair === f ? FLAIR_STYLES[f] : "border-white/[0.07] text-slate-500 hover:text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Ticker picker */}
      <div className="mb-3">
        <select
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className="w-full bg-[#151c2f] border border-white/[0.07] rounded px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-600"
        >
          <option value="">No ticker (general post)</option>
          {tickers.map((t) => (
            <option key={t} value={t}>{t} — {state.assets[t]?.name}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <input
        ref={titleRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title (required)"
        maxLength={200}
        className="w-full bg-[#151c2f] border border-white/[0.07] rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 mb-2"
      />

      {/* Body */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Your thesis, your loss porn, your DD… (optional)"
        rows={4}
        className="w-full bg-[#151c2f] border border-white/[0.07] rounded px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-600 resize-none mb-3"
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">{title.length}/200</span>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
            className="text-xs bg-blue-700 hover:bg-blue-600 disabled:bg-[#151c2f] disabled:text-slate-500 text-white px-4 py-1.5 rounded font-mono transition-colors"
          >
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
