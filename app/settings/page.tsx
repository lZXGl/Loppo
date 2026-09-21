'use client';

import React from 'react';
import { Sun, Moon, Sparkles, Shield, Key, Bell, Check, Palette } from 'lucide-react';
import { useTheme, ACCENT_PALETTES } from '@/components/theme/ThemeProvider';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
  const { theme, setTheme, accent, setAccent } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    toast(newTheme === 'dark' ? '🌙 Dark theme enabled' : '☀️ Light theme enabled', 'info');
  };

  const handleAccentChange = (id: string, label: string) => {
    setAccent(id);
    toast(`✨ Accent color updated: ${label}`, 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-ink">Settings & Preferences</h1>
        <p className="text-xs text-ink-subtle mt-1">
          Customize your interface theme, ambient page tint, and account security.
        </p>
      </div>

      {/* 1. Appearance & Theme Mode */}
      <section className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
          <Palette className="w-4 h-4 text-primary" />
          <span>Interface Appearance</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Dark Mode Option */}
          <button
            onClick={() => handleThemeChange('dark')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'dark'
                ? 'border-primary bg-surface-2 ring-1 ring-primary shadow-sm'
                : 'border-hairline bg-surface-1 hover:border-hairline-strong'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#010102] border border-[#23252a] flex items-center justify-center text-white">
              <Moon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Dark Mode</span>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
              <p className="text-[11px] text-ink-subtle mt-1">
                Linear obsidian canvas with hairline borders. Comfortable for extended reading.
              </p>
            </div>
          </button>

          {/* Light Mode Option */}
          <button
            onClick={() => handleThemeChange('light')}
            className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
              theme === 'light'
                ? 'border-primary bg-surface-2 ring-1 ring-primary shadow-sm'
                : 'border-hairline bg-surface-1 hover:border-hairline-strong'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-[#e2e8f0] flex items-center justify-center text-slate-800">
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-ink">Light Mode</span>
                {theme === 'light' && <Check className="w-3.5 h-3.5 text-primary" />}
              </div>
              <p className="text-[11px] text-ink-subtle mt-1">
                Crisp high-contrast white canvas with slate text and subtle hairlines.
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 2. Dynamic Ambient Accent Tint Engine */}
      <section className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Ambient Page Accent Tint</span>
          </div>
          <span className="text-[11px] font-mono text-primary font-semibold">
            {accent.label}
          </span>
        </div>
        <p className="text-xs text-ink-subtle">
          Select an accent palette. It dynamically shifts your interactive highlights, button states, and ambient radial glow in real-time.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {ACCENT_PALETTES.map((p) => {
            const isSelected = accent.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleAccentChange(p.id, p.label)}
                className={`p-3 rounded-xl border text-center flex flex-col items-center gap-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-surface-2 ring-1 ring-primary shadow-sm'
                    : 'border-hairline bg-surface-1 hover:border-hairline-strong'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center text-white"
                  style={{ backgroundColor: p.color }}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] font-medium text-ink">{p.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Account Security & 2FA */}
      <section className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security & Authentication</span>
        </div>

        <div className="divide-y divide-hairline">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-ink">Two-Factor Authentication (TOTP)</div>
              <div className="text-[11px] text-ink-subtle">
                Secure your account with Google Authenticator or 1Password.
              </div>
            </div>
            <button
              onClick={() => toast('🔑 2FA setup modal opened', 'info')}
              className="px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 hover:bg-surface-3 text-xs font-medium text-ink transition-colors"
            >
              Configure 2FA
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-ink">Supabase Auth Session</div>
              <div className="text-[11px] text-ink-subtle">
                Manage your active session tokens and connected OAuth providers.
              </div>
            </div>
            <button
              onClick={() => toast('Session refreshed', 'success')}
              className="px-3 py-1.5 rounded-lg border border-hairline bg-surface-2 hover:bg-surface-3 text-xs font-medium text-ink transition-colors"
            >
              Check Status
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
