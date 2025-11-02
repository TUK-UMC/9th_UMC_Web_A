type Props = { count?: number };

export default function CommentSkeletonList({ count = 8 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-3">
          <div className="h-9 w-9 rounded-full bg-white/10 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-28 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </>
  );
}
