import React, { useState } from 'react';
import { Community, User } from '../types';
import { Users, Plus, Check, MessageSquare, Shield, Sparkles } from 'lucide-react';

interface CommunitiesViewProps {
  communities: Community[];
  currentUser: User;
  onJoinToggle: (communityId: string) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  communities,
  currentUser,
  onJoinToggle,
}) => {
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(communities[0]);
  const [newDiscussionText, setNewDiscussionText] = useState('');
  const [discussions, setDiscussions] = useState<
    { id: string; author: User; text: string; timestamp: string; replies: number }[]
  >([
    {
      id: 'd_1',
      author: currentUser,
      text: 'What camera bodies or prime lenses are you finding most intuitive for documentary portraiture this year?',
      timestamp: '2h ago',
      replies: 14,
    },
    {
      id: 'd_2',
      author: {
        id: 'usr_art',
        name: 'Sipho Zulu',
        username: 'siphozulu',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        verified: false,
        coinsBalance: 200,
        followersCount: 1200,
        followingCount: 300,
        bio: 'Cape Town visualist',
      },
      text: 'Sharing lighting diagrams from last weekend’s golden hour coastal expedition. Natural reflector techniques made a huge difference.',
      timestamp: '5h ago',
      replies: 28,
    },
  ]);

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiscussionText.trim()) return;
    setDiscussions([
      {
        id: `d_${Date.now()}`,
        author: currentUser,
        text: newDiscussionText.trim(),
        timestamp: 'Just now',
        replies: 0,
      },
      ...discussions,
    ]);
    setNewDiscussionText('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold">
            UsWorld Communities & Guilds
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mt-1">
            Niche Circles & Discourse
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Connect around shared crafts, photography, sound design, and engineering without algorithm manipulation.
          </p>
        </div>
      </div>

      {/* Main Layout: Community selector cards on left, active discussions on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Community Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Discover Communities
          </h3>

          {communities.map((comm) => {
            const isSelected = selectedCommunity?.id === comm.id;
            return (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunity(comm)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-1 ring-indigo-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {comm.avatar}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {comm.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                        {comm.membersCount.toLocaleString()} members
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onJoinToggle(comm.id);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                      comm.isJoined
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {comm.isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2">
                  {comm.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right 2 Columns: Community Details & Discussion Stream */}
        {selectedCommunity && (
          <div className="lg:col-span-2 space-y-5">
            {/* Community Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 h-44 flex flex-col justify-end p-5 text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${selectedCommunity.coverImage})` }}
              />
              <div className="relative z-10">
                <span className="text-xs text-indigo-300 font-semibold">{selectedCommunity.category}</span>
                <h2 className="text-xl font-bold font-display">{selectedCommunity.name}</h2>
                <p className="text-xs text-slate-200 mt-1 max-w-lg">{selectedCommunity.description}</p>
              </div>
            </div>

            {/* Community Rules Box */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>Community Guidelines</span>
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                {selectedCommunity.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            {/* Post in Community */}
            <form
              onSubmit={handlePostDiscussion}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  placeholder={`Start a discussion in ${selectedCommunity.name}...`}
                  value={newDiscussionText}
                  onChange={(e) => setNewDiscussionText(e.target.value)}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newDiscussionText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl disabled:opacity-40 transition-colors"
                >
                  Post
                </button>
              </div>
            </form>

            {/* Discussions List */}
            <div className="space-y-3">
              {discussions.map((disc) => (
                <div
                  key={disc.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={disc.author.avatar}
                        alt={disc.author.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {disc.author.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{disc.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {disc.text}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{disc.replies} replies</span>
                    </span>
                    <button className="hover:underline">Reply to thread</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
