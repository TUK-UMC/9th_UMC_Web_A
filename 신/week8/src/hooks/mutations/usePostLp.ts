import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function usePostLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLp,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default usePostLp;
