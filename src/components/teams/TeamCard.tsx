"use client";

import type { Team } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";
import { useFavouriteTeams } from "@/lib/hooks/useFavouriteTeams";

interface TeamCardProps {
  team: Team;
  groupLabel?: string;
}

export default function TeamCard({ team, groupLabel }: TeamCardProps) {
  const { isFavourite, toggleFavourite, mounted } = useFavouriteTeams();
  const fav = mounted && isFavourite(team.id);

  return (
    <div className="relative">
      <Link href={`/teams/${team.id}`}>
        <div className="bg-slate-800/60 backdrop-blur-sm hover:bg-slate-700/60 border border-slate-700/50 hover:border-slate-600/70 rounded-xl p-4 flex flex-col items-center gap-3 transition-all text-center cursor-pointer">
          <Flag
            countryCode={team.area?.code ?? team.tla}
            name={team.name}
            size="lg"
          />
          <div>
            <div className="font-semibold text-white text-sm leading-tight">
              {team.name}
            </div>
            {groupLabel && (
              <div className="text-xs text-slate-500 mt-0.5">{groupLabel}</div>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavourite(team.id);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
        title={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <svg
          className={`w-4 h-4 transition-colors ${
            fav ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
          }`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      </button>
    </div>
  );
}
