import type { Asset, ContactTip, GameState } from "@/types";
import { CONTACTS, getContactUnlockAtCount } from "@/data/contacts";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function uuid(): string {
  return `tip_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Returns contact IDs that should be newly unlocked after posting.
 * Call after incrementing playerPostCount.
 */
export function getNewlyUnlockedContacts(
  currentContacts: string[],
  newPostCount: number
): string[] {
  const contact = getContactUnlockAtCount(newPostCount);
  if (!contact || currentContacts.includes(contact.id)) return [];
  return [contact.id];
}

/**
 * Generate tips from unlocked contacts on day advance.
 * Each contact rolls independently based on its tipFrequency.
 */
export function generateContactTips(
  state: GameState,
  newDay: number
): ContactTip[] {
  if (state.contacts.length === 0) return [];

  const assetList = Object.values(state.assets);
  const tips: ContactTip[] = [];

  for (const contactId of state.contacts) {
    const contactDef = CONTACTS.find((c) => c.id === contactId);
    if (!contactDef) continue;

    // Roll for tip
    if (Math.random() > contactDef.tipFrequency) continue;

    // Pick a relevant asset from specialty (ticker or sector match)
    const candidates = assetList.filter((a) => {
      const inSpecialty = contactDef.specialty.some(
        (s) => s === a.ticker || (a.type === "stock" && "sector" in a && a.sector === s)
      );
      return inSpecialty;
    });

    const target: Asset | undefined = candidates.length > 0
      ? pick(candidates)
      : pick(assetList.filter((a) => a.type !== "crypto" || contactDef.specialty.includes("Crypto")));

    if (!target) continue;

    // Determine actual direction from the asset's trend
    const trueDirection: "bullish" | "bearish" = target.trend >= 0 ? "bullish" : "bearish";

    // Apply accuracy: flip the direction with probability (1 - accuracy)
    const correct = Math.random() < contactDef.tipAccuracy;
    const tipDirection: "bullish" | "bearish" = correct
      ? trueDirection
      : trueDirection === "bullish" ? "bearish" : "bullish";

    const message = pick(contactDef.tipMessages[tipDirection])
      .replace(/\{ticker\}/g, target.ticker);

    tips.push({
      id: uuid(),
      contactId,
      day: newDay,
      ticker: target.ticker,
      direction: tipDirection,
      message,
      isRead: false,
    });
  }

  return tips;
}
