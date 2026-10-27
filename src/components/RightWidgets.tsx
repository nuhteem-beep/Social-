import React from 'react';
import { User, EventItem } from '../types';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Coins,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface RightWidgetsProps {
  usersToFollow: User[];
  upcomingEvents: EventItem[];
  currentUser: User;
  onFollowToggle: (userId: string) => void;
  onViewProfile: (user: User) => void;
  onOpenCreatorStudio: () => void;
  onSelectEvent: (event: EventItem) => void;
}

export const RightWidgets: React.FC<RightWidgetsProps> = ({
  usersToFollow,
  upcomingEvents,
  currentUser,
  onFollowToggle,
  onViewProfile,
  onOpenCreatorStudio,
  onSelectEvent,
}) => {
  const trendingTags = [
    { tag: 'CapeTownVibes', count: '48.2K posts' },
    { tag: 'NextGenTech', count: '92.1K posts' },
    { tag: 'UsWorldLive', count: '31.5K posts' },
    { tag: 'CreatorEconomy', count: '64.8K posts' },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-80 shrink-0 p-4 space-y-5 sticky top-16 min-h-[calc(100vh-4rem)]">
      {/* UsWorld Wallet & Creator Quick Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-xs border border-indigo-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Virtual Wallet</span>
          </span>
          <span className="text-[10px] bg-indigo-500/30 px-2 py-0.5 rounded-full text-indigo-200">
            Active
          </span>
        </div>

        <div>
          <p className="text-2xl font-bold font-display text-white tabular-nums">
            {currentUser.coinsBalance.toLocaleString()}
          </p>
          <p className="text-xs text-slate-300">UsWorld Coins balance</p>
        </div>

        <button
          onClick={onOpenCreatorStudio}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Creator Studio & Top Up</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Suggested Creators */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Creators You Might Like</span>
        </h3>

        <div className="space-y-3">
          {usersToFollow.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-2.5">
              <button
                onClick={() => onViewProfile(user)}
                className="flex items-center gap-2.5 text-left min-w-0 group"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover shrink-0 group-hover:ring-2 group-hover:ring-indigo-400"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:underline flex items-center gap-1">
                    {user.name}
                    {user.verified && (
                      <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400 shrink-0 fill-indigo-600/10" />
                    )}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                </div>
              </button>

              <button
                onClick={() => onFollowToggle(user.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                  user.isFollowing
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
          <span>Trending Hashtags</span>
        </div>

        <div className="space-y-2">
          {trendingTags.map((t) => (
            <div
              key={t.tag}
              className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
            >
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                #{t.tag}
              </p>
              <p className="text-[10px] text-slate-400 tabular-nums">{t.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Event Snippet */}
      {upcomingEvents[0] && (
        <div
          onClick={() => onSelectEvent(upcomingEvents[0])}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 cursor-pointer hover:border-indigo-300 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Featured Live Event</span>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
            {upcomingEvents[0].title}
          </p>
          <p className="text-[11px] text-slate-400">{upcomingEvents[0].date}</p>
        </div>
      )}

      {/* Quiet Footer */}
      <div className="pt-2 text-[11px] text-slate-400 space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span>About</span>
          <span>·</span>
          <span>Terms</span>
          <span>·</span>
          <span>Privacy</span>
          <span>·</span>
          <span>Creators</span>
          <span>·</span>
          <span>Safety</span>
        </div>
        <p className="text-[10px] text-slate-400">© 2026 UsWorld Social Inc. Connect. Share. Inspire.</p>
      </div>
    </aside>
  );
};
