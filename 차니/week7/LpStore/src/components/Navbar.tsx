import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyInfo } from "../api/auth";
import { useEffect, useState } from "react";
import type { ResponseMyInfoDto } from "../types/auth.types";
import Sidebar from "./Sidebar";
import useSidebar from "../hooks/useSidebar";
import { useMutation } from "@tanstack/react-query";

function BurgerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export const HEADER_H = 90;

export default function Navbar({
  onSidebarChange,
}: {
  onSidebarChange?: (openOnDesktop: boolean) => void;
}) {
  const { logout, accessToken } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();
  const isSmall = useSidebar();

  const [openSidebar, setOpenSidebar] = useState<boolean>(() => !isSmall);

  const { mutate: doLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => window.location.assign("/"),
  });

  useEffect(() => {
    setOpenSidebar(!isSmall);
  }, [isSmall]);

  useEffect(() => {
    onSidebarChange?.(!isSmall && openSidebar);
  }, [openSidebar, isSmall, onSidebarChange]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      setData(response);
    };
    if (accessToken) getData();
  }, [accessToken]);

  return (
    <>
      <div className="w-full h-[90px] bg-[#1f1e1e] p-6 shadow-md fixed z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <button
              className="cursor-pointer text-white"
              onClick={() => setOpenSidebar((v) => !v)}
            >
              <BurgerIcon />
            </button>

            <Link to="/" className="text-2xl font-bold text-pink-600">
              돌려돌려LP판
            </Link>
          </div>

          {!accessToken && (
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 rounded-sm text-white bg-pink-600 font-semibold cursor-pointer"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-sm text-pink-600 bg-white font-semibold cursor-pointer"
              >
                회원가입
              </Link>
            </div>
          )}

          {accessToken && (
            <div className="flex gap-4 items-center">
              <Link
                to="/my"
                className="text-white transition-colors font-medium"
              >
                {data?.data.name}님 반갑습니다.
              </Link>
              <button
                type="button"
                className="px-4 py-2 rounded-sm text-white bg-pink-600 font-semibold cursor-pointer"
                onClick={() => doLogout()}
                disabled={isLoggingOut}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      <Sidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
        headerHeight={HEADER_H}
      />
    </>
  );
}
