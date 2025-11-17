import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const HomeLayoutContent = () => {
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

const HomeLayout = () => {
  return (
    <SidebarProvider>
      <HomeLayoutContent />
    </SidebarProvider>
  );
};

export default HomeLayout;
