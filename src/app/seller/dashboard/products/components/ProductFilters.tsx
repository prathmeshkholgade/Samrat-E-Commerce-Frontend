import React from 'react';
import { Search, RotateCcw, Trash2, ShieldAlert, CheckCircle2, FileText, Ban } from 'lucide-react';
import type { SellerProduct } from '../../../../../shared/types';

interface ProductFiltersProps {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  sortBy: string;
  categories: string[];
  selectedCount: number;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string) => void;
  onResetFilters: () => void;
  onBulkDelete: () => void;
  onBulkStatusUpdate: (status: SellerProduct['status']) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  statusFilter,
  categoryFilter,
  sortBy,
  categories,
  selectedCount,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  onBulkDelete,
  onBulkStatusUpdate,
}) => {
  const statuses = ['All', 'Published', 'Draft', 'Out of Stock', 'Archived'];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || categoryFilter !== 'All' || sortBy !== 'name-asc';

  return (
    <div className="space-y-4">
      {/* Search and Filters grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs text-left">
        
        {/* Search */}
        <div className="md:col-span-4 relative flex items-center bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 transition-all gap-2">
          <Search size={16} className="text-slate-450" />
          <input
            type="text"
            placeholder="Search name, SKU..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-9"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-2 flex flex-col gap-1">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/50 hover:border-slate-350/50 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-9"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'All' ? 'All Statuses' : status}
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
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="stock-asc">Stock (Low to High)</option>
            <option value="stock-desc">Stock (High to Low)</option>
            <option value="sales-desc">Sales (High to Low)</option>
            <option value="rating-desc">Rating (High to Low)</option>
          </select>
        </div>

        {/* Reset Filters button */}
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

      {/* Bulk Actions Toolbar */}
      {selectedCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-indigo-50/70 border border-indigo-100/70 px-5 py-3 rounded-2xl animate-in slide-in-from-top-2 duration-200 gap-3 text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-650" />
            <span className="text-xs font-extrabold text-indigo-950">
              {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Bulk Status:</span>
            
            <button
              onClick={() => onBulkStatusUpdate('Published')}
              className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-250 text-[10px] font-bold text-slate-700 hover:text-emerald-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={12} />
              <span>Publish</span>
            </button>
            
            <button
              onClick={() => onBulkStatusUpdate('Draft')}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-[10px] font-bold text-slate-700 hover:text-slate-800 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <FileText size={12} />
              <span>Draft</span>
            </button>
            
            <button
              onClick={() => onBulkStatusUpdate('Archived')}
              className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-250 text-[10px] font-bold text-slate-700 hover:text-rose-700 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Ban size={12} />
              <span>Archive</span>
            </button>

            <div className="h-4 w-px bg-indigo-200 mx-1" />

            <button
              onClick={onBulkDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 border border-rose-650 text-[10px] font-bold text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Trash2 size={12} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
