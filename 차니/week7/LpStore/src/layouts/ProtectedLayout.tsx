import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import FloatingButton from "../components/FloatingButton";
import { useEffect, useState } from "react";
import useSidebar from "../hooks/useSidebar";
import clsx from "clsx";
import LpCreateModal from "../components/LpCreateModal";

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

  const isSmall = useSidebar();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  const offsetClass = desktopSidebarOpen && !isSmall ? "pl-64" : "";

  const [openWrite, setOpenWrite] = useState(false);

  if (!accessToken) {
    return <RedirectToLogin />;
  }

  return (
    <div className="select-none bg-black h-dvh flex flex-col">
      <Navbar onSidebarChange={setDesktopSidebarOpen} />
      <main
        className={clsx(
          "mt-[90px] transition-[padding] duration-200",
          offsetClass
        )}
      >
        <Outlet />
      </main>
      <FloatingButton onClick={() => setOpenWrite(true)} />
      {openWrite && <LpCreateModal onClose={() => setOpenWrite(false)} />}
    </div>
  );
};

export default ProtectedLayout;
