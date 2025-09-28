import { createContext } from "react";
import type { Theme } from "../types/theme.types";

export interface IThemeContext {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);
