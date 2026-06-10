import React from 'react';
import { Tag, Edit, Trash2, Calendar, ArrowLeft, ArrowRight, ToggleLeft, ToggleRight } from 'lucide-react';
import type { SellerCoupon } from '../../../../../shared/types';

interface CouponTableProps {
  coupons: SellerCoupon[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onEditClick: (coupon: SellerCoupon) => void;
  onDeleteClick: (id: string) => void;
  onToggleStatus: (coupon: SellerCoupon) => void;
}

export const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  currentPage,
  itemsPerPage,
  totalCount,
  onPageChange,
  onEditClick,
  onDeleteClick,
  onToggleStatus,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      // Return brief Month Date, Year format
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      <div className="overflow-x-auto min-h-[250px]">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Tag size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Coupons Registered</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or filters, or create a new coupon.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2">Code</th>
                <th className="py-3 px-2">Discount Details</th>
                <th className="py-3 px-2">Min Spend & Cap</th>
                <th className="py-3 px-2 text-center">Active Period</th>
                <th className="py-3 px-2 text-right">Usage</th>
                <th className="py-3 px-2 text-right">Revenue Generated</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
              {coupons.map((c) => {
                const isActive = c.status === 'Active';
                const isExpired = c.status === 'Expired';
                const isDisabled = c.status === 'Disabled';

                return (
                  <tr key={c.id} className="hover:bg-slate-55/30 transition-colors">
                    
                    {/* Coupon Code */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
                          <Tag size={14} />
                        </div>
                        <div>
                          <span className="text-slate-900 font-black text-sm uppercase tracking-wider font-mono">
                            {c.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        c.discountType === 'Percentage'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {c.discountType === 'Percentage' 
                          ? `${c.discountValue}% Off` 
                          : `$${c.discountValue.toFixed(2)} Off`}
                      </span>
                    </td>

                    {/* Minimum Spend & Cap */}
                    <td className="py-3 px-2 text-slate-500 font-semibold space-y-0.5">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold">Min Spend: </span>
                        <span className="text-slate-700 font-black">${c.minPurchase.toFixed(2)}</span>
                      </div>
                      {c.maxDiscount !== undefined && (
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold">Max Discount: </span>
                          <span className="text-slate-700 font-black">${c.maxDiscount.toFixed(2)}</span>
                        </div>
                      )}
                    </td>

                    {/* Duration Range */}
                    <td className="py-3 px-2 text-center text-slate-500 font-semibold space-y-0.5">
                      <div className="flex items-center justify-center gap-1.5 text-[10px]">
                        <Calendar size={11} className="text-slate-450 shrink-0" />
                        <span>{formatDate(c.startDate)}</span>
                        <span className="text-slate-400">→</span>
                        <span>{formatDate(c.endDate)}</span>
                      </div>
                    </td>

                    {/* Usage count */}
                    <td className="py-3 px-2 text-right text-slate-900 font-extrabold text-[12px]">
                      {c.usageCount}
                    </td>

                    {/* Revenue Generated */}
                    <td className="py-3 px-2 text-right text-indigo-650 font-black text-[12px]">
                      ${c.revenueGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-2 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
                          : isDisabled
                          ? 'bg-amber-50 border border-amber-105 text-amber-700'
                          : 'bg-rose-50 border border-rose-100 text-rose-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        
                        {/* Toggle switch for active/disabled */}
                        {!isExpired && (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(c)}
                            title={isActive ? 'Deactivate Coupon' : 'Activate Coupon'}
                            className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-650 transition-colors cursor-pointer"
                          >
                            {isActive ? (
                              <ToggleRight size={22} className="text-indigo-600" />
                            ) : (
                              <ToggleLeft size={22} className="text-slate-400" />
                            )}
                          </button>
                        )}

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditClick(c)}
                          className="p-1.5 hover:bg-slate-50 text-slate-450 hover:text-slate-800 border border-transparent hover:border-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Coupon"
                        >
                          <Edit size={13} />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete coupon ${c.code}?`)) {
                              onDeleteClick(c.id);
                            }
                          }}
                          className="p-1.5 hover:bg-rose-50 text-slate-450 hover:text-rose-600 border border-transparent hover:border-rose-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 size={13} />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {coupons.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> coupon entries
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

export default CouponTable;
