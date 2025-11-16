import { useQuery } from "@tanstack/react-query";
import { getMyInfo } from "../../api/auth";
import { QUERY_KEY } from "../../constants/key";
import { useAuth } from "../../context/AuthContext";

export default function useMyInfo() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: [QUERY_KEY.me],
    queryFn: getMyInfo,
    enabled: !!accessToken,
    staleTime: 60_000,
  });
}
