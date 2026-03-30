"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { BlogFeed } from "@/components/blog/BlogFeed";
import { ContactsPanel } from "@/components/blog/ContactsPanel";
import { MarketTicker } from "@/components/dashboard/MarketTicker";

export default function BlogPage() {
  const { state } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  if (!state.gameStarted) return null;

  const unreadTips = (state.contactTips ?? []).filter((t) => !t.isRead).length;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <TopNav />
      <main className="flex-1 p-4 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Blog feed — takes remaining space */}
          <div className="flex-1 min-w-0">
            <BlogFeed />
          </div>

          {/* Contacts sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            {/* Mobile: collapsible; Desktop: always visible */}
            <div className="sticky top-4">
              <ContactsPanel />

              {/* Contact unlock progress */}
              <div className="mt-3 bg-gray-900 border border-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-mono">
                  Network Progress
                </div>
                <div className="text-sm font-mono font-bold text-white">
                  {(state.playerFollowerCount ?? 0).toLocaleString()}
                  <span className="text-gray-500 font-normal text-xs ml-1">followers</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {(state.contacts ?? []).length} contacts · {state.playerPostCount ?? 0} post{(state.playerPostCount ?? 0) !== 1 ? "s" : ""}
                </div>
                {(state.playerFollowerCount ?? 0) >= 50 && (
                  <div className="mt-2 text-xs text-emerald-400 font-mono">
                    📈 Posts now influence prices
                  </div>
                )}
                {(state.playerFollowerCount ?? 0) < 50 && (state.playerFollowerCount ?? 0) > 0 && (
                  <div className="mt-2 text-xs text-gray-600">
                    {50 - (state.playerFollowerCount ?? 0)} more followers until posts move prices
                  </div>
                )}
                {unreadTips > 0 && (
                  <div className="mt-2 text-xs text-blue-400">
                    {unreadTips} unread tip{unreadTips !== 1 ? "s" : ""} in inbox
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="sticky bottom-0">
        <MarketTicker />
      </div>
    </div>
  );
}
