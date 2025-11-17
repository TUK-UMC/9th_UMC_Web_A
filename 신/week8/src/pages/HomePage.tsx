import { useEffect, useState } from "react";
// import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import ErrorState from "../components/ErrorState";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpWriteModal from "../components/LpWriteModal";
import useDebounce from "../hooks/useDebounce";
import {
  // SCROLL_THROTTLE_DELAY,
  SEARCH_DEBOUNCE_DELAY,
} from "../constants/delay";
import { Search } from "lucide-react";
// import useThrottle from "../hooks/useThrottle";

const HomePage = () => {
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedQuery = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  // const { data, isPending, isError, refetch } = useGetLpList({ order });

  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
    refetch,
  } = useGetInfiniteLpList(debouncedQuery, order, 50);

  // ref, inView
  // ref -> 특정한 HTML 요소를 감시할 수 있다.
  // inView -> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({ threshold: 0 });
  // const throttledInView = useThrottle(inView, SCROLL_THROTTLE_DELAY);

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetching]);

  // useEffect(() => {
  //   if (throttledInView && hasNextPage) {
  //     fetchNextPage();
  //   }
  // }, [throttledInView, fetchNextPage, hasNextPage]);

  if (isError)
    return (
      <ErrorState
        message="LP 목록을 불러오는데 실패했습니다."
        onRetry={() => refetch()}
      />
    );

  return (
    <div className="relative p-6">
      <div className="flex items-center gap-3 pb-2 mb-4 border-b border-gray-700">
        <Search />
        <input
          className="flex-1 bg-transparent outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
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
        {isPending && <LpCardSkeletonList count={20} />}
        {lps?.pages?.map((page) =>
          page.data.data?.flat().map((lp) => <LpCard key={lp.id} lp={lp} />)
        )}
        {isFetching && <LpCardSkeletonList count={20} />}
        <div ref={ref} className="h-2" />
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#e91e63] rounded-full text-white text-3xl shadow-lg hover:bg-[#c2185b] transition-colors flex items-center justify-center z-60 cursor-pointer"
        aria-label="Add new item"
      >
        +
      </button>

      {/* LP 작성 모달 */}
      <LpWriteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;
