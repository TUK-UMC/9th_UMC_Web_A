import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationOrder } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../api/lp";

function useGetInfiniteLpList(
  search: string,
  order: PaginationOrder,
  limit: number
) {
  const trimmed = search.trim();
  // const isEmpty = trimmed.length === 0;

  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search: trimmed, order, limit }],
    queryFn: ({ pageParam }) =>
      getLpList({
        cursor: (pageParam ?? 0) as number,
        search: trimmed,
        order,
        limit,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((p) => {
        const inner = p.data?.data;
        return Array.isArray(inner) ? inner : inner?.data ?? [];
      }),
    }),
    // enabled: !isEmpty,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });
}

export default useGetInfiniteLpList;
