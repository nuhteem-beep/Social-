import React from 'react';
import { ActiveTab, User } from '../types';
import {
  Home,
  Compass,
  Film,
  MessageSquare,
  Radio,
  Users,
  ShoppingBag,
  Calendar,
  Sparkles,
  ShieldCheck,
  Settings,
  User as UserIcon,
  LogOut,
} from 'lucide-react';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User;
  unreadMessagesCount: number;
  onOpenSettings: () => void;
  onSwitchAccount: () => void;
}

export const Sidebar: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  unreadMessagesCount,
  onOpenSettings,
  onSwitchAccount,
}) => {
  const mainNavItems = [
    { id: 'feed' as ActiveTab, label: 'Feed', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explore & Search', icon: Compass },
    { id: 'reels' as ActiveTab, label: 'Reels', icon: Film },
    { id: 'messages' as ActiveTab, label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'live' as ActiveTab, label: 'Live Stream', icon: Radio },
    { id: 'communities' as ActiveTab, label: 'Communities', icon: Users },
    { id: 'marketplace' as ActiveTab, label: 'Marketplace', icon: ShoppingBag },
    { id: 'events' as ActiveTab, label: 'Events', icon: Calendar },
    { id: 'creator' as ActiveTab, label: 'Creator Studio', icon: Sparkles },
    { id: 'admin' as ActiveTab, label: 'Moderation & Safety', icon: ShieldCheck },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-950/70 p-4 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="space-y-1">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-600 text-white rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4 text-slate-400" />
          <span>My Profile</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings & Privacy</span>
        </button>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-xl flex items-center justify-between mt-3 border border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0 text-left">
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">@{currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={onSwitchAccount}
            title="Switch demo persona / account"
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export const MobileTabBar: React.FC<{
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadMessagesCount: number;
}> = ({ activeTab, setActiveTab, unreadMessagesCount }) => {
  const tabs = [
    { id: 'feed' as ActiveTab, label: 'Feed', icon: Home },
    { id: 'explore' as ActiveTab, label: 'Explore', icon: Compass },
    { id: 'reels' as ActiveTab, label: 'Reels', icon: Film },
    { id: 'messages' as ActiveTab, label: 'Chat', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile' as ActiveTab, label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 h-16 px-2 flex items-center justify-around pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
            {tab.badge && tab.badge > 0 ? (
              <span className="absolute top-1 right-2 w-2 h-2 bg-indigo-600 rounded-full" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
};
