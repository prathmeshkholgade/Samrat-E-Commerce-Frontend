import React from 'react';
import { Search, RotateCcw, AlertTriangle, ArrowUpDown, Tag, Edit3, Trash2 } from 'lucide-react';

interface InventoryFiltersProps {
  searchQuery: string;
  categoryFilter: string;
  stockStatusFilter: 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';
  sortBy: 'sku-asc' | 'sku-desc' | 'stock-asc' | 'stock-desc' | 'total-stock-desc';
  selectedCount: number;
  categories: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  onStockStatusChange: (status: 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock') => void;
  onSortChange: (sort: 'sku-asc' | 'sku-desc' | 'stock-asc' | 'stock-desc' | 'total-stock-desc') => void;
  onResetFilters: () => void;
  onBulkUpdateStock: () => void;
}

export const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchQuery,
  categoryFilter,
  stockStatusFilter,
  sortBy,
  selectedCount,
  categories,
  onSearchChange,
  onCategoryChange,
  onStockStatusChange,
  onSortChange,
  onResetFilters,
  onBulkUpdateStock,
}) => {
  const isFiltered = searchQuery !== '' || categoryFilter !== 'All' || stockStatusFilter !== 'All' || sortBy !== 'stock-asc';

  return (
    <div className="space-y-4 text-left select-none">
      
      {/* Search and core filters row */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search bar */}
        <div className="w-full md:max-w-xs relative flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2 hover:bg-slate-100/60 focus-within:border-indigo-500 transition-all gap-2">
          <Search size={15} className="text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search SKU or product title..."
            className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
          />
        </div>

        {/* Dropdowns filters */}
        <div className="w-full flex-grow flex flex-wrap items-center justify-end gap-3.5">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100/50 transition-colors relative">
            <Tag size={13} className="text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
            >
              <option value="All">Category: All</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Stock Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100/50 transition-colors relative">
            <AlertTriangle size={13} className="text-slate-400" />
            <select
              value={stockStatusFilter}
              onChange={(e) => onStockStatusChange(e.target.value as any)}
              className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
            >
              <option value="All">Status: All Statuses</option>
              <option value="In Stock">Status: In Stock</option>
              <option value="Low Stock">Status: Low Stock</option>
              <option value="Out of Stock">Status: Out of Stock</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/40 px-3 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-100/50 transition-colors relative">
            <ArrowUpDown size={13} className="text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-transparent pr-4 outline-hidden border-none text-[11px] font-black uppercase text-slate-700 cursor-pointer appearance-none"
            >
              <option value="stock-asc">Sort: Available (Low to High)</option>
              <option value="stock-desc">Sort: Available (High to Low)</option>
              <option value="total-stock-desc">Sort: Total Stock (High to Low)</option>
              <option value="sku-asc">Sort: SKU (A-Z)</option>
              <option value="sku-desc">Sort: SKU (Z-A)</option>
            </select>
          </div>

          {/* Clear Filters reset */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-3.5 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-550 hover:text-slate-800 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-3xs"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

        </div>

      </div>

      {/* Bulk actions banner */}
      {selectedCount > 0 && (
        <div className="bg-indigo-50/70 border border-indigo-100/80 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-3xs text-indigo-900 animate-in slide-in-from-top-3 duration-250">
          <span className="text-xs font-bold">
            Selected <span className="font-black text-indigo-755">{selectedCount}</span> catalog products for adjustments
          </span>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBulkUpdateStock}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-150 cursor-pointer inline-flex items-center gap-1.5"
            >
              <Edit3 size={13} />
              <span>Bulk Update Inventory</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default InventoryFilters;
