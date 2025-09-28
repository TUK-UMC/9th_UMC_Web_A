import { useContext } from "react";
import { ThemeContext, type IThemeContext } from "../context/ThemeContext";

export const useTheme = (): IThemeContext => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
