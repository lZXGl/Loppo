'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Flame,
  Compass,
  Newspaper,
  User,
  MessageSquare,
  Users,
  Settings,
  Info,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Feed', href: '/', icon: Home },
  { label: 'Popular', href: '/popular', icon: Flame },
  { label: 'Explore', href: '/explore', icon: Compass },
  { label: 'News', href: '/news', icon: Newspaper },
];

const SECONDARY_ITEMS = [
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'Messages', href: '/chat', icon: MessageSquare },
  { label: 'Friends', href: '/friends', icon: Users },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const FOOTER_LINKS = [
  { label: 'About', href: '/about', icon: Info },
  { label: 'Rules', href: '/rules', icon: ShieldCheck },
  { label: 'Privacy', href: '/privacy', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Core Nav */}
        <div>
          <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider px-3 mb-2">
            Platform
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-surface-2 text-ink border border-hairline font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-1'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-primary' : 'text-ink-subtle'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Community & Personal */}
        <div>
          <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider px-3 mb-2">
            Personal
          </div>
          <nav className="space-y-1">
            {SECONDARY_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-surface-2 text-ink border border-hairline font-semibold shadow-xs'
                      : 'text-ink-muted hover:text-ink hover:bg-surface-1'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-primary' : 'text-ink-subtle'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Resources */}
      <div className="pt-4 border-t border-hairline">
        <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 text-[11px] text-ink-subtle">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="px-3 mt-2 text-[10px] text-ink-tertiary">
          © 2026 Loppo Inc. Software Craft.
        </p>
      </div>
    </aside>
  );
}
