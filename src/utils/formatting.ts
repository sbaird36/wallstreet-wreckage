export function formatCurrency(value: number, decimals?: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${value.toLocaleString("en-US", {
      minimumFractionDigits: decimals ?? 2,
      maximumFractionDigits: decimals ?? 2,
    })}`;
  }
  if (value < 0.01 && value > 0) {
    // Show enough decimals for tiny crypto prices
    return `$${value.toFixed(8).replace(/\.?0+$/, "")}`;
  }
  return `$${value.toFixed(decimals ?? 2)}`;
}

export function formatPrice(value: number): string {
  if (value >= 10_000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (value >= 1_000) return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (value >= 1) return value.toFixed(2);
  if (value >= 0.01) return value.toFixed(4);
  return value.toFixed(8);
}

export function formatPercent(value: number, showSign = true): string {
  const formatted = Math.abs(value * 100).toFixed(2) + "%";
  if (!showSign) return formatted;
  return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

export function formatLargeNumber(value: number): string {
  if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toString();
}

export function formatDayAsDate(day: number, startDate: string): string {
  const [year, month, d] = startDate.split("-").map(Number);
  const date = new Date(year, month - 1, d);
  date.setDate(date.getDate() + day - 1);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
