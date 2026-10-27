import React, { useState } from 'react';
import { User, Post } from '../types';
import {
  Search,
  TrendingUp,
  Hash,
  Users,
  Compass,
  CheckCircle2,
  Heart,
  MessageCircle,
} from 'lucide-react';

interface ExploreViewProps {
  allUsers: User[];
  posts: Post[];
  currentUser: User;
  onFollowToggle: (userId: string) => void;
  onViewProfile: (user: User) => void;
  onSelectPost: (post: Post) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  allUsers,
  posts,
  currentUser,
  onFollowToggle,
  onViewProfile,
  onSelectPost,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'people' | 'tags' | 'posts'>('all');

  const trendingTopics = [
    { tag: 'CapeTownVibes', postsCount: '48.2K posts', category: 'Photography & Travel' },
    { tag: 'NextGenTech', postsCount: '92.1K posts', category: 'Engineering' },
    { tag: 'UsWorldLive', postsCount: '31.5K posts', category: 'Live Music' },
    { tag: 'CreatorEconomy', postsCount: '64.8K posts', category: 'Business & Media' },
    { tag: 'IndieCrafts', postsCount: '19.4K posts', category: 'Artisan Goods' },
  ];

  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== currentUser.id &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPosts = posts.filter(
    (p) =>
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search people, hashtags #, topics, posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
        />
      </div>

      {/* Segmented Filter */}
      <div className="flex items-center gap-2">
        {(['all', 'people', 'tags', 'posts'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              activeFilter === filter
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Trending Topics Banner */}
      {(activeFilter === 'all' || activeFilter === 'tags') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span>Trending on UsWorld</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trendingTopics.map((item) => (
              <div
                key={item.tag}
                onClick={() => setSearchQuery(item.tag)}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/60 hover:border-indigo-300 cursor-pointer transition-all"
              >
                <span className="text-[10px] text-slate-400">{item.category}</span>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  #{item.tag}
                </p>
                <p className="text-[11px] text-slate-500 tabular-nums">{item.postsCount}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* People Results / Suggested Creators */}
      {(activeFilter === 'all' || activeFilter === 'people') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Suggested Creators to Follow</span>
            </div>
            <span className="text-xs text-indigo-600 font-medium">{filteredUsers.length} creators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 bg-slate-50/40 dark:bg-slate-950/30"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <button
                      onClick={() => onViewProfile(user)}
                      className="text-xs font-bold text-slate-900 dark:text-white hover:underline truncate flex items-center gap-1"
                    >
                      <span>{user.name}</span>
                      {user.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20 shrink-0" />
                      )}
                    </button>
                    <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 tabular-nums">
                      {user.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {user.bio}
                </p>

                <button
                  onClick={() => onFollowToggle(user.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    user.isFollowing
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Grid / Posts Results */}
      {(activeFilter === 'all' || activeFilter === 'posts') && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Explore Visuals & Posts
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-xs"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-4 h-full flex flex-col justify-between bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
                    <p className="text-xs line-clamp-4 leading-relaxed">{post.content}</p>
                    <span className="text-[10px] text-slate-300">@{post.author.username}</span>
                  </div>
                )}

                {/* Hover Scrim */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
