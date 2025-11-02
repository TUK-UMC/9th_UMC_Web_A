import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 페이지를 보호하는 컴포넌트
 * 로그인하지 않은 사용자에게 경고 모달을 표시하고 로그인 페이지로 리다이렉트합니다.
 */
const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      setShowModal(true);
    }
  }, [isLoggedIn]);

  const handleConfirm = () => {
    // 현재 경로를 로그인 페이지의 state로 전달
    navigate("/login", { 
      state: { from: location.pathname },
      replace: true 
    });
  };

  // 로그인하지 않은 경우 경고 모달 표시
  if (!isLoggedIn()) {
    return (
      showModal && (
        <div className="min-h-screen bg-black/80 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-2xl font-bold text-white mb-2">로그인이 필요합니다</h2>
              <p className="text-gray-400">이 페이지를 보려면 먼저 로그인해주세요.</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      )
    );
  }

  // 로그인한 경우 자식 컴포넌트를 렌더링
  return <>{children}</>;
};

export default AuthGuard;
