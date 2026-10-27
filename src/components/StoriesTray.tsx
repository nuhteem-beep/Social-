import React, { useState, useEffect } from 'react';
import { Story, User } from '../types';
import { Plus, X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface StoriesTrayProps {
  stories: Story[];
  currentUser: User;
  onOpenStory: (story: Story, index?: number) => void;
  onAddStory: () => void;
}

export const StoriesTray: React.FC<StoriesTrayProps> = ({
  stories,
  currentUser,
  onOpenStory,
  onAddStory,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs mb-6 overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
        {/* Current user Add Story */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group" onClick={onAddStory}>
          <div className="relative">
            <div className="w-16 h-16 rounded-full p-0.5 border-2 border-dashed border-indigo-400 group-hover:border-indigo-600 transition-colors">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 group-hover:scale-110 transition-transform">
              <Plus className="w-3 h-3 stroke-[3]" />
            </span>
          </div>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[70px]">
            Your Story
          </span>
        </div>

        {/* Other users' stories */}
        {stories.map((story) => {
          const isCurrentUser = story.user.id === currentUser.id;
          if (isCurrentUser) return null;

          return (
            <button
              key={story.id}
              onClick={() => onOpenStory(story)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <div className="w-full h-full rounded-full p-0.5 bg-white dark:bg-slate-900">
                  <img
                    src={story.user.avatar}
                    alt={story.user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[70px]">
                {story.user.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface StoryViewerModalProps {
  story: Story;
  allStories: Story[];
  onClose: () => void;
  onNextStory: () => void;
  onPrevStory: () => void;
  onSendReply: (storyId: string, reply: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  onNextStory,
  onPrevStory,
  onSendReply,
}) => {
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);

  const currentItem = story.items[itemIndex] || story.items[0];
  const duration = currentItem?.durationMs || 5000;

  useEffect(() => {
    setProgress(0);
  }, [itemIndex, story.id]);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (itemIndex < story.items.length - 1) {
            setItemIndex((i) => i + 1);
            return 0;
          } else {
            onNextStory();
            return 0;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [itemIndex, story, duration, isPaused, onNextStory]);

  const handleHeartClick = () => {
    const id = Date.now();
    const x = Math.random() * 40 - 20;
    setFloatingHearts((prev) => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1500);
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendReply(story.id, replyText);
    setReplyText('');
    handleHeartClick();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm h-[88vh] max-h-[780px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between select-none">
        {/* Story Background Media */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${currentItem.mediaUrl})` }}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        {/* Top Header & Progress bars */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Progress segments */}
          <div className="flex items-center gap-1.5">
            {story.items.map((item, idx) => (
              <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width:
                      idx < itemIndex ? '100%' : idx === itemIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={story.user.avatar}
                alt={story.user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-white/40"
              />
              <div>
                <p className="text-sm font-semibold text-white drop-shadow-xs flex items-center gap-1">
                  {story.user.username}
                  {story.user.verified && (
                    <span className="text-indigo-400 text-xs">✓</span>
                  )}
                </p>
                <p className="text-[11px] text-white/75">{currentItem.timestamp}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 text-white/80 hover:text-white rounded-full bg-black/20"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Nav tap areas on left/right */}
        <div className="absolute inset-0 top-20 bottom-24 z-10 flex justify-between pointer-events-auto">
          <button
            onClick={() => {
              if (itemIndex > 0) setItemIndex((i) => i - 1);
              else onPrevStory();
            }}
            className="w-1/3 h-full opacity-0 hover:opacity-100 flex items-center justify-start pl-2 text-white/70 hover:text-white transition-opacity"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-8 h-8 drop-shadow" />
          </button>
          <button
            onClick={() => {
              if (itemIndex < story.items.length - 1) setItemIndex((i) => i + 1);
              else onNextStory();
            }}
            className="w-1/3 h-full opacity-0 hover:opacity-100 flex items-center justify-end pr-2 text-white/70 hover:text-white transition-opacity"
            aria-label="Next story"
          >
            <ChevronRight className="w-8 h-8 drop-shadow" />
          </button>
        </div>

        {/* Caption */}
        {currentItem.caption && (
          <div className="relative z-10 px-5 py-3 text-center">
            <p className="text-sm font-medium text-white drop-shadow-md bg-black/30 backdrop-blur-xs p-2.5 rounded-xl">
              {currentItem.caption}
            </p>
          </div>
        )}

        {/* Floating Hearts Animation */}
        <div className="absolute bottom-24 right-6 pointer-events-none z-20">
          {floatingHearts.map((heart) => (
            <div
              key={heart.id}
              className="absolute text-2xl animate-bounce"
              style={{
                transform: `translateX(${heart.x}px) translateY(-50px)`,
                transition: 'all 1s ease-out',
                opacity: 0.9,
              }}
            >
              💖
            </div>
          ))}
        </div>

        {/* Bottom Interactive Bar: Send Reply & Heart */}
        <div className="relative z-10 p-4 border-t border-white/10 bg-black/40 backdrop-blur-sm">
          <form onSubmit={handleSubmitReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to @${story.user.username}...`}
              className="flex-1 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2 text-white disabled:opacity-40 hover:text-indigo-300 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleHeartClick}
              className="p-2 text-rose-400 hover:text-rose-300 hover:scale-125 transition-all"
              title="Send Heart"
            >
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
