import React, { useState, useEffect } from 'react';
import { Reel, User } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Send,
  X,
} from 'lucide-react';

interface ReelsViewProps {
  reels: Reel[];
  currentUser: User;
  onLikeReel: (reelId: string) => void;
  onSaveReel: (reelId: string) => void;
  onAddComment: (reelId: string, text: string) => void;
  onFollowToggle: (userId: string) => void;
  onViewProfile: (user: User) => void;
  onShareReel: (reel: Reel) => void;
}

export const ReelsView: React.FC<ReelsViewProps> = ({
  reels,
  currentUser,
  onLikeReel,
  onSaveReel,
  onAddComment,
  onFollowToggle,
  onViewProfile,
  onShareReel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [heartBurst, setHeartBurst] = useState(false);

  const currentReel = reels[currentIndex] || reels[0];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) setCurrentIndex((i) => i + 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') handlePrev();
      if (e.key === 'ArrowDown') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, reels.length]);

  const handleDoubleTap = () => {
    if (!currentReel.isLiked) {
      onLikeReel(currentReel.id);
    }
    setHeartBurst(true);
    setTimeout(() => setHeartBurst(false), 900);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(currentReel.id, commentInput);
    setCommentInput('');
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 flex items-center justify-center relative select-none">
      {/* Vertical Reel Frame */}
      <div className="relative w-full aspect-[9/16] max-h-[82vh] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
        {/* Reel Background Video Cover */}
        <div
          className="absolute inset-0 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${currentReel.videoCover})` }}
          onDoubleClick={handleDoubleTap}
        >
          {/* Subtle cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />
        </div>

        {/* Double Tap Big Heart Animation */}
        {heartBurst && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
            <Heart className="w-24 h-24 fill-rose-500 text-rose-500 drop-shadow-xl" />
          </div>
        )}

        {/* Top Header Bar */}
        <div className="relative z-10 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
              UsWorld Reels
            </span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black/40 backdrop-blur-xs text-white rounded-full hover:bg-black/60 transition-colors"
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Floating Engagement Buttons */}
        <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
          {/* Like */}
          <button
            onClick={() => {
              onLikeReel(currentReel.id);
              if (!currentReel.isLiked) {
                setHeartBurst(true);
                setTimeout(() => setHeartBurst(false), 900);
              }
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-black/40 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform">
              <Heart
                className={`w-6 h-6 transition-colors ${
                  currentReel.isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'
                }`}
              />
            </div>
            <span className="text-[11px] font-semibold drop-shadow-sm tabular-nums">
              {currentReel.likesCount.toLocaleString()}
            </span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(true)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-black/40 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-semibold drop-shadow-sm tabular-nums">
              {currentReel.commentsCount.toLocaleString()}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShareReel(currentReel)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-black/40 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-semibold drop-shadow-sm tabular-nums">
              {currentReel.sharesCount.toLocaleString()}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={() => onSaveReel(currentReel.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-black/40 backdrop-blur-md rounded-full group-hover:scale-110 transition-transform">
              <Bookmark
                className={`w-6 h-6 transition-colors ${
                  currentReel.isSaved ? 'fill-indigo-500 text-indigo-500' : 'text-white'
                }`}
              />
            </div>
          </button>

          {/* Rotating Audio Disc */}
          <div className="p-2 bg-black/40 backdrop-blur-md rounded-full mt-2 animate-spin-slow">
            <img
              src={currentReel.author.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-white/60"
            />
          </div>
        </div>

        {/* Bottom Info & Creator Details */}
        <div className="relative z-10 p-5 pr-16 text-white space-y-2.5">
          {/* Creator row */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onViewProfile(currentReel.author)}
              className="flex items-center gap-2 text-left group"
            >
              <img
                src={currentReel.author.avatar}
                alt={currentReel.author.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-white/40 group-hover:ring-2 group-hover:ring-indigo-400"
              />
              <span className="text-xs font-bold drop-shadow-xs flex items-center gap-1">
                @{currentReel.author.username}
                {currentReel.author.verified && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />}
              </span>
            </button>

            {currentReel.author.id !== currentUser.id && (
              <button
                onClick={() => onFollowToggle(currentReel.author.id)}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                  currentReel.author.isFollowing
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-900 hover:bg-slate-100'
                }`}
              >
                {currentReel.author.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          {/* Caption */}
          <p className="text-xs text-white/95 leading-relaxed line-clamp-2 drop-shadow-xs">
            {currentReel.caption}
          </p>

          {/* Audio track info */}
          <div className="flex items-center gap-1.5 text-[11px] text-white/80 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full w-fit">
            <Music className="w-3 h-3 animate-pulse" />
            <span className="truncate max-w-[200px]">{currentReel.musicTrack}</span>
          </div>
        </div>

        {/* Comments Drawer Modal */}
        {showComments && (
          <div className="absolute inset-x-0 bottom-0 top-1/3 bg-slate-900/95 backdrop-blur-md rounded-t-3xl z-30 p-4 flex flex-col justify-between border-t border-slate-700 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-semibold text-white">
                Comments ({currentReel.commentsCount})
              </h4>
              <button
                onClick={() => setShowComments(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {currentReel.comments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  Be the first to comment on this reel!
                </p>
              ) : (
                currentReel.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-slate-300">
                        <span className="font-semibold text-white mr-1.5">
                          @{comment.author.username}
                        </span>
                        {comment.content}
                      </p>
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 bg-slate-800 text-xs px-3.5 py-2 rounded-full text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Up/Down Reel Navigation Arrows */}
      <div className="hidden md:flex flex-col gap-2 ml-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 shadow-md transition-all"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === reels.length - 1}
          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 shadow-md transition-all"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
