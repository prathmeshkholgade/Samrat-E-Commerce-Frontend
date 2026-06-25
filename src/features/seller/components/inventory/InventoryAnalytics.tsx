import React from 'react';
import { Package, TrendingUp, AlertTriangle, XCircle, BarChart2 } from 'lucide-react';
import type { SellerProduct } from '../../../../shared/types';

interface InventoryAnalyticsProps {
  products: SellerProduct[];
}

export const InventoryAnalytics: React.FC<InventoryAnalyticsProps> = ({ products }) => {
  const totalSKUs = products.length;
  const totalAvailableStock = products.reduce((acc, p) => acc + p.stock, 0);
  
  const lowStockThresholdCount = products.filter(p => {
    const threshold = p.lowStockThreshold ?? 10;
    return p.stock > 0 && p.stock <= threshold;
  }).length;

  const outOfStockCount = products.filter(p => p.stock === 0).length;

  // Let's compute a mock stock valuation
  const totalStockValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
      
      {/* 1. Total Catalog SKUs */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Catalog SKUs</span>
          <span className="text-2xl font-black text-slate-900 block leading-none">{totalSKUs}</span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Total unique products</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-650">
          <Package size={18} />
        </div>
      </div>

      {/* 2. Total Available Stock */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Available Stock</span>
          <span className="text-2xl font-black text-slate-900 block leading-none">{totalAvailableStock}</span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Valued at ${totalStockValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
          <TrendingUp size={18} />
        </div>
      </div>

      {/* 3. Low Stock Alerts */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Low Stock Alerts</span>
          <span className={`text-2xl font-black block leading-none ${lowStockThresholdCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>
            {lowStockThresholdCount}
          </span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Under threshold limits</span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStockThresholdCount > 0 ? 'bg-amber-50 border border-amber-100 text-amber-600' : 'bg-slate-50 border border-slate-100 text-slate-650'}`}>
          <AlertTriangle size={18} />
        </div>
      </div>

      {/* 4. Out Of Stock */}
      <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Out of Stock</span>
          <span className={`text-2xl font-black block leading-none ${outOfStockCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {outOfStockCount}
          </span>
          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Needs immediate restock</span>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${outOfStockCount > 0 ? 'bg-rose-50 border border-rose-100 text-rose-600' : 'bg-slate-50 border border-slate-100 text-slate-650'}`}>
          <XCircle size={18} />
        </div>
      </div>

    </div>
  );
};

export default InventoryAnalytics;
