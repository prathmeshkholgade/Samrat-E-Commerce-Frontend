import React from 'react';
import { Search, RotateCcw, Star, ShieldAlert } from 'lucide-react';

interface ReviewFiltersProps {
  searchQuery: string;
  ratingFilter: 'All' | '5' | '4' | '3' | '2' | '1';
  statusFilter: 'All' | 'Replied' | 'Unreplied' | 'Reported';
  onSearchChange: (query: string) => void;
  onRatingChange: (rating: 'All' | '5' | '4' | '3' | '2' | '1') => void;
  onStatusChange: (status: 'All' | 'Replied' | 'Unreplied' | 'Reported') => void;
  onResetFilters: () => void;
}

export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  searchQuery,
  ratingFilter,
  statusFilter,
  onSearchChange,
  onRatingChange,
  onStatusChange,
  onResetFilters,
}) => {
  const isFiltered = searchQuery !== '' || ratingFilter !== 'All' || statusFilter !== 'All';

  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4 text-left select-none">
      
      {/* Search Bar */}
      <div className="w-full md:max-w-xs relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 hover:bg-slate-100/60 focus-within:border-indigo-500 transition-all gap-2">
        <Search size={15} className="text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search product, customer name..."
          className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
        />
      </div>

      {/* Filters selectors */}
      <div className="w-full md:w-auto flex flex-wrap items-center justify-end gap-3.5">
        
        {/* Rating Select dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-100/50 transition-colors relative">
          <Star size={13} className="text-slate-400" />
          <select
            value={ratingFilter}
            onChange={(e) => onRatingChange(e.target.value as any)}
            className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
          >
            <option value="All">Rating: All Stars</option>
            <option value="5">Rating: 5 Stars ★★★★★</option>
            <option value="4">Rating: 4 Stars ★★★★☆</option>
            <option value="3">Rating: 3 Stars ★★★☆☆</option>
            <option value="2">Rating: 2 Stars ★★☆☆☆</option>
            <option value="1">Rating: 1 Star  ★☆☆☆☆</option>
          </select>
        </div>

        {/* Status Select dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-655 hover:bg-slate-100/50 transition-colors relative">
          <ShieldAlert size={13} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as any)}
            className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
          >
            <option value="All">Status: All Statuses</option>
            <option value="Unreplied">Status: Unreplied</option>
            <option value="Replied">Status: Replied</option>
            <option value="Reported">Status: Reported</option>
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

export default ReviewFilters;
