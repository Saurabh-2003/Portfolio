"use client";

import * as React from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";

interface CustomThemeProviderProps {
  children: React.ReactNode;
  attribute?: "class" | "data-theme" | "data-mode";
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
  themes?: string[];
}

export function ThemeProvider({
  children,
  ...props
}: CustomThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={true}
      storageKey="portfolio-theme"
      themes={["light", "dark"]}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// Theme toggle hook
export function useTheme() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useNextTheme();

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
  };
}

// Theme configuration context
interface ThemeConfig {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeConfigContext = React.createContext<ThemeConfig | undefined>(
  undefined,
);

export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accentColor, setAccentColor] = React.useState<string>("#000000");

  // Load accent color from localStorage on mount
  React.useEffect(() => {
    const savedAccentColor = localStorage.getItem("portfolio-accent-color");
    if (savedAccentColor) {
      setAccentColor(savedAccentColor);
    }
  }, []);

  // Update CSS custom property when accent color changes
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", accentColor);
    localStorage.setItem("portfolio-accent-color", accentColor);
  }, [accentColor]);

  const value = React.useMemo(
    () => ({
      accentColor,
      setAccentColor,
    }),
    [accentColor],
  );

  return (
    <ThemeConfigContext.Provider value={value}>
      {children}
    </ThemeConfigContext.Provider>
  );
}

export function useThemeConfig() {
  const context = React.useContext(ThemeConfigContext);
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeConfigProvider");
  }
  return context;
}

// Combined theme providers
export function CombinedThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <ThemeConfigProvider>{children}</ThemeConfigProvider>
    </ThemeProvider>
  );
}
