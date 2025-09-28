import type { PropsWithChildren } from "react";
import { useState } from "react";
import { THEME, type Theme } from "../types/theme.types";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<Theme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEME.LIGHT ? THEME.DARK : THEME.LIGHT));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
