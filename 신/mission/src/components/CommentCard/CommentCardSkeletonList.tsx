import CommentCardSkeleton from "./CommentCardSkeleton";

interface CommentCardSkeletonListProps {
  count: number;
}

const CommentCardSkeletonList = ({ count }: CommentCardSkeletonListProps) => {
  return (
    <>
      {new Array(count).fill(0).map((_, idx) => (
        <CommentCardSkeleton key={idx} />
      ))}
    </>
  );
};

export default CommentCardSkeletonList;
