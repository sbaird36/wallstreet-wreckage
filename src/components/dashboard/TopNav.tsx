"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency, formatDayAsDate } from "@/utils/formatting";
import { SaveLoadModal } from "@/components/modals/SaveLoadModal";
import { TraderRankBadge } from "@/components/ui/TraderRank";
import { AdvanceDayButton } from "@/components/dashboard/AdvanceDayButton";

const NAV_TABS = [
  { href: "/dashboard",   label: "Dashboard",    icon: "📊" },
  { href: "/news",        label: "Market News",  icon: "📰" },
  { href: "/blog",        label: "WSB",          icon: "💬" },
  { href: "/algorithm",   label: "My Algorithm", icon: "🤖" },
  { href: "/advisors",    label: "Advisors",     icon: "👔" },
  { href: "/stats",       label: "Stats",        icon: "🏆" },
  { href: "/skills",      label: "Skills",       icon: "⚡" },
  { href: "/research",    label: "Research",     icon: "🔬" },
];

export function TopNav() {
  const { state } = useGame();
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const pathname = usePathname();
  const netWorth = getNetWorth(state.portfolio, state.assets);
  const displayDate = formatDayAsDate(state.currentDay, state.startDate);

  return (
    <>
      <nav className="bg-[#0f1221] border-b border-white/[0.07] sticky top-0 z-40">
        {/* Main bar */}
        <div className="px-5 h-12 flex items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center h-full flex-shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 pr-4 border-r border-white/[0.07] h-full"
            >
              <Image
                src="/logo.png"
                alt="WallStreet Wreckage"
                width={72}
                height={44}
                className="h-9 w-auto object-contain flex-shrink-0"
              />
              <span className="hidden sm:block font-bold text-sm text-white">
                Wall<span className="text-blue-400">Street</span>{" "}
                <span className="text-slate-400 font-normal">Wreckage</span>
              </span>
            </Link>

            {/* Advance Day — inline in nav, only when game active */}
            {state.gameStarted && (
              <div className="pl-4">
                <AdvanceDayButton compact />
              </div>
            )}
          </div>

          {/* Right: Date + rank + stats + save */}
          <div className="flex items-center h-full flex-shrink-0 gap-0">
            {state.gameStarted && (
              <div className="hidden md:flex flex-col items-end pr-4 border-r border-white/[0.07] mr-0">
                <div className="text-xs font-medium text-slate-400 leading-none">{displayDate}</div>
                <div className="mt-0.5"><TraderRankBadge xp={state.xp ?? 0} size="xs" /></div>
              </div>
            )}
            <div className="hidden sm:flex items-center h-full">
              <div className="px-4 border-r border-white/[0.07] text-right">
                <div className="text-xs text-slate-400 font-medium mb-0.5">net worth</div>
                <div className="font-mono font-bold text-white tabular-nums text-sm leading-tight">
                  {formatCurrency(netWorth)}
                </div>
              </div>
              <div className="px-4 border-r border-white/[0.07] text-right">
                <div className="text-xs text-slate-400 font-medium mb-0.5">cash</div>
                <div className="font-mono font-bold text-emerald-400 tabular-nums text-sm leading-tight">
                  {formatCurrency(state.portfolio.cash)}
                </div>
              </div>
            </div>
            <div className="pl-4">
              <button
                onClick={() => setShowSaveLoad(true)}
                className="text-xs px-3 py-1.5 bg-[#151c2f] hover:bg-[#1e2a45] text-slate-300 hover:text-white rounded border border-white/[0.07] hover:border-white/20 transition-colors font-medium"
              >
                Save / Load
              </button>
            </div>
          </div>
        </div>

        {/* Mobile stats strip — shown only on small screens when in a game */}
        {state.gameStarted && (
          <div className="sm:hidden border-t border-white/[0.07] px-4 py-2 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400">NW </span>
              <span className="text-white tabular-nums">{formatCurrency(netWorth)}</span>
            </div>
            <div>
              <span className="text-slate-400">Cash </span>
              <span className="text-emerald-400 tabular-nums">{formatCurrency(state.portfolio.cash)}</span>
            </div>
            <div className="text-slate-400">{displayDate}</div>
          </div>
        )}

        {/* Tab navigation — hidden on mobile (BottomNav handles it), shown on sm+ */}
        {state.gameStarted && (
          <div className="border-t border-white/[0.07] px-2 sm:px-5 hidden sm:flex items-center gap-0 sm:gap-1 h-12">
            {NAV_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              const isBlog = tab.href === "/blog";
              const isSkills = tab.href === "/skills";
              const isAdvisors = tab.href === "/advisors";
              const unreadTips = isBlog
                ? (state.contactTips ?? []).filter((t) => !t.isRead).length
                : 0;
              const unspentPoints = isSkills ? (state.skillPoints ?? 0) : 0;
              const unreadEmails = isAdvisors
                ? (state.advisorEmails ?? []).filter((e) => !e.isRead).length
                : 0;
              const hasBadge = unreadTips > 0 || unspentPoints > 0 || unreadEmails > 0;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    relative flex items-center gap-2 px-3 sm:px-5 h-full text-sm font-medium
                    border-b-2 transition-colors flex-1 sm:flex-none justify-center sm:justify-start
                    ${isActive
                      ? "border-blue-500 text-white font-medium"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20"
                    }
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  {isSkills && unspentPoints > 0 && (
                    <span className="hidden sm:flex items-center justify-center text-[10px] font-mono font-bold min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-gray-900">
                      {unspentPoints}
                    </span>
                  )}
                  {hasBadge && (
                    <span className={`absolute top-2 right-2 sm:right-1 w-2 h-2 rounded-full ${isSkills ? "bg-amber-500" : "bg-blue-500"} ${isSkills ? "sm:hidden" : ""}`} />
                  )}
                  {isAdvisors && unreadEmails > 0 && (
                    <span className="hidden sm:flex items-center justify-center text-[10px] font-mono font-bold min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white">
                      {unreadEmails}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {showSaveLoad && <SaveLoadModal onClose={() => setShowSaveLoad(false)} />}
    </>
  );
}
