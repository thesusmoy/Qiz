'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/stores/theme-store';

export function ThemeProvider({ children }) {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const storedTheme = localStorage.getItem('theme-storage');
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        if (
          parsedTheme.state?.theme &&
          ['light', 'dark'].includes(parsedTheme.state.theme)
        ) {
          setTheme(parsedTheme.state.theme);
        }
      }
    } catch (e) {
      console.error('Error reading theme from storage', e);
    }
  }, [setTheme]);

  // Apply theme class to document root
  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Store in localStorage directly as backup
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Prevent hydration issues - render children only after mounted
  if (!mounted) {
    return null; // Return nothing on first render
  }

  return children;
}
