import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common.types";
import type { ResponseLpListDto } from "../../types/lp.types";
import { getLpList } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";

export type LpItem = ResponseLpListDto["data"]["data"][number];

export type LpListResult = {
  items: LpItem[];
  nextCursor: number | null;
  hasNext: boolean;
};

export function useLpList(params: PaginationDto) {
  const { cursor, search, order, limit } = params;

  return useQuery<ResponseLpListDto, Error, LpListResult>({
    queryKey: [
      QUERY_KEY.lps,
      {
        cursor: cursor ?? null,
        search: search ?? "",
        order: order ?? "desc",
        limit: limit ?? 20,
      },
    ],
    queryFn: () => getLpList({ cursor, search, order, limit }),

    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분

    select: (res) => ({
      items: res.data.data,
      nextCursor: res.nextCursor,
      hasNext: res.hasNext,
    }),
  });
}
