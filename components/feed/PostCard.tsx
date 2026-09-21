'use client';

import React, { useState } from 'react';
import { Heart, MessageSquare, Bookmark, Share2, Tag, Check, BarChart2 } from 'lucide-react';
import { Post } from '@/types/database';
import { useToast } from '@/components/ui/Toast';

interface PostCardProps {
  post: Post;
  onLikeToggle: (id: string) => void;
  onSaveToggle: (id: string) => void;
}

export function PostCard({ post, onLikeToggle, onSaveToggle }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; author: string; text: string }[]>([]);
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const { toast } = useToast();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      toast('🔗 Post link copied to clipboard!', 'success');
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), author: 'You', text: commentText.trim() },
    ]);
    setCommentText('');
    toast('💬 Reply added!', 'success');
  };

  return (
    <article className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4 transition-all hover:border-hairline-strong">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-hairline flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt={post.author} className="w-full h-full object-cover" />
            ) : (
              post.author.slice(0, 2)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-ink">{post.author}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-hairline bg-surface-2 text-ink-subtle font-mono">
                {post.category}
              </span>
            </div>
            <div className="text-[11px] text-ink-subtle">
              {new Date(post.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Post Text */}
      <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{post.text}</p>

      {/* Media Attachment */}
      {post.image_url && (
        <div className="rounded-lg overflow-hidden border border-hairline bg-surface-2">
          <img
            src={post.image_url}
            alt="Attachment"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Interactive Poll */}
      {post.poll && (
        <div className="p-3.5 rounded-lg border border-hairline bg-surface-2 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <BarChart2 className="w-3.5 h-3.5 text-primary" />
            <span>{post.poll.question}</span>
          </div>
          <div className="space-y-1.5">
            {post.poll.options.map((opt, idx) => {
              const isSelected = pollVoted === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setPollVoted(idx);
                    toast(`Voted: "${opt.text}"`, 'success');
                  }}
                  className={`w-full p-2 rounded-md text-xs font-medium flex items-center justify-between border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-hairline bg-surface-1 text-ink hover:border-hairline-strong'
                  }`}
                >
                  <span>{opt.text}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-mono text-ink-subtle hover:text-primary transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-hairline select-none text-xs text-ink-muted">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 transition-colors ${
              post.is_liked ? 'text-rose-500 font-semibold' : 'hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.is_liked ? 'fill-rose-500' : ''}`} />
            <span>{post.likes_count}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments_count + comments.length}</span>
          </button>

          <button
            onClick={() => onSaveToggle(post.id)}
            className={`flex items-center gap-1.5 transition-colors ${
              post.is_saved ? 'text-amber-500 font-semibold' : 'hover:text-amber-400'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${post.is_saved ? 'fill-amber-500' : ''}`} />
            <span>{post.is_saved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 hover:text-ink transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="pt-3 border-t border-hairline space-y-3">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a constructive reply..."
              className="flex-1 h-8 px-3 rounded-lg bg-surface-2 border border-hairline text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="h-8 px-3 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
            >
              Reply
            </button>
          </form>

          {comments.map((c) => (
            <div key={c.id} className="p-2.5 rounded-lg bg-surface-2 border border-hairline text-xs space-y-1">
              <div className="font-semibold text-ink">{c.author}</div>
              <div className="text-ink-muted">{c.text}</div>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
