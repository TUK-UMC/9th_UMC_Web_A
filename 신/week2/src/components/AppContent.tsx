import Todo from "./Todo";
import { TodoProvider } from "../context/TodoContext";
import { useTheme, THEME } from "../context/ThemeProvider";
import Navbar from "./Navbar";
import clsx from "clsx";

export default function AppContent() {
  const { theme } = useTheme();
  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx(
        "min-h-screen transition-all",
        isLightMode ? "bg-white text-black" : "bg-gray-900 text-white"
      )}
    >
      <TodoProvider>
        <Navbar />
        <Todo />
      </TodoProvider>
    </div>
  );
}
