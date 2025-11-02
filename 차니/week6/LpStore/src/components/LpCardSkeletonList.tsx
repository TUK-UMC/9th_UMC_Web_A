type Props = { count?: number };

export default function LpCardSkeletonList({ count = 20 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-square rounded-md bg-white/10 animate-pulse"
          aria-hidden
        />
      ))}
    </>
  );
}
