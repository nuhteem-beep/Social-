import React, { useState } from 'react';
import { Post, User } from '../types';
import { AlertTriangle, X, Check } from 'lucide-react';

interface ReportModalProps {
  post: Post;
  onClose: () => void;
  onSubmitReport: (reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  post,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState('Commercial Spam / Bots');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reasons = [
    'Commercial Spam / Bots',
    'Harassment or Hate Speech',
    'Inappropriate or Explicit Media',
    'Impersonation of Creator',
    'Misinformation or Scam',
    'Copyright Dispute',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(reason, details);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-slate-900 dark:text-white">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-base font-display">Report Content</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <h4 className="text-sm font-bold">Report Received</h4>
            <p className="text-xs text-slate-400">
              Our safety moderation team will review this within 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 my-4 text-xs">
            <p className="text-slate-500">
              Help us keep UsWorld authentic and safe. Select the primary reason for reporting this post by @{post.author.username}:
            </p>

            <div className="space-y-2">
              {reasons.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    reason === r
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-rose-600"
                  />
                  <span>{r}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Additional Context (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Provide any relevant details..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
