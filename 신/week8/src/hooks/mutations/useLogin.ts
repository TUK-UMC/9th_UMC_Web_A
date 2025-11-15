import { useMutation } from "@tanstack/react-query";
import { postSignin } from "../../apis/auth";
import { useLocalStorage } from "../useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../../constants/key";
import type { RequestSigninDto } from "../../types/auth";

function useLogin() {
  const { setItem: setAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { setItem: setRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  return useMutation({
    mutationFn: (signinData: RequestSigninDto) => postSignin(signinData),
    onSuccess: (response) => {
      const { data } = response;

      if (data) {
        // 토큰 저장
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      }
    },
  });
}

export default useLogin;
