import type { Advisor, AdvisorEmail, AdvisorSkills, GameState, HiredAdvisor } from "@/types";
import {
  ADVISOR_FIRST_NAMES,
  ADVISOR_LAST_NAMES,
  ADVISOR_TITLES_BY_TIER,
  ADVISOR_BIOS_BY_SPECIALTY,
  ADVISOR_EMOJIS,
  WEEKLY_EMAIL_TEMPLATES_BULLISH,
  WEEKLY_EMAIL_TEMPLATES_BEARISH,
  WEEKLY_EMAIL_TEMPLATES_NEUTRAL,
  HOT_TIP_BULLISH,
  HOT_TIP_BEARISH,
} from "@/data/advisorData";

// ── Seeded pseudo-random ─────────────────────────────────────────────────────
function makeRng(seed: number) {
  let s = Math.abs(seed) % 2147483647 || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickRng<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Skill → fee mapping ──────────────────────────────────────────────────────
function calcFee(skills: AdvisorSkills): number {
  const avg = (skills.stockPicking + skills.cryptoKnowledge + skills.riskManagement + skills.marketTiming) / 4;
  // $200 base + exponential on avg skill 0-10
  const raw = 200 + Math.pow(avg, 1.6) * 160;
  // Round to nearest $50
  return Math.round(raw / 50) * 50;
}

// ── Generate a single advisor procedurally ───────────────────────────────────
function generateAdvisor(seed: number, specialtyHint: string, tierHint: 1 | 2 | 3): Advisor {
  const rng = makeRng(seed);

  const firstName = pickRng(ADVISOR_FIRST_NAMES, rng);
  const lastName = pickRng(ADVISOR_LAST_NAMES, rng);
  const name = `${firstName} ${lastName}`;
  const title = pickRng(ADVISOR_TITLES_BY_TIER[tierHint], rng);
  const emoji = pickRng(ADVISOR_EMOJIS, rng);

  const bioCandidates =
    ADVISOR_BIOS_BY_SPECIALTY[specialtyHint] ?? ADVISOR_BIOS_BY_SPECIALTY["General"];
  const bio = pickRng(bioCandidates, rng);

  // Skill ranges by tier
  const [lo, hi]: [number, number] =
    tierHint === 1 ? [1, 4] : tierHint === 2 ? [3, 7] : [6, 10];

  const randSkill = () => Math.round(lo + rng() * (hi - lo));

  const skills: AdvisorSkills = {
    stockPicking: randSkill(),
    cryptoKnowledge: randSkill(),
    riskManagement: randSkill(),
    marketTiming: randSkill(),
  };

  // Slight specialty boost
  if (specialtyHint === "Crypto") skills.cryptoKnowledge = Math.min(10, skills.cryptoKnowledge + 2);
  if (specialtyHint === "General") skills.stockPicking = Math.min(10, skills.stockPicking + 1);

  const weeklyFee = calcFee(skills);

  return {
    id: `adv_${seed}_${tierHint}`,
    name,
    title,
    bio,
    emoji,
    skills,
    weeklyFee,
    specialty: specialtyHint,
  };
}

// ── Advisor pool (4-6 advisors, refreshed weekly) ────────────────────────────
const SPECIALTIES = [
  "General", "Technology", "Crypto", "Electric Vehicles", "Banking",
  "Healthcare", "Fast Food", "Space", "Fintech", "Speculative",
  "Social Media", "E-Commerce", "Streaming", "Retail", "Automotive",
];

export function generateAdvisorPool(weekNumber: number, hiredIds: string[]): Advisor[] {
  const rng = makeRng(weekNumber * 9973 + 12345);
  const count = 4 + Math.floor(rng() * 3); // 4-6 advisors
  const pool: Advisor[] = [];

  const usedSeeds = new Set<number>();

  for (let i = 0; i < count + 6 && pool.length < count; i++) {
    const seed = Math.floor(rng() * 9_999_999) + 1;
    if (usedSeeds.has(seed)) continue;
    usedSeeds.add(seed);

    const tierRoll = rng();
    const tier: 1 | 2 | 3 = tierRoll < 0.45 ? 1 : tierRoll < 0.8 ? 2 : 3;
    const specialty = pickRng(SPECIALTIES, rng);
    const advisor = generateAdvisor(seed, specialty, tier);

    // Skip if already hired
    if (hiredIds.includes(advisor.id)) continue;
    pool.push(advisor);
  }

  return pool;
}

// ── Tip accuracy ─────────────────────────────────────────────────────────────
function getTipAccuracy(skill: number): number {
  // 0-10 skill → 22-72% base, with up to 10% luck bonus
  return 0.22 + (skill / 10) * 0.5 + Math.random() * 0.1;
}

// ── Determine "true" direction for an asset ──────────────────────────────────
function getTrueDirection(asset: { currentPrice: number; previousPrice: number; trend: number }): "bullish" | "bearish" {
  const todayChg = asset.previousPrice > 0
    ? (asset.currentPrice - asset.previousPrice) / asset.previousPrice
    : 0;
  // Weight recent price action 60%, structural trend 40%
  const score = todayChg * 0.6 + asset.trend * 100 * 0.4;
  return score >= 0 ? "bullish" : "bearish";
}

// ── Generate hot tips for a day ──────────────────────────────────────────────
export function generateAdvisorHotTips(state: GameState, day: number): AdvisorEmail[] {
  const emails: AdvisorEmail[] = [];
  const assets = Object.values(state.assets);

  for (const hired of state.hiredAdvisors ?? []) {
    // Probability of sending a hot tip: 10-35% per day based on marketTiming
    const chance = 0.10 + (hired.currentSkills.marketTiming / 10) * 0.25;
    if (Math.random() > chance) continue;

    // Pick a target asset — prefer advisor specialty
    const specialtyCandidates = assets.filter((a) =>
      a.type === (hired.advisor.specialty === "Crypto" ? "crypto" : "stock")
    );
    const candidates = specialtyCandidates.length >= 3 ? specialtyCandidates : assets;
    const target = pick(candidates);
    if (!target) continue;

    // Determine tip direction via accuracy
    const isCrypto = target.type === "crypto";
    const relevantSkill = isCrypto ? hired.currentSkills.cryptoKnowledge : hired.currentSkills.stockPicking;
    const accuracy = getTipAccuracy(relevantSkill);
    const trueDir = getTrueDirection(target);
    const tipDir: "bullish" | "bearish" = Math.random() < accuracy ? trueDir : (trueDir === "bullish" ? "bearish" : "bullish");

    const skillLabel = relevantSkill <= 3 ? "low" : relevantSkill <= 6 ? "moderate" : "high";
    const templatePool = tipDir === "bullish" ? HOT_TIP_BULLISH : HOT_TIP_BEARISH;
    const body = pick(templatePool)
      .replace(/\{ticker\}/g, target.ticker)
      .replace(/\[SKILL_LEVEL\]/g, skillLabel);

    emails.push({
      id: uid("tip"),
      advisorId: hired.advisor.id,
      advisorName: hired.advisor.name,
      advisorEmoji: hired.advisor.emoji,
      day,
      subject: `${tipDir === "bullish" ? "🟢" : "🔴"} Hot tip: ${target.ticker}`,
      body,
      tickers: [target.ticker],
      tipDirection: tipDir,
      isRead: false,
      type: "hot_tip",
    });
  }

  return emails;
}

// ── Generate weekly recap emails (call on Monday) ────────────────────────────
export function generateWeeklyAdvisorEmails(state: GameState, day: number): AdvisorEmail[] {
  const emails: AdvisorEmail[] = [];
  const assets = Object.values(state.assets);
  const activeEventTickers = state.activeEvents.flatMap((e) => e.affectedTickers);

  for (const hired of state.hiredAdvisors ?? []) {
    // Pick 2-3 stocks to mention
    const specialtyCandidates = assets.filter((a) =>
      hired.advisor.specialty === "Crypto"
        ? a.type === "crypto"
        : hired.advisor.specialty === "General"
        ? a.type === "stock"
        : a.type === "stock" && "sector" in a && a.sector === hired.advisor.specialty
    );
    const pool = specialtyCandidates.length >= 2 ? specialtyCandidates : assets.filter((a) => a.type === "stock");

    // Prefer tickers that have active events (more newsworthy)
    const withEvents = pool.filter((a) => activeEventTickers.includes(a.ticker));
    const sorted = [...withEvents, ...pool.filter((a) => !activeEventTickers.includes(a.ticker))];

    const count = 2 + Math.floor(Math.random() * 2); // 2-3 picks
    const picks: typeof assets = [];
    const seen = new Set<string>();
    for (const a of sorted) {
      if (picks.length >= count) break;
      if (!seen.has(a.ticker)) { picks.push(a); seen.add(a.ticker); }
    }

    if (picks.length === 0) continue;

    const tickers = picks.map((a) => a.ticker);
    const tickerStr = tickers.length === 1
      ? tickers[0]
      : tickers.slice(0, -1).join(", ") + " and " + tickers[tickers.length - 1];

    // Overall bias: do more picks trend bullish or bearish?
    const avgTrend = picks.reduce((sum, a) => sum + getTrueDirection(a) === "bullish" ? 1 : -1, 0);
    const bias: "bullish" | "bearish" | "neutral" = avgTrend > 0 ? "bullish" : avgTrend < 0 ? "bearish" : "neutral";

    // Apply accuracy — advisor may recommend against the true direction
    const avgSkill = (hired.currentSkills.stockPicking + hired.currentSkills.cryptoKnowledge) / 2;
    const accuracy = getTipAccuracy(avgSkill);
    const actualBias: "bullish" | "bearish" | "neutral" = Math.random() < accuracy ? bias : (bias === "bullish" ? "bearish" : "bullish");

    const templatePool =
      actualBias === "bullish"
        ? WEEKLY_EMAIL_TEMPLATES_BULLISH
        : actualBias === "bearish"
        ? WEEKLY_EMAIL_TEMPLATES_BEARISH
        : WEEKLY_EMAIL_TEMPLATES_NEUTRAL;

    const body = pick(templatePool).replace(/\{tickers\}/g, tickerStr);

    emails.push({
      id: uid("weekly"),
      advisorId: hired.advisor.id,
      advisorName: hired.advisor.name,
      advisorEmoji: hired.advisor.emoji,
      day,
      subject: `📬 Weekly market outlook — ${hired.advisor.name}`,
      body,
      tickers,
      tipDirection: actualBias === "neutral" ? null : actualBias,
      isRead: false,
      type: "weekly",
    });
  }

  return emails;
}

// ── Drift advisor skills weekly ──────────────────────────────────────────────
export function driftAdvisorSkills(
  hiredAdvisors: HiredAdvisor[]
): Array<{ id: string; skills: AdvisorSkills }> {
  return hiredAdvisors.map((h) => {
    const drifted = { ...h.currentSkills };
    for (const key of Object.keys(drifted) as (keyof AdvisorSkills)[]) {
      if (Math.random() < 0.20) {
        const delta = Math.random() < 0.5 ? 1 : -1;
        drifted[key] = Math.max(0, Math.min(10, drifted[key] + delta));
      }
    }
    return { id: h.advisor.id, skills: drifted };
  });
}

// ── Calculate total weekly fee for all hired advisors ────────────────────────
export function calcTotalWeeklyFee(hiredAdvisors: HiredAdvisor[]): number {
  return hiredAdvisors.reduce((sum, h) => sum + h.advisor.weeklyFee, 0);
}

// ── Get current week number (1-based) ────────────────────────────────────────
export function getAdvisorWeekNumber(day: number): number {
  return Math.ceil(day / 7);
}
