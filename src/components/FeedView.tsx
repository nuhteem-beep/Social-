import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { StoriesTray } from './StoriesTray';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Share2,
  MoreHorizontal,
  Image,
  BarChart2,
  Sparkles,
  MapPin,
  Smile,
  Send,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface FeedViewProps {
  posts: Post[];
  currentUser: User;
  stories: any[];
  onOpenStory: (story: any) => void;
  onAddStory: () => void;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onOpenCreatePost: () => void;
  onReportPost: (post: Post) => void;
  onSharePost: (post: Post) => void;
  onViewProfile: (user: User) => void;
  onFollowToggle: (userId: string) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  posts,
  currentUser,
  stories,
  onOpenStory,
  onAddStory,
  onLikePost,
  onSavePost,
  onAddComment,
  onVotePoll,
  onOpenCreatePost,
  onReportPost,
  onSharePost,
  onViewProfile,
  onFollowToggle,
}) => {
  const [activeFeedTab, setActiveFeedTab] = useState<'for_you' | 'following' | 'trending' | 'subscribers'>('for_you');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);

  // Filter posts based on activeFeedTab
  const filteredPosts = posts.filter((p) => {
    if (activeFeedTab === 'following') {
      return p.author.isFollowing || p.author.id === currentUser.id;
    }
    if (activeFeedTab === 'trending') {
      return p.likesCount > 1000;
    }
    if (activeFeedTab === 'subscribers') {
      return p.visibility === 'subscribers' || p.author.isCreator;
    }
    return true; // for_you
  });

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* 24-Hour Ephemeral Stories Tray */}
      <StoriesTray
        stories={stories}
        currentUser={currentUser}
        onOpenStory={onOpenStory}
        onAddStory={onAddStory}
      />

      {/* Feed Segmented Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800">
        <button
          onClick={() => setActiveFeedTab('for_you')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeFeedTab === 'for_you'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          For You
        </button>
        <button
          onClick={() => setActiveFeedTab('following')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeFeedTab === 'following'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Following
        </button>
        <button
          onClick={() => setActiveFeedTab('trending')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            activeFeedTab === 'trending'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveFeedTab('subscribers')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeFeedTab === 'subscribers'
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-3 h-3" />
          <span>Exclusive</span>
        </button>
      </div>

      {/* Quick Composer Trigger Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <button
            onClick={onOpenCreatePost}
            className="flex-1 text-left px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm rounded-full transition-colors border border-slate-200/50 dark:border-slate-700/50"
          >
            What is inspiring you today, {currentUser.name.split(' ')[0]}?
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 px-1">
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Image className="w-4 h-4 text-emerald-500" />
            <span>Photo / Video</span>
          </button>
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <span>Interactive Poll</span>
          </button>
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Polish</span>
          </button>
        </div>
      </div>

      {/* Feed Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommentsOpen = !!expandedComments[post.id];
          const isMe = post.author.id === currentUser.id;

          return (
            <article
              key={post.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-shadow hover:shadow-sm"
            >
              {/* Post Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => onViewProfile(post.author)}
                    className="shrink-0 group focus:outline-none"
                  >
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-indigo-500/30 transition-all"
                    />
                  </button>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        onClick={() => onViewProfile(post.author)}
                        className="text-sm font-semibold text-slate-900 dark:text-white hover:underline truncate"
                      >
                        {post.author.name}
                      </button>
                      {post.author.verified && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 fill-indigo-600/10" />
                      )}
                      <span className="text-xs text-slate-400 truncate">@{post.author.username}</span>
                    </div>

                    {/* Clean unboxed metadata with dot separators */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{post.timestamp}</span>
                      {post.location && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {post.location}
                          </span>
                        </>
                      )}
                      {post.feeling && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500 dark:text-slate-400">{post.feeling}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right action menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuPostId(openMenuPostId === post.id ? null : post.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
                    aria-label="Post options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {openMenuPostId === post.id && (
                    <div className="absolute right-0 top-8 z-30 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 text-xs">
                      {!isMe && (
                        <button
                          onClick={() => {
                            onFollowToggle(post.author.id);
                            setOpenMenuPostId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          {post.author.isFollowing ? 'Unfollow' : 'Follow'} @{post.author.username}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onSharePost(post);
                          setOpenMenuPostId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        Share via Link
                      </button>
                      <button
                        onClick={() => {
                          onReportPost(post);
                          setOpenMenuPostId(null);
                        }}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        Report content
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed mb-3">
                {post.content}
              </div>

              {/* Tags unboxed */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="hover:underline cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Image Media */}
              {post.image && (
                <div className="relative rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 max-h-[500px]">
                  <img
                    src={post.image}
                    alt="Post media"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[480px] hover:scale-[1.01] transition-transform duration-300"
                  />
                </div>
              )}

              {/* Interactive Poll component */}
              {post.poll && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700/60 mb-3 space-y-2">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{post.poll.question}</span>
                  </p>
                  <div className="space-y-2 mt-2">
                    {post.poll.options.map((opt) => {
                      const total = post.poll?.totalVotes || 1;
                      const percent = Math.round((opt.votes / total) * 100);
                      const isVoted = post.poll?.userVotedId === opt.id;

                      return (
                        <button
                          key={opt.id}
                          onClick={() => onVotePoll(post.id, opt.id)}
                          className={`w-full text-left relative overflow-hidden rounded-lg p-2.5 text-xs font-medium border transition-all ${
                            isVoted
                              ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                          }`}
                        >
                          {/* Progress fill */}
                          <div
                            className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${
                              isVoted
                                ? 'bg-indigo-200/50 dark:bg-indigo-800/40'
                                : 'bg-slate-200/50 dark:bg-slate-700/50'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              {isVoted && <span className="text-indigo-600 font-bold">✓</span>}
                              {opt.text}
                            </span>
                            <span className="tabular-nums font-semibold text-slate-500 dark:text-slate-400">
                              {percent}% ({opt.votes})
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-400 text-right tabular-nums">
                    {post.poll.totalVotes.toLocaleString()} total votes
                  </p>
                </div>
              )}

              {/* Engagement Action Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs">
                {/* Like */}
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    post.isLiked ? 'text-rose-600 dark:text-rose-500 font-semibold' : ''
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform ${
                      post.isLiked ? 'fill-rose-500 stroke-rose-500 scale-110' : ''
                    }`}
                  />
                  <span className="tabular-nums">{post.likesCount.toLocaleString()}</span>
                </button>

                {/* Comment */}
                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="tabular-nums">{post.commentsCount}</span>
                </button>

                {/* Repost / Share */}
                <button
                  onClick={() => onSharePost(post)}
                  className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Repeat2 className="w-4 h-4" />
                  <span className="tabular-nums">{post.sharesCount}</span>
                </button>

                {/* Bookmark */}
                <button
                  onClick={() => onSavePost(post.id)}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    post.isSaved ? 'text-indigo-600 dark:text-indigo-400' : ''
                  }`}
                  aria-label="Save post"
                >
                  <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-indigo-600' : ''}`} />
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {isCommentsOpen && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {/* Comments list */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 py-2 text-center">
                        No comments yet. Start the conversation!
                      </p>
                    ) : (
                      post.comments.map((comment) => (
                        <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                          <img
                            src={comment.author.avatar}
                            alt={comment.author.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                          <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {comment.author.name}
                              </span>
                              <span className="text-[10px] text-slate-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Write a constructive comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      className="flex-1 text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInputs[post.id]?.trim()}
                      className="p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
