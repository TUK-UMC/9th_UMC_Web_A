import clsx from "clsx";
import { useTheme } from "../context/ThemeProvider";
import { THEME } from "../types/theme.types";

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "p-4 h-dvh w-full",
        isLightMode ? "bg-white" : "bg-gray-800"
      )}
    >
      <h1
        className={clsx(
          "text-xl font-bold",
          isLightMode ? "text-black" : "text-white"
        )}
      >
        Theme Title
      </h1>
      <p className={clsx("mt-2", isLightMode ? "text-black" : "text-white")}>
        Theme Main Text
      </p>
    </div>
  );
}
