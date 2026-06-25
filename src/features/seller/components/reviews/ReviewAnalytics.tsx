import React from 'react';
import { Star, MessageSquare, Award } from 'lucide-react';
import type { SellerReview } from '../../../../shared/types';

interface ReviewAnalyticsProps {
  reviews: SellerReview[];
}

export const ReviewAnalytics: React.FC<ReviewAnalyticsProps> = ({ reviews }) => {
  const totalReviews = reviews.length;
  
  // Average rating
  const avgRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;

  // Distribution counts
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    const star = Math.round(r.rating) as 5|4|3|2|1;
    if (distribution[star] !== undefined) {
      distribution[star]++;
    }
  });

  const renderStars = (score: number) => {
    const stars = [];
    const floor = Math.floor(score);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={14}
          className={`${i <= floor ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} shrink-0`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left select-none">
      
      {/* 1. Average Rating Card */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-center space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Average Store Rating</span>
        
        <div className="flex items-baseline gap-2.5">
          <span className="text-4xl font-black text-slate-900 leading-none">{avgRating.toFixed(1)}</span>
          <span className="text-xs font-bold text-slate-400">out of 5.0</span>
        </div>

        <div className="flex items-center gap-1">
          {renderStars(avgRating)}
          <span className="text-[10px] text-slate-450 font-bold ml-1.5">Storewide Score</span>
        </div>
      </div>

      {/* 2. Total reviews count */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-center space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Reviews Registry Log</span>
        
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900 leading-none">{totalReviews}</span>
          <span className="text-xs font-bold text-slate-400">Customer feedback logs</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <MessageSquare size={13} className="text-slate-400" />
          <span>95% Positive Response Rate</span>
        </div>
      </div>

      {/* 3. Distribution list progress */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-3xs space-y-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Rating Distribution</span>
        
        <div className="space-y-1.5">
          {([5, 4, 3, 2, 1] as const).map(star => {
            const count = distribution[star];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2.5 text-[10px] font-bold text-slate-500">
                <span className="w-3 shrink-0 text-right">{star}★</span>
                
                {/* Progress bar container */}
                <div className="flex-grow h-2 bg-slate-50 border border-slate-150/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <span className="w-8 shrink-0 text-slate-400 font-bold text-right">
                  {count} ({Math.round(percentage)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ReviewAnalytics;
