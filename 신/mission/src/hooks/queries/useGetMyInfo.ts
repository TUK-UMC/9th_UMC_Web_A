import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function useGetMyInfo(enabled: boolean = false) {
  return useQuery({
    queryKey: [QUERY_KEY.myInfo],
    queryFn: () => getMyInfo(),

    // accessToken이 있을 때만 쿼리 실행
    enabled,

    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분

    // 에러 발생 시 재시도 하지 않음 (인증 에러는 재시도해도 의미 없음)
    retry: false,

    select: (data) => data.data,
  });
}

export default useGetMyInfo;
