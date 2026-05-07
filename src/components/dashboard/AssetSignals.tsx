"use client";

import { useGame } from "@/context/GameContext";
import { getSignals } from "@/utils/signals";
import type { Asset } from "@/types";

interface Props {
  asset: Asset;
}

export function AssetSignals({ asset }: Props) {
  const { state } = useGame();
  const signals = getSignals(asset, state.activeEvents, state.currentDay, state.blogFeed);

  if (signals.length === 0) return null;

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1">
      {signals.map((sig, i) => (
        <span
          key={i}
          title={sig.label}
          className={`
            inline-flex items-center text-[11px] leading-none px-1 py-0.5 rounded border
            cursor-default ${sig.bg} ${sig.color}
          `}
        >
          {sig.icon}
        </span>
      ))}
    </div>
  );
}
