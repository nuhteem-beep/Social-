import React, { useState } from 'react';
import { Post, Reel } from '../types';
import { Share2, Copy, Check, X, Send, Link, MessageSquare } from 'lucide-react';

interface ShareModalProps {
  item: Post | Reel;
  onClose: () => void;
  onSendViaChat: (authorName: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  item,
  onClose,
  onSendViaChat,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://usworld.social/post/${item.id}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base font-display">Share Content</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 my-4 text-xs">
          {/* Quick Copy Link */}
          <div>
            <label className="block text-slate-500 font-medium mb-1">Direct Link</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-[11px] text-slate-600 dark:text-slate-300"
              />
              <button
                onClick={handleCopy}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"
                title="Copy link"
              >
                {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                Link copied to clipboard!
              </p>
            )}
          </div>

          {/* Forward to UsWorld Chat */}
          <button
            onClick={() => {
              onSendViaChat(item.author.name);
              onClose();
            }}
            className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Forward via UsWorld Direct Chat
              </span>
            </div>
            <Send className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
