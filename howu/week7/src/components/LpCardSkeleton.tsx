/**
 * LP 카드 스켈레톤 UI 컴포넌트
 */
const LpCardSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
      <div className="aspect-video bg-gray-800 animate-pulse"></div>
    </div>
  );
};

/**
 * 여러 개의 스켈레톤 카드를 렌더링하는 컴포넌트
 */
export const LpCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <LpCardSkeleton key={index} />
      ))}
    </>
  );
};

export default LpCardSkeleton;

