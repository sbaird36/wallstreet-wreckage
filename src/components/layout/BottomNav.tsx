"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";

const NAV_TABS = [
  { href: "/dashboard",  label: "Trade",  icon: "📊" },
  { href: "/news",       label: "News",   icon: "📰" },
  { href: "/blog",       label: "WSB",    icon: "💬" },
  { href: "/algorithm",  label: "Algo",   icon: "🤖" },
  { href: "/advisors",   label: "Advisor",icon: "👔" },
  { href: "/hedge-fund", label: "Fund",   icon: "🏦" },
  { href: "/stats",      label: "Stats",  icon: "🏆" },
  { href: "/skills",     label: "Skills", icon: "⚡" },
];

export function BottomNav() {
  const { state } = useGame();
  const pathname = usePathname();

  if (!state.gameStarted) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-gray-900 border-t border-gray-800 safe-area-inset-bottom">
      <div className="flex items-stretch h-14">
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
                relative flex-1 flex flex-col items-center justify-center gap-0.5
                transition-colors active:bg-gray-800
                ${isActive ? "text-blue-400" : "text-gray-500"}
              `}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className="text-[9px] font-mono tracking-wide leading-none">{tab.label}</span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-400 rounded-b-full" />
              )}
              {hasBadge && (
                <span
                  className={`absolute top-1 right-[calc(50%-14px)] w-2 h-2 rounded-full ${
                    isSkills ? "bg-amber-500" : "bg-blue-500"
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
