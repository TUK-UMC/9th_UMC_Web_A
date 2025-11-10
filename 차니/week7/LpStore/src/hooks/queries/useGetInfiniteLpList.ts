import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationOrder } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../api/lp";

function useGetInfiniteLpList(
  search: string,
  order: PaginationOrder,
  limit: number
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, { search, order, limit }],
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: (pageParam ?? 0) as number, search, order, limit }),
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
  });
}

export default useGetInfiniteLpList;
