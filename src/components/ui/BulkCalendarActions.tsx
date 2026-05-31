"use client";

import type { Match } from "@/lib/api/types";
import { downloadICS } from "@/lib/utils/calendar";
import Icon from "@/components/ui/Icon";

interface Props {
  matches: Match[];
}

export default function BulkCalendarActions({ matches }: Props) {
  if (matches.length === 0) return null;

  function handleDownload() {
    downloadICS(matches, "wc2026-full-schedule.ics");
  }

  function handleGoogleCalendar() {
    downloadICS(matches, "wc2026-full-schedule.ics");
    window.open("https://calendar.google.com/calendar/r/settings/import", "_blank");
  }

  return (
    <div className="flex flex-col gap-2 pt-1 sm:items-start">
      <p className="text-xs text-slate-500 uppercase tracking-widest">Add to your calendar</p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGoogleCalendar}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-slate-300 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="calendar" className="w-4 h-4 shrink-0 text-blue-400" />
          Google Calendar
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-4 py-2 text-sm font-bold text-slate-300 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <Icon name="download" className="w-4 h-4 shrink-0" />
          Download .ics
          <span className="text-slate-500 text-xs">{matches.length} matches</span>
        </button>
      </div>
    </div>
  );
}
