"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import styles from "./styles.module.scss";

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    const themes = ["system", "light", "dark"];
    const currentTheme = theme || "system";
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const themeNames: { [key: string]: string } = {
    system: "Sistem",
    light: "Luminos",
    dark: "Întunecat",
  };

  if (!mounted) {
    return null;
  }

  const currentTheme = theme || "system";

  return (
    <div className={styles.themeToggleWrapper}>
      <button
        className={styles.themeButton}
        onClick={cycleTheme}
        aria-label={`Switch theme (current: ${themeNames[currentTheme]})`}
      >
        {currentTheme === "system" && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V13C20 14.1046 19.1046 15 18 15H6C4.89543 15 4 14.1046 4 13V6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 19H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15V19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {currentTheme === "light" && (
          <img
            src={"/icons/sun.svg"}
            alt={"sun"}
            height={20}
            width={20}
            draggable={false}
          />
        )}
        {currentTheme === "dark" && (
          <img
            src={"/icons/luna.svg"}
            alt={"moon"}
            height={20}
            width={20}
            draggable={false}
          />
        )}
      </button>
      <div className={styles.tooltip}>{themeNames[currentTheme]}</div>
    </div>
  );
};

export default ThemeToggle;
