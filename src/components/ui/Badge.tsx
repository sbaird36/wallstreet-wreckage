import type { Sector, AssetType, EventSentiment } from "@/types";

const SECTOR_COLORS: Record<Sector, string> = {
  Technology: "bg-blue-900 text-blue-300 border-blue-700",
  "Social Media": "bg-purple-900 text-purple-300 border-purple-700",
  "E-Commerce": "bg-orange-900 text-orange-300 border-orange-700",
  "Electric Vehicles": "bg-teal-900 text-teal-300 border-teal-700",
  Streaming: "bg-red-900 text-red-300 border-red-700",
  "Fast Food": "bg-yellow-900 text-yellow-300 border-yellow-700",
  Banking: "bg-green-900 text-green-300 border-green-700",
  Space: "bg-indigo-900 text-indigo-300 border-indigo-700",
  Crypto: "bg-amber-900 text-amber-300 border-amber-700",
  Retail: "bg-lime-900 text-lime-300 border-lime-700",
  Entertainment: "bg-pink-900 text-pink-300 border-pink-700",
  Fintech: "bg-cyan-900 text-cyan-300 border-cyan-700",
  Healthcare: "bg-sky-900 text-sky-300 border-sky-700",
  Automotive: "bg-stone-800 text-stone-300 border-stone-600",
  Speculative: "bg-orange-950 text-orange-400 border-orange-700",
};

const SENTIMENT_COLORS: Record<EventSentiment, string> = {
  VERY_BULLISH: "bg-emerald-900 text-emerald-300 border-emerald-700",
  BULLISH: "bg-green-900 text-green-300 border-green-700",
  MIXED: "bg-yellow-900 text-yellow-300 border-yellow-700",
  BEARISH: "bg-orange-900 text-orange-300 border-orange-700",
  VERY_BEARISH: "bg-rose-900 text-rose-300 border-rose-700",
};

interface SectorBadgeProps {
  sector: Sector;
}

export function SectorBadge({ sector }: SectorBadgeProps) {
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded border ${SECTOR_COLORS[sector]} font-mono`}
    >
      {sector}
    </span>
  );
}

interface TypeBadgeProps {
  type: AssetType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const classes =
    type === "stock"
      ? "bg-gray-800 text-gray-300 border-gray-600"
      : "bg-amber-900 text-amber-300 border-amber-700";
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded border ${classes} font-mono`}>
      {type === "stock" ? "STOCK" : "CRYPTO"}
    </span>
  );
}

interface SentimentBadgeProps {
  sentiment: EventSentiment;
}

export function SentimentBadge({ sentiment }: SentimentBadgeProps) {
  const label = sentiment.replace("_", " ");
  return (
    <span
      className={`inline-block text-xs px-2 py-0.5 rounded border ${SENTIMENT_COLORS[sentiment]} font-mono`}
    >
      {label}
    </span>
  );
}
