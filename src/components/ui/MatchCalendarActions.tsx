"use client";

import type { Match } from "@/lib/api/types";
import { getGoogleCalendarUrl, downloadICS } from "@/lib/utils/calendar";
import Icon from "@/components/ui/Icon";

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
          <Icon name="calendar" className="w-4 h-4 shrink-0" />
          Google Calendar
        </a>
        <button
          onClick={() => downloadICS([match], `wc2026-match-${match.id}.ics`)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
        >
          <Icon name="download" className="w-4 h-4 shrink-0" />
          Download .ics
        </button>
      </div>
    </div>
  );
}
