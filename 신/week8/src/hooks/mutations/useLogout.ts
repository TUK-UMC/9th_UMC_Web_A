import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
}

export default useLogout;
