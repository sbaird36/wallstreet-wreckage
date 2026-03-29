"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { CONTACTS, getUnlockedContacts } from "@/data/contacts";
import type { ContactTip } from "@/types";

const TIER_LABELS: Record<number, string> = {
  1: "Acquaintance",
  2: "Connected",
  3: "Insider",
};

const TIER_STYLES: Record<number, string> = {
  1: "text-gray-400 bg-gray-800 border-gray-600",
  2: "text-blue-300 bg-blue-900/50 border-blue-700",
  3: "text-yellow-300 bg-yellow-900/40 border-yellow-700",
};

const DIR_STYLES = {
  bullish: "text-emerald-400 bg-emerald-900/30 border-emerald-800",
  bearish: "text-rose-400 bg-rose-900/30 border-rose-800",
};

function TipCard({ tip }: { tip: ContactTip }) {
  const { dispatch, state } = useGame();
  const contact = CONTACTS.find((c) => c.id === tip.contactId);
  const asset = state.assets[tip.ticker];

  return (
    <div className={`rounded-lg border p-3 mb-2 ${tip.isRead ? "opacity-70" : "border-l-2"} ${tip.isRead ? "border-gray-800" : tip.direction === "bullish" ? "border-l-emerald-700 border-gray-800" : "border-l-rose-700 border-gray-800"}`}>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="text-base">{contact?.emoji ?? "👤"}</span>
          <span className="text-xs font-mono text-gray-300 font-bold truncate">
            u/{contact?.username ?? tip.contactId}
          </span>
          {!tip.isRead && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          )}
        </div>
        <button
          onClick={() => dispatch({ type: "DISMISS_CONTACT_TIP", payload: { tipId: tip.id } })}
          className="text-gray-700 hover:text-gray-400 text-xs flex-shrink-0"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed mb-2">{tip.message}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {tip.ticker && (
            <span className="text-xs font-mono px-1.5 py-0.5 rounded border bg-blue-900/20 text-blue-400 border-blue-800/40">
              {tip.ticker}
            </span>
          )}
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${DIR_STYLES[tip.direction]}`}>
            {tip.direction === "bullish" ? "↑ BULLISH" : "↓ BEARISH"}
          </span>
        </div>
        <span className="text-xs text-gray-600 font-mono">Day {tip.day}</span>
      </div>
    </div>
  );
}

function LockedContactSlot({ postCount, threshold }: { postCount: number; threshold: number }) {
  return (
    <div className="bg-gray-900/40 border border-gray-800 rounded-lg p-3 opacity-50">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔒</span>
        <div>
          <div className="text-xs text-gray-500 font-mono">Locked Contact</div>
          <div className="text-xs text-gray-600">{threshold - postCount} more posts to unlock</div>
        </div>
      </div>
    </div>
  );
}

export function ContactsPanel() {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<"tips" | "contacts">("tips");

  const unlockedContacts = getUnlockedContacts(state.contacts ?? []);
  const tips = (state.contactTips ?? []).slice().reverse(); // newest first
  const unreadCount = tips.filter((t) => !t.isRead).length;

  // Next lock thresholds (contacts not yet unlocked)
  const lockedContacts = CONTACTS.filter((c) => !(state.contacts ?? []).includes(c.id));
  const nextLockedThresholds = lockedContacts
    .sort((a, b) => a.unlockAtPostCount - b.unlockAtPostCount)
    .slice(0, 2)
    .map((c) => c.unlockAtPostCount);

  const playerPostCount = state.playerPostCount ?? 0;

  function handleMarkRead() {
    dispatch({ type: "MARK_TIPS_READ" });
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("tips")}
          className={`flex-1 px-3 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === "tips" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Inbox
          {unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors ${
            activeTab === "contacts" ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          Contacts
        </button>
      </div>

      {/* Tips tab */}
      {activeTab === "tips" && (
        <div className="p-3">
          {tips.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">📭</div>
              <div className="text-xs text-gray-500">No tips yet.</div>
              <div className="text-xs text-gray-600 mt-1">
                {unlockedContacts.length === 0
                  ? "Post on the blog to unlock contacts who'll tip you."
                  : "Your contacts will tip you as the market evolves."}
              </div>
            </div>
          ) : (
            <>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkRead}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 mb-3 transition-colors"
                >
                  Mark all read
                </button>
              )}
              <div className="max-h-96 overflow-y-auto pr-0.5 space-y-0">
                {tips.map((tip) => (
                  <TipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Contacts tab */}
      {activeTab === "contacts" && (
        <div className="p-3 space-y-2">
          {unlockedContacts.length === 0 && (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-xs text-gray-500">No contacts yet.</div>
              <div className="text-xs text-gray-600 mt-1">
                Make your first post to attract attention.
              </div>
            </div>
          )}

          {unlockedContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-gray-800/60 border border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-xl flex-shrink-0">{contact.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-white">{contact.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border font-mono ${TIER_STYLES[contact.tier]}`}>
                      {TIER_LABELS[contact.tier]}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">u/{contact.username}</div>
                  <div className="text-xs text-gray-400 mt-1.5 leading-relaxed">{contact.bio}</div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {contact.specialty.slice(0, 4).map((s) => (
                      <span key={s} className="text-xs font-mono px-1.5 py-0.5 bg-gray-700 text-gray-400 rounded border border-gray-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Locked slots */}
          {nextLockedThresholds.map((threshold) => (
            <LockedContactSlot
              key={threshold}
              postCount={playerPostCount}
              threshold={threshold}
            />
          ))}

          <div className="text-xs text-gray-600 text-center pt-1 border-t border-gray-800 mt-2">
            {playerPostCount} post{playerPostCount !== 1 ? "s" : ""} made · {CONTACTS.length} total contacts
          </div>
        </div>
      )}
    </div>
  );
}
