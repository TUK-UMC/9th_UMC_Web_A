import LpCardSkeleton from "./LpCardSkeleton";

type Props = { count?: number };

export default function LpCardSkeletonList({ count = 20 }: Props) {
  // 그리드 안에서 사용하므로 wrapper 없이 조각만 반환
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <LpCardSkeleton key={i} />
      ))}
    </>
  );
}
