import React, { useState } from 'react';
import { ReportItem, User } from '../types';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  UserX,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

interface AdminDashboardViewProps {
  reports: ReportItem[];
  onResolveReport: (reportId: string, action: 'dismiss' | 'remove_content' | 'ban_user') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  reports,
  onResolveReport,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  const filteredReports = reports.filter((r) => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'resolved') return r.status === 'resolved';
    return true;
  });

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-rose-400 font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>UsWorld Trust & Safety Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight mt-1">
            Community Moderation Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Real-time content integrity enforcement. Review AI-flagged spam, impersonation, and copyright disputes to maintain a respectful, inspiring social graph.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase">Pending</span>
            <p className="text-xl font-bold text-amber-400 tabular-nums">
              {reports.filter((r) => r.status === 'pending').length}
            </p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase">Resolved</span>
            <p className="text-xl font-bold text-emerald-400 tabular-nums">
              {reports.filter((r) => r.status === 'resolved').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All Reports ({reports.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Pending Review
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'resolved'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Resolved
        </button>
      </div>

      {/* Reports Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 text-slate-500 font-semibold">
                <th className="py-3 px-4">Target Type</th>
                <th className="py-3 px-4">Reason & Details</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Reported By</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredReports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white uppercase text-[11px]">
                    {rep.targetType}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-semibold text-slate-900 dark:text-white">{rep.reason}</p>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{rep.details}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold uppercase ${
                        rep.severity === 'high'
                          ? 'text-rose-600'
                          : rep.severity === 'medium'
                          ? 'text-amber-600'
                          : 'text-blue-500'
                      }`}
                    >
                      {rep.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{rep.reportedBy}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-medium ${
                        rep.status === 'resolved'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {rep.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {rep.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onResolveReport(rep.id, 'dismiss')}
                          className="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                          title="Dismiss report"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => onResolveReport(rep.id, 'remove_content')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium"
                          title="Remove flagged content"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => onResolveReport(rep.id, 'ban_user')}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium"
                          title="Ban author from UsWorld"
                        >
                          Ban User
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Action taken</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
