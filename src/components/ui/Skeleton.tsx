function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 justify-end">
          <SkeletonBlock className="w-20 h-4" />
          <SkeletonBlock className="w-8 h-6 rounded-sm" />
        </div>
        <div className="flex flex-col items-center gap-2 min-w-[90px]">
          <SkeletonBlock className="w-16 h-6" />
          <SkeletonBlock className="w-12 h-4 rounded-full" />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <SkeletonBlock className="w-8 h-6 rounded-sm" />
          <SkeletonBlock className="w-20 h-4" />
        </div>
      </div>
    </div>
  );
}

export function GroupTableSkeleton() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <SkeletonBlock className="w-16 h-4" />
      </div>
      <div className="divide-y divide-slate-700/30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="px-4 py-3 flex items-center gap-3">
            <SkeletonBlock className="w-4 h-3" />
            <SkeletonBlock className="w-5 h-4 rounded-sm" />
            <SkeletonBlock className="w-24 h-4" />
            <div className="ml-auto flex gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonBlock key={j} className="w-5 h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScorerRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-700/30">
      <SkeletonBlock className="w-6 h-4" />
      <SkeletonBlock className="w-8 h-6 rounded-sm" />
      <SkeletonBlock className="w-32 h-4" />
      <div className="ml-auto flex gap-6">
        <SkeletonBlock className="w-6 h-4" />
        <SkeletonBlock className="w-6 h-4" />
        <SkeletonBlock className="w-6 h-4" />
      </div>
    </div>
  );
}

export function TeamCardSkeleton() {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col items-center gap-3">
      <SkeletonBlock className="w-12 h-9 rounded-sm" />
      <SkeletonBlock className="w-20 h-4" />
      <SkeletonBlock className="w-14 h-3" />
    </div>
  );
}
