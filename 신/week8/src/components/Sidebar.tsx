import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useEffect, useState } from "react";
import useDeleteUser from "../hooks/mutations/useDeleteUser";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const Sidebar = () => {
  const { isOpen, close } = useSidebar();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();
  const { removeItem: removeAccessToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.accessToken
  );
  const { removeItem: removeRefreshToken } = useLocalStorage(
    LOCAL_STORAGE_KEY.refreshToken
  );

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser();
      // 토큰 제거
      removeAccessToken();
      removeRefreshToken();
      // 로그인 페이지로 이동
      window.location.href = "/login";
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* 사이드바 */}
      <aside
        className={`
          fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-[#1a1a1a]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col z-60
        `}
        role="dialog"
      >
        {/* 메뉴 아이템들 */}
        <nav className="flex-1 px-4 pt-6 backdrop-blur-sm">
          {/* 찾기 */}
          <Link
            to="/search"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>찾기</span>
          </Link>

          {/* 마이페이지 */}
          <Link
            to="/my"
            className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 rounded-md transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>마이페이지</span>
          </Link>
        </nav>

        {/* 하단 탈퇴하기 버튼 */}
        <div className="p-4">
          <button
            onClick={handleDeleteClick}
            className="w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-left cursor-pointer"
          >
            탈퇴하기
          </button>
        </div>
      </aside>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]"
          onClick={handleDeleteCancel}
        >
          <div
            className="bg-[#2c2c2c] rounded-2xl p-8 max-w-md w-full mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={handleDeleteCancel}
              className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl w-8 h-8 flex items-center justify-center cursor-pointer"
              aria-label="Close modal"
            >
              ×
            </button>

            {/* 모달 내용 */}
            <div className="text-center">
              <h2 className="text-white text-xl font-bold mb-6">
                정말 탈퇴하시겠습니까?
              </h2>

              {/* 버튼 그룹 */}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isPending}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  아니오
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isPending}
                  className="flex-1 bg-[#e91e63] hover:bg-[#c2185b] text-white py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isPending ? "탈퇴 중..." : "예"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
