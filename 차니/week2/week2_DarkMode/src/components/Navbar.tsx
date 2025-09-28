import clsx from "clsx";
import { useTheme } from "../hooks/useTheme";
import ThemeToggleButton from "./ThemeToggleButton";
import { THEME } from "../types/theme.types";

export default function Navbar() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav
      className={clsx(
        "p-4 w-full flex justify-end",
        isLightMode ? "bg-white" : "bg-gray-800"
      )}
    >
      <ThemeToggleButton />
    </nav>
  );
}
