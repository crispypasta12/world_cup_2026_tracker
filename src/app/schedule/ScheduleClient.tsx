"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { Match } from "@/lib/api/types";
import MatchList from "@/components/matches/MatchList";
import { downloadICS } from "@/lib/utils/calendar";
import Icon from "@/components/ui/Icon";

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
  initialVenue?: string;
}

export default function ScheduleClient({ matches, initialVenue = "ALL" }: ScheduleClientProps) {
  const [stage, setStage] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [venue, setVenue] = useState(initialVenue);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const venues = useMemo(() => {
    return [
      "ALL",
      ...Array.from(new Set(matches.map((m) => m.venue).filter(Boolean))).sort(),
    ] as string[];
  }, [matches]);

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage !== "ALL" && m.stage !== stage) return false;
      if (venue !== "ALL" && m.venue !== venue) return false;
      if (statusFilter === "LIVE" && m.status !== "IN_PLAY" && m.status !== "PAUSED") return false;
      if (statusFilter === "UPCOMING" && m.status !== "SCHEDULED" && m.status !== "TIMED") return false;
      if (statusFilter === "FINISHED" && m.status !== "FINISHED") return false;
      return true;
    });
  }, [matches, stage, statusFilter, venue]);

  // All upcoming matches across the entire tournament (ignores filters)
  const allUpcoming = useMemo(
    () => matches.filter((m) => m.status === "SCHEDULED" || m.status === "TIMED"),
    [matches]
  );

  // Upcoming matches within the current filtered view
  const filteredUpcoming = useMemo(
    () => filtered.filter((m) => m.status === "SCHEDULED" || m.status === "TIMED"),
    [filtered]
  );

  useEffect(() => {
    if (!exportOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [exportOpen]);

  function handleDownloadFiltered() {
    if (filteredUpcoming.length === 0) return;
    const label = stage !== "ALL" ? stage.toLowerCase().replace(/_/g, "-") : "schedule";
    downloadICS(filteredUpcoming, `wc2026-${label}.ics`);
    setExportOpen(false);
  }

  function handleDownloadAll() {
    downloadICS(allUpcoming, "wc2026-full-schedule.ics");
    setExportOpen(false);
  }

  function handleAddAllToGoogleCalendar() {
    downloadICS(allUpcoming, "wc2026-full-schedule.ics");
    window.open("https://calendar.google.com/calendar/r/settings/import", "_blank");
    setExportOpen(false);
  }

  const showFilteredOption =
    filteredUpcoming.length > 0 && filteredUpcoming.length < allUpcoming.length;

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
        <select
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="rounded-lg border border-slate-700/50 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-700/60 focus:outline-none"
          title="Filter by venue"
        >
          {!venues.includes(venue) && (
            <option value={venue} className="bg-slate-900 text-white">
              {venue}
            </option>
          )}
          {venues.map((v) => (
            <option key={v} value={v} className="bg-slate-900 text-white">
              {v === "ALL" ? "All Venues" : v}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {filtered.length} match{filtered.length !== 1 ? "es" : ""}
        </p>

        {/* Export dropdown */}
        <div ref={exportRef} className="relative">
          <button
            onClick={() => setExportOpen((o) => !o)}
            aria-expanded={exportOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/70 rounded-lg text-xs text-slate-400 hover:text-white transition-colors backdrop-blur-sm"
          >
            <Icon name="download" className="w-3.5 h-3.5 shrink-0" />
            Export
            <Icon name="chevron-right" className={`w-3 h-3 rotate-90 transition-transform ${exportOpen ? "-rotate-90" : ""}`} />
          </button>

          {exportOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
              {/* Filtered option — only shown when a filter is active */}
              {showFilteredOption && (
                <>
                  <button
                    onClick={handleDownloadFiltered}
                    className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                  >
                    <Icon name="download" className="w-3.5 h-3.5 shrink-0" />
                    <div>
                      <div className="text-sm text-slate-200 font-medium">Download filtered view</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {filteredUpcoming.length} upcoming match{filteredUpcoming.length !== 1 ? "es" : ""} · .ics
                      </div>
                    </div>
                  </button>
                  <div className="border-t border-slate-700/50" />
                </>
              )}

              {/* Download all */}
              <button
                onClick={handleDownloadAll}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <Icon name="download" className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <div className="text-sm text-slate-200 font-medium">Download all matches</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {allUpcoming.length} upcoming matches · wc2026-full-schedule.ics
                  </div>
                </div>
              </button>

              <div className="border-t border-slate-700/50" />

              {/* Add all to Google Calendar */}
              <button
                onClick={handleAddAllToGoogleCalendar}
                className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
              >
                <Icon name="calendar" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <div className="text-sm text-slate-200 font-medium">Add all to Google Calendar</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Downloads the .ics file and opens Google Calendar import
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <MatchList matches={filtered} groupByDate />
    </div>
  );
}
