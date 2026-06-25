import React from 'react';
import { Search, RotateCcw, Plus } from 'lucide-react';

interface CouponFiltersProps {
  searchQuery: string;
  statusFilter: 'All' | 'Active' | 'Disabled' | 'Expired';
  onSearchChange: (query: string) => void;
  onStatusChange: (status: 'All' | 'Active' | 'Disabled' | 'Expired') => void;
  onResetFilters: () => void;
  onAddClick: () => void;
}

export const CouponFilters: React.FC<CouponFiltersProps> = ({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onResetFilters,
  onAddClick,
}) => {
  const isFiltered = searchQuery !== '' || statusFilter !== 'All';

  const filterOptions: { label: string; value: 'All' | 'Active' | 'Disabled' | 'Expired' }[] = [
    { label: 'All Coupons', value: 'All' },
    { label: 'Active', value: 'Active' },
    { label: 'Disabled', value: 'Disabled' },
    { label: 'Expired', value: 'Expired' },
  ];

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4 text-left">
      
      {/* Search Input bar */}
      <div className="w-full md:max-w-xs relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 hover:bg-slate-100/60 focus-within:border-indigo-500 transition-all gap-2">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by coupon code..."
          className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
        />
      </div>

      {/* Status pills selector & Actions */}
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 self-stretch md:self-auto justify-end select-none">
        
        {/* Pills container */}
        <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-xl self-stretch sm:self-auto justify-between sm:justify-start">
          {filterOptions.map((opt) => {
            const isSelected = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onStatusChange(opt.value)}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-3xs border border-slate-200/50'
                    : 'text-slate-450 hover:text-slate-800'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
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

          {/* Create Coupon Button */}
          <button
            onClick={onAddClick}
            className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-100 flex items-center gap-2 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Coupon</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default CouponFilters;
