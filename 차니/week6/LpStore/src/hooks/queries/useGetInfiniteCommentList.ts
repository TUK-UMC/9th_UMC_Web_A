import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationOrder } from "../../enums/common";
import { getCommentList } from "../../api/comment";

function useGetInfiniteCommentList(
  lpId: string,
  limit: number,
  order: PaginationOrder
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.comments, lpId, order],
    queryFn: ({ pageParam }) =>
      getCommentList({ lpId, cursor: pageParam, limit, order }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.data.hasNext ? lastPage.data.nextCursor : undefined;
    },
  });
}

export default useGetInfiniteCommentList;
