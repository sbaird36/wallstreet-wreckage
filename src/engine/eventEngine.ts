import type {
  GameState,
  MarketEvent,
  FiredEvent,
  Asset,
  VolatilityOverride,
  EventSentiment,
} from "@/types";
import { EVENT_LIBRARY } from "@/data/events";
import { COMPANY_EVENTS } from "@/data/companyEvents";
import { randomBetween } from "@/utils/math";

const ALL_EVENTS: MarketEvent[] = [...EVENT_LIBRARY, ...COMPANY_EVENTS];

function getRecentSentiment(
  eventHistory: GameState["eventHistory"],
  currentDay: number
): "BULLISH" | "BEARISH" | "NEUTRAL" {
  const recentEvents = eventHistory.filter(
    (e) => e.day >= currentDay - 4 && e.day <= currentDay
  );
  if (recentEvents.length === 0) return "NEUTRAL";

  const BULLISH_SENTIMENTS: EventSentiment[] = ["BULLISH", "VERY_BULLISH"];
  const BEARISH_SENTIMENTS: EventSentiment[] = ["BEARISH", "VERY_BEARISH"];

  let bullishCount = 0;
  let bearishCount = 0;
  for (const e of recentEvents) {
    if (BULLISH_SENTIMENTS.includes(e.event.sentiment)) bullishCount++;
    if (BEARISH_SENTIMENTS.includes(e.event.sentiment)) bearishCount++;
  }

  if (bullishCount > bearishCount) return "BULLISH";
  if (bearishCount > bullishCount) return "BEARISH";
  return "NEUTRAL";
}

function getAffectedAssets(
  event: MarketEvent,
  assets: Record<string, Asset>
): string[] {
  const tickers: string[] = [];

  if (event.effect.targetTickers) {
    // Direct ticker targets — only include ones that exist
    return event.effect.targetTickers.filter((t) => assets[t]);
  }

  for (const asset of Object.values(assets)) {
    if (event.effect.targetType && asset.type !== event.effect.targetType) continue;
    if (
      event.effect.targetSectors &&
      asset.type === "stock" &&
      !event.effect.targetSectors.includes(asset.sector)
    ) {
      continue;
    }
    if (
      event.effect.targetSectors &&
      asset.type === "crypto" &&
      !event.effect.targetSectors.includes("Crypto")
    ) {
      continue;
    }
    tickers.push(asset.ticker);
  }

  return tickers;
}

function resolveEvent(
  event: MarketEvent,
  assets: Record<string, Asset>
): FiredEvent | null {
  const affectedTickers = getAffectedAssets(event, assets);
  if (affectedTickers.length === 0) return null;

  const actualMultipliers: Record<string, number> = {};
  for (const ticker of affectedTickers) {
    actualMultipliers[ticker] = randomBetween(
      event.effect.priceMultiplierRange[0],
      event.effect.priceMultiplierRange[1]
    );
  }

  return {
    day: 0, // Will be set by caller
    event,
    affectedTickers,
    actualMultipliers,
  };
}

export function selectEventsForDay(
  state: GameState,
  isWeekend: boolean = false
): { events: FiredEvent[]; newCooldowns: Record<string, number>; newVolatilityOverrides: Record<string, VolatilityOverride> } {
  const { currentDay, assets, recentEventCooldowns, eventHistory } = state;
  const events: FiredEvent[] = [];
  const newCooldowns = { ...recentEventCooldowns };
  const newVolatilityOverrides = { ...state.volatilityOverrides };

  // 40% chance any event fires this day
  if (Math.random() > 0.40) {
    return { events, newCooldowns, newVolatilityOverrides };
  }

  // 1–3 events: weighted 60/30/10
  const roll = Math.random();
  const numEvents = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;

  const recentSentiment = getRecentSentiment(eventHistory, currentDay);

  // Filter eligible events and apply conditions-based probability adjustments
  type EligibleEntry = { event: MarketEvent; adjustedProbability: number };
  const eligible: EligibleEntry[] = ALL_EVENTS
    .filter((event) => {
      const lastFired = recentEventCooldowns[event.id];
      if (lastFired !== undefined && currentDay - lastFired < event.cooldownDays) return false;
      // On weekends only crypto events can fire (stock markets are closed)
      if (isWeekend && event.category !== "CRYPTO") return false;
      // minDay gate
      if (event.conditions?.minDay !== undefined && currentDay < event.conditions.minDay) return false;
      return true;
    })
    .map((event) => {
      let prob = event.probability;
      if (recentSentiment === "BULLISH" && event.conditions?.ifRecentBullish !== undefined) {
        prob *= event.conditions.ifRecentBullish;
      } else if (recentSentiment === "BEARISH" && event.conditions?.ifRecentBearish !== undefined) {
        prob *= event.conditions.ifRecentBearish;
      }
      return { event, adjustedProbability: prob };
    });

  // Track tickers already hit this turn to avoid piling on
  const tickersHitThisTurn = new Set<string>();

  for (let i = 0; i < numEvents && eligible.length > 0; i++) {
    // Weighted random selection using adjusted probabilities
    const totalWeight = eligible.reduce((sum, e) => sum + e.adjustedProbability, 0);
    let rand = Math.random() * totalWeight;
    let selectedEvent: MarketEvent | null = null;
    let selectedIndex = -1;

    for (let j = 0; j < eligible.length; j++) {
      rand -= eligible[j].adjustedProbability;
      if (rand <= 0) {
        selectedEvent = eligible[j].event;
        selectedIndex = j;
        break;
      }
    }

    if (!selectedEvent) continue;

    const fired = resolveEvent(selectedEvent, assets);
    if (!fired) continue;

    // Skip if this event overlaps too many already-hit tickers
    const overlap = fired.affectedTickers.filter((t) => tickersHitThisTurn.has(t)).length;
    if (overlap > 2) continue;

    fired.day = currentDay + 1;
    events.push(fired);
    newCooldowns[selectedEvent.id] = currentDay;

    // Apply volatility overrides
    for (const ticker of fired.affectedTickers) {
      tickersHitThisTurn.add(ticker);
      const existing = newVolatilityOverrides[ticker];
      const newExpiry = currentDay + 1 + selectedEvent.effect.volatilityBoostDays;
      if (!existing || existing.expiresOnDay < newExpiry) {
        newVolatilityOverrides[ticker] = {
          multiplier: selectedEvent.effect.volatilityMultiplier,
          expiresOnDay: newExpiry,
        };
      }
    }

    // Remove from eligible to avoid duplicate selection
    eligible.splice(selectedIndex, 1);
  }

  return { events, newCooldowns, newVolatilityOverrides };
}
