"use client";

import { useGame } from "@/context/GameContext";
import type { TraderSkills } from "@/types";

// ── Constants ─────────────────────────────────────────────────────────────────

const UPGRADE_COSTS = [4, 8, 16, 28, 44]; // cost to advance from level N → N+1
const MAX_LEVEL = 5;
const POINTS_PER_WEEK = 1;

function totalCostToMax(): number {
  return UPGRADE_COSTS.reduce((s, c) => s + c, 0); // 26 per skill
}

// ── Skill definitions ─────────────────────────────────────────────────────────

type SkillKey = keyof TraderSkills;

interface LevelDef {
  name: string;
  description: string;
  mechanic: string; // one-liner on what actually changes in the game
}

interface SkillDef {
  key: SkillKey;
  label: string;
  icon: string;
  color: string;        // tailwind accent colour
  borderColor: string;
  bgColor: string;
  levels: LevelDef[];   // index 0 = level 1 unlock, etc.
}

const SKILLS: SkillDef[] = [
  {
    key: "blogLiteracy",
    label: "Blog Literacy",
    icon: "📰",
    color: "text-cyan-400",
    borderColor: "border-cyan-800",
    bgColor: "bg-cyan-900/20",
    levels: [
      {
        name: "Skeptic",
        description: "You've started questioning what you read online. A genuine skill.",
        mechanic: "Posts show a rough Credibility hint based on flair and community reaction.",
      },
      {
        name: "Pattern Spotter",
        description: "FUD follows patterns. You're starting to see them.",
        mechanic: "Credibility hints become more nuanced — five grades instead of three.",
      },
      {
        name: "Early Reader",
        description: "You can sense when a story is real before the crowd confirms it.",
        mechanic: "Verified/Unverified status revealed after 1 day instead of 2.",
      },
      {
        name: "FUD Detector",
        description: "Misinformation has tells. You know most of them.",
        mechanic: "Likely-fake posts get a warning badge visible before the 1-day window.",
      },
      {
        name: "Truth Broker",
        description: "You can read a post and know instantly whether it's real.",
        mechanic: "All posts show real/fake status immediately — no waiting period.",
      },
    ],
  },
  {
    key: "analystAcuity",
    label: "Analyst Acuity",
    icon: "🔬",
    color: "text-purple-400",
    borderColor: "border-purple-800",
    bgColor: "bg-purple-900/20",
    levels: [
      {
        name: "Report Reader",
        description: "You actually read the analyst note instead of just the rating.",
        mechanic: "Analyst picks show a Confidence indicator (Low / Medium / High).",
      },
      {
        name: "Track Recorder",
        description: "You've started checking whether analysts were actually right before.",
        mechanic: "Each analyst report shows a directional hit-rate based on recent performance.",
      },
      {
        name: "Signal Reader",
        description: "You can tell the difference between a real upgrade and a maintenance rating.",
        mechanic: "Analyst picks show an expected price-move magnitude alongside the direction.",
      },
      {
        name: "Consensus Watcher",
        description: "You notice when the street quietly starts changing its mind.",
        mechanic: "Dashboard flags when analyst consensus on a held stock is shifting.",
      },
      {
        name: "Whisper Network",
        description: "You know what the smart money is thinking before the note publishes.",
        mechanic: "Analyst reports unlock 1 day early — before the wider market sees them.",
      },
    ],
  },
  {
    key: "algorithmMastery",
    label: "Algorithm Mastery",
    icon: "🤖",
    color: "text-blue-400",
    borderColor: "border-blue-800",
    bgColor: "bg-blue-900/20",
    levels: [
      {
        name: "Signal Aware",
        description: "You understand that each factor has a different weight — and why.",
        mechanic: "Factor bars show their % contribution to the total score.",
      },
      {
        name: "Factor Analyst",
        description: "You can read the strength of individual signals, not just their presence.",
        mechanic: "Factor bars show signal strength labels: Weak / Moderate / Strong / Very Strong.",
      },
      {
        name: "Top Picker",
        description: "The algorithm now surfaces its best ideas, not just its rankings.",
        mechanic: "A 'Top Opportunities' panel shows the 3 highest-conviction algorithm picks.",
      },
      {
        name: "Backtest Reader",
        description: "You check how often your settings were right before trusting them.",
        mechanic: "Algorithm shows a 30-day backtested accuracy score for your current config.",
      },
      {
        name: "Self-Optimizer",
        description: "The algorithm itself starts coaching you on how to improve it.",
        mechanic: "Algorithm generates parameter suggestions when certain factors are outperforming.",
      },
    ],
  },
  {
    key: "eventReading",
    label: "Event Reading",
    icon: "🌐",
    color: "text-amber-400",
    borderColor: "border-amber-800",
    bgColor: "bg-amber-900/20",
    levels: [
      {
        name: "Sector Mapper",
        description: "You know which sectors get hit by which types of events.",
        mechanic: "News events display affected sector badges and impact direction clearly.",
      },
      {
        name: "Impact Grader",
        description: "Not all events are equal. You've learned to read the magnitude.",
        mechanic: "Events display an impact magnitude label: Minor / Moderate / Major / Extreme.",
      },
      {
        name: "Horizon Scanner",
        description: "You've seen enough events to sense when another one is due.",
        mechanic: "'Event Horizon' panel appears in News — shows probability hints for upcoming events.",
      },
      {
        name: "Precedent Analyst",
        description: "You know what happened last time this kind of shock hit the market.",
        mechanic: "Event feed shows historical precedent data: how similar events moved prices.",
      },
      {
        name: "Market Forecaster",
        description: "You can see the event before it becomes the headline.",
        mechanic: "Real-time probability scores for all active event categories shown in dashboard.",
      },
    ],
  },
  {
    key: "riskManagement",
    label: "Risk Management",
    icon: "🛡️",
    color: "text-rose-400",
    borderColor: "border-rose-800",
    bgColor: "bg-rose-900/20",
    levels: [
      { name: "Stop-Loss Aware",    description: "You start tracking how far down your positions are.",      mechanic: "Holdings down 10%+ from cost basis highlighted red in portfolio." },
      { name: "Drawdown Tracker",   description: "You know your worst-case exposure at all times.",           mechanic: "Portfolio shows max drawdown stat + recovery tracking in Stats." },
      { name: "Portfolio Shield",   description: "One mistake per week doesn't have to define it.",           mechanic: "Once per week, you can reverse a buy trade within 24 hours (undo button appears on fresh positions)." },
      { name: "Vol Forecaster",     description: "You sense when turbulence is coming before it hits.",      mechanic: "High-volatility assets get a warning badge the day before a volatile event." },
      { name: "Risk Oracle",        description: "Your whole portfolio risk picture in one glance.",          mechanic: "Daily portfolio concentration risk score shown in dashboard. Alerts when >50% in one asset." },
    ],
  },
  {
    key: "marketTiming",
    label: "Market Timing",
    icon: "⏱️",
    color: "text-green-400",
    borderColor: "border-green-800",
    bgColor: "bg-green-900/20",
    levels: [
      { name: "Pattern Reader",   description: "You start to see the rhythm in price movements.",          mechanic: "Price chart shows 7-day moving average overlay on each asset." },
      { name: "Volume Watcher",   description: "Volume doesn't lie — you know how to read it.",            mechanic: "Market table shows relative volume vs 7-day average (Low/Normal/High/Spike)." },
      { name: "Momentum Trader",  description: "You ride the wave, not fight it.",                          mechanic: "Momentum score (last 5 days) shown per asset in market table." },
      { name: "Dip Buyer",        description: "You know when fear creates opportunity.",                    mechanic: "+10 XP bonus when you buy within 2 days of an asset's 14-day low." },
      { name: "Wave Rider",       description: "Your entries are so good they're almost suspicious.",       mechanic: "Buys near local lows tagged as 'Perfect Entry' in transaction history." },
    ],
  },
];

