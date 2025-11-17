import { useCallback, useEffect, useState } from "react";

export default function useSidebar(breakpoint = 1000) {
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );

  // 사이드바 열림 상태
  const [open, setOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= breakpoint : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      const small = window.innerWidth < breakpoint;
      setIsSmall(small);
      // 모바일이면 기본 닫힘, 데스크탑이면 기본 열림
      setOpen(!small);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  // 열기 / 닫기 / 토글
  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);
  const toggleSidebar = useCallback(() => setOpen((prev) => !prev), []);

  return { isSmall, open, openSidebar, closeSidebar, toggleSidebar };
}
