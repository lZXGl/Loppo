'use client';

import React from 'react';

export function SkeletonFeed() {
  return (
    <div className="space-y-4 w-full" aria-label="Loading feed...">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-hairline bg-surface-1 p-5 space-y-4 shadow-sm"
        >
          {/* Header Row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full linear-shimmer flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3.5 w-1/3 rounded-sm linear-shimmer" />
              <div className="h-2.5 w-1/5 rounded-sm linear-shimmer" />
            </div>
          </div>

          {/* Body Lines */}
          <div className="space-y-2">
            <div className="h-3 w-11/12 rounded-sm linear-shimmer" />
            <div className="h-3 w-4/5 rounded-sm linear-shimmer" />
            <div className="h-3 w-2/3 rounded-sm linear-shimmer" />
          </div>

          {/* Media Placeholder on first card */}
          {i === 1 && (
            <div className="h-56 w-full rounded-lg linear-shimmer" />
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-7 w-16 rounded-full linear-shimmer" />
            <div className="h-7 w-16 rounded-full linear-shimmer" />
            <div className="h-7 w-16 rounded-full linear-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
