export default function LpCardSkeleton() {
  return (
    <div
      className="group relative block isolate hover:z-20 focus:z-20"
      aria-hidden
    >
      <div className="relative aspect-square overflow-hidden rounded-md bg-black">
        <div className="absolute inset-0 bg-white/10 animate-pulse" />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-2">
          <div className="px-3 py-2">
            <div className="h-4 w-3/4 bg-white/15 rounded animate-pulse" />
            <div className="mt-2 flex items-center gap-3 text-xs text-white/85">
              <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-12 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
