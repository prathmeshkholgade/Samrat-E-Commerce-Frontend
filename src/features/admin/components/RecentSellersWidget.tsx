import React from 'react';
import { useAppSelector } from '../../../store';
import { Store, ShieldCheck } from 'lucide-react';

export const RecentSellersWidget: React.FC = () => {
  const { sellers } = useAppSelector((state) => state.admin);
  const recentSellers = sellers.filter((s) => s.status === 'Approved');

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-5 text-left flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Store className="text-indigo-650" size={16} />
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Onboarded Merchants
        </h4>
      </div>

      <div className="flex-grow divide-y divide-slate-50 overflow-y-auto max-h-[300px]">
        {recentSellers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center h-full">
            <span className="text-xs font-bold text-slate-400">No recently active merchants.</span>
          </div>
        ) : (
          recentSellers.map((seller) => (
            <div key={seller.id} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-extrabold text-xs text-slate-850 truncate max-w-[150px]">
                    {seller.storeName}
                  </p>
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[8px] font-black text-emerald-700 uppercase tracking-wider leading-none">
                    <ShieldCheck size={9} />
                    <span>Active</span>
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-450 leading-none">
                  Applicant: <span className="font-semibold text-slate-600">{seller.name}</span>
                </p>
                <p className="text-[9px] font-mono text-slate-400 truncate max-w-[180px]">
                  {seller.email}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                  {seller.category}
                </span>
                <span className="text-[8px] font-bold text-slate-400 block mt-1">
                  {seller.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentSellersWidget;
