import React from 'react';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import type { DashboardMetric } from '../../../../store/slices/dashboardSlice';

interface DashboardCardProps {
  metric: DashboardMetric;
  icon: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ metric, icon }) => {
  const { title, value, type, change, isPositive, label } = metric;

  // Format value depending on type
  const formatValue = () => {
    if (type === 'currency') {
      return `$${Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (type === 'rating') {
      return (
        <span className="flex items-center gap-1">
          {value}
          <Star size={16} className="fill-amber-400 text-amber-400" />
        </span>
      );
    }
    return Number(value).toLocaleString();
  };

  return (
    <div className="bg-white border border-slate-100 hover:border-slate-200 p-6 rounded-3xl shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between group relative overflow-hidden text-left">
      
      {/* Decorative Gradient Background on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-50/10 to-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight select-all pt-1.5 flex items-center">
            {formatValue()}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100/80 text-slate-500 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100/50 group-hover:text-indigo-650 transition-all duration-300">
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100/70 text-xs font-bold text-slate-450 relative z-10">
        <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black ${
          isPositive 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
            : 'bg-rose-50 text-rose-700 border border-rose-100/50'
        }`}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="truncate">{label}</span>
      </div>

    </div>
  );
};

export default DashboardCard;
