import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCcw, 
  AlertCircle, 
  Search, 
  RotateCcw,
  Calendar,
  ArrowLeft,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { SellerTransaction } from '../../../../../shared/types';

interface TransactionTableProps {
  transactions: SellerTransaction[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  typeFilter: 'All' | 'Sale' | 'Withdrawal' | 'Refund' | 'Fee';
  statusFilter: 'All' | 'Completed' | 'Pending' | 'Failed';
  onSearchChange: (query: string) => void;
  onTypeChange: (type: 'All' | 'Sale' | 'Withdrawal' | 'Refund' | 'Fee') => void;
  onStatusChange: (status: 'All' | 'Completed' | 'Pending' | 'Failed') => void;
  onResetFilters: () => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  currentPage,
  itemsPerPage,
  totalCount,
  onPageChange,
  searchQuery,
  typeFilter,
  statusFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onResetFilters,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);
  const isFiltered = searchQuery !== '' || typeFilter !== 'All' || statusFilter !== 'All';

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      {/* 1. Transaction Filter Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-50 pb-5">
        
        {/* Search Input bar */}
        <div className="w-full md:max-w-xs relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 hover:bg-slate-100/60 focus-within:border-indigo-500 transition-all gap-2">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search transaction or order ID..."
            className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
          />
        </div>

        {/* Dropdown selectors */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-end gap-3 select-none">
          
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-100/50 transition-colors">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase mr-1">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value as any)}
              className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-750 cursor-pointer appearance-none"
            >
              <option value="All">All Types</option>
              <option value="Sale">Sale Earnings</option>
              <option value="Withdrawal">Withdrawals</option>
              <option value="Refund">Refunds</option>
              <option value="Fee">Platform Fees</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-100/50 transition-colors">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase mr-1">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value as any)}
              className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-750 cursor-pointer appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          {/* Reset button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-3.5 py-2 border border-slate-205 hover:border-slate-350 hover:bg-slate-50 text-slate-550 hover:text-slate-800 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-3xs"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* 2. Transaction Ledger List */}
      <div className="overflow-x-auto min-h-[250px]">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <ArrowUpRight size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Ledger Records</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or category filter selectors.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2">Transaction ID</th>
                <th className="py-3 px-2">Order Reference</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-center">Settlement Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
              {transactions.map((tx) => {
                const isPositive = tx.amount >= 0;
                
                // Set icons and colors based on Transaction Type
                let iconEl = <ArrowUpRight size={13} />;
                let typeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                
                if (tx.type === 'Withdrawal') {
                  iconEl = <ArrowDownLeft size={13} />;
                  typeColor = 'bg-blue-50 text-blue-700 border-blue-105';
                } else if (tx.type === 'Refund') {
                  iconEl = <RefreshCcw size={12} />;
                  typeColor = 'bg-amber-50 text-amber-700 border-amber-105';
                } else if (tx.type === 'Fee') {
                  iconEl = <AlertCircle size={12} />;
                  typeColor = 'bg-slate-50 text-slate-650 border-slate-200';
                }

                return (
                  <tr key={tx.id} className="hover:bg-slate-55/30 transition-colors">
                    
                    {/* Transaction ID */}
                    <td className="py-3 px-2">
                      <span className="text-slate-900 font-mono tracking-tight text-[11px]">
                        {tx.id}
                      </span>
                    </td>

                    {/* Order Reference */}
                    <td className="py-3 px-2 font-mono">
                      {tx.orderId ? (
                        <Link 
                          to={`/seller/orders/${tx.orderId}`}
                          className="text-indigo-650 hover:underline hover:text-indigo-800 flex items-center gap-1 w-fit"
                          title="View Order Details"
                        >
                          <span>{tx.orderId}</span>
                          <ExternalLink size={11} className="opacity-60" />
                        </Link>
                      ) : (
                        <span className="text-slate-350">N/A</span>
                      )}
                    </td>

                    {/* Type Badge */}
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${typeColor}`}>
                        {iconEl}
                        <span>{tx.type}</span>
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-2 text-slate-500 font-semibold max-w-[200px] truncate" title={tx.description}>
                      {tx.description}
                    </td>

                    {/* Amount */}
                    <td className={`py-3 px-2 text-right text-[12px] font-black ${
                      isPositive ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {isPositive ? '+' : ''}${tx.amount.toFixed(2)}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                          : tx.status === 'Pending'
                          ? 'bg-amber-50 border border-amber-105 text-amber-700'
                          : 'bg-rose-50 border border-rose-100 text-rose-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-2 text-center text-slate-450 text-[10px]">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={11} className="text-slate-350 shrink-0" />
                        <span>{formatTimestamp(tx.date)}</span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 3. Pagination panel */}
      {transactions.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> ledger entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? 'bg-indigo-650 text-white shadow-md shadow-indigo-150'
                    : 'bg-white hover:bg-slate-50 text-slate-550 border border-slate-200/40 hover:border-slate-200'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransactionTable;
