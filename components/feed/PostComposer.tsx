'use client';

import React, { useState } from 'react';
import { Image, Video, BarChart2, Send, X } from 'lucide-react';
import { Post } from '@/types/database';
import { useToast } from '@/components/ui/Toast';

interface PostComposerProps {
  onPostCreated: (post: Post) => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !imageUrl.trim()) {
      toast('Please write something or attach media', 'error');
      return;
    }

    setSubmitting(true);

    const newPost: Post = {
      id: Date.now().toString(),
      user_id: 'current-user',
      author: 'Zeyad Ashraf',
      author_avatar: '/assets/default-avatar.svg',
      text: text.trim(),
      image_url: imageUrl.trim() || null,
      video_url: null,
      category: 'General',
      tags: ['Discussion'],
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      is_saved: false,
      created_at: new Date().toISOString(),
      poll: showPollBuilder && pollQuestion.trim()
        ? {
            question: pollQuestion.trim(),
            options: pollOptions.filter(Boolean).map((opt) => ({ text: opt, votes: 0 })),
            total_votes: 0,
          }
        : null,
    };

    onPostCreated(newPost);
    setText('');
    setImageUrl('');
    setShowImageInput(false);
    setShowPollBuilder(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setSubmitting(false);
    toast('🚀 Discussion published successfully!', 'success');
  };

  return (
    <form
      onSubmit={handlePublish}
      className="rounded-xl border border-hairline bg-surface-1 p-4 shadow-sm mb-6 transition-all focus-within:border-primary/60"
    >
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold text-xs flex-shrink-0">
          U
        </div>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start a community discussion, share a thought, or ask a question..."
            rows={2}
            className="w-full bg-transparent text-sm text-ink placeholder:text-ink-subtle resize-none focus:outline-none leading-relaxed"
          />

          {showImageInput && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1 h-8 px-3 rounded-lg bg-surface-2 border border-hairline text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => {
                  setShowImageInput(false);
                  setImageUrl('');
                }}
                className="text-ink-subtle hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {showPollBuilder && (
            <div className="mt-3 p-3 rounded-lg border border-hairline bg-surface-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-ink">
                <span>Poll Builder</span>
                <button
                  type="button"
                  onClick={() => setShowPollBuilder(false)}
                  className="text-ink-subtle hover:text-ink"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Poll question..."
                className="w-full h-8 px-3 rounded bg-surface-1 border border-hairline text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary"
              />
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[idx] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full h-7 px-3 rounded bg-surface-1 border border-hairline text-xs text-ink placeholder:text-ink-subtle focus:outline-none focus:border-primary"
                />
              ))}
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-hairline flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
              >
                <Image className="w-3.5 h-3.5 text-primary" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPollBuilder(!showPollBuilder)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors"
              >
                <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Poll</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Publish'}</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
