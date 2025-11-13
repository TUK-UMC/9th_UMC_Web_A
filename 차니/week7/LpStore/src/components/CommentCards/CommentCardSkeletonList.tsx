import CommentCardSkeleton from "./CommentCardSkeleton";

type Props = { count?: number };

export default function CommentSkeletonList({ count = 8 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CommentCardSkeleton key={i} />
      ))}
    </>
  );
}
