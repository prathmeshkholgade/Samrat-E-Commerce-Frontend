import React, { useState, useRef, useEffect } from 'react';
import { Star, MessageSquare, AlertOctagon, CornerDownRight, MoreVertical, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import type { SellerReview } from '../../../../shared/types';

interface ReviewTableProps {
  reviews: SellerReview[];
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onReply: (review: SellerReview) => void;
  onReport: (review: SellerReview) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  currentPage,
  itemsPerPage,
  totalCount,
  onPageChange,
  onReply,
  onReport,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

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

  const renderStars = (score: number) => {
    const stars = [];
    const floor = Math.round(score);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={11}
          className={`${i <= floor ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} shrink-0`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      <div className="overflow-x-auto min-h-[250px]" ref={dropdownRef}>
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Reviews Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or filters.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2 w-[180px]">Product</th>
                <th className="py-3 px-2 w-[130px]">Customer</th>
                <th className="py-3 px-2 text-center w-[90px]">Rating</th>
                <th className="py-3 px-2">Review & Reply</th>
                <th className="py-3 px-2 text-center w-[90px]">Date</th>
                <th className="py-3 px-2 text-right w-[60px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
              {reviews.map((r) => {
                const isDropdownOpen = activeDropdownId === r.id;

                return (
                  <tr key={r.id} className={`align-top hover:bg-slate-55/20 transition-colors ${r.status === 'Reported' ? 'bg-rose-50/20' : ''}`}>
                    
                    {/* Product Cell */}
                    <td className="py-3.5 px-2">
                      <div className="flex items-start gap-2.5">
                        <img
                          src={r.productImage || 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=60&q=80'}
                          alt={r.productName}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-150"
                        />
                        <div className="min-w-0">
                          <p className="text-slate-850 font-extrabold truncate max-w-[140px] leading-tight" title={r.productName}>
                            {r.productName}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 block font-mono uppercase mt-0.5">
                            SKU: {r.productId.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-2">
                      <p className="text-slate-800 font-extrabold">{r.customerName}</p>
                      <span className="text-[9px] text-slate-400 font-semibold block mt-0.5 truncate max-w-[125px]">
                        {r.customerEmail}
                      </span>
                    </td>

                    {/* Rating stars */}
                    <td className="py-3.5 px-2 text-center">
                      <div className="flex items-center justify-center gap-0.5">
                        {renderStars(r.rating)}
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-1">{r.rating}.0 / 5</span>
                    </td>

                    {/* Review comment text */}
                    <td className="py-3.5 px-2 font-semibold text-slate-600 leading-relaxed text-left space-y-2 max-w-[320px]">
                      <p className="text-slate-700 italic">"{r.comment}"</p>
                      
                      {/* Nested reply block */}
                      {r.reply ? (
                        <div className="bg-slate-50 border border-slate-150/50 p-2.5 rounded-xl flex items-start gap-2 text-[10px] text-slate-500 font-medium">
                          <CornerDownRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <p className="font-extrabold text-indigo-950">Seller's Response:</p>
                            <p className="text-slate-550 leading-relaxed">"{r.reply.message}"</p>
                            <span className="text-[8px] font-black text-slate-400 block mt-1">REPLIED ON {r.reply.date}</span>
                          </div>
                        </div>
                      ) : r.status === 'Reported' ? (
                        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2 rounded-lg flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider">
                          <AlertOctagon size={12} className="text-rose-600 shrink-0" />
                          <span>Flagged / Reported by Store Moderator</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onReply(r)}
                          className="px-2 py-0.5 text-[9px] font-black uppercase text-indigo-650 hover:text-indigo-855 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer border border-indigo-150/55"
                        >
                          + Reply to Review
                        </button>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-2 text-center text-slate-400 font-semibold text-[11px]">
                      {r.date}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-2 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : r.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-850 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-2 mt-1 w-36 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-2">
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onReply(r);
                            }}
                            disabled={r.status === 'Reported'}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40"
                          >
                            <MessageSquare size={13} className="text-slate-400" />
                            <span>{r.reply ? 'Edit Reply' : 'Add Reply'}</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onReport(r);
                            }}
                            disabled={r.status === 'Reported'}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-40"
                          >
                            <AlertOctagon size={13} className="text-rose-400" />
                            <span>Report / Flag</span>
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

      {/* Pagination */}
      {reviews.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-455">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> reviews
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-855 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
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
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-855 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewTable;
