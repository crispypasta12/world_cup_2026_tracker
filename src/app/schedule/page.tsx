import { getMatches } from "@/lib/api/client";
import { fetchH2HBatch } from "@/lib/utils/h2h";
import type { H2HRecord } from "@/lib/utils/h2h";
import ScheduleClient from "./ScheduleClient";

export const revalidate = 60;

export const metadata = {
  title: "Schedule | WC 2026",
};

interface Props {
  searchParams?: Promise<{ venue?: string }>;
}

export default async function SchedulePage({ searchParams }: Props) {
  let matches;
  try {
    matches = await getMatches();
  } catch {
    return (
      <div className="text-center text-slate-500 py-16">
        Failed to load schedule. Check your API key.
      </div>
    );
  }

  const h2hMap = await fetchH2HBatch(matches).catch(() => ({} as Record<number, H2HRecord>));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Match Schedule</h1>
        <p className="text-slate-400 mt-1 text-sm">
          All {matches.length} matches — filter by stage or status.
        </p>
      </div>
      <ScheduleClient matches={matches} initialVenue={(await searchParams)?.venue ?? "ALL"} h2hMap={h2hMap} />
    </div>
  );
}
