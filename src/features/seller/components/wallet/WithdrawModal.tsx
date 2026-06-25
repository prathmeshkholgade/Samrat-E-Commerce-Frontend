import React, { useState, useEffect } from 'react';
import { X, Landmark, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  availableBalance: number;
  onClose: () => void;
  onWithdrawSubmit: (amount: number, bankName: string) => Promise<void>;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  availableBalance,
  onClose,
  onWithdrawSubmit,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [bankName, setBankName] = useState('HDFC Bank A/c (...8921)');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount(0);
      setBankName('HDFC Bank A/c (...8921)');
      setAgreed(false);
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (amount <= 0) {
      setError('Withdrawal amount must be greater than $0.00.');
      return;
    }

    if (amount > availableBalance) {
      setError(`Withdrawal amount cannot exceed available balance of $${availableBalance.toFixed(2)}.`);
      return;
    }

    if (!agreed) {
      setError('Please check the confirmation box to authorize this withdrawal.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onWithdrawSubmit(amount, bankName);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Payout withdrawal request failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      
      {/* Modal Box */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center">
              <Landmark size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none">Withdraw Earnings</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Settle available balance to your primary bank account.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-455 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success screen or Payout Form */}
        {success ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={28} className="fill-emerald-50" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-sm">Withdrawal Requested</h4>
              <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
                Your request to transfer <span className="text-slate-805 font-black">${amount.toFixed(2)}</span> to <span className="text-slate-805 font-black">{bankName}</span> has been logged successfully.
              </p>
            </div>
            <p className="text-[10px] text-slate-450 font-bold leading-relaxed pt-1.5">
              Settlements usually complete and clear within 24 to 48 business hours. You can audit progress in the ledger table.
            </p>
            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 cursor-pointer"
              >
                Go back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              
              {/* Account Available Balance display */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex justify-between items-center select-none">
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Wallet Balance</span>
                  <span className="text-xl font-black text-slate-800 leading-none mt-1 block">
                    ${availableBalance.toFixed(2)}
                  </span>
                </div>
                <span className="px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-md text-[9px] font-black uppercase tracking-wider text-indigo-700">
                  Ready to Settle
                </span>
              </div>

              {/* Amount input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 block">Withdrawal Amount ($)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-400 font-extrabold text-xs">$</span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount to withdraw..."
                    className="w-full bg-white border border-slate-205 rounded-xl pl-7 pr-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-bold text-slate-800"
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold">
                  <span>Enter dollar sum value.</span>
                  <button
                    type="button"
                    onClick={() => setAmount(availableBalance)}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Bank selector dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-455 block">Destination Bank Account</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="HDFC Bank A/c (...8921)">HDFC Bank A/c (...8921) - Primary</option>
                  <option value="ICICI Bank A/c (...7705)">ICICI Bank A/c (...7705)</option>
                  <option value="Citibank N.A. A/c (...2194)">Citibank N.A. A/c (...2194)</option>
                  <option value="State Bank of India A/c (...4560)">State Bank of India A/c (...4560)</option>
                </select>
              </div>

              {/* Terms agreement checkbox */}
              <div className="pt-1 select-none">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="text-[10px] font-semibold text-slate-450 leading-snug">
                    I authorize Samrat Seller platform to deduct and settle this amount to my bank account. I confirm the target bank details are accurate.
                  </span>
                </label>
              </div>

              {/* Error banner */}
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl flex items-start gap-2 text-[10px] font-bold">
                  <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

            </div>

            {/* Footer */}
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
                <span>{isSubmitting ? 'Processing Payout...' : 'Confirm Withdrawal'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default WithdrawModal;
