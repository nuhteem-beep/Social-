import React, { useState, useEffect } from 'react';
import { LiveStream, User, LiveGift } from '../types';
import { VIRTUAL_GIFTS } from '../data/mockData';
import {
  Radio,
  Eye,
  Gift,
  Heart,
  Send,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  Coins,
  CheckCircle2,
  X,
} from 'lucide-react';

interface LiveStreamViewProps {
  liveStream: LiveStream;
  currentUser: User;
  onSendComment: (text: string) => void;
  onTipGift: (gift: LiveGift) => void;
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
}

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  liveStream,
  currentUser,
  onSendComment,
  onTipGift,
  onViewProfile,
  onFollowToggle,
}) => {
  const [commentText, setCommentText] = useState('');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<LiveGift | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [isMuted, setIsMuted] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onSendComment(commentText.trim());
    setCommentText('');
  };

  const handleTip = (gift: LiveGift) => {
    if (currentUser.coinsBalance < gift.coins) {
      alert(`You need ${gift.coins} coins to send ${gift.name}. Please top up your wallet in Creator Studio!`);
      return;
    }
    onTipGift(gift);
    setActiveGiftAnimation(gift);
    setShowGiftModal(false);
    setTimeout(() => setActiveGiftAnimation(null), 2500);
  };

  const spawnHeart = () => {
    const id = Date.now();
    const x = Math.random() * 60 - 30;
    setFloatingHearts((prev) => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1800);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Stream Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Main Video Stream Frame (2 columns) */}
        <div className="lg:col-span-2 relative aspect-video sm:aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-800 select-none">
          {/* Background Live Stream Cover */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${liveStream.thumbnail})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
          </div>

          {/* Top Stream Status Bar */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 text-white rounded-full text-xs font-bold tracking-wide animate-pulse">
                <Radio className="w-3.5 h-3.5" />
                <span>LIVE</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-black/50 backdrop-blur-md text-white/90 rounded-full text-xs font-medium tabular-nums">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>{liveStream.viewersCount.toLocaleString()}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
                aria-label={isMuted ? 'Unmute stream' : 'Mute stream'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Floating Gift Particle Animation */}
          {activeGiftAnimation && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none bg-black/30 backdrop-blur-xs animate-in zoom-in-75">
              <div className="text-6xl animate-bounce mb-2">{activeGiftAnimation.icon}</div>
              <p className="text-xl font-bold font-display text-amber-300 drop-shadow-md">
                Tipped {activeGiftAnimation.name}!
              </p>
              <p className="text-xs text-white/90 mt-1">+{activeGiftAnimation.coins} Coins to Host</p>
            </div>
          )}

          {/* Floating Hearts Reaction Stream */}
          <div className="absolute bottom-20 right-6 pointer-events-none z-20">
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                className="absolute text-2xl animate-fade-out"
                style={{
                  transform: `translateX(${h.x}px) translateY(-80px)`,
                  transition: 'all 1.5s ease-out',
                }}
              >
                ❤️
              </div>
            ))}
          </div>

          {/* Bottom Stream Host Information */}
          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onViewProfile(liveStream.host)}
                className="flex items-center gap-2.5 text-left group"
              >
                <img
                  src={liveStream.host.avatar}
                  alt={liveStream.host.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:underline flex items-center gap-1">
                    {liveStream.host.name}
                    {liveStream.host.verified && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">{liveStream.title}</p>
                </div>
              </button>

              {liveStream.host.id !== currentUser.id && (
                <button
                  onClick={() => onFollowToggle(liveStream.host.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
                    liveStream.host.isFollowing
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {liveStream.host.isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Total Gifts counter */}
            <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold text-amber-300 tabular-nums">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{liveStream.totalGiftsReceived.toLocaleString()} Gifts Received</span>
            </div>
          </div>
        </div>

        {/* Live Chat & Tipping Side Drawer (1 column) */}
        <div className="flex flex-col h-[480px] lg:h-auto bg-slate-900/90 rounded-2xl border border-slate-800 p-4 justify-between">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <span className="font-bold text-white">Live Discussion Stream</span>
            <span className="text-slate-400">{liveStream.category}</span>
          </div>

          {/* Incoming Comments Stream */}
          <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
            {liveStream.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-semibold text-indigo-300">@{comment.user.username}</span>
                    {comment.gift && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        {comment.gift.icon} {comment.gift.name}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 mt-0.5">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer: Heart, Gift, and Chat Input */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 px-1">
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="tabular-nums font-semibold">{currentUser.coinsBalance}</span> coins
              </span>

              <button
                onClick={() => setShowGiftModal(true)}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Send Virtual Gift</span>
              </button>
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Say something inspiring..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-slate-800 text-xs px-3.5 py-2.5 rounded-full text-white placeholder-slate-400 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="button"
                onClick={spawnHeart}
                className="p-2 text-rose-500 hover:text-rose-400 hover:scale-110 transition-transform"
                title="Send heart reaction"
              >
                <Heart className="w-5 h-5 fill-rose-500" />
              </button>
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Virtual Gifts Store Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base font-display">Virtual Gift Store</h3>
              </div>
              <button onClick={() => setShowGiftModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3 flex items-center justify-between text-xs bg-slate-800/80 p-3 rounded-xl">
              <span className="text-slate-400">Your Coin Balance:</span>
              <span className="font-bold text-amber-300 tabular-nums flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {currentUser.coinsBalance.toLocaleString()} Coins
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 my-4">
              {VIRTUAL_GIFTS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleTip(g)}
                  className="flex flex-col items-center p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-400/50 transition-all group"
                >
                  <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">{g.icon}</span>
                  <span className="text-xs font-semibold text-slate-200">{g.name}</span>
                  <span className="text-[11px] font-bold text-amber-400 mt-0.5 tabular-nums">
                    {g.coins} coins
                  </span>
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Tipping directly supports {liveStream.host.name} and animates live across all viewers.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
