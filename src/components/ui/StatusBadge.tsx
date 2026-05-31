import type { MatchStatus } from "@/lib/api/types";

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

const config: Record<MatchStatus, { label: string; cls: string }> = {
  SCHEDULED: { label: "Scheduled", cls: "bg-slate-700 text-slate-300" },
  TIMED: { label: "Upcoming", cls: "bg-blue-900/60 text-blue-300" },
  IN_PLAY: { label: "LIVE", cls: "bg-green-500/20 text-green-400 animate-pulse" },
  PAUSED: { label: "HT", cls: "bg-yellow-500/20 text-yellow-300" },
  FINISHED: { label: "FT", cls: "bg-slate-700 text-slate-400" },
  POSTPONED: { label: "Postponed", cls: "bg-red-900/40 text-red-400" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-900/40 text-red-400" },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, cls } = config[status] ?? config.SCHEDULED;
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls} ${className}`}>
      {label}
    </span>
  );
}
