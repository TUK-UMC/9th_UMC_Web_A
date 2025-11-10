import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../api/authApi';
import LpCreateModal from './LpCreateModal';
import WithdrawalConfirmModal from './WithdrawalConfirmModal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, removeUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // useMutation을 사용하여 로그아웃 처리
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await logoutUser();
    },
    onSuccess: () => {
      // 로컬 스토리지에서 사용자 정보 제거
      removeUser();
      // 로그인 페이지로 리다이렉트
      navigate('/login', { replace: true });
    },
    onError: (error) => {
      console.error('로그아웃 실패:', error);
      // API 호출이 실패해도 로컬에서 로그아웃 처리
      removeUser();
      navigate('/login', { replace: true });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // 사이드바 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSidebar();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
        <div className="max-w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 버거 버튼 + 로고 */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="lg:hidden text-white p-2 hover:bg-gray-800 rounded transition-colors"
                aria-label="메뉴 열기"
              >
                <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
                </svg>
              </button>
              <h1 className="text-xl md:text-2xl font-bold text-pink-500 cursor-pointer" onClick={() => navigate('/main')}>
                🎵 LP Collection
              </h1>
            </div>

            {/* 오른쪽: 로그인 상태에 따른 버튼 */}
            {isLoggedIn() ? (
              <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
                <span className="hidden md:inline text-gray-400">
                  환영합니다, <span className="text-white font-semibold">{user?.name}</span>님!
                </span>
                <button
                  onClick={() => navigate('/mypage')}
                  className="px-3 py-2 md:px-4 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="hidden md:inline">마이페이지</span>
                  <span className="md:hidden">👤</span>
                </button>
                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="px-3 py-2 md:px-4 text-pink-400 hover:text-pink-300 border border-pink-400 rounded-lg hover:border-pink-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-2 md:px-4 text-gray-300 hover:text-white transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-3 py-2 md:px-4 bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 사이드바 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 w-64 bg-gray-900 border-r border-gray-800 z-40 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        <div className="p-4 flex flex-col h-full">
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => {
                navigate('/main');
                closeSidebar();
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
            >
              🔍 Q 찾기
            </button>
            {isLoggedIn() && (
              <button
                onClick={() => {
                  navigate('/mypage');
                  closeSidebar();
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-white"
              >
                👤 마이페이지
              </button>
            )}
          </nav>
          {/* 탈퇴하기 버튼 */}
          {isLoggedIn() && (
            <button
              onClick={() => {
                setIsWithdrawalModalOpen(true);
                closeSidebar();
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400 border-t border-gray-800 mt-auto"
            >
              탈퇴하기
            </button>
          )}
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 pt-14 lg:ml-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>

      {/* 플로팅 버튼 */}
      {isLoggedIn() && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-50 flex items-center justify-center"
          aria-label="새 LP 작성"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      )}

      {/* LP 생성 모달 */}
      <LpCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
        }}
      />

      {/* 탈퇴 확인 모달 */}
      <WithdrawalConfirmModal
        isOpen={isWithdrawalModalOpen}
        onClose={() => setIsWithdrawalModalOpen(false)}
      />
    </div>
  );
};

export default Layout;

