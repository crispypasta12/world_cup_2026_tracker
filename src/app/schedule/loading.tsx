import { MatchCardSkeleton } from "@/components/ui/Skeleton";

export default function ScheduleLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-4 w-64 bg-slate-700/30 rounded animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-7 w-24 bg-slate-700/40 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, g) => (
          <div key={g} className="space-y-3">
            <div className="h-4 w-28 bg-slate-700/40 rounded animate-pulse" />
            {Array.from({ length: 4 }).map((_, i) => (
              <MatchCardSkeleton key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
