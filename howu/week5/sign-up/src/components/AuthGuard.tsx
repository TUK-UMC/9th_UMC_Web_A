import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트합니다.
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 로그인하지 않은 경우 null을 반환 (리다이렉트 중)
  if (!isLoggedIn()) {
    return null;
  }

  // 로그인한 경우 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

export default AuthGuard;
