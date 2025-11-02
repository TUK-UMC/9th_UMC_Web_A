import { useInfiniteQuery } from "@tanstack/react-query";
import { getCommentList } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationOrder } from "../../enums/common";

function useGetCommentList(
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

export default useGetCommentList;
