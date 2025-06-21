"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  className,
  variant = "outline",
  size = "icon",
}: ThemeToggleProps) {
  const { toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`${className} relative overflow-hidden transition-all hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/50`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          scale: [0.7, 1.2, 1],
          rotate: isDark ? 360 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "backOut",
        }}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-500" />
        )}
      </motion.div>
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
}

// Alternative theme toggle with text
export function ThemeToggleWithText({
  className,
  variant = "outline",
}: Omit<ThemeToggleProps, "size">) {
  const { toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant={variant} className={className} disabled>
        <Sun className="mr-2 h-4 w-4" />
        Light
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={toggleTheme}
      className={`${className} transition-all hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-primary/50`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        className="mr-2"
        initial={false}
        animate={{
          scale: [0.7, 1.2, 1],
          rotate: isDark ? 360 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "backOut",
        }}
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-yellow-500" />
        ) : (
          <Moon className="h-4 w-4 text-blue-500" />
        )}
      </motion.div>
      <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
    </Button>
  );
}

// Theme toggle for mobile menu
export function MobileThemeToggle() {
  const { toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
        disabled
      >
        <Sun className="mr-3 h-4 w-4" />
        Toggle theme
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="flex items-center">
        <motion.div
          className="mr-3"
          initial={false}
          animate={{
            scale: [0.7, 1.2, 1],
            rotate: isDark ? 360 : 0,
          }}
          transition={{
            duration: 0.4,
            ease: "backOut",
          }}
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-blue-500" />
          )}
        </motion.div>
        <span className="font-medium">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </div>
      <div
        className={`w-9 h-5 rounded-full p-1 transition-colors duration-300 ${isDark ? "bg-blue-800" : "bg-yellow-300"}`}
      >
        <div
          className={`w-3 h-3 rounded-full transition-transform duration-300 ${isDark ? "bg-white translate-x-4" : "bg-white translate-x-0"}`}
        ></div>
      </div>
    </button>
  );
}
