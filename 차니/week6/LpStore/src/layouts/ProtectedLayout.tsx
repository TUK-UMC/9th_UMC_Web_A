import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FloatingButton from "../components/FloatingButton";
import { useEffect } from "react";

function RedirectToLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    navigate("/login", { replace: true, state: { from: location } });
  }, [navigate, location]);

  return null;
}

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <RedirectToLogin />;
  }

  return (
    <div className="select-none bg-black h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 mt-[90px]">
        <Outlet />
      </main>
      <FloatingButton to="#" />
    </div>
  );
};

export default ProtectedLayout;
