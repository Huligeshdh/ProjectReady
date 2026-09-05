import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  // Legacy compatibility props
  theme: ResolvedTheme;
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'projectready-theme';

const defaultContext: ThemeContextType = {
  mode: 'system',
  resolvedTheme: 'dark',
  setMode: () => {},
  toggleTheme: () => {},
  theme: 'dark',
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode;
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (typeof window === 'undefined') return 'dark';
    if (mode === 'light') return 'light';
    if (mode === 'dark') return 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const computeResolvedTheme = (currentMode: ThemeMode): ResolvedTheme => {
      if (currentMode === 'light') return 'light';
      if (currentMode === 'dark') return 'dark';
      return mediaQuery.matches ? 'dark' : 'light';
    };

    const updateDOM = (resTheme: ResolvedTheme) => {
      const root = document.documentElement;
      if (resTheme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
      }
    };

    const initialResolved = computeResolvedTheme(mode);
    setResolvedTheme(initialResolved);
    updateDOM(initialResolved);

    // Save preference in localStorage under projectready-theme
    try {
      localStorage.setItem(STORAGE_KEY, mode);
      localStorage.removeItem('app_theme'); // Cleanup legacy key
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (mode === 'system') {
        const newRes = e.matches ? 'dark' : 'light';
        setResolvedTheme(newRes);
        updateDOM(newRes);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
    } else {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  const toggleTheme = () => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme,
        setMode,
        toggleTheme,
        theme: resolvedTheme,
        setTheme: setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext) || defaultContext;
};

