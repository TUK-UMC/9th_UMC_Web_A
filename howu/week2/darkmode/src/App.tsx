import { useState } from "react";
import { DarkModeProvider, useDarkMode } from "./contexts/DarkModeContext";
import DarkModeToggle from "./components/DarkModeToggle";
import clsx from "clsx";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function AppContent() {
  const [count, setCount] = useState(0);
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={clsx(
        "min-h-screen transition-all duration-500",
        isDarkMode
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-100"
      )}
    >
      {/* 헤더 */}
      <header className="flex justify-between items-center p-6">
        <h1
          className={clsx(
            "text-3xl font-bold",
            isDarkMode ? "text-white" : "text-gray-800"
          )}
        >
          Dark Mode Demo
        </h1>
        <DarkModeToggle />
      </header>

      {/* 현재 모드 표시 */}
      <div
        className={clsx(
          "rounded-xl p-4 shadow-lg transition-all duration-300",
          isDarkMode
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        )}
      >
        <p className={clsx(isDarkMode ? "text-gray-300" : "text-gray-600")}>
          현재 모드:
          <span
            className={clsx(
              "ml-2 font-semibold",
              isDarkMode ? "text-blue-400" : "text-yellow-500"
            )}
          >
            {isDarkMode ? "🌙 다크 모드" : "☀️ 라이트 모드"}
          </span>
        </p>
      </div>

      {/* 설명 텍스트 */}
      <p
        className={clsx(
          "max-w-2xl",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}
      >
        Click on the Vite and React logos to learn more.
        <br />
        우측 상단의 토글 버튼을 클릭하여 다크모드를 전환해보세요!
      </p>
    </div>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
