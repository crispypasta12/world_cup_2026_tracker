import type { MatchStatus } from "@/lib/api/types";

interface StatusBadgeProps {
  status: MatchStatus;
  className?: string;
}

const config: Record<MatchStatus, { label: string; cls: string }> = {
  SCHEDULED: { label: "Scheduled", cls: "bg-white/10 text-slate-300 ring-1 ring-white/10" },
  TIMED: { label: "Upcoming", cls: "bg-[var(--wc-gold)]/15 text-[var(--wc-gold)] ring-1 ring-[var(--wc-gold)]/25" },
  IN_PLAY: { label: "LIVE", cls: "bg-green-500/20 text-green-300 ring-1 ring-green-400/30 animate-pulse" },
  PAUSED: { label: "HT", cls: "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/30" },
  FINISHED: { label: "FT", cls: "bg-white/10 text-slate-400 ring-1 ring-white/10" },
  POSTPONED: { label: "Postponed", cls: "bg-red-900/40 text-red-300 ring-1 ring-red-400/25" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-900/40 text-red-300 ring-1 ring-red-400/25" },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const { label, cls } = config[status] ?? config.SCHEDULED;
  return (
    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${cls} ${className}`}>
      {label}
    </span>
  );
}
