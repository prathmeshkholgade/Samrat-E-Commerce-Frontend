import React from 'react';
import { Search, RotateCcw, ArrowUpDown } from 'lucide-react';

interface CustomerFiltersProps {
  searchQuery: string;
  sortBy: 'name-asc' | 'name-desc' | 'spend-desc' | 'orders-desc';
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'name-asc' | 'name-desc' | 'spend-desc' | 'orders-desc') => void;
  onResetFilters: () => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchQuery,
  sortBy,
  onSearchChange,
  onSortChange,
  onResetFilters,
}) => {
  const isFiltered = searchQuery !== '' || sortBy !== 'spend-desc';

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
      
      {/* Search Input bar */}
      <div className="w-full sm:max-w-xs relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 hover:bg-slate-100/60 focus-within:border-indigo-500 transition-all gap-2">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
        />
      </div>

      {/* Sorting dropdown */}
      <div className="w-full sm:w-auto flex items-center justify-end gap-3 select-none">
        
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100/50 transition-colors relative">
          <ArrowUpDown size={13} className="text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
          >
            <option value="spend-desc">Sort: Total Spend (High to Low)</option>
            <option value="orders-desc">Sort: Orders Count (High to Low)</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="name-desc">Sort: Name (Z-A)</option>
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
  );
};

export default CustomerFilters;
