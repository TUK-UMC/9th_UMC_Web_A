import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export const MainLayout = () => {
  return (
    <div className="select-none bg-black h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};
