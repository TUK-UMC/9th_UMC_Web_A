import { useEffect, useMemo, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import type { PaginationOrder } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import QueryState from "../components/QueryState";
import useInView from "../hooks/useInview";
import LpCardSkeletonList from "../components/LpCards/LpCardSkeletonList";
import LpCard from "../components/LpCards/LpCard";

const MainPage = () => {
  const [order, setOrder] = useState<PaginationOrder>(PAGINATION_ORDER.desc);

  const params = useMemo(() => ({ search: "", order, limit: 50 }), [order]);

  const {
    data,
    isPending,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useGetInfiniteLpList(params.search, params.order, params.limit);

  // 관찰 트리거
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "600px 0px 600px 0px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((p) => p) ?? [];

  useEffect(() => {
    if (!isPending && items.length < 10 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isPending, items.length, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <QueryState
      isLoading={isPending}
      isError={isError}
      error={error}
      fallback={
        <div className="relative p-6 min-h-dvh bg-black text-white">
          <div className="flex justify-end gap-2 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto max-w-6xl px-4 py-6">
            <LpCardSkeletonList count={20} />
          </div>
        </div>
      }
      onRetry={() => refetch()}
    >
      <div className="relative p-6 min-h-dvh bg-black text-white">
        {/* 상단 필터 */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-4 py-2 rounded-md transition-colors ${
              order === PAGINATION_ORDER.asc
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-4 py-2 rounded-md transition-colors ${
              order === PAGINATION_ORDER.desc
                ? "bg-white text-black"
                : "bg-transparent text-white"
            }`}
          >
            최신순
          </button>

          {/* 백그라운드 갱신 배지 */}
          {isFetching && !isPending && (
            <span className="ml-3 self-center text-xs opacity-70">
              갱신 중…
            </span>
          )}
        </div>

        {/* 그리드 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto max-w-6xl px-4 py-6">
          {/* 카드 목록 */}
          {items.map((lp) => (
            <LpCard key={lp.id} item={lp} />
          ))}

          {/* 하단 스켈레톤 */}
          {isFetchingNextPage && <LpCardSkeletonList count={10} />}

          {/* 관찰 트리거 */}
          <div ref={ref} className="h-2 col-span-full" />
        </div>
      </div>
    </QueryState>
  );
};

export default MainPage;
