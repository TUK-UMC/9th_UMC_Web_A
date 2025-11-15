import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import type { RequestLpDto } from "../../types/lp";

function useGetLpDetail({ lpId }: RequestLpDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, lpId],
    queryFn: () => getLpDetail({ lpId }),

    // LP 상세 데이터는 자주 변하지 않으므로 5분간 캐시 유지
    staleTime: 1000 * 60 * 5, // 5분

    // 10분 동안 사용되지 않으면 캐시 제거
    gcTime: 1000 * 60 * 10, // 10분

    // lpId가 없으면 쿼리 실행하지 않음
    enabled: !!lpId,

    select: (data) => data.data,
  });
}

export default useGetLpDetail;
