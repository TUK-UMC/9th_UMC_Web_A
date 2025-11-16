import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSidebar from "../hooks/useSidebar";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../api/auth";
import { createPortal } from "react-dom";
import { CloseIcon, SearchIcon, UserIcon } from "../assets/icons";

function Item({
  to,
  icon,
  label,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-m text-white cursor-pointer"
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar({
  open,
  onClose,
  headerHeight = 90,
}: {
  open: boolean;
  onClose: () => void;
  headerHeight?: number;
}) {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const isSmall = useSidebar();

  const { mutate: doLeave, isPending: isLeaving } = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await logout();
      navigate("/login", { replace: true });
    },
  });

  const handleItemClick = () => {
    if (isSmall) onClose();
  };

  const handleWithdraw = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const body = document.body;

    if (open) {
      const prevOverflow = body.style.overflow;
      body.style.overflow = "hidden";

      return () => {
        body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  const asideStyle = {
    top: headerHeight,
    height: `calc(100vh - ${headerHeight}px)`,
  } as const;

  const modal =
    openModal &&
    typeof document !== "undefined" &&
    createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => !isLeaving && setOpenModal(false)}
        />
        <div className="relative w-[600px] max-w-[92vw] rounded-2xl bg-neutral-900 p-6 shadow-xl">
          <button
            className="absolute right-4 top-4 text-white/70 hover:text-white"
            onClick={() => !isLeaving && setOpenModal(false)}
            aria-label="close"
          >
            <CloseIcon />
          </button>

          <h2 className="text-xl font-semibold mb-6">회원 탈퇴</h2>

          <p className="mb-6 text-sm opacity-80">
            정말 탈퇴하시겠습니까?
            <br />
            탈퇴 시 계정과 관련된 정보가 삭제되며, 복구가 어려울 수 있습니다.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              disabled={isLeaving}
              className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => doLeave()}
              disabled={isLeaving}
              className="px-4 py-2 rounded-md bg-pink-600 hover:bg-pink-500 disabled:bg-gray-500"
            >
              {isLeaving ? "처리 중…" : "탈퇴하기"}
            </button>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {isSmall && open && (
        <div
          onClick={onClose}
          className="fixed inset-x-0 bottom-0 bg-black/40 z-50 md:hidden"
          style={{ top: headerHeight }}
        />
      )}

      <aside
        className={`fixed left-0 w-64 bg-[#121212] text-white z-50 transform transition-transform
        ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={asideStyle}
      >
        <div className="flex flex-col justify-between h-full w-full">
          <nav className="px-2 py-4 space-y-1">
            <Item
              to="#"
              icon={<SearchIcon />}
              label="찾기"
              onClick={handleItemClick}
            />
            {accessToken && (
              <Item
                to="/my"
                icon={<UserIcon />}
                label="마이페이지"
                onClick={handleItemClick}
              />
            )}
          </nav>
          <nav className="px-2 py-4 flex justify-center">
            <button
              type="button"
              onClick={handleWithdraw}
              className="text-m text-white cursor-pointer"
            >
              탈퇴하기
            </button>
          </nav>
        </div>
      </aside>

      {modal}
    </>
  );
}
