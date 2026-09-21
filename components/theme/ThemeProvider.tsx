'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

export interface AccentOption {
  id: string;
  label: string;
  color: string;
  hover: string;
  glow: string;
}

export const ACCENT_PALETTES: AccentOption[] = [
  {
    id: 'lavender',
    label: 'Linear Lavender',
    color: '#5e6ad2',
    hover: '#828fff',
    glow: 'rgba(94, 106, 210, 0.24)',
  },
  {
    id: 'violet',
    label: 'Cyber Violet',
    color: '#8b5cf6',
    hover: '#a78bfa',
    glow: 'rgba(139, 92, 246, 0.24)',
  },
  {
    id: 'cyan',
    label: 'Electric Cyan',
    color: '#06b6d4',
    hover: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.24)',
  },
  {
    id: 'emerald',
    label: 'Terminal Emerald',
    color: '#10b981',
    hover: '#34d399',
    glow: 'rgba(16, 185, 129, 0.24)',
  },
  {
    id: 'amber',
    label: 'Solar Amber',
    color: '#f59e0b',
    hover: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.24)',
  },
];

interface ThemeContextType {
  theme: Theme;
  accent: AccentOption;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setAccent: (accentId: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  accent: ACCENT_PALETTES[0],
  setTheme: () => {},
  toggleTheme: () => {},
  setAccent: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [accent, setAccentState] = useState<AccentOption>(ACCENT_PALETTES[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Read stored preferences
    const savedTheme = (localStorage.getItem('loppoTheme') || 'dark') as Theme;
    const savedAccentId = localStorage.getItem('loppoAccentId') || 'lavender';
    const foundAccent = ACCENT_PALETTES.find((a) => a.id === savedAccentId) || ACCENT_PALETTES[0];

    setThemeState(savedTheme);
    setAccentState(foundAccent);
    applyThemeToDOM(savedTheme, foundAccent);
    setMounted(true);
  }, []);

  function applyThemeToDOM(t: Theme, a: AccentOption) {
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.classList.toggle('dark', t === 'dark');
    root.classList.toggle('dark-mode', t === 'dark');

    // Apply active accent tokens & ambient glow
    root.style.setProperty('--accent-color', a.color);
    root.style.setProperty('--accent-hover', a.hover);
    root.style.setProperty('--accent-glow', a.glow);
    root.style.setProperty(
      '--accent-subtle',
      a.glow.replace('0.24', t === 'dark' ? '0.12' : '0.06')
    );
  }

  function setTheme(newTheme: Theme) {
    const root = document.documentElement;
    root.classList.add('theme-transitioning');
    setThemeState(newTheme);
    localStorage.setItem('loppoTheme', newTheme);
    applyThemeToDOM(newTheme, accent);

    setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 300);
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  function setAccent(accentId: string) {
    const found = ACCENT_PALETTES.find((a) => a.id === accentId) || ACCENT_PALETTES[0];
    setAccentState(found);
    localStorage.setItem('loppoAccentId', found.id);
    applyThemeToDOM(theme, found);
  }

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
