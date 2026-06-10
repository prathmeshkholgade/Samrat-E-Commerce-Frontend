import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { SellerProduct } from '../../../../../shared/types';

interface UpdateStockModalProps {
  isOpen: boolean;
  product: SellerProduct | null;
  onClose: () => void;
  onSave: (amount: number, isAbsolute: boolean, lowStockThreshold: number, notes: string) => Promise<void>;
}

export const UpdateStockModal: React.FC<UpdateStockModalProps> = ({
  isOpen,
  product,
  onClose,
  onSave,
}) => {
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(10);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setThreshold(product.lowStockThreshold ?? 10);
      setQuantity(0);
      setIsAbsolute(false);
      setNotes('');
      setError('');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate quantity
      if (isAbsolute && quantity < 0) {
        throw new Error('Absolute stock cannot be negative.');
      }
      if (!isAbsolute && product.stock + quantity < 0) {
        throw new Error(`Cannot subtract more than available stock (${product.stock} units).`);
      }
      if (threshold < 0) {
        throw new Error('Threshold cannot be negative.');
      }

      await onSave(quantity, isAbsolute, threshold, notes.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error updating stock levels.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">Adjust Product Stock</h3>
            <p className="text-[10px] text-slate-450 font-bold mt-1.5 uppercase font-mono">{product.sku}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Product details */}
          <div className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-150/50">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-black text-slate-800 truncate leading-snug">{product.name}</p>
              <p className="text-[10px] text-slate-450 font-bold mt-0.5">Current Stock available: <span className="text-slate-900 font-extrabold">{product.stock} units</span></p>
            </div>
          </div>

          {/* Mode Switch segment control */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 block">Adjustment Mode</label>
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => { setIsAbsolute(false); setQuantity(0); }}
                className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  !isAbsolute ? 'bg-white text-indigo-650 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Add / Subtract
              </button>
              <button
                type="button"
                onClick={() => { setIsAbsolute(true); setQuantity(product.stock); }}
                className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  isAbsolute ? 'bg-white text-indigo-650 shadow-3xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Set Absolute
              </button>
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Quantity Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 block">
                {isAbsolute ? 'Absolute Stock' : 'Change Amount'}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder={isAbsolute ? 'e.g. 50' : 'e.g. 10 or -5'}
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-extrabold text-slate-850"
              />
            </div>

            {/* Threshold Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 block">Low Threshold</label>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                placeholder="e.g. 10"
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-extrabold text-slate-850"
              />
            </div>

          </div>

          {/* Audit Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 block">Adjustment Reason (Notes)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Restocked from distributor, warehouse count audit"
              className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold"
            />
          </div>

          {/* Errors banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-start gap-2.5 text-[10px] font-bold">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Buttons footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-550 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center"
            >
              {isSubmitting ? 'Saving...' : 'Apply Stock Update'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default UpdateStockModal;
