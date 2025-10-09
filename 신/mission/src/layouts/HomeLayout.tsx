import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* <footer>푸터</footer> */}
    </div>
  );
};

export default HomeLayout;
