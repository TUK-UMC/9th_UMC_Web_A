import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="select-none bg-black w-dvw h-dvh">
      <Navbar />
      <Outlet />
    </div>
  );
};
