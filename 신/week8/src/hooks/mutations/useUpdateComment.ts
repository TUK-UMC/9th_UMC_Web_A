import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateComment } from "../../apis/comment";
import { QUERY_KEY } from "../../constants/key";

function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.comments],
      });
    },
  });
}

export default useUpdateComment;
