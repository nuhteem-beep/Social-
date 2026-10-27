import React from 'react';
import { NotificationItem, User } from '../types';
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Gift,
  ShoppingBag,
  Sparkles,
  X,
  CheckCheck,
} from 'lucide-react';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onViewProfile: (user: User) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onViewProfile,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />;
      case 'follow':
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case 'gift':
        return <Gift className="w-3.5 h-3.5 text-amber-500" />;
      case 'purchase':
        return <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-5 text-slate-900 dark:text-white max-h-[85vh] flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base font-display">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Mark all read
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-10">
              No notifications at this time.
            </p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-2xl flex items-start gap-3 transition-colors ${
                  !notif.read
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40'
                    : 'bg-slate-50/50 dark:bg-slate-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={notif.actor.avatar}
                    alt={notif.actor.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 p-0.5 bg-white dark:bg-slate-900 rounded-full shadow-xs">
                    {getIcon(notif.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <p className="text-slate-700 dark:text-slate-300">
                    <span
                      onClick={() => onViewProfile(notif.actor)}
                      className="font-bold text-slate-900 dark:text-white cursor-pointer hover:underline mr-1"
                    >
                      {notif.actor.name}
                    </span>
                    {notif.targetText}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{notif.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
