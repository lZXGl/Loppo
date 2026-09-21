'use client';

import React, { useState } from 'react';
import { Search, Users, Hash, Compass, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const CREATORS = [
  { id: '1', name: 'Zeyad Ashraf', username: 'ZXG', role: 'Full-Stack Architect', karma: 420 },
  { id: '2', name: 'Sophia Chen', username: 'sophia', role: 'Design Systems Lead', karma: 310 },
  { id: '3', name: 'Marcus Vance', username: 'marcus', role: 'Database Engineer', karma: 280 },
  { id: '4', name: 'Elena Rostova', username: 'elena', role: 'Security Researcher', karma: 195 },
];

const CATEGORIES = [
  { name: 'Engineering', count: '1.4k posts', icon: '💻' },
  { name: 'Design Craft', count: '890 posts', icon: '🎨' },
  { name: 'Database & Supabase', count: '670 posts', icon: '🗄️' },
  { name: 'Artificial Intelligence', count: '1.2k posts', icon: '🤖' },
  { name: 'Showcase', count: '450 posts', icon: '🚀' },
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');

  const filteredCreators = CREATORS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-ink">Explore & Discover</h1>
        <p className="text-xs text-ink-subtle mt-1">
          Find trending community categories, top creators, and architectural discussions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-ink-subtle absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter creators, topics, or hashtags..."
          className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-surface-1 border border-hairline text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
        />
      </div>

      {/* Categories Grid */}
      <div>
        <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-primary" />
          <span>Featured Topics</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="p-4 rounded-xl border border-hairline bg-surface-1 hover:border-hairline-strong transition-all cursor-pointer group"
            >
              <div className="text-xl mb-2">{cat.icon}</div>
              <div className="text-xs font-semibold text-ink group-hover:text-primary transition-colors">
                {cat.name}
              </div>
              <div className="text-[11px] text-ink-subtle">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Creators List */}
      <div>
        <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          <span>Community Creators</span>
        </div>
        <div className="rounded-xl border border-hairline bg-surface-1 divide-y divide-hairline overflow-hidden shadow-sm">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="p-4 flex items-center justify-between hover:bg-surface-2/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-hairline flex items-center justify-center text-primary font-bold text-xs uppercase">
                  {creator.name.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-semibold text-ink">{creator.name}</div>
                  <div className="text-[11px] text-ink-subtle">
                    @{creator.username} • {creator.role}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-ink-subtle">{creator.karma} karma</span>
                <button className="px-3 py-1 rounded-md bg-surface-2 hover:bg-surface-3 border border-hairline text-xs font-medium text-ink transition-colors">
                  Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
