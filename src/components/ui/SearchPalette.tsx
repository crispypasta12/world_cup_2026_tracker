"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Team, Match } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Icon from "@/components/ui/Icon";
import { teamCode, teamName } from "@/lib/utils/match";

interface SearchData {
  teams: Team[];
  matches: Match[];
}

type Result =
  | { type: "team"; data: Team }
  | { type: "match"; data: Match };

interface SearchPaletteProps {
  onClose: () => void;
}

export default function SearchPalette({ onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<SearchData | null>(null);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    fetch("/api/search")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ teams: [], matches: [] }));
  }, []);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const q = query.toLowerCase().trim();

  const teamResults = (data?.teams ?? [])
    .filter(
      (t) =>
        q === "" ||
        t.name?.toLowerCase().includes(q) ||
        t.shortName?.toLowerCase().includes(q) ||
        t.tla?.toLowerCase().includes(q)
    )
    .slice(0, q ? 6 : 0);

  const matchResults =
    q.length >= 2
      ? (data?.matches ?? [])
          .filter((m) => {
            const home = teamName(m.homeTeam).toLowerCase();
            const away = teamName(m.awayTeam).toLowerCase();
            const homeTla = m.homeTeam.tla?.toLowerCase() ?? "";
            const awayTla = m.awayTeam.tla?.toLowerCase() ?? "";
            return (
              home.includes(q) ||
              away.includes(q) ||
              homeTla.includes(q) ||
              awayTla.includes(q)
            );
          })
          .slice(0, 6)
      : [];

  const results: Result[] = [
    ...teamResults.map((t) => ({ type: "team" as const, data: t })),
    ...matchResults.map((m) => ({ type: "match" as const, data: m })),
  ];

  function navigate(result: Result) {
    if (result.type === "team") router.push(`/teams/${result.data.id}`);
    else router.push(`/matches/${result.data.id}`);
    handleClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter" && results[cursor]) {
      navigate(results[cursor]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-xl bg-slate-900/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Icon name="search" className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search teams or matches…"
            className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
          />
          <kbd className="hidden sm:inline text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Body */}
        {data === null && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            Loading…
          </div>
        )}

        {data !== null && results.length === 0 && (
          <div className="px-4 py-8 text-center text-slate-500 text-sm">
            {q ? "No results found." : "Start typing to search…"}
          </div>
        )}

        {results.length > 0 && (
          <div className="py-1.5 max-h-[420px] overflow-y-auto">
            {teamResults.length > 0 && (
              <p className="px-4 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Teams
              </p>
            )}
            {teamResults.map((team, i) => (
              <button
                key={team.id}
                onClick={() => navigate({ type: "team", data: team })}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  cursor === i ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <Flag
                  countryCode={team.area?.code ?? team.tla}
                  name={team.name ?? "Team"}
                  size="sm"
                />
                <div>
                  <div className="text-sm text-white font-medium">{team.name ?? "Team"}</div>
                  <div className="text-xs text-slate-500">{team.tla ?? ""}</div>
                </div>
                <Icon name="chevron-right" className="w-3.5 h-3.5 text-slate-600 ml-auto" />
              </button>
            ))}

            {matchResults.length > 0 && (
              <p className="px-4 pt-2 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Matches
              </p>
            )}
            {matchResults.map((match, i) => (
              <button
                key={match.id}
                onClick={() => navigate({ type: "match", data: match })}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                  cursor === teamResults.length + i
                    ? "bg-white/10"
                    : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Flag
                    countryCode={teamCode(match.homeTeam)}
                    name={teamName(match.homeTeam)}
                    size="sm"
                  />
                  <span className="text-sm text-white truncate">
                    {teamName(match.homeTeam)}
                  </span>
                  <span className="text-slate-500 text-xs shrink-0">vs</span>
                  <span className="text-sm text-white truncate">
                    {teamName(match.awayTeam)}
                  </span>
                  <Flag
                    countryCode={teamCode(match.awayTeam)}
                    name={teamName(match.awayTeam)}
                    size="sm"
                  />
                </div>
                <div className="text-xs text-slate-500 shrink-0">
                  {match.utcDate.slice(0, 10)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
