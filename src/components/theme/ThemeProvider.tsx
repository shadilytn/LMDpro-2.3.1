import React from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "app-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = (localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("theme")) as Theme | null;
        if (saved === "light" || saved === "dark") return saved;
        // Check documentElement class initialized by head script
        if (document.documentElement.classList.contains("light-mode")) {
          return "light";
        }
      } catch (e) {
        console.warn("Could not read theme from localStorage", e);
      }
    }
    return "dark";
  });

  const applyThemeToDOM = React.useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const body = document.body;
    
    if (newTheme === "light") {
      root.classList.add("light-mode");
      root.setAttribute("data-theme", "light");
      if (body) {
        body.classList.add("light-mode");
        body.setAttribute("data-theme", "light");
      }
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#f8fafc");
    } else {
      root.classList.remove("light-mode");
      root.setAttribute("data-theme", "dark");
      if (body) {
        body.classList.remove("light-mode");
        body.setAttribute("data-theme", "dark");
      }
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) metaTheme.setAttribute("content", "#071319");
    }
  }, []);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      localStorage.setItem("theme", newTheme); // backward compat
    } catch (e) {
      console.warn("Could not save theme to localStorage", e);
    }
    applyThemeToDOM(newTheme);
  }, [applyThemeToDOM]);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        localStorage.setItem("theme", nextTheme);
      } catch (e) {
        console.warn("Could not save theme to localStorage", e);
      }
      applyThemeToDOM(nextTheme);
      return nextTheme;
    });
  }, [applyThemeToDOM]);

  // Initial and reactive DOM synchronization
  React.useEffect(() => {
    applyThemeToDOM(theme);

    // Cross-tab storage listener
    const handleStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === "theme") {
        const next = event.newValue as Theme | null;
        if (next === "light" || next === "dark") {
          setThemeState(next);
          applyThemeToDOM(next);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [theme, applyThemeToDOM]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === "dark",
        isLight: theme === "light",
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

