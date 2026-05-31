import { ScorerRowSkeleton } from "@/components/ui/Skeleton";

export default function ScorersLoading() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <div className="h-8 w-40 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-4 w-72 bg-slate-700/30 rounded animate-pulse" />
      </div>
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="h-4 w-32 bg-slate-700/40 rounded animate-pulse" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <ScorerRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
