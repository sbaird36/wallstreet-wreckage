"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency, formatDayAsDate } from "@/utils/formatting";
import { SaveLoadModal } from "@/components/modals/SaveLoadModal";

const NAV_TABS = [
  { href: "/dashboard",   label: "Dashboard",    icon: "📊" },
  { href: "/news",        label: "Market News",  icon: "📰" },
  { href: "/blog",        label: "WSB",          icon: "💬" },
  { href: "/algorithm",   label: "My Algorithm", icon: "🤖" },
  { href: "/hedge-fund",  label: "Hedge Fund",   icon: "🏦" },
];

export function TopNav() {
  const { state } = useGame();
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const pathname = usePathname();
  const netWorth = getNetWorth(state.portfolio, state.assets);
  const displayDate = formatDayAsDate(state.currentDay, state.startDate);
  const fundName = state.playerHedgeFund?.name;

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        {/* Main bar */}
        <div className="px-5 h-12 flex items-center justify-between gap-4">
          {/* Left: Brand + live indicator */}
          <div className="flex items-center h-full gap-0 flex-shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 pr-5 border-r border-gray-800 h-full"
            >
              <span className="bg-blue-600 text-white font-mono font-bold text-xs px-1.5 py-0.5 rounded tracking-wide">
                WWX
              </span>
              <span className="hidden sm:block font-bold text-sm text-white tracking-wide">
                Wall<span className="text-blue-400">Street</span>{" "}
                <span className="text-gray-400 font-normal">Wreckage</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2 pl-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-fast" />
              <span className="text-xs font-mono text-gray-500 tracking-widest">LIVE</span>
            </div>
          </div>

          {/* Center: Date + fund */}
          <div className="hidden md:flex flex-col items-center flex-1">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
              {displayDate}
            </div>
            {fundName && (
              <div className="text-xs text-yellow-500 font-mono font-bold">{fundName}</div>
            )}
          </div>

          {/* Right: Stats + action */}
          <div className="flex items-center h-full flex-shrink-0">
            <div className="hidden sm:flex items-center h-full">
              <div className="px-5 border-r border-gray-800 text-right">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Net Worth</div>
                <div className="font-mono font-bold text-white tabular-nums text-sm leading-tight">
                  {formatCurrency(netWorth)}
                </div>
              </div>
              <div className="px-5 border-r border-gray-800 text-right">
                <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Cash</div>
                <div className="font-mono font-bold text-emerald-400 tabular-nums text-sm leading-tight">
                  {formatCurrency(state.portfolio.cash)}
                </div>
              </div>
            </div>
            <div className="pl-4">
              <button
                onClick={() => setShowSaveLoad(true)}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-200 rounded border border-gray-700 hover:border-gray-600 transition-colors font-mono tracking-wide"
              >
                SAVE / LOAD
              </button>
            </div>
          </div>
        </div>

        {/* Mobile stats strip — shown only on small screens when in a game */}
        {state.gameStarted && (
          <div className="sm:hidden border-t border-gray-800 px-4 py-2 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-gray-500 uppercase tracking-widest">NW </span>
              <span className="text-white tabular-nums">{formatCurrency(netWorth)}</span>
            </div>
            <div>
              <span className="text-gray-500 uppercase tracking-widest">Cash </span>
              <span className="text-emerald-400 tabular-nums">{formatCurrency(state.portfolio.cash)}</span>
            </div>
            <div className="text-gray-500">{displayDate}</div>
          </div>
        )}

        {/* Tab navigation — only shown when in a game */}
        {state.gameStarted && (
          <div className="border-t border-gray-800 px-5 flex items-center gap-1 h-12">
            {NAV_TABS.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-5 h-full text-sm font-mono tracking-wide
                    border-b-2 transition-colors
                    ${isActive
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                    }
                  `}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
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
