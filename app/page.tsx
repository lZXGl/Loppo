'use client';

import React, { useState, useEffect } from 'react';
import { PostComposer } from '@/components/feed/PostComposer';
import { FeedTabs, SortMode } from '@/components/feed/FeedTabs';
import { PostCard } from '@/components/feed/PostCard';
import { SkeletonFeed } from '@/components/feed/SkeletonFeed';
import { INITIAL_POSTS } from '@/lib/mockData';
import { Post } from '@/types/database';
import { useToast } from '@/components/ui/Toast';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortMode, setSortMode] = useState<SortMode>('hot');
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch with short delay to demonstrate skeleton pulse
    const timer = setTimeout(() => {
      setPosts(INITIAL_POSTS);
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikeToggle = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const is_liked = !p.is_liked;
          const likes_count = is_liked ? p.likes_count + 1 : p.likes_count - 1;
          return { ...p, is_liked, likes_count };
        }
        return p;
      })
    );
  };

  const handleSaveToggle = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const is_saved = !p.is_saved;
          toast(is_saved ? '🔖 Added to bookmarks' : 'Removed from bookmarks', 'info');
          return { ...p, is_saved };
        }
        return p;
      })
    );
  };

  // Filter & Sort
  const filteredPosts = posts.filter((p) => {
    if (sortMode === 'media') return Boolean(p.image_url || p.video_url);
    if (sortMode === 'saved') return Boolean(p.is_saved);
    return true;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Post Composer Card */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Filter Tabs */}
      <FeedTabs
        activeTab={sortMode}
        onTabChange={setSortMode}
        count={filteredPosts.length}
      />

      {/* Feed List or Skeleton */}
      {loading ? (
        <SkeletonFeed />
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-surface-1 p-12 text-center space-y-2">
          <div className="text-3xl">💬</div>
          <div className="text-sm font-semibold text-ink">No discussions found</div>
          <p className="text-xs text-ink-subtle">
            Be the first to publish a post or select a different filter tab!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeToggle={handleLikeToggle}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
