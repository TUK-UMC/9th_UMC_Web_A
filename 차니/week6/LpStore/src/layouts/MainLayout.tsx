import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FloatingButton from "../components/FloatingButton";
import { useState } from "react";
import useSidebar from "../hooks/useSidebar";
import clsx from "clsx";

export const MainLayout = () => {
  const isSmall = useSidebar();
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  const offsetClass = desktopSidebarOpen && !isSmall ? "pl-64" : "";

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
      <FloatingButton to="#" />
    </div>
  );
};
