"use client";

import { useState, useMemo } from "react";
import type { Match } from "@/lib/api/types";
import MatchList from "@/components/matches/MatchList";

const STAGES: { value: string; label: string }[] = [
  { value: "ALL", label: "All Stages" },
  { value: "GROUP_STAGE", label: "Group Stage" },
  { value: "LAST_32", label: "Round of 32" },
  { value: "LAST_16", label: "Round of 16" },
  { value: "QUARTER_FINALS", label: "Quarter-Finals" },
  { value: "SEMI_FINALS", label: "Semi-Finals" },
  { value: "FINAL", label: "Final" },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "LIVE", label: "Live" },
  { value: "UPCOMING", label: "Upcoming" },
  { value: "FINISHED", label: "Finished" },
];

interface ScheduleClientProps {
  matches: Match[];
}

export default function ScheduleClient({ matches }: ScheduleClientProps) {
  const [stage, setStage] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "ALL" && m.stage !== stage) return false;
      if (statusFilter === "LIVE" && m.status !== "IN_PLAY" && m.status !== "PAUSED") return false;
      if (statusFilter === "UPCOMING" && m.status !== "SCHEDULED" && m.status !== "TIMED") return false;
      if (statusFilter === "FINISHED" && m.status !== "FINISHED") return false;
      return true;
    });
  }, [matches, stage, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStage(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                stage === s.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s.value
                  ? "bg-slate-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <MatchList matches={filtered} groupByDate />
    </div>
  );
}
