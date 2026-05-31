"use client";

import { useState, useMemo } from "react";
import type { Match } from "@/lib/api/types";
import MatchList from "@/components/matches/MatchList";
import { downloadICS } from "@/lib/utils/calendar";

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
                  ? "bg-blue-600/80 backdrop-blur-sm text-white border border-blue-500/50"
                  : "bg-slate-800/60 backdrop-blur-sm text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/50"
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
                  ? "bg-slate-600/80 backdrop-blur-sm text-white border border-slate-500/50"
                  : "bg-slate-800/60 backdrop-blur-sm text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filtered.length} match{filtered.length !== 1 ? "es" : ""}
        </p>
        <button
          onClick={() => {
            const scheduledOnly = filtered.filter(
              (m) => m.status === "SCHEDULED" || m.status === "TIMED"
            );
            if (scheduledOnly.length === 0) return;
            const label =
              stage !== "ALL"
                ? stage.toLowerCase().replace(/_/g, "-")
                : "full-schedule";
            downloadICS(scheduledOnly, `wc2026-${label}.ics`);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/70 rounded-lg text-xs text-slate-400 hover:text-white transition-colors backdrop-blur-sm"
          title="Download upcoming matches as .ics calendar file"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export .ics
        </button>
      </div>

      <MatchList matches={filtered} groupByDate />
    </div>
  );
}
