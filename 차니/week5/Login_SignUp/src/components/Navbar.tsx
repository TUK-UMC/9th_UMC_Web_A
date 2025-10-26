import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isLoggedIn = !!accessToken;

  return (
    <div className="w-full h-[90px] bg-[#1f1e1e] p-6 flex justify-between items-center">
      <div className="text-2xl font-bold text-pink-600">돌려돌려LP판</div>
      {isLoggedIn ? (
        <div>
          <button
            className="px-4 py-2 rounded-sm text-white bg-pink-600 font-semibold cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <button
            className="px-4 py-2 rounded-sm text-white bg-pink-600 font-semibold cursor-pointer"
            onClick={handleLogin}
          >
            로그인
          </button>
          <button
            className="px-4 py-2 rounded-sm text-pink-600 bg-white font-semibold cursor-pointer"
            onClick={handleSignUp}
          >
            회원가입
          </button>
        </div>
      )}
    </div>
  );
}
