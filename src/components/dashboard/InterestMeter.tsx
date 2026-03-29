"use client";

import { useState, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { HEDGE_FUNDS, type HedgeFundDef } from "@/data/hedgeFunds";
import { computeInterestScore, canFoundHedgeFund, HEDGE_FUND_THRESHOLD } from "@/utils/interestScore";
import { getNetWorth } from "@/utils/calculations";
import { formatCurrency, formatPercent } from "@/utils/formatting";
import { CreateHedgeFundModal } from "@/components/modals/CreateHedgeFundModal";

function FundCard({ fund, interested, score }: { fund: HedgeFundDef; interested: boolean; score: number }) {
  const [expanded, setExpanded] = useState(false);
  const ptsAway = Math.ceil(fund.minScore - score);

  return (
    <div
      className={`rounded-lg border transition-colors ${
        interested
          ? "bg-gray-800 border-gray-600 cursor-pointer hover:border-gray-500"
          : "bg-gray-900 border-gray-800 opacity-50"
      }`}
      onClick={() => interested && setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl w-7 text-center">{fund.emoji}</span>
          <div>
            <div className={`text-xs font-bold font-mono ${interested ? "text-white" : "text-gray-500"}`}>
              {fund.name}
            </div>
            <div className="text-xs text-gray-500">{fund.strategy}</div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          {interested ? (
            <span className="text-xs bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded font-mono">
              INTERESTED
            </span>
          ) : (
            <span className="text-xs text-gray-600 font-mono">
              {ptsAway} pts away
            </span>
          )}
        </div>
      </div>

      {/* Expanded recruiter quote */}
      {interested && expanded && (
        <div className="px-3 pb-3 border-t border-gray-700 mt-1 pt-2">
          <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
            Recruiter Message
          </div>
          <p className="text-xs text-gray-300 italic leading-relaxed">
            &ldquo;{fund.recruiterQuote}&rdquo;
          </p>
          <div className="text-xs text-gray-600 mt-2">— {fund.name} Talent Acquisition</div>
        </div>
      )}
    </div>
  );
}

function OwnFundDisplay() {
  const { state } = useGame();
  const fund = state.playerHedgeFund!;
  const netWorth = getNetWorth(state.portfolio, state.assets);
  const returnSinceFounding =
    fund.foundedNetWorth > 0
      ? (netWorth - fund.foundedNetWorth) / fund.foundedNetWorth
      : 0;

  return (
    <div className="bg-gray-900 border border-yellow-700/60 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs text-yellow-500 uppercase tracking-wider">
          Your Hedge Fund
        </h2>
        <span className="text-xs bg-yellow-900 text-yellow-300 border border-yellow-700 px-2 py-0.5 rounded font-mono">
          FOUNDER
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{fund.emoji}</span>
        <div>
          <div className="text-lg font-mono font-bold text-white">{fund.name}</div>
          <div className="text-xs text-gray-400">{fund.strategy} · Founded Day {fund.foundedDay}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 mb-0.5">AUM</div>
          <div className="text-sm font-mono font-bold text-white tabular-nums">
            {formatCurrency(netWorth)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 mb-0.5">Since Founded</div>
          <div className={`text-sm font-mono font-bold tabular-nums ${returnSinceFounding >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {returnSinceFounding >= 0 ? "+" : ""}
            {formatPercent(returnSinceFounding, false)}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2.5">
          <div className="text-xs text-gray-500 mb-0.5">Days Active</div>
          <div className="text-sm font-mono font-bold text-white tabular-nums">
            {state.currentDay - fund.foundedDay}
          </div>
        </div>
      </div>
    </div>
  );
}

export function InterestMeter() {
  const { state } = useGame();
  const [showFoundModal, setShowFoundModal] = useState(false);
  const [showAllFunds, setShowAllFunds] = useState(false);

  const netWorth = getNetWorth(state.portfolio, state.assets);
  const snp499 = state.indexes["snp499"];

  const score = useMemo(
    () => computeInterestScore(state.portfolio, netWorth, snp499),
    [state.portfolio, netWorth, snp499]
  );

  const canFound = canFoundHedgeFund(netWorth);
  const interestedFunds = HEDGE_FUNDS.filter((f) => score >= f.minScore);
  const nextFund = HEDGE_FUNDS.find((f) => score < f.minScore);
  const displayFunds = showAllFunds ? HEDGE_FUNDS : HEDGE_FUNDS.slice(0, 5);

  // Portfolio return vs market for display
  const portfolioReturn =
    (netWorth - 10_000) / 10_000;
  const marketReturn =
    snp499 && snp499.startingValue > 0
      ? (snp499.currentValue - snp499.startingValue) / snp499.startingValue
      : 0;
  const alpha = portfolioReturn - marketReturn;

  if (state.playerHedgeFund) {
    return <OwnFundDisplay />;
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs text-gray-400 uppercase tracking-wider">
            Hedge Fund Interest
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {interestedFunds.length}/{HEDGE_FUNDS.length} funds interested
            </span>
          </div>
        </div>

        {/* Score + gauge */}
        <div className="mb-4">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {score.toFixed(1)}
                <span className="text-lg text-gray-500">/100</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">Interest Score</div>
            </div>
            <div className="text-right text-xs">
              <div className="text-gray-500 mb-0.5">Your alpha vs SNP499</div>
              <div className={`font-mono font-bold tabular-nums text-sm ${alpha >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {alpha >= 0 ? "+" : ""}{formatPercent(alpha, false)}
              </div>
            </div>
          </div>

          {/* Gauge bar */}
          <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-1">
            {/* Fund threshold ticks */}
            {HEDGE_FUNDS.map((f) => (
              <div
                key={f.id}
                className="absolute top-0 w-px h-full bg-gray-600 opacity-60"
                style={{ left: `${f.minScore}%` }}
              />
            ))}
            {/* Fill */}
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${score}%`,
                background:
                  score < 30
                    ? "linear-gradient(to right, #1a3248, #2a4862)"
                    : score < 60
                    ? "linear-gradient(to right, #1d4ed8, #3b82f6)"
                    : score < 85
                    ? "linear-gradient(to right, #065f46, #10b981)"
                    : "linear-gradient(to right, #854d0e, #eab308)",
              }}
            />
          </div>

          {/* Label markers */}
          <div className="flex justify-between text-xs text-gray-600">
            <span>Unproven</span>
            <span>Promising</span>
            <span>Elite</span>
            <span>Legendary</span>
          </div>
        </div>

        {/* Next fund teaser */}
        {nextFund && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2.5 mb-3 flex items-center gap-2.5">
            <span className="text-base opacity-60">{nextFund.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-gray-400">
                Next:{" "}
                <span className="text-white font-mono">{nextFund.name}</span>
              </div>
              <div className="text-xs text-gray-500">{nextFund.strategy}</div>
            </div>
            <div className="text-xs font-mono text-gray-500 whitespace-nowrap">
              {Math.ceil(nextFund.minScore - score)} pts away
            </div>
          </div>
        )}

        {/* Fund list */}
        <div className="space-y-1.5 mb-3">
          {displayFunds.map((fund) => (
            <FundCard
              key={fund.id}
              fund={fund}
              interested={score >= fund.minScore}
              score={score}
            />
          ))}
        </div>

        {!showAllFunds && HEDGE_FUNDS.length > 5 && (
          <button
            onClick={() => setShowAllFunds(true)}
            className="w-full text-xs text-gray-500 hover:text-gray-300 py-1 transition-colors"
          >
            Show all {HEDGE_FUNDS.length} funds ↓
          </button>
        )}

        {/* Found your own fund CTA */}
        {canFound ? (
          <button
            onClick={() => setShowFoundModal(true)}
            className="mt-3 w-full py-3 bg-yellow-900 hover:bg-yellow-800 text-yellow-200 rounded-lg font-mono font-bold text-sm transition-colors border border-yellow-700 flex items-center justify-center gap-2"
          >
            <span>👑</span> Found Your Own Hedge Fund
          </button>
        ) : (
          <div className="mt-3 bg-gray-800 border border-gray-800 rounded-lg p-3 text-center">
            <div className="text-xs text-gray-500 mb-1">
              Found Your Own Fund
            </div>
            <div className="text-xs text-gray-600">
              Reach{" "}
              <span className="text-yellow-600 font-mono">
                {formatCurrency(HEDGE_FUND_THRESHOLD)}
              </span>{" "}
              portfolio value to unlock ·{" "}
              <span className="text-gray-500 font-mono">
                {formatCurrency(Math.max(HEDGE_FUND_THRESHOLD - netWorth, 0))} to go
              </span>
            </div>
          </div>
        )}
      </div>

      {showFoundModal && (
        <CreateHedgeFundModal onClose={() => setShowFoundModal(false)} />
      )}
    </>
  );
}
