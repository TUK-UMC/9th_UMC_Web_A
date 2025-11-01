import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationOrder } from "../../enums/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetInfiniteLpList(
  search: string,
  order: PaginationOrder,
  limit: number
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.lps, order],
    queryFn: ({ pageParam }) =>
      getLpList({ cursor: pageParam, search, order, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteLpList;
