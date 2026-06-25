import React, { useState } from 'react';
import { Package, AlertTriangle, XCircle, Plus, Check } from 'lucide-react';
import type { SellerProduct } from '../../../../shared/types';

interface WidgetProps {
  products: SellerProduct[];
  onRestock: (productId: string, quantity: number) => Promise<void>;
}

// 1. Low Stock Products Widget
export const LowStockWidget: React.FC<WidgetProps> = ({ products, onRestock }) => {
  const lowStockItems = products.filter((p) => {
    const threshold = p.lowStockThreshold ?? 10;
    return p.stock > 0 && p.stock <= threshold;
  });

  const [restockInputs, setRestockInputs] = useState<Record<string, number>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleQuickRestock = async (productId: string) => {
    const qty = restockInputs[productId] || 0;
    if (qty <= 0) return;
    
    setSubmittingId(productId);
    try {
      await onRestock(productId, qty);
      setRestockInputs(prev => ({ ...prev, [productId]: 0 }));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between text-left h-full space-y-4">
      
      {/* Header */}
      <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
        <AlertTriangle size={14} className="text-amber-600 animate-pulse" />
        <span>Low Stock Alert Backlog ({lowStockItems.length})</span>
      </h3>

      {/* List */}
      <div className="divide-y divide-slate-150/40 overflow-y-auto max-h-[300px] flex-grow pr-1.5 space-y-3.5">
        {lowStockItems.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold">
            No products are currently low on stock! Excellent job.
          </div>
        ) : (
          lowStockItems.map((p) => {
            const threshold = p.lowStockThreshold ?? 10;
            const percentage = Math.min(100, (p.stock / threshold) * 100);
            
            return (
              <div key={p.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex gap-2.5 items-center min-w-0">
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-150" />
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 truncate max-w-[150px] leading-tight" title={p.name}>
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Progress bar ratio available/threshold */}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold block leading-none">
                        {p.stock} of {threshold} left
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Restock Input Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    value={restockInputs[p.id] || ''}
                    onChange={(e) => setRestockInputs(prev => ({ ...prev, [p.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    placeholder="+ Qty"
                    className="w-14 bg-slate-50 border border-slate-205 rounded-lg px-2 py-1 text-[11px] font-black text-center outline-hidden focus:border-indigo-500"
                    disabled={submittingId === p.id}
                  />
                  <button
                    onClick={() => handleQuickRestock(p.id)}
                    disabled={submittingId === p.id || !restockInputs[p.id]}
                    className="p-1 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm shadow-amber-100 flex items-center justify-center"
                    title="Apply Restock"
                  >
                    <Check size={12} className="stroke-[3px]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

// 2. Out Of Stock Products Widget
export const OutOfStockWidget: React.FC<WidgetProps> = ({ products, onRestock }) => {
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const [quickAddAmt, setQuickAddAmt] = useState<Record<string, number>>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const handleQuickRestock = async (productId: string, defaultQty: number) => {
    setSubmittingId(productId);
    try {
      await onRestock(productId, defaultQty);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs flex flex-col justify-between text-left h-full space-y-4">
      
      {/* Header */}
      <h3 className="text-xs font-black uppercase text-slate-455 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
        <XCircle size={14} className="text-rose-600 animate-pulse" />
        <span>Out of Stock Alerts ({outOfStockItems.length})</span>
      </h3>

      {/* List */}
      <div className="divide-y divide-slate-150/40 overflow-y-auto max-h-[300px] flex-grow pr-1.5 space-y-3.5">
        {outOfStockItems.length === 0 ? (
          <div className="text-center py-12 text-slate-450 text-xs font-semibold">
            All catalog items are stocked. No out-of-stock items!
          </div>
        ) : (
          outOfStockItems.map((p) => (
            <div key={p.id} className="pt-3.5 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex gap-2.5 items-center min-w-0">
                <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-slate-150" />
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-slate-800 truncate max-w-[150px] leading-tight" title={p.name}>
                    {p.name}
                  </p>
                  <p className="text-[10px] text-rose-500 font-bold block mt-0.5 font-mono uppercase">
                    SKU: {p.sku}
                  </p>
                </div>
              </div>

              {/* Quick +50 Restock button */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleQuickRestock(p.id, 50)}
                  disabled={submittingId === p.id}
                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  <Plus size={11} className="stroke-[3px]" />
                  <span>Restock +50</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
