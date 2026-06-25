import React from 'react';
import { CheckCheck, Trash2 } from 'lucide-react';
import type { NotificationType } from '../../../../store/slices/sellerNotificationsSlice';

interface NotificationFiltersProps {
  typeFilter: 'All' | NotificationType;
  statusFilter: 'All' | 'Read' | 'Unread';
  onTypeChange: (type: 'All' | NotificationType) => void;
  onStatusChange: (status: 'All' | 'Read' | 'Unread') => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange,
  onMarkAllAsRead,
  onClearAll,
}) => {
  const typeOptions: { label: string; value: 'All' | NotificationType }[] = [
    { label: 'All Alerts', value: 'All' },
    { label: 'New Orders', value: 'New Order' },
    { label: 'Reviews', value: 'Review' },
    { label: 'Low Stock', value: 'Low Stock' },
    { label: 'Payout Updates', value: 'Payout Update' },
    { label: 'Promotions', value: 'Promotion' },
  ];

  const statusOptions: { label: string; value: 'All' | 'Read' | 'Unread' }[] = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Unread Only', value: 'Unread' },
    { label: 'Read Only', value: 'Read' },
  ];

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-4 text-left">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onTypeChange(opt.value)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
                typeFilter === opt.value
                  ? 'bg-indigo-650 text-white border-indigo-650 shadow-3xs'
                  : 'bg-white text-slate-650 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2.5 self-end lg:self-center">
          <button
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 hover:text-slate-900 border border-slate-200/50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <CheckCheck size={14} className="text-indigo-600" />
            <span>Mark All as Read</span>
          </button>
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-150/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Status Filters */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-2">Filter Status:</span>
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                statusFilter === opt.value
                  ? 'bg-white text-indigo-650 shadow-3xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
