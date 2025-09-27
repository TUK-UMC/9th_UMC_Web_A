import { createContext, useContext, useState } from "react";

export enum THEME {
  LIGHT = "light",
  DARK = "dark",
}

type TTheme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: THEME.LIGHT | THEME.DARK;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
