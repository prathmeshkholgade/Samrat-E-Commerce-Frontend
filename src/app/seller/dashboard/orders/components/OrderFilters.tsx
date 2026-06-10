import React from 'react';
import { Search, RotateCcw, ShieldAlert, CheckCircle2, Box, Send, Truck, Archive, XCircle, RefreshCw } from 'lucide-react';
import type { SellerOrder } from '../../../../../shared/types';

interface OrderFiltersProps {
  searchQuery: string;
  statusFilter: string;
  paymentStatusFilter: string;
  sortBy: string;
  selectedCount: number;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onPaymentStatusChange: (paymentStatus: string) => void;
  onSortChange: (sortBy: string) => void;
  onResetFilters: () => void;
  onBulkStatusUpdate: (status: SellerOrder['status']) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchQuery,
  statusFilter,
  paymentStatusFilter,
  sortBy,
  selectedCount,
  onSearchChange,
  onStatusChange,
  onPaymentStatusChange,
  onSortChange,
  onResetFilters,
  onBulkStatusUpdate,
}) => {
  const statuses = [
    'All',
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  const paymentStatuses = ['All', 'Paid', 'Unpaid', 'Refunded'];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || paymentStatusFilter !== 'All' || sortBy !== 'date-desc';

  return (
    <div className="space-y-4">
      {/* Filters Form Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs text-left">
        
        {/* Search */}
        <div className="md:col-span-4 relative flex items-center bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 transition-all gap-2">
          <Search size={16} className="text-slate-450" />
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
          />
        </div>

        {/* Order Status Filter */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-9"
          >
            <option value="All">All Statuses</option>
            {statuses.filter(s => s !== 'All').map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <select
            value={paymentStatusFilter}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-9"
          >
            <option value="All">All Payments</option>
            {paymentStatuses.filter(p => p !== 'All').map((pst) => (
              <option key={pst} value={pst}>
                {pst}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Select */}
        <div className="md:col-span-3 flex flex-col gap-1">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-9"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div className="md:col-span-1 flex justify-end">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 rounded-xl transition-all cursor-pointer flex items-center justify-center border border-slate-200/40"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Bulk Status Update Toolbar */}
      {selectedCount > 0 && (
        <div className="flex flex-col lg:flex-row items-center justify-between bg-indigo-50/70 border border-indigo-100/70 px-5 py-3 rounded-2xl animate-in slide-in-from-top-2 duration-200 gap-3 text-left">
          <div className="flex items-center gap-2 flex-shrink-0">
            <ShieldAlert size={16} className="text-indigo-650" />
            <span className="text-xs font-extrabold text-indigo-950">
              {selectedCount} {selectedCount === 1 ? 'order' : 'orders'} selected for batch update
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-end">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Update Status:</span>
            
            <button
              onClick={() => onBulkStatusUpdate('Confirmed')}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-[9px] font-bold text-slate-700 hover:text-indigo-750 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={11} />
              <span>Confirm</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Packed')}
              className="px-2.5 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-200 text-[9px] font-bold text-slate-700 hover:text-sky-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Box size={11} />
              <span>Pack</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Shipped')}
              className="px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-[9px] font-bold text-slate-700 hover:text-blue-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Send size={11} />
              <span>Ship</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Out For Delivery')}
              className="px-2.5 py-1.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-200 text-[9px] font-bold text-slate-700 hover:text-purple-750 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Truck size={11} />
              <span>Out For Delivery</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Delivered')}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-250 text-[9px] font-bold text-slate-700 hover:text-emerald-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={11} className="fill-emerald-100 text-emerald-700" />
              <span>Deliver</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Cancelled')}
              className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-[9px] font-bold text-slate-700 hover:text-rose-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <XCircle size={11} />
              <span>Cancel</span>
            </button>

            <button
              onClick={() => onBulkStatusUpdate('Returned')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-105 border border-slate-200 hover:border-slate-350 text-[9px] font-bold text-slate-700 hover:text-slate-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} />
              <span>Return</span>
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
