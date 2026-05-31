"use client";

import type { Team } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";
import { useFavouriteTeams } from "@/lib/hooks/useFavouriteTeams";
import Icon from "@/components/ui/Icon";

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
        <Icon
          name="star"
          className={`w-4 h-4 transition-colors ${
            fav ? "text-yellow-400 fill-yellow-400" : "text-slate-600"
          }`}
          fill={fav ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}
