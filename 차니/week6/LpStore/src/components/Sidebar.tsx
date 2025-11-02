import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useSidebar from "../hooks/useSidebar";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="7" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
    >
      <path strokeWidth="2" d="M20 21a8 8 0 10-16 0" />
      <circle cx="12" cy="7" r="4" strokeWidth="2" />
    </svg>
  );
}

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
  const { accessToken } = useAuth();
  const isSmall = useSidebar();

  const handleItemClick = () => {
    if (isSmall) onClose();
  };

  const asideStyle = {
    top: headerHeight,
    height: `calc(100vh - ${headerHeight}px)`,
  } as const;

  return (
    <>
      {isSmall && open && (
        <div
          onClick={onClose}
          className="fixed inset-x-0 bottom-0 bg-black/40 z-40 md:hidden"
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
            <Link
              to="#"
              onClick={handleItemClick}
              className="text-m text-white cursor-pointer"
            >
              탈퇴하기
            </Link>
          </nav>
        </div>
      </aside>
    </>
  );
}
