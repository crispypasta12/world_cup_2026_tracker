"use client";

import { useState, useRef, useEffect } from "react";
import type { Match } from "@/lib/api/types";
import { getGoogleCalendarUrl, downloadICS } from "@/lib/utils/calendar";

interface Props {
  match: Match;
}

export default function CalendarMenu({ match }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-colors"
        title="Add to calendar"
        aria-label="Add to calendar"
        aria-expanded={open}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <a
            href={getGoogleCalendarUrl(match)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <svg className="w-4 h-4 shrink-0 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.5 3h-2.25V1.5h-1.5V3h-7.5V1.5h-1.5V3H4.5A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm0 16.5h-15V9h15v10.5zM4.5 7.5V4.5h2.25V6h1.5V4.5h7.5V6h1.5V4.5H19.5V7.5h-15z" />
            </svg>
            Add to Google Calendar
          </a>
          <button
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-t border-slate-700/50"
            onClick={() => {
              downloadICS([match], `wc2026-match-${match.id}.ics`);
              setOpen(false);
            }}
          >
            <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download .ics
          </button>
        </div>
      )}
    </div>
  );
}
