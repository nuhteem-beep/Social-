import React, { useState } from 'react';
import { User, Post, Reel } from '../types';
import {
  MapPin,
  Globe,
  CheckCircle2,
  Calendar,
  Grid,
  Film,
  Bookmark,
  ShoppingBag,
  Coins,
  MessageSquare,
  Edit3,
  Heart,
  Share2,
  X,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  posts: Post[];
  reels: Reel[];
  onFollowToggle: (userId: string) => void;
  onStartChat: (user: User) => void;
  onUpdateBio: (bio: string, location: string, website: string) => void;
  onTipUser: (user: User, amount: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  reels,
  onFollowToggle,
  onStartChat,
  onUpdateBio,
  onTipUser,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved' | 'shop'>('posts');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [editWebsite, setEditWebsite] = useState(user.website || '');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipSuccess, setTipSuccess] = useState(false);

  const isMe = user.id === currentUser.id;
  const userPosts = posts.filter((p) => p.author.id === user.id);
  const userReels = reels.filter((r) => r.author.id === user.id);
  const savedPosts = posts.filter((p) => p.isSaved);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBio(editBio, editLocation, editWebsite);
    setShowEditModal(false);
  };

  const handleSendTip = (amount: number) => {
    onTipUser(user, amount);
    setTipSuccess(true);
    setTimeout(() => {
      setTipSuccess(false);
      setShowTipModal(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden">
        {/* Decorative subtle backdrop pattern */}
        <div className="h-28 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900" />

        <div className="relative -mt-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg"
              />
              {user.isCreator && (
                <span className="absolute bottom-1 right-1 bg-amber-500 text-white p-1 rounded-full text-xs shadow-xs" title="Verified Creator">
                  ⭐
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                {user.verified && (
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-600/10" />
                )}
                {user.isBusiness && (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50">
                    Business Account
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">@{user.username}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isMe ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onFollowToggle(user.id)}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-xs ${
                    user.isFollowing
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={() => onStartChat(user)}
                  className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors"
                  title="Direct Message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowTipModal(true)}
                  className="inline-flex items-center gap-1 px-3 py-2 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl text-xs font-semibold transition-colors"
                  title="Tip Creator"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tip</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bio & Details */}
        <div className="mt-4 space-y-3">
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed">
            {user.bio}
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </span>
            )}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{user.website.replace('https://', '')}</span>
              </a>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 pt-3 text-xs">
            <div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {userPosts.length}
              </span>{' '}
              <span className="text-slate-400">Posts</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {user.followersCount.toLocaleString()}
              </span>{' '}
              <span className="text-slate-400">Followers</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                {user.followingCount.toLocaleString()}
              </span>{' '}
              <span className="text-slate-400">Following</span>
            </div>
            {user.likesCount && (
              <div>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {user.likesCount.toLocaleString()}
                </span>{' '}
                <span className="text-slate-400">Likes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-around border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
            activeTab === 'posts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
            activeTab === 'reels'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        {isMe && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 py-3 border-b-2 transition-all ${
              activeTab === 'saved'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedPosts.length})</span>
          </button>
        )}
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'posts' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {userPosts.length === 0 ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">
              No posts shared yet.
            </p>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer shadow-2xs"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="p-4 h-full flex flex-col justify-between bg-slate-900 text-white">
                    <p className="text-xs line-clamp-4 leading-relaxed">{post.content}</p>
                    <span className="text-[10px] text-slate-400">{post.timestamp}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reels' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {userReels.length === 0 ? (
            <p className="col-span-full py-12 text-center text-xs text-slate-400">
              No reels published yet.
            </p>
          ) : (
            userReels.map((reel) => (
              <div
                key={reel.id}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-md"
              >
                <img
                  src={reel.videoCover}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs font-semibold line-clamp-1">{reel.caption}</p>
                  <span className="text-[10px] text-slate-300 tabular-nums">
                    {reel.likesCount.toLocaleString()} views
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {savedPosts.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-2xs"
            >
              {post.image ? (
                <img
                  src={post.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-4 h-full bg-slate-900 text-white">
                  <p className="text-xs line-clamp-3">{post.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base font-display">Edit Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 my-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Website / Portfolio Link
                </label>
                <input
                  type="text"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-colors"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tip Creator Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-base font-display flex items-center gap-1.5">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Tip {user.name}</span>
              </h3>
              <button onClick={() => setShowTipModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {tipSuccess ? (
              <div className="py-6 text-center space-y-2">
                <Check className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-bold">Coins Tipped Successfully!</p>
              </div>
            ) : (
              <div className="space-y-4 my-4">
                <p className="text-xs text-slate-500 text-center">
                  Select a tip amount from your UsWorld wallet to support their craft:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[25, 50, 100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => handleSendTip(amt)}
                      className="p-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded-xl border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold text-xs transition-colors"
                    >
                      {amt} Coins
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
