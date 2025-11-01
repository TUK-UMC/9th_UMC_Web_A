import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = () => {
  const { isOpen } = useSidebar();

  return (
    <>
      {/* 사이드바 */}
      <aside
        className={`
          fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-[#1a1a1a] z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
      >
        {/* 메뉴 아이템들 */}
        <nav className="flex-1 px-4 pt-6">
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
          <button className="w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors text-left">
            탈퇴하기
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
