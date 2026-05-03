"use client";

interface Props {
  label: string;
  value: number; // 0-10
}

export function AdvisorSkillBar({ label, value }: Props) {
  const color =
    value >= 8 ? "bg-emerald-500" :
    value >= 5 ? "bg-blue-500" :
    value >= 3 ? "bg-amber-500" :
    "bg-rose-600";

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs font-mono font-bold text-white">{value}/10</span>
      </div>
      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );
}
