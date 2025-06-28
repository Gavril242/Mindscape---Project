
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ColorTheme = "green" | "blue" | "purple" | "orange" | "teal";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColor?: ColorTheme;
};

type ThemeProviderState = {
  theme: Theme;
  colorTheme: ColorTheme;
  setTheme: (theme: Theme) => void;
  setColorTheme: (color: ColorTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "green",
  setTheme: () => null,
  setColorTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColor = "green",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("ui-theme") as Theme) || defaultTheme
  );
  
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (localStorage.getItem("ui-color-theme") as ColorTheme) || defaultColor
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-green", "theme-blue", "theme-purple", "theme-orange", "theme-teal");
    if (colorTheme !== "green") {
      root.classList.add(`theme-${colorTheme}`);
    }
    localStorage.setItem("ui-color-theme", colorTheme);
  }, [colorTheme]);

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("ui-theme", theme);
      setTheme(theme);
    },
    setColorTheme: (color: ColorTheme) => {
      setColorTheme(color);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
