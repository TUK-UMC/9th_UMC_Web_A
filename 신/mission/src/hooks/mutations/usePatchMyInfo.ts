import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";
import type { ResponseMyInfoDto, PatchMyInfoDto } from "../../types/auth";

function usePatchMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMyInfo,
    // onMutate -> API 요청 이전에 호출되는 함수
    // UI에 바로 변경을 보여주기 위해 Cache 업데이트
    onMutate: async (variables: PatchMyInfoDto) => {
      // 1. 내 정보에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.myInfo],
      });

      // 2. 현재 내 정보 데이터를 캐시에서 가져오기
      const previousMyInfo = queryClient.getQueryData<ResponseMyInfoDto>([
        QUERY_KEY.myInfo,
      ]);

      // 3. 내 정보 데이터를 복사해서 newMyInfo라는 새로운 객체를 만듦
      // 복사하는 이유는 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서
      const newMyInfo = { ...previousMyInfo } as ResponseMyInfoDto;

      // 4. 변경된 데이터를 newMyInfo에 반영
      if (newMyInfo && newMyInfo.data) {
        newMyInfo.data = {
          ...newMyInfo.data,
          name: variables.name || newMyInfo.data.name,
          bio: variables.bio !== undefined ? variables.bio : newMyInfo.data.bio,
          avatar:
            variables.avatar !== undefined
              ? variables.avatar
              : newMyInfo.data.avatar,
        };
      }

      // 5. 업데이트된 내 정보 데이터를 캐시에 저장
      // 이렇게 하면 UI가 바로 업데이트 됨, 사용자가 변화를 즉시 확인할 수 있음
      queryClient.setQueryData([QUERY_KEY.myInfo], newMyInfo);

      return { previousMyInfo, newMyInfo };
    },

    // API 요청이 실패하면 이전 상태로 롤백
    onError: (err, variables, context) => {
      console.error("내 정보 수정 실패:", err, variables);
      // 에러 발생 시 이전 데이터로 되돌리기
      if (context?.previousMyInfo) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousMyInfo);
      }
    },

    // onSettled는 API 요청이 끝난 후 (성공하든 실패하든 실행)
    onSettled: async () => {
      // 최신 데이터를 서버에서 다시 불러와서 동기화
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
}

export default usePatchMyInfo;
