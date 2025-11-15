import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function usePatchLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default usePatchLp;
