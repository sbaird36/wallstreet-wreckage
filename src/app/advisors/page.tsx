"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "@/context/GameContext";
import { TopNav } from "@/components/dashboard/TopNav";
import { AdvisorSkillBar } from "@/components/advisors/AdvisorSkillBar";
import { formatCurrency } from "@/utils/formatting";
import type { Advisor, AdvisorEmail, HiredAdvisor } from "@/types";
import { generateAdvisorPool, getAdvisorWeekNumber } from "@/engine/advisorEngine";

function getRatingLabel(avg: number): { label: string; color: string } {
  if (avg >= 8) return { label: "Elite", color: "text-emerald-400" };
  if (avg >= 6) return { label: "Strong", color: "text-blue-400" };
  if (avg >= 4) return { label: "Average", color: "text-amber-400" };
  return { label: "Budget", color: "text-rose-400" };
}

function avgSkill(skills: { stockPicking: number; cryptoKnowledge: number; riskManagement: number; marketTiming: number }) {
  return (skills.stockPicking + skills.cryptoKnowledge + skills.riskManagement + skills.marketTiming) / 4;
}

function AdvisorCard({
  advisor,
  isHired,
  hiredData,
  canAfford,
  onHire,
  onFire,
}: {
  advisor: Advisor;
  isHired: boolean;
  hiredData?: HiredAdvisor;
  canAfford: boolean;
  onHire: () => void;
  onFire: () => void;
}) {
  const skills = hiredData?.currentSkills ?? advisor.skills;
  const avg = avgSkill(skills);
  const rating = getRatingLabel(avg);

  return (
    <div className={`bg-[#0f1221] border rounded-xl p-4 space-y-4 ${isHired ? "border-blue-600/50" : "border-white/[0.07]"}`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="text-3xl leading-none mt-0.5">{advisor.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-white text-sm">{advisor.name}</span>
            {isHired && (
              <span className="text-[10px] font-mono bg-blue-900/60 text-blue-300 border border-blue-700/50 px-1.5 py-0.5 rounded-full">HIRED</span>
            )}
            <span className={`text-[10px] font-mono font-bold ${rating.color}`}>{rating.label}</span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{advisor.title}</div>
          <div className="text-xs text-slate-500 mt-0.5 font-medium">{advisor.specialty}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs text-slate-400">Weekly fee</div>
          <div className="text-sm font-mono font-bold text-white">{formatCurrency(advisor.weeklyFee)}</div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-slate-300 leading-relaxed">{advisor.bio}</p>

      {/* Skills */}
      <div className="space-y-2">
        <AdvisorSkillBar label="Stock Picking" value={skills.stockPicking} />
        <AdvisorSkillBar label="Crypto Knowledge" value={skills.cryptoKnowledge} />
        <AdvisorSkillBar label="Risk Management" value={skills.riskManagement} />
        <AdvisorSkillBar label="Market Timing" value={skills.marketTiming} />
      </div>

      {/* Action */}
      {isHired ? (
        <button
          onClick={onFire}
          className="w-full py-2 text-xs font-mono font-bold rounded border border-rose-700/60 text-rose-400 hover:bg-rose-950/40 transition-colors"
        >
          Dismiss Advisor
        </button>
      ) : (
        <button
          onClick={onHire}
          disabled={!canAfford}
          className={`w-full py-2 text-xs font-mono font-bold rounded border transition-colors ${
            canAfford
              ? "border-emerald-600 bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60"
              : "border-white/[0.07] text-slate-500 cursor-not-allowed"
          }`}
        >
          {canAfford ? `Hire · First week ${formatCurrency(advisor.weeklyFee)}` : "Insufficient cash"}
        </button>
      )}
    </div>
  );
}

function EmailItem({ email, onDismiss }: { email: AdvisorEmail; onDismiss: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${email.isRead ? "border-white/[0.07] bg-[#0f1221]/60" : "border-white/[0.07] bg-[#0f1221]"}`}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-[#151c2f]/30 transition-colors"
      >
        <span className="text-lg leading-none mt-0.5 flex-shrink-0">{email.advisorEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {!email.isRead && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
            )}
            <span className="text-sm font-medium text-white leading-tight">{email.subject}</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              email.type === "hot_tip"
                ? "bg-amber-900/60 text-amber-400 border border-amber-700/50"
                : "bg-[#151c2f] text-slate-300 border border-white/[0.07]"
            }`}>
              {email.type === "hot_tip" ? "HOT TIP" : "WEEKLY"}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-0.5">{email.advisorName} · Day {email.day}</div>
        </div>
        <span className="text-slate-500 text-xs flex-shrink-0">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-white/[0.07]">
          <p className="text-sm text-slate-200 leading-relaxed mt-3 whitespace-pre-wrap">{email.body}</p>
          {email.tickers.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Mentioned:</span>
              {email.tickers.map((t) => (
                <span key={t} className="text-[10px] font-mono bg-[#151c2f] text-slate-200 px-1.5 py-0.5 rounded border border-white/[0.07]">
                  {t}
                </span>
              ))}
              {email.tipDirection && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                  email.tipDirection === "bullish"
                    ? "text-emerald-400 bg-emerald-950/60 border-emerald-700/50"
                    : "text-rose-400 bg-rose-950/60 border-rose-700/50"
                }`}>
                  {email.tipDirection.toUpperCase()}
                </span>
              )}
            </div>
          )}
          <button
            onClick={onDismiss}
            className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Dismiss email
          </button>
        </div>
      )}
    </div>
  );
}

export default function AdvisorsPage() {
  const { state, dispatch } = useGame();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (!state.gameStarted) router.push("/");
  }, [state.gameStarted, router]);

  // Bootstrap pool on first visit if empty
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if ((state.advisorPool ?? []).length === 0) {
      const week = getAdvisorWeekNumber(state.currentDay);
      const pool = generateAdvisorPool(week, (state.hiredAdvisors ?? []).map((h) => h.advisor.id));
      dispatch({ type: "REFRESH_ADVISOR_POOL", payload: { pool } });
    }
  }, []);

  if (!state.gameStarted) return null;

  const pool = state.advisorPool ?? [];
  const hired = state.hiredAdvisors ?? [];
  const emails = [...(state.advisorEmails ?? [])].reverse();
  const unreadCount = emails.filter((e) => !e.isRead).length;
  const cash = state.portfolio.cash;

  function handleHire(advisor: Advisor) {
    dispatch({ type: "HIRE_ADVISOR", payload: { advisor } });
  }

  function handleFire(advisorId: string) {
    dispatch({ type: "FIRE_ADVISOR", payload: { advisorId } });
  }

  function handleDismissEmail(emailId: string) {
    dispatch({ type: "DISMISS_ADVISOR_EMAIL", payload: { emailId } });
  }

  function handleMarkAllRead() {
    dispatch({ type: "MARK_ADVISOR_EMAILS_READ" });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <TopNav />

      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
        <div className="mb-5">
          <h1 className="text-lg font-bold text-white">Financial Advisors</h1>
          <p className="text-sm text-slate-300 mt-0.5">
            Hire advisors to receive weekly market outlooks and hot tips. Skills drift over time — a good hire today may not stay good.
          </p>
        </div>

        {/* Hired advisors */}
        {hired.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3">
              Your Advisors ({hired.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hired.map((h) => (
                <AdvisorCard
                  key={h.advisor.id}
                  advisor={h.advisor}
                  isHired
                  hiredData={h}
                  canAfford={cash >= h.advisor.weeklyFee}
                  onHire={() => {}}
                  onFire={() => handleFire(h.advisor.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available this week */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest mb-3">
            Available This Week
          </h2>
          {pool.length === 0 ? (
            <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl px-5 py-8 text-center">
              <div className="text-slate-500 text-sm">No advisors available right now.</div>
              <div className="text-slate-500 text-xs mt-1">New advisors appear each Monday.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pool.map((advisor) => (
                <AdvisorCard
                  key={advisor.id}
                  advisor={advisor}
                  isHired={false}
                  canAfford={cash >= advisor.weeklyFee}
                  onHire={() => handleHire(advisor)}
                  onFire={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        {/* Inbox */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              INBOX
              {unreadCount > 0 && (
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full font-mono">
                  {unreadCount} new
                </span>
              )}
            </h2>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {emails.length === 0 ? (
            <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl px-5 py-8 text-center">
              <div className="text-3xl mb-2">📬</div>
              <div className="text-slate-500 text-sm">No emails yet.</div>
              <div className="text-slate-500 text-xs mt-1">Hire an advisor and advance a day to receive your first message.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {emails.map((email) => (
                <EmailItem
                  key={email.id}
                  email={email}
                  onDismiss={() => handleDismissEmail(email.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
