import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FloatingButton from "../components/FloatingButton";

export const MainLayout = () => {
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
