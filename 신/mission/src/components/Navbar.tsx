import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSidebar } from "../context/SidebarContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const Navbar = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const { toggle } = useSidebar();

  // accessToken이 있을 때만 사용자 정보 조회
  const { data } = useGetMyInfo(!!accessToken);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between relative z-50">
      {/* 왼쪽: 햄버거 메뉴 + 로고 */}
      <div className="flex items-center gap-4">
        {/* 햄버거 메뉴 */}
        <button
          onClick={toggle}
          className="text-white hover:opacity-80 transition-opacity cursor-pointer"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M7.95 11.95h32m-32 12h32m-32 12h32"
            />
          </svg>
        </button>

        {/* 로고 */}
        <Link
          to="/"
          className="text-[#e91e63] text-xl font-bold hover:opacity-80 transition-opacity"
        >
          돌려돌려LP판
        </Link>
      </div>

      {/* 오른쪽: 검색 + 로그인/회원가입 */}
      <div className="flex items-center gap-4">
        {/* 검색 아이콘 */}
        <button className="text-white hover:opacity-80 transition-opacity">
          <svg
            width="28"
            height="28"
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
        </button>

        {!accessToken ? (
          // 로그인/회원가입 버튼
          <>
            <Link
              to="/login"
              className="px-4 py-2 text-white hover:opacity-80 transition-opacity"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 text-white bg-[#e91e63] rounded-md hover:bg-[#c2185b] transition-colors"
            >
              회원가입
            </Link>
          </>
        ) : (
          <>
            <div className="px-4 py-2 text-white">
              {data?.name}님 반갑습니다.
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
