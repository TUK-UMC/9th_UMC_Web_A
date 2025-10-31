import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

const LpDetailPage = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const { data: lp, isPending, isError, refetch } = useGetLpDetail(lpId!);

  if (isPending) {
    return <LoadingSpinner message="LP 상세 정보를 불러오는 중..." />;
  }

  if (isError || !lp) {
    return (
      <ErrorState
        message="LP 상세 정보를 불러오는데 실패했습니다."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {/* LP 카드 */}
      <div className="relative bg-[#2a2a2a] rounded-2xl p-8">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 mb-6">
          <img
            className="w-12 h-12 rounded-full object-cover"
            src={lp.author.avatar}
            alt={lp.author.name}
          />
          <div>
            <div className="text-white font-semibold">{lp.author.name}</div>
            <div className="text-gray-400 text-sm">
              {(() => {
                const now = new Date();
                const created = new Date(lp.createdAt);
                const diffInSeconds = Math.floor(
                  (now.getTime() - created.getTime()) / 1000
                );
                const diffInMinutes = Math.floor(diffInSeconds / 60);
                const diffInHours = Math.floor(diffInMinutes / 60);
                const diffInDays = Math.floor(diffInHours / 24);

                if (diffInDays > 0) return `${diffInDays}일 전`;
                if (diffInHours > 0) return `${diffInHours}시간 전`;
                if (diffInMinutes > 0) return `${diffInMinutes}분 전`;
                return "방금 전";
              })()}
            </div>
          </div>
        </div>

        {/* LP 제목 */}
        <h1 className="text-white text-2xl font-bold mb-8">{lp.title}</h1>

        {/* 수정/삭제 버튼 (우측 상단) */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>

        {/* LP 이미지 */}
        <div className="flex justify-center mb-8">
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-full overflow-hidden shadow-2xl">
            <img
              src={lp.thumbnail}
              alt={lp.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* LP 설명 */}
        <p className="text-gray-300 leading-relaxed mb-6 text-center">
          {lp.content}
        </p>

        {/* 태그 */}
        {lp.tags && lp.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {lp.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-4 py-2 bg-[#3a4a5a] text-gray-200 rounded-full text-sm hover:bg-[#4a5a6a] transition-colors cursor-pointer"
              >
                # {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* 좋아요 */}
        <div className="flex justify-center">
          <button className="flex items-center gap-2">
            <span className="text-2xl">❤️</span>
            <span className="text-white text-xl font-semibold">
              {lp.likes.length}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
