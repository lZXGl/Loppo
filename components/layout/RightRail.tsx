'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Award, ExternalLink, Sparkles } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: '#NextJS15', posts: '2.4k discussions', change: '+18%' },
  { tag: '#SupabaseRLS', posts: '1.8k discussions', change: '+24%' },
  { tag: '#LinearDesign', posts: '940 discussions', change: '+9%' },
  { tag: '#TailwindV4', posts: '810 discussions', change: '+14%' },
  { tag: '#TypeScript', posts: '620 discussions', change: '+5%' },
];

export function RightRail() {
  return (
    <aside className="w-80 flex-shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] flex flex-col gap-5 select-none hidden lg:flex">
      {/* Community Spotlight Banner */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-ink uppercase tracking-wider">
            Loppo Next.js Overhaul
          </span>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed">
          Rebuilt with Linear design tokens, dynamic ambient page tinting, and zero-FOUC dual themes.
        </p>
        <div className="mt-3 flex items-center justify-between pt-3 border-t border-hairline text-xs font-medium">
          <span className="text-ink-subtle">Engine</span>
          <span className="text-primary font-mono">Next.js 15 App Router</span>
        </div>
      </div>

      {/* Trending Topics Panel */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 shadow-sm flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>Trending Topics</span>
          </div>
          <span className="text-[10px] text-ink-subtle font-mono">Live</span>
        </div>

        <div className="space-y-3">
          {TRENDING_TOPICS.map((topic) => (
            <Link
              key={topic.tag}
              href={`/explore?q=${encodeURIComponent(topic.tag)}`}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-surface-2 transition-all border border-transparent hover:border-hairline"
            >
              <div>
                <div className="text-xs font-medium text-ink group-hover:text-primary transition-colors">
                  {topic.tag}
                </div>
                <div className="text-[11px] text-ink-subtle">{topic.posts}</div>
              </div>
              <span className="text-[10px] font-mono font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {topic.change}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
