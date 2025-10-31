import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";

const HomePage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);

  const { data, isPending, isError, refetch } = useGetLpList({ order });

  if (isPending) return <LoadingSpinner message="LP를 불러오는 중..." />;

  if (isError)
    return (
      <ErrorState
        message="LP 목록을 불러오는데 실패했습니다."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="relative p-6">
      {/* 상단 필터 영역 */}
      <div className="flex justify-end gap-2 mb-6">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded-md transition-colors ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded-md transition-colors ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data?.map((lp) => (
          <div
            key={lp.id}
            className="group cursor-pointer"
            onClick={() => navigate(`/lp/${lp.id}`)}
          >
            {/* 앨범 커버 이미지 + 호버 정보 */}
            <div className="relative aspect-square overflow-hidden rounded-lg">
              {/* 앨범 커버 */}
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* 호버 시 나타나는 정보 오버레이 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {/* 앨범 제목 */}
                <h3 className="text-white font-bold text-sm md:text-base mb-2 line-clamp-2">
                  {lp.title}
                </h3>

                {/* 날짜와 좋아요 */}
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-200">
                  <span>
                    {new Date(lp.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{lp.likes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 플로팅 버튼 */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#e91e63] rounded-full text-white text-3xl shadow-lg hover:bg-[#c2185b] transition-colors flex items-center justify-center z-60"
        aria-label="Add new item"
      >
        +
      </button>
    </div>
  );
};

export default HomePage;
