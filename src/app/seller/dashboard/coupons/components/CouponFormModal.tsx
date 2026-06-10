import React, { useState, useEffect } from 'react';
import { X, Tag, Calendar, AlertCircle } from 'lucide-react';
import type { SellerCoupon } from '../../../../../shared/types';

interface CouponFormModalProps {
  isOpen: boolean;
  coupon: SellerCoupon | null; // Null means create, not null means edit
  onClose: () => void;
  onSave: (couponData: Omit<SellerCoupon, 'id' | 'usageCount' | 'revenueGenerated'> & { id?: string }) => Promise<void>;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  coupon,
  onClose,
  onSave,
}) => {
  // Form states
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [minPurchase, setMinPurchase] = useState<number>(0);
  const [maxDiscount, setMaxDiscount] = useState<number>(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<SellerCoupon['status']>('Active');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Prepopulate if editing
  useEffect(() => {
    if (coupon) {
      setCode(coupon.code);
      setDiscountType(coupon.discountType);
      setDiscountValue(coupon.discountValue);
      setMinPurchase(coupon.minPurchase);
      setMaxDiscount(coupon.maxDiscount || 0);
      setStartDate(coupon.startDate);
      setEndDate(coupon.endDate);
      setStatus(coupon.status);
    } else {
      // Defaults for create mode
      setCode('');
      setDiscountType('Percentage');
      setDiscountValue(0);
      setMinPurchase(0);
      setMaxDiscount(0);
      
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];
      
      setStartDate(today);
      setEndDate(nextMonthStr);
      setStatus('Active');
    }
    setValidationError('');
  }, [coupon, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Code validation
    const cleanedCode = code.trim().toUpperCase();
    if (!cleanedCode) {
      setValidationError('Coupon code is required.');
      return;
    }
    if (!/^[A-Z0-9_-]{3,20}$/.test(cleanedCode)) {
      setValidationError('Code must be 3-20 characters and alphanumeric (dashes/underscores allowed).');
      return;
    }

    // Value validations
    if (discountValue <= 0) {
      setValidationError('Discount value must be greater than 0.');
      return;
    }
    if (discountType === 'Percentage' && discountValue > 100) {
      setValidationError('Percentage discount cannot exceed 100%.');
      return;
    }

    if (minPurchase < 0) {
      setValidationError('Minimum purchase amount cannot be negative.');
      return;
    }

    if (discountType === 'Percentage' && maxDiscount < 0) {
      setValidationError('Maximum discount cannot be negative.');
      return;
    }

    // Date validations
    if (!startDate || !endDate) {
      setValidationError('Start date and end date are both required.');
      return;
    }

    if (endDate < startDate) {
      setValidationError('End date cannot be prior to start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        ...(coupon ? { id: coupon.id } : {}),
        code: cleanedCode,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount: discountType === 'Percentage' ? (maxDiscount || undefined) : undefined,
        startDate,
        endDate,
        status: coupon ? status : 'Active', // New coupons are active by default
      });
      onClose();
    } catch (err: any) {
      setValidationError(err?.message || 'Failed to save coupon.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
              <Tag size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none">
                {coupon ? 'Modify Coupon Code' : 'Generate Promo Coupon'}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                {coupon ? 'Update this coupon\'s rules and settings.' : 'Set up discounts, spend thresholds, and active dates.'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-450 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* Coupon Code Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-450 block">Coupon Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SUPERAUTUMN20"
                className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-bold text-slate-800 uppercase"
                disabled={!!coupon} // Cannot change coupon code once created
              />
              {!coupon && (
                <p className="text-[9px] text-slate-400 font-semibold leading-normal">Unique alphanumeric code used by customers at checkout.</p>
              )}
            </div>

            {/* Row: Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block">Discount Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed Amount">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block">Discount Value</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder={discountType === 'Percentage' ? 'e.g. 15' : 'e.g. 50'}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

            </div>

            {/* Row: Min Purchase & Max Discount */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block">Minimum Purchase ($)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={minPurchase || ''}
                  onChange={(e) => setMinPurchase(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 100"
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[10px] font-black uppercase block ${discountType === 'Fixed Amount' ? 'text-slate-300' : 'text-slate-455'}`}>
                  Max Discount ($) {discountType === 'Fixed Amount' && '(N/A)'}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={discountType === 'Percentage' ? (maxDiscount || '') : ''}
                  onChange={(e) => setMaxDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 30 (Optional)"
                  disabled={discountType === 'Fixed Amount'}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-bold text-slate-800 disabled:bg-slate-50 disabled:text-slate-350 disabled:border-slate-150"
                />
              </div>

            </div>

            {/* Row: Start & End Dates */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-400" />
                  <span>Start Date</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block flex items-center gap-1.5">
                  <Calendar size={12} className="text-slate-400" />
                  <span>End Date</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                />
              </div>

            </div>

            {/* Status Option (Only visible when editing) */}
            {coupon && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-450 block">Status State</label>
                <div className="flex gap-3">
                  {(['Active', 'Disabled', 'Expired'] as SellerCoupon['status'][]).map((st) => (
                    <label 
                      key={st} 
                      className={`flex-1 border p-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        status === st
                          ? 'border-indigo-650 bg-indigo-50/20 text-indigo-700 font-extrabold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500 font-bold'
                      }`}
                    >
                      <input
                        type="radio"
                        name="coupon_status"
                        checked={status === st}
                        onChange={() => setStatus(st)}
                        className="sr-only"
                      />
                      <span className="text-[11px] uppercase tracking-wider">{st}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Error banner */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-bold leading-normal">
                <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

          </div>

          {/* Footer buttons */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-205 text-slate-550 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Saving Coupon...' : coupon ? 'Save Settings' : 'Create Coupon'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CouponFormModal;
