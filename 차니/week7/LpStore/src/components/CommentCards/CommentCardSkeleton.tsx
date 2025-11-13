export default function CommentCardSkeleton() {
  return (
    <div
      className="flex gap-3 pb-4 border-b border-gray-700 last:border-b-0"
      aria-hidden
    >
      <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="h-4 w-32 bg-white/15 rounded animate-pulse" />
          <div className="h-4 w-4 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-3 w-5/6 bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
