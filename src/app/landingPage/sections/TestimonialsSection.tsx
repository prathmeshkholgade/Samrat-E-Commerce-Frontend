import React from 'react';
import { Star, Quote } from 'lucide-react';
import SectionTitle from '../../../shared/components/SectionTitle';
import { reviewsData } from '../../../shared/data/mockData';
import type { Testimonial } from '../../../shared/types';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <SectionTitle
          badge="Reviews & Feedback"
          title="Loved by Buyers & Sellers Alike"
          subtitle="See what our active shoppers and commercial merchant partners have to say about their experiences."
          align="center"
        />

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviewsData.map((review: Testimonial) => (
            <div
              key={review.id}
              className="bg-slate-50 dark:bg-slate-950 p-6 md:p-8 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              {/* Giant quote watermark */}
              <Quote
                size={80}
                className="absolute right-4 bottom-4 text-slate-200/40 dark:text-slate-800/10 pointer-events-none -z-0"
              />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                {/* Star Ratings */}
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(review.rating) ? 'currentColor' : 'transparent'}
                        className={i < Math.floor(review.rating) ? '' : 'text-slate-200 dark:text-slate-700'}
                      />
                    ))}
                  </div>

                  {/* Customer / Vendor Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${review.type === 'customer'
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'text-indigo-700 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30'
                      }`}
                  >
                    {review.type === 'customer' ? 'Verified Buyer' : 'Verified Vendor'}
                  </span>
                </div>

                {/* Quote Text */}
                <blockquote className="text-base md:text-lg text-slate-700 dark:text-slate-350 italic leading-relaxed">
                  "{review.quote}"
                </blockquote>

                {/* Profile Card */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow"
                    loading="lazy"
                  />
                  <div>
                    <cite className="not-italic font-extrabold text-slate-900 dark:text-white block text-sm">
                      {review.name}
                    </cite>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mt-0.5">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
