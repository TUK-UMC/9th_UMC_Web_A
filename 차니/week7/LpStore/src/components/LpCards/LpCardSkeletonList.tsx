import LpCardSkeleton from "./LpCardSkeleton";

type Props = { count?: number };

export default function LpCardSkeletonList({ count = 20 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LpCardSkeleton key={i} />
      ))}
    </>
  );
}
