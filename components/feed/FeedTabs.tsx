'use client';

import React from 'react';
import { Flame, Clock, Trophy, Image as ImageIcon, Bookmark } from 'lucide-react';

export type SortMode = 'hot' | 'latest' | 'top' | 'media' | 'saved';

interface FeedTabsProps {
  activeTab: SortMode;
  onTabChange: (tab: SortMode) => void;
  count: number;
}

export function FeedTabs({ activeTab, onTabChange, count }: FeedTabsProps) {
  const TABS: { id: SortMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'hot', label: 'Hot', icon: Flame },
    { id: 'latest', label: 'Latest', icon: Clock },
    { id: 'top', label: 'Top Liked', icon: Trophy },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'saved', label: 'Saved', icon: Bookmark },
  ];

  return (
    <div className="flex items-center justify-between border-b border-hairline pb-3 mb-4 select-none">
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-surface-1 border border-hairline">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-surface-2 text-ink border border-hairline shadow-xs font-semibold'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-2/60'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  isActive ? 'text-primary' : 'text-ink-subtle'
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      <div className="text-xs font-mono text-ink-subtle">
        {count} {count === 1 ? 'discussion' : 'discussions'}
      </div>
    </div>
  );
}
