import React, { useState } from 'react';
import { Bell, ShieldCheck, Mail, BookOpen, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  toggleReadStatus,
  deleteNotification,
  markAllAsRead,
  clearAllNotifications,
  type NotificationType,
} from '../../../../store/slices/sellerNotificationsSlice';

import NotificationFilters from '../../../../features/seller/components/notifications/NotificationFilters';
import NotificationItemRow from '../../../../features/seller/components/notifications/NotificationItemRow';

export const NotificationsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.sellerNotifications);

  // Local filter states
  const [typeFilter, setTypeFilter] = useState<'All' | NotificationType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Read' | 'Unread'>('All');

  // Summary Metrics calculations
  const totalCount = items.length;
  const unreadCount = items.filter((n) => !n.read).length;
  
  // Specific Type counts
  const orderAlertsCount = items.filter((n) => n.type === 'New Order').length;
  const stockAlertsCount = items.filter((n) => n.type === 'Low Stock').length;

  // Filter items client-side
  const filteredItems = items.filter((n) => {
    let matchesType = true;
    if (typeFilter !== 'All') {
      matchesType = n.type === typeFilter;
    }

    let matchesStatus = true;
    if (statusFilter === 'Unread') {
      matchesStatus = !n.read;
    } else if (statusFilter === 'Read') {
      matchesStatus = n.read;
    }

    return matchesType && matchesStatus;
  });

  const handleToggleRead = (id: string) => {
    dispatch(toggleReadStatus(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to permanently delete all notifications? This cannot be undone.')) {
      dispatch(clearAllNotifications());
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Bell className="text-indigo-650" size={24} />
            <span>Store Alerts & Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit administrative events, order reservations, stock replenishment notices, payout transfers, and active discount campaigns.</p>
        </div>
      </div>

      {/* Analytics Cards / Summary widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Notifications */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Registry</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{totalCount}</span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Audit log entries logged</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 text-slate-500 flex items-center justify-center">
            <BookOpen size={18} />
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Unread Alerts</span>
            <span className="text-2xl font-black text-indigo-650 block leading-none">{unreadCount}</span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Awaiting review attention</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-655 flex items-center justify-center">
            <Mail size={18} />
          </div>
        </div>

        {/* Pending Orders Alert */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">New Order Logs</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{orderAlertsCount}</span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Recent buyer checkout signals</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-655 flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
        </div>

        {/* Low Stock count */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Stock Violations</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{stockAlertsCount}</span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Replenishment actions recommended</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-655 flex items-center justify-center">
            <AlertCircle size={18} />
          </div>
        </div>

      </div>

      {/* Filter panel */}
      <NotificationFilters
        typeFilter={typeFilter}
        statusFilter={statusFilter}
        onTypeChange={setTypeFilter}
        onStatusChange={setStatusFilter}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
      />

      {/* Notifications list registry */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex flex-col items-center justify-center min-h-[250px] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-105 flex items-center justify-center text-slate-400">
              <Bell size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Notifications Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">No alerts match the selected type and status filter criteria.</p>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <NotificationItemRow
              key={item.id}
              notification={item}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationsScreen;
