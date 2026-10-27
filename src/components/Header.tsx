import React from 'react';
import { ActiveTab, User, NotificationItem } from '../types';
import {
  Bell,
  Search,
  PlusCircle,
  Video,
  ShieldAlert,
  Moon,
  Sun,
  Coins,
  Globe,
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  unreadNotificationsCount: number;
  openCreateModal: () => void;
  openLiveStream: () => void;
  onOpenNotifications: () => void;
  isDark: boolean;
  toggleDark: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadNotificationsCount,
  openCreateModal,
  openLiveStream,
  onOpenNotifications,
  isDark,
  toggleDark,
  language,
  setLanguage,
  onSearchClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('feed')}
          className="text-left cursor-pointer group flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm shadow-indigo-500/20">
            U
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            UsWorld
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveTab('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'feed'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Feed
            {activeTab === 'feed' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'explore'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explore
            {activeTab === 'explore' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'reels'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reels
            {activeTab === 'reels' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'messages'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Messages
            {activeTab === 'messages' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('marketplace')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'marketplace'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Marketplace
            {activeTab === 'marketplace' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + compact utilities */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search trigger */}
          <button
            onClick={onSearchClick}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search users, posts, topics"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Go Live trigger */}
          <button
            onClick={openLiveStream}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 rounded-lg transition-colors border border-rose-200/60 dark:border-rose-900/40"
            title="Join or start live broadcast"
          >
            <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span>Go Live</span>
          </button>

          {/* Virtual Coins display */}
          <div
            onClick={() => setActiveTab('creator')}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200/50 dark:border-amber-900/30 cursor-pointer hover:bg-amber-100/60 transition-colors"
            title="UsWorld Virtual Coins & Tipping Balance"
          >
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <span className="tabular-nums font-semibold">{currentUser.coinsBalance.toLocaleString()}</span>
          </div>

          {/* Notifications bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
            )}
          </button>

          {/* Dark mode switch */}
          <button
            onClick={toggleDark}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm shadow-indigo-600/20 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create</span>
          </button>

          {/* Profile Avatar button */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all ml-1"
            title="View Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
