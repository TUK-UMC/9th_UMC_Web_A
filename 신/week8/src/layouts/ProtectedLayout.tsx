import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const ProtectedLayoutContent = () => {
  const { isOpen, close } = useSidebar();

  const handleMainClick = () => {
    if (isOpen) {
      close();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-black text-white">
      <Navbar />
      <Sidebar />
      <main
        className={`flex-1 bg-black transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
        onClick={handleMainClick}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const ProtectedLayout = () => {
  const { accessToken } = useAuth();

  if (!accessToken) {
    alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <ProtectedLayoutContent />
    </SidebarProvider>
  );
};

export default ProtectedLayout;
