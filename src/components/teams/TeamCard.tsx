import type { Team } from "@/lib/api/types";
import Flag from "@/components/ui/Flag";
import Link from "next/link";

interface TeamCardProps {
  team: Team;
  groupLabel?: string;
}

export default function TeamCard({ team, groupLabel }: TeamCardProps) {
  return (
    <Link href={`/teams/${team.id}`}>
      <div className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl p-4 flex flex-col items-center gap-3 transition-colors text-center cursor-pointer">
        <Flag
          countryCode={team.area?.code?.toLowerCase() ?? "xx"}
          name={team.name}
          size="lg"
        />
        <div>
          <div className="font-semibold text-white text-sm leading-tight">{team.name}</div>
          {groupLabel && (
            <div className="text-xs text-slate-500 mt-0.5">{groupLabel}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
