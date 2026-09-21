'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Sun, Moon, Bell, Sparkles } from 'lucide-react';
import { useTheme, ACCENT_PALETTES } from '@/components/theme/ThemeProvider';
import { useToast } from '@/components/ui/Toast';

export function Header() {
  const { theme, toggleTheme, accent, setAccent } = useTheme();
  const { toast } = useToast();

  const handleThemeToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    toggleTheme();
    toast(next === 'dark' ? '🌙 Dark theme enabled' : '☀️ Light theme enabled', 'info');
  };

  const handleAccentChange = (id: string, label: string) => {
    setAccent(id);
    toast(`✨ Accent palette: ${label}`, 'info');
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-hairline bg-surface-1/80 backdrop-blur-md transition-colors">
      <div className="w-full px-6 h-full flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              L
            </div>
            <span className="font-semibold text-lg tracking-tight text-ink">Loppo</span>
          </Link>

          {/* Linear Search Bar with Shortcut */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search posts, topics, creators..."
              className="w-80 h-9 pl-9 pr-12 text-xs rounded-full bg-surface-2 border border-hairline text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
            <kbd className="absolute right-3 text-[10px] font-mono px-1.5 py-0.5 rounded border border-hairline-strong text-ink-subtle bg-surface-3">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Dynamic Ambient Accent Picker */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-hairline bg-surface-2"
            title="Change ambient accent tint"
          >
            <Sparkles className="w-3.5 h-3.5 text-ink-subtle mr-1" />
            {ACCENT_PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleAccentChange(p.id, p.label)}
                aria-label={`Select ${p.label}`}
                className={`w-3.5 h-3.5 rounded-full transition-transform ${
                  accent.id === p.id
                    ? 'ring-2 ring-offset-2 ring-primary scale-110 ring-offset-surface-2'
                    : 'opacity-70 hover:opacity-100 hover:scale-110'
                }`}
                style={{ backgroundColor: p.color }}
              />
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={handleThemeToggle}
            aria-label="Toggle theme mode"
            className="w-9 h-9 rounded-lg border border-hairline bg-surface-2 flex items-center justify-center text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="w-9 h-9 rounded-lg border border-hairline bg-surface-2 flex items-center justify-center text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Log In CTA */}
          <Link
            href="/login"
            className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center justify-center transition-all shadow-sm"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
