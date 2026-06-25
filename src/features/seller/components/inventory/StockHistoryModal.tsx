import React from 'react';
import { X, Clock, ArrowDownRight, ArrowUpRight, FileText, AlertCircle } from 'lucide-react';
import type { SellerProduct } from '../../../../shared/types';
import type { InventoryTransaction } from '../../../../store/services/sellerApi';

interface StockHistoryModalProps {
  isOpen: boolean;
  product: SellerProduct | null;
  onClose: () => void;
  transactions: InventoryTransaction[];
}

export const StockHistoryModal: React.FC<StockHistoryModalProps> = ({
  isOpen,
  product,
  onClose,
  transactions,
}) => {
  if (!isOpen) return null;

  // Filter logs if product is specified
  const filtered = product
    ? transactions.filter((t) => t.productId === product.id)
    : transactions;

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">
              {product ? 'Product Inventory History' : 'Warehouse Stock Registry Log'}
            </h3>
            <p className="text-[10px] text-slate-450 font-bold mt-1.5 uppercase font-mono">
              {product ? `${product.name} (${product.sku})` : 'Historic record logs across all SKUs'}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Timeline Log body */}
        <div className="p-6 max-h-[450px] overflow-y-auto space-y-6">
          
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">No Transactions Logged</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">Adjust stock levels to generate adjustment entries.</p>
              </div>
            </div>
          ) : (
            <div className="relative before:absolute before:top-2 before:bottom-2 before:left-[19px] before:w-0.5 before:bg-slate-100 space-y-6">
              {filtered.map((tx) => {
                const isPositive = tx.quantityChanged >= 0;
                
                let iconColor = 'bg-emerald-50 border-emerald-250 text-emerald-600';
                let Icon = ArrowUpRight;

                if (!isPositive) {
                  iconColor = 'bg-rose-50 border-rose-250 text-rose-600';
                  Icon = ArrowDownRight;
                }
                
                if (tx.type === 'Sale') {
                  iconColor = 'bg-blue-50 border-blue-250 text-blue-600';
                  Icon = ArrowDownRight;
                }

                return (
                  <div key={tx.id} className="flex gap-4 items-start relative z-10 animate-in fade-in duration-200">
                    
                    {/* Circle icon type */}
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 shadow-3xs ${iconColor}`}>
                      <Icon size={16} />
                    </div>

                    {/* Content details */}
                    <div className="flex-grow min-w-0 text-xs">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-extrabold text-slate-800">
                          {tx.type === 'Restock'
                            ? `Catalog Restock (+${tx.quantityChanged} units)`
                            : tx.type === 'Sale'
                            ? `Order Reservation (${tx.quantityChanged} units)`
                            : `Stock Adjustment (${tx.quantityChanged >= 0 ? '+' : ''}${tx.quantityChanged} units)`
                          }
                        </p>
                        <span className="text-[10px] text-slate-400 font-bold font-mono shrink-0">
                          {tx.id}
                        </span>
                      </div>
                      
                      {/* Product Name lookup for overall listing */}
                      {!product && (
                        <p className="text-[10px] font-black text-slate-900 mt-1 uppercase font-mono bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 inline-block">
                          SKU: {tx.sku} | {tx.productName}
                        </p>
                      )}

                      <p className="text-slate-500 font-semibold mt-1 bg-slate-50/50 p-2 border border-slate-150/45 rounded-xl">
                        {tx.notes || 'No adjustment reason notes provided.'}
                      </p>

                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-bold mt-1.5">
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{formatDate(tx.timestamp)}</span>
                        </span>
                        <span className="font-mono text-slate-450">
                          Stock Level Post-Tx: {tx.newStockAvailable} Available
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Footer close */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/45">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-850 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close Registry
          </button>
        </div>

      </div>
    </div>
  );
};

export default StockHistoryModal;
