import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useDeleteLp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps],
      });
    },
  });
}

export default useDeleteLp;