// ── Level pip row ─────────────────────────────────────────────────────────────

function LevelPips({ current, color }: { current: number; color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: MAX_LEVEL }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-1.5 rounded-full transition-colors ${
            i < current ? color.replace("text-", "bg-") : "bg-[#1e2a45]"
          }`}
        />
      ))}
    </div>
  );
}

// ── Organic XP bar ────────────────────────────────────────────────────────────

function XPBar({ xp, color }: { xp: number; color: string }) {
  if (xp === 0) return null;
  const isGaining = xp > 0;
  const pct = isGaining ? Math.min((xp / 20) * 100, 100) : Math.min((Math.abs(xp) / 10) * 100, 100);
  return (
    <div className="mt-2 pt-2 border-t border-white/[0.07]">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
        <span>{isGaining ? "Organic gain" : "Performance penalty"}</span>
        <span className={isGaining ? "text-emerald-600" : "text-red-600"}>
          {isGaining ? `+${xp.toFixed(1)} / 20` : `${xp.toFixed(1)} / −10`}
        </span>
      </div>
      <div className="h-1 bg-[#151c2f] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isGaining ? color.replace("text-", "bg-") + " opacity-60" : "bg-red-700"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Individual skill card ─────────────────────────────────────────────────────

function SkillCard({ skill, currentLevel, currentXP, skillPoints, onUpgrade }: {
  skill: SkillDef;
  currentLevel: number;
  currentXP: number;
  skillPoints: number;
  onUpgrade: () => void;
}) {
  const isMaxed = currentLevel >= MAX_LEVEL;
  const nextCost = isMaxed ? null : UPGRADE_COSTS[currentLevel];
  const canAfford = nextCost !== null && skillPoints >= nextCost;
  const nextLevel = skill.levels[currentLevel]; // undefined if maxed

  return (
    <div className={`rounded-xl border ${skill.borderColor} ${skill.bgColor} p-4`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{skill.icon}</span>
          <div>
            <h3 className={`text-sm font-mono font-bold ${skill.color}`}>{skill.label}</h3>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              {isMaxed ? (
                <span className="text-yellow-400">MASTERED</span>
              ) : (
                `Level ${currentLevel} / ${MAX_LEVEL}`
              )}
            </div>
          </div>
        </div>
        <LevelPips current={currentLevel} color={skill.color} />
      </div>

      {/* Unlocked levels */}
      {currentLevel > 0 && (
        <div className="space-y-1.5 mb-3">
          {skill.levels.slice(0, currentLevel).map((lvl, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
              <div>
                <span className="font-mono font-bold text-slate-200">{lvl.name}</span>
                <span className="text-slate-400 ml-2">{lvl.mechanic}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Next unlock preview */}
      {nextLevel && (
        <div className={`rounded border border-dashed ${skill.borderColor} p-2.5 mb-3`}>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs text-slate-400 font-medium">Next Unlock</span>
            <span className={`text-xs font-mono font-bold ${skill.color}`}>Level {currentLevel + 1} · {nextLevel.name}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{nextLevel.description}</p>
          <p className={`text-xs font-mono mt-1 ${skill.color}`}>⚡ {nextLevel.mechanic}</p>
        </div>
      )}

      {/* Remaining locked levels (collapsed) */}
      {!isMaxed && currentLevel < MAX_LEVEL - 1 && (
        <div className="flex gap-1 flex-wrap mb-3">
          {skill.levels.slice(currentLevel + 1).map((lvl, i) => (
            <span key={i} className="text-xs font-mono text-slate-600 bg-[#151c2f] border border-white/[0.07] rounded px-1.5 py-0.5">
              L{currentLevel + 2 + i} {lvl.name}
            </span>
          ))}
        </div>
      )}

      {/* Upgrade button */}
      {!isMaxed && (
        <button
          onClick={onUpgrade}
          disabled={!canAfford}
          className={`w-full text-xs font-mono font-bold px-3 py-2 rounded border transition-colors ${
            canAfford
              ? `${skill.bgColor} ${skill.borderColor} ${skill.color} hover:brightness-125 active:scale-95`
              : "bg-[#151c2f] border-white/[0.07] text-slate-500 cursor-not-allowed"
          }`}
        >
          {canAfford
            ? `Upgrade → Level ${currentLevel + 1}  (${nextCost} pt${nextCost === 1 ? "" : "s"})`
            : `${nextCost} pts needed  ·  have ${skillPoints}`}
        </button>
      )}

      {isMaxed && (
        <div className="text-center text-xs font-mono text-yellow-500 py-1">
          ★ Fully Mastered
        </div>
      )}

      <XPBar xp={currentXP} color={skill.color} />
    </div>
  );
}

// ── Influence tiers ───────────────────────────────────────────────────────────

const INFLUENCE_TIERS = [
  { min: 0,     label: "Unknown",         color: "text-slate-400" },
  { min: 100,   label: "Forum Lurker",    color: "text-slate-300" },
  { min: 300,   label: "Regular Poster",  color: "text-blue-400" },
  { min: 700,   label: "Known Trader",    color: "text-cyan-400" },
  { min: 1500,  label: "Market Analyst",  color: "text-green-400" },
  { min: 3500,  label: "Influencer",      color: "text-yellow-400" },
  { min: 7000,  label: "Market Mover",    color: "text-orange-400" },
  { min: 15000, label: "Oracle",          color: "text-amber-300" },
];

function getCurrentTier(influence: number) {
  let tier = INFLUENCE_TIERS[0];
  for (const t of INFLUENCE_TIERS) {
    if (influence >= t.min) tier = t;
    else break;
  }
  return tier;
}

function getNextTier(influence: number) {
  for (const t of INFLUENCE_TIERS) {
    if (influence < t.min) return t;
  }
  return null;
}

// ── Influence panel ───────────────────────────────────────────────────────────

function InfluencePanel({ influence, skillPoints, onSpend }: { influence: number; skillPoints: number; onSpend: () => void }) {
  const currentTier = getCurrentTier(influence);
  const nextTier = getNextTier(influence);
  const progressPct = nextTier
    ? Math.min(((influence - currentTier.min) / (nextTier.min - currentTier.min)) * 100, 100)
    : 100;

  return (
    <div className="bg-[#0f1221] border border-purple-900/50 rounded-xl p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-mono font-bold text-white">Market Influence</h2>
          <p className="text-xs text-slate-400 mt-1">
            Grows organically from blog posts, verification, and daily performance.
            Spend skill points to boost it directly.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Score</div>
            <div className="text-2xl font-mono font-bold tabular-nums text-purple-400">
              {influence.toLocaleString()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Tier</div>
            <div className={`text-base font-mono font-bold ${currentTier.color}`}>
              {currentTier.label}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {nextTier && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-500 font-mono mb-1">
            <span>{currentTier.label}</span>
            <span>{nextTier.label} at {nextTier.min.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-[#151c2f] rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500 font-mono mt-1 text-right">
            {nextTier.min - influence} more to next tier
          </div>
        </div>
      )}
      {!nextTier && (
        <div className="mb-4 text-xs font-mono text-amber-400 text-center py-1">
          ★ Maximum Tier Reached — Oracle
        </div>
      )}

      {/* Tier list (compact) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {INFLUENCE_TIERS.map((t) => (
          <span
            key={t.label}
            className={`text-xs font-mono px-2 py-0.5 rounded border ${influence >= t.min ? `${t.color} border-current opacity-90` : "text-slate-600 border-white/[0.07]"}`}
          >
            {t.label}
          </span>
        ))}
      </div>

      {/* Spend skill point button */}
      <div className="flex items-center gap-3 pt-3 border-t border-white/[0.07]">
        <button
          onClick={onSpend}
          disabled={skillPoints < 1}
          className={`px-4 py-2 rounded border font-mono text-xs font-bold transition-colors ${
            skillPoints >= 1
              ? "bg-purple-900/40 border-purple-700 text-purple-300 hover:bg-purple-800/50 active:scale-95"
              : "bg-[#151c2f] border-white/[0.07] text-slate-500 cursor-not-allowed"
          }`}
        >
          Invest 1 skill point → +15 influence
        </button>
        <span className="text-xs text-slate-500 font-mono">
          {skillPoints} pt{skillPoints !== 1 ? "s" : ""} available
        </span>
      </div>

      {/* Organic growth note */}
      <div className="mt-3 text-xs text-slate-500 font-mono space-y-0.5">
        <div>· +3 influence per day your portfolio gains &gt;0.5%</div>
        <div>· −1.5 per day your portfolio drops &gt;0.5%</div>
        <div>· +30 per verified post prediction · −12 per wrong call</div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function SkillsView() {
  const { state, dispatch } = useGame();
  const skills = state.traderSkills ?? { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0, riskManagement: 0, marketTiming: 0 };
  const skillsXP = state.traderSkillsXP ?? { blogLiteracy: 0, analystAcuity: 0, algorithmMastery: 0, eventReading: 0, riskManagement: 0, marketTiming: 0 };
  const skillPoints = state.skillPoints ?? 0;
  const totalSpent = Object.values(skills).reduce((sum, lvl) => {
    let cost = 0;
    for (let i = 0; i < lvl; i++) cost += UPGRADE_COSTS[i];
    return sum + cost;
  }, 0);

  const playerInfluence = state.playerInfluence ?? 0;

  function upgrade(skill: SkillKey) {
    dispatch({ type: "UPGRADE_SKILL", payload: { skill } });
  }

  function spendPointOnInfluence() {
    dispatch({ type: "SPEND_POINT_ON_INFLUENCE" });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Influence section */}
      <InfluencePanel
        influence={playerInfluence}
        skillPoints={skillPoints}
        onSpend={spendPointOnInfluence}
      />

      {/* Header */}
      <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-mono font-bold text-white">Trader Progression</h1>
            <p className="text-xs text-slate-400 mt-1">
              Earn <span className="text-amber-400 font-mono font-bold">skill points</span> by gaining XP through trading, challenges, and achievements.
              Invest them to permanently unlock new trading capabilities.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Available</div>
              <div className={`text-2xl font-mono font-bold tabular-nums ${skillPoints > 0 ? "text-amber-400" : "text-slate-500"}`}>
                {skillPoints}
              </div>
              <div className="text-xs text-slate-500 font-mono">skill pts</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Invested</div>
              <div className="text-2xl font-mono font-bold tabular-nums text-slate-300">{totalSpent}</div>
              <div className="text-xs text-slate-500 font-mono">total spent</div>
            </div>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="mt-4 pt-3 border-t border-white/[0.07]">
          <div className="flex justify-between text-xs text-slate-500 font-mono mb-1.5">
            <span>Overall mastery</span>
            <span>{totalSpent} / {totalCostToMax() * 6} pts</span>
          </div>
          <div className="h-1.5 bg-[#151c2f] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalSpent / (totalCostToMax() * 6)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skill grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILLS.map((skill) => (
          <SkillCard
            key={skill.key}
            skill={skill}
            currentLevel={skills[skill.key] ?? 0}
            currentXP={skillsXP[skill.key] ?? 0}
            skillPoints={skillPoints}
            onUpgrade={() => upgrade(skill.key)}
          />
        ))}
      </div>

      {/* How it works */}
      <div className="bg-[#0f1221] border border-white/[0.07] rounded-xl p-4 text-xs text-slate-400 font-mono space-y-1">
        <div className="text-slate-300 font-bold mb-2">How Progression Works</div>
        <div>· Earn XP by trading, completing challenges, and unlocking achievements</div>
        <div>· XP thresholds award skill points — they accumulate, spend any time in any order</div>
        <div>· Upgrade costs: L1={UPGRADE_COSTS[0]} · L2={UPGRADE_COSTS[1]} · L3={UPGRADE_COSTS[2]} · L4={UPGRADE_COSTS[3]} · L5={UPGRADE_COSTS[4]} pts</div>
        <div className="pt-1 text-slate-500">── Organic progression ──</div>
        <div>· <span className="text-cyan-600">Blog Literacy</span> gains XP for verified posts (+1.0) and loses for wrong calls (−0.5)</div>
        <div>· <span className="text-blue-600">Algorithm Mastery</span> gains XP for profitable sells (&gt;5%) and loses for losses (&gt;5%)</div>
        <div>· <span className="text-purple-600">Analyst Acuity</span> gains XP when analyst-informed trades pay off</div>
        <div>· <span className="text-amber-600">Event Reading</span> gains XP for profitable trades made during active market events</div>
        <div>· Accumulate <span className="text-white">20 XP</span> to auto-gain a level · reach <span className="text-red-500">−10 XP</span> to lose one</div>
      </div>
    </div>
  );
}
