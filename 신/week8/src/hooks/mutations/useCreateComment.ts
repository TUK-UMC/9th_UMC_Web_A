import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments],
      });
    },
  });
}

export default useCreateComment;
