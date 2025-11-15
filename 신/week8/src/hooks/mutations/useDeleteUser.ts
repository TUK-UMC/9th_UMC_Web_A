import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../apis/auth";
import { QUERY_KEY } from "../../constants/key";

function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
      });
    },
  });
}

export default useDeleteUser;
