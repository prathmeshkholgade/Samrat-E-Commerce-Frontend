import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  subtext?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon,
  trend,
  subtext,
}) => {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs hover:shadow-2xs transition-all duration-300 flex items-start justify-between text-left">
      <div className="space-y-2">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          {label}
        </span>
        <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-none">
          {value}
        </h4>
        
        {(trend || subtext) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {trend && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-rose-50 text-rose-700'
              }`}>
                {trend.value}
              </span>
            )}
            {subtext && (
              <span className="text-[9px] font-semibold text-slate-400 leading-none">
                {subtext}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl text-slate-500 border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;
