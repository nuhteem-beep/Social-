import React, { useState } from 'react';
import { User } from '../types';
import {
  X,
  Shield,
  Lock,
  Globe,
  Bell,
  Eye,
  UserCheck,
  Smartphone,
  LogOut,
  Moon,
  Sun,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  currentUser: User;
  onClose: () => void;
  isDark: boolean;
  toggleDark: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  onSwitchUser: (userId: string) => void;
  availableUsers: Record<string, User>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  currentUser,
  onClose,
  isDark,
  toggleDark,
  language,
  setLanguage,
  onSwitchUser,
  availableUsers,
}) => {
  const [isPrivateAccount, setIsPrivateAccount] = useState(false);
  const [adFreeMode, setAdFreeMode] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const languages = [
    { code: 'en', label: 'English (US & Global)' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'pt', label: 'Português' },
  ];

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base font-display">Settings & Privacy</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedNotice && (
          <div className="my-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <div className="space-y-5 my-4 text-xs">
          {/* Account Privacy */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Privacy & Audience
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Private Account</p>
                <p className="text-slate-400 text-[11px]">
                  When active, only approved followers can see your posts and stories.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isPrivateAccount}
                onChange={(e) => setIsPrivateAccount(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Read Receipts & Online State</p>
                <p className="text-slate-400 text-[11px]">Show others when you have read messages.</p>
              </div>
              <input
                type="checkbox"
                checked={readReceipts}
                onChange={(e) => setReadReceipts(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Premium & Experience */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              UsWorld Premium
            </h4>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span>Ad-Free Experience</span>
                  <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded font-bold">
                    PRO
                  </span>
                </p>
                <p className="text-slate-400 text-[11px]">Browse feeds and reels completely undisturbed.</p>
              </div>
              <input
                type="checkbox"
                checked={adFreeMode}
                onChange={(e) => setAdFreeMode(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Language & Localization */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Language & Region
            </h4>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Select Platform Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Switch Demo Persona */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Switch Demo User Persona
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(availableUsers).map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSwitchUser(u.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    currentUser.id === u.id
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <img
                    src={u.avatar}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs">{u.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
