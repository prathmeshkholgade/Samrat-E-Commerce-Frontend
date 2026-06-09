import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import type { DashboardReview } from '../../../../../store/slices/dashboardSlice';

interface ReviewWidgetProps {
  reviews: DashboardReview[];
}

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({ reviews }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <MessageSquare size={16} className="text-indigo-650" />
          <span>Recent Customer Reviews</span>
        </h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Feedback logs left by clients on your items.</p>
      </div>

      {/* List */}
      <div className="space-y-4 flex-grow overflow-y-auto">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-3 rounded-2xl bg-slate-50/30 border border-slate-150/50 space-y-2">
            
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-800 font-extrabold">{rev.customerName}</span>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={11} 
                    className={i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                  />
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
              "{rev.message}"
            </p>

            <div className="pt-2 border-t border-slate-100 text-[9px] font-black uppercase text-slate-400">
              Product: <span className="text-indigo-600 font-black">{rev.productName}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default ReviewWidget;
