import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../api/lp";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseLpDetailDto } from "../../types/lp.types";

export function useLpDetail(lpId: string) {
  return useQuery<ResponseLpDetailDto>({
    queryKey: [QUERY_KEY.lp, lpId],
    queryFn: () => getLpDetail(lpId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
