import React, { useState, useRef, useEffect } from 'react';
import { Edit3, Eye, MoreVertical, ArrowLeft, ArrowRight } from 'lucide-react';
import type { SellerProduct } from '../../../../shared/types';

interface InventoryTableProps {
  products: SellerProduct[];
  reservedStockMap: Record<string, number>;
  selectedIds: string[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  onUpdateStock: (product: SellerProduct) => void;
  onViewHistory: (product: SellerProduct) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  reservedStockMap,
  selectedIds,
  currentPage,
  itemsPerPage,
  totalCount,
  onToggleSelect,
  onSelectAll,
  onPageChange,
  onUpdateStock,
  onViewHistory,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Determine if all items on the current page are selected
  const currentPageIds = products.map((p) => p.id);
  const isAllSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      onSelectAll(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelections = [...selectedIds];
      currentPageIds.forEach((id) => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      onSelectAll(newSelections);
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) {
      return { label: 'Out of Stock', badge: 'bg-rose-50 border-rose-200 text-rose-700' };
    }
    if (stock <= threshold) {
      return { label: 'Low Stock', badge: 'bg-amber-50 border-amber-200 text-amber-700' };
    }
    return { label: 'In Stock', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700' };
  };

  // Pagination bounds
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Actions dropdown per row state
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    if (activeDropdownId) {
      document.addEventListener('mousedown', clickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [activeDropdownId]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      {/* Table grid */}
      <div className="overflow-x-auto min-h-[250px]" ref={dropdownRef}>
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Edit3 size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Products Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or filters.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2 w-8">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllToggle}
                    className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                </th>
                <th className="py-3 px-2">Product Name</th>
                <th className="py-3 px-2">SKU</th>
                <th className="py-3 px-2 text-right">Available</th>
                <th className="py-3 px-2 text-right">Reserved</th>
                <th className="py-3 px-2 text-right">Total Stock</th>
                <th className="py-3 px-2 text-right">Threshold</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
              {products.map((p) => {
                const isChecked = selectedIds.includes(p.id);
                const isDropdownOpen = activeDropdownId === p.id;

                const reserved = reservedStockMap[p.id] || 0;
                const total = p.stock + reserved;
                const threshold = p.lowStockThreshold ?? 10;
                const status = getStockStatus(p.stock, threshold);

                return (
                  <tr key={p.id} className={`hover:bg-slate-55/30 transition-colors ${isChecked ? 'bg-indigo-50/10' : ''}`}>
                    
                    {/* Checkbox */}
                    <td className="py-3.5 px-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelect(p.id)}
                        className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                    </td>

                    {/* Product Cell */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-150 bg-slate-50 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-slate-800 font-extrabold truncate max-w-[180px] leading-tight" title={p.name}>
                            {p.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 block">
                            {p.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-2 text-slate-900 font-extrabold font-mono text-[10px] uppercase">
                      {p.sku}
                    </td>

                    {/* Available */}
                    <td className="py-3 px-2 text-right">
                      <span className={`text-[12px] font-black ${
                        p.stock === 0 ? 'text-rose-600' : p.stock <= threshold ? 'text-amber-600' : 'text-slate-900'
                      }`}>
                        {p.stock}
                      </span>
                    </td>

                    {/* Reserved */}
                    <td className="py-3 px-2 text-right">
                      <span className={`text-[11px] font-bold ${reserved > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {reserved}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-3 px-2 text-right text-slate-900 font-black text-[12px]">
                      {total}
                    </td>

                    {/* Threshold */}
                    <td className="py-3 px-2 text-right text-slate-450 font-bold">
                      {threshold}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-extrabold tracking-wider ${status.badge}`}>
                        {status.label}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 px-2 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : p.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-850 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-2 mt-1 w-40 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-2">
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onUpdateStock(p);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Edit3 size={13} className="text-slate-400" />
                            <span>Adjust Stock</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onViewHistory(p);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Eye size={13} className="text-slate-400" />
                            <span>Stock History</span>
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
      {products.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> catalog SKUs
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

export default InventoryTable;
