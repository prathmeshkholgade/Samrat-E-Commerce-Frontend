import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface BulkUpdateStockModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onSave: (amount: number, isAbsolute: boolean, lowStockThreshold?: number, notes: string) => Promise<void>;
}

export const BulkUpdateStockModal: React.FC<BulkUpdateStockModalProps> = ({
  isOpen,
  selectedCount,
  onClose,
  onSave,
}) => {
  const [updateStockEnabled, setUpdateStockEnabled] = useState(true);
  const [isAbsolute, setIsAbsolute] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);

  const [updateThresholdEnabled, setUpdateThresholdEnabled] = useState(false);
  const [threshold, setThreshold] = useState<number>(10);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUpdateStockEnabled(true);
      setIsAbsolute(false);
      setQuantity(0);
      setUpdateThresholdEnabled(false);
      setThreshold(10);
      setNotes('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!updateStockEnabled && !updateThresholdEnabled) {
        throw new Error('Please select at least one field to update (Available Stock or Low Threshold).');
      }

      if (updateStockEnabled && isAbsolute && quantity < 0) {
        throw new Error('Absolute stock cannot be negative.');
      }

      if (updateThresholdEnabled && threshold < 0) {
        throw new Error('Threshold cannot be negative.');
      }

      const passThreshold = updateThresholdEnabled ? threshold : undefined;
      const passQty = updateStockEnabled ? quantity : 0;
      // If stock update is disabled, isAbsolute must be false and amount must be 0 so no available stock change occurs
      const passIsAbsolute = updateStockEnabled ? isAbsolute : false;

      await onSave(passQty, passIsAbsolute, passThreshold, notes.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error executing batch update.');
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
            <h3 className="font-extrabold text-slate-900 text-base leading-none">Bulk Adjust Stock Settings</h3>
            <p className="text-[10px] text-indigo-600 font-black mt-1.5 uppercase">Applying changes to {selectedCount} selected items</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Section 1: Update Stock Available */}
          <div className="border border-slate-150/55 rounded-2xl p-4 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={updateStockEnabled}
                onChange={(e) => setUpdateStockEnabled(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-350 text-indigo-650 accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-black text-slate-800">Update Available Stock levels</span>
            </label>

            {updateStockEnabled && (
              <div className="space-y-3 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                {/* Segment control */}
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-lg gap-1">
                  <button
                    type="button"
                    onClick={() => { setIsAbsolute(false); setQuantity(0); }}
                    className={`py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
                      !isAbsolute ? 'bg-white text-indigo-650 shadow-3xs' : 'text-slate-500'
                    }`}
                  >
                    Add / Subtract Quantity
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAbsolute(true); setQuantity(0); }}
                    className={`py-1.5 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
                      isAbsolute ? 'bg-white text-indigo-650 shadow-3xs' : 'text-slate-500'
                    }`}
                  >
                    Set Absolute Stock
                  </button>
                </div>

                {/* Amount input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-450">
                    {isAbsolute ? 'Set New Available Stock for all' : 'Amount to Add (positive) or Subtract (negative)'}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    placeholder={isAbsolute ? 'e.g. 100' : 'e.g. 50 or -10'}
                    className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs outline-hidden focus:border-indigo-500 font-extrabold text-slate-850"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Update Low Stock Threshold */}
          <div className="border border-slate-150/55 rounded-2xl p-4 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={updateThresholdEnabled}
                onChange={(e) => setUpdateThresholdEnabled(e.target.checked)}
                className="w-4 h-4 rounded-sm border-slate-350 text-indigo-650 accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-black text-slate-800">Update Low Stock Threshold limits</span>
            </label>

            {updateThresholdEnabled && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
                <label className="text-[9px] font-black uppercase text-slate-450">New Threshold Value</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                  placeholder="e.g. 15"
                  className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs outline-hidden focus:border-indigo-500 font-extrabold text-slate-850"
                />
              </div>
            )}
          </div>

          {/* Notes audit logs */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-450 block">Audit Log Reason Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Restocked batch items, bulk audit adjustments"
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

          {/* Footer buttons */}
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
              {isSubmitting ? 'Processing Batch...' : `Apply Bulk updates to ${selectedCount} Items`}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default BulkUpdateStockModal;
