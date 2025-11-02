import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import type { PaginationOrder } from "../../enums/common";
import type { ResponseCommentListDto } from "../../types/comment.types";
import { getCommentList } from "../../api/comment";

export type CommentItem = ResponseCommentListDto["data"]["data"][number];

export default function useLpCommentsInfinite(
  lpId: number | string,
  order: PaginationOrder = "desc",
  limit = 20
) {
  return useInfiniteQuery<ResponseCommentListDto, Error>({
    queryKey: [QUERY_KEY.lpComments, lpId, order],
    initialPageParam: 0, // 서버가 null/undefined 시작이면 null로 바꾸고 아래에서 ?? undefined 유지
    queryFn: ({ pageParam }) =>
      getCommentList({
        lpId: String(lpId),
        cursor: (pageParam as number | null) ?? undefined,
        order,
        limit,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.data.hasNext ? lastPage.data.nextCursor ?? undefined : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
