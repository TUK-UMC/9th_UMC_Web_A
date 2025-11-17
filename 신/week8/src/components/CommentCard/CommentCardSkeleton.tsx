const CommentCardSkeleton = () => {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-12 h-12 rounded-full bg-gray-700"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>
  );
};

export default CommentCardSkeleton;
