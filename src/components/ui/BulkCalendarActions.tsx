"use client";

import type { Match } from "@/lib/api/types";
import { downloadICS } from "@/lib/utils/calendar";

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
    <div className="flex flex-col items-center gap-2 pt-1">
      <p className="text-xs text-slate-600 uppercase tracking-widest">Add to your calendar</p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={handleGoogleCalendar}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors backdrop-blur-sm"
        >
          <svg className="w-4 h-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3h-2.25V1.5h-1.5V3h-7.5V1.5h-1.5V3H4.5A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm0 16.5h-15V9h15v10.5zM4.5 7.5V4.5h2.25V6h1.5V4.5h7.5V6h1.5V4.5H19.5V7.5h-15z" />
          </svg>
          Google Calendar
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors backdrop-blur-sm"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download .ics
          <span className="text-slate-500 text-xs">{matches.length} matches</span>
        </button>
      </div>
    </div>
  );
}
