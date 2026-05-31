"use client";

import type { Match } from "@/lib/api/types";
import { getGoogleCalendarUrl, downloadICS } from "@/lib/utils/calendar";

interface Props {
  match: Match;
}

export default function MatchCalendarActions({ match }: Props) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5">
      <p className="text-sm text-slate-400 mb-3">Add this match to your calendar</p>
      <div className="flex flex-wrap gap-3">
        <a
          href={getGoogleCalendarUrl(match)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm text-blue-300 hover:text-blue-200 transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.5 3h-2.25V1.5h-1.5V3h-7.5V1.5h-1.5V3H4.5A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm0 16.5h-15V9h15v10.5zM4.5 7.5V4.5h2.25V6h1.5V4.5h7.5V6h1.5V4.5H19.5V7.5h-15z" />
          </svg>
          Google Calendar
        </a>
        <button
          onClick={() => downloadICS([match], `wc2026-match-${match.id}.ics`)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download .ics
        </button>
      </div>
    </div>
  );
}
