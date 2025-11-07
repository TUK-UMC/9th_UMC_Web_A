import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchMyInfo } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function usePatchMyInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchMyInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
}

export default usePatchMyInfo;
