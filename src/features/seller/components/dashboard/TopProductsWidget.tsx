import React from 'react';
import { Trophy } from 'lucide-react';
import type { DashboardTopProduct } from '../../../../store/slices/dashboardSlice';

interface TopProductsWidgetProps {
  products: DashboardTopProduct[];
}

export const TopProductsWidget: React.FC<TopProductsWidgetProps> = ({ products }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <Trophy size={16} className="text-indigo-650" />
          <span>Top Selling Products</span>
        </h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">High-demand items generating highest revenue values.</p>
      </div>

      {/* List */}
      <div className="space-y-4 flex-grow overflow-y-auto">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between gap-4 p-2.5 rounded-2xl hover:bg-slate-50/50 transition-colors">
            
            <div className="flex items-center gap-3">
              {/* Placement badge */}
              <div className={`w-6 h-6 rounded-full font-black text-[10px] flex items-center justify-center border ${
                index === 0 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : index === 1
                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                    : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {index + 1}
              </div>

              <img 
                src={product.image} 
                alt={product.name} 
                className="w-11 h-11 object-cover rounded-xl border border-slate-100/80 bg-slate-50"
              />

              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-slate-900 line-clamp-1">{product.name}</h4>
                <p className="text-[10px] font-bold text-slate-400">Units Sold: <span className="text-slate-700">{product.unitsSold} units</span></p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block mb-0.5">Revenue</span>
              <span className="text-xs font-black text-slate-900">${product.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default TopProductsWidget;
