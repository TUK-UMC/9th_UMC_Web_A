const LpCardSkeleton = () => {
  return (
    <div className="group animate-pulse">
      {/* 앨범 커버 이미지 + 호버 정보 */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        {/* 앨범 커버 */}
        <div className="w-full h-full bg-gray-300" />

        {/* 호버 시 나타나는 정보 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* 앨범 제목 */}
          <div className="w-full h-4 bg-gray-400 rounded-sm mb-2" />

          {/* 날짜와 좋아요 */}
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-200">
            <span>
              <div className="w-16 h-4 bg-gray-400 rounded-sm" />
            </span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-gray-400 rounded-sm" />
              <span className="w-4 h-4 bg-gray-400 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LpCardSkeleton;
