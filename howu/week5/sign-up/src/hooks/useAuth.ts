import { useLocalStorage } from "./useLocalStorage";
import type { UserInfo } from "../types/auth";

const USER_KEY = "user_info";

/**
 * 사용자 인증 상태를 관리하는 커스텀 훅
 */
export function useAuth() {
  const [user, setUser, removeUser] = useLocalStorage<UserInfo | null>(USER_KEY, null);

  // 로그인 함수
  const login = (userData: UserInfo) => {
    setUser(userData);
  };

  // 로그아웃 함수
  const logout = () => {
    removeUser();
  };

  // 로그인 상태 확인
  const isLoggedIn = () => {
    return user !== null && user.accessToken !== "";
  };

  // 액세스 토큰 가져오기
  const getAccessToken = () => {
    return user?.accessToken || "";
  };

  // 리프레시 토큰 가져오기
  const getRefreshToken = () => {
    return user?.refreshToken || "";
  };

  // 사용자 정보 가져오기
  const getUserInfo = () => {
    return user;
  };

  return {
    user,
    login,
    logout,
    isLoggedIn,
    getAccessToken,
    getRefreshToken,
    getUserInfo,
  };
}
