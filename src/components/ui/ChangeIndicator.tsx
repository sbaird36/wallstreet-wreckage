import { formatPercent } from "@/utils/formatting";

interface Props {
  value: number; // ratio, e.g. 0.05 = +5%
  size?: "sm" | "md" | "lg";
  showArrow?: boolean;
}

export function ChangeIndicator({ value, size = "md", showArrow = true }: Props) {
  const isPositive = value >= 0;
  const isNeutral = Math.abs(value) < 0.0001;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
  };

  const colorClass = isNeutral
    ? "text-gray-400"
    : isPositive
    ? "text-emerald-400"
    : "text-rose-400";

  const arrow = isNeutral ? "—" : isPositive ? "▲" : "▼";

  return (
    <span className={`${colorClass} ${sizeClasses[size]} tabular-nums font-mono`}>
      {showArrow && <span className="mr-0.5">{arrow}</span>}
      {formatPercent(value)}
    </span>
  );
}
