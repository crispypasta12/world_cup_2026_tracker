"use client";

import { useState, useRef, useEffect } from "react";
import type { Match } from "@/lib/api/types";
import { getGoogleCalendarUrl, downloadICS } from "@/lib/utils/calendar";
import Icon from "@/components/ui/Icon";

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
        <Icon name="calendar" className="w-4 h-4" />
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
            <Icon name="calendar" className="w-4 h-4 shrink-0 text-blue-400" />
            Add to Google Calendar
          </a>
          <button
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-colors border-t border-slate-700/50"
            onClick={() => {
              downloadICS([match], `wc2026-match-${match.id}.ics`);
              setOpen(false);
            }}
          >
            <Icon name="download" className="w-4 h-4 shrink-0 text-slate-400" />
            Download .ics
          </button>
        </div>
      )}
    </div>
  );
}
