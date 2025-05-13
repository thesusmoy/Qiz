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

  useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return children;
}
