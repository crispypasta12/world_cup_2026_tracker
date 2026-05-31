export default function VenuesLoading() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <div className="h-8 w-32 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-4 w-96 bg-slate-700/30 rounded animate-pulse" />
      </div>
      {Array.from({ length: 3 }).map((_, s) => (
        <div key={s} className="space-y-4">
          <div className="h-7 w-24 bg-slate-700/50 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: s === 0 ? 6 : 2 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-3 animate-pulse"
              >
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-slate-700/50 rounded" />
                  <div className="h-3 w-28 bg-slate-700/30 rounded" />
                </div>
                <div className="h-4 w-32 bg-slate-700/30 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
