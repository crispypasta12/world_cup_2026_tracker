import { GroupTableSkeleton } from "@/components/ui/Skeleton";

export default function GroupsLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-700/50 rounded animate-pulse" />
        <div className="h-4 w-80 bg-slate-700/30 rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <GroupTableSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
