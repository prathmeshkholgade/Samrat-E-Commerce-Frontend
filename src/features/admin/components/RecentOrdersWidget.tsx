import React from 'react';
import { useAppSelector } from '../../../store';
import { ShoppingBag } from 'lucide-react';

export const RecentOrdersWidget: React.FC = () => {
  const { recentOrders } = useAppSelector((state) => state.admin);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-5 text-left flex flex-col h-full">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <ShoppingBag className="text-indigo-650" size={16} />
        <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">
          Platform Orders Audit Feed
        </h4>
      </div>

      <div className="flex-grow divide-y divide-slate-50 overflow-y-auto max-h-[300px]">
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center h-full">
            <span className="text-xs font-bold text-slate-400">No orders registered on platform yet.</span>
          </div>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="py-3 flex items-start justify-between gap-3 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-extrabold text-xs text-slate-850">
                    {order.id}
                  </p>
                  <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                    order.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : order.status === 'Pending'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-100 text-slate-650 border border-slate-200'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <p className="text-[10px] text-slate-450 leading-none">
                  Customer: <span className="font-semibold text-slate-600">{order.customerName}</span>
                </p>
                <p className="text-[9px] text-slate-400">
                  Seller: <span className="font-semibold text-slate-500">{order.sellerName}</span>
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-xs font-mono font-bold text-slate-800 block">
                  ${order.amount.toFixed(2)}
                </span>
                <span className="text-[8px] font-bold text-slate-400 block mt-1">
                  {order.date}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentOrdersWidget;
