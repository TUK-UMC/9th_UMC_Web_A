import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
      {/* 로고 */}
      <Link
        to="/"
        className="text-[#e91e63] text-xl font-bold hover:opacity-80 transition-opacity"
      >
        돌려돌려LP판
      </Link>

      {/* 로그인/회원가입 버튼 */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="px-4 py-2 text-white bg-transparent border border-gray-700 rounded-md hover:bg-gray-800 transition-colors"
        >
          로그인
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 text-white bg-[#e91e63] rounded-md hover:bg-[#c2185b] transition-colors"
        >
          회원가입
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
