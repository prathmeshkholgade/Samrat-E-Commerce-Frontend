import React from 'react';
import { Wallet, Landmark, Award, ShieldAlert, ArrowUpRight } from 'lucide-react';

interface WalletCardsProps {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  withdrawnAmount: number;
  onWithdrawClick: () => void;
}

export const WalletCards: React.FC<WalletCardsProps> = ({
  availableBalance,
  pendingBalance,
  totalEarnings,
  withdrawnAmount,
  onWithdrawClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left select-none">
      
      {/* 1. Available Balance (Highlighted CTA card) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-650 to-purple-650 p-6 text-white shadow-lg shadow-indigo-100 flex flex-col justify-between min-h-[160px]">
        {/* Abstract background light effect */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-4 top-4 text-white/20">
          <Wallet size={36} />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-indigo-100 tracking-wider block">Available Balance</span>
          <span className="text-3xl font-black block leading-none">
            ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[9px] font-semibold text-indigo-150 block">Ready for payout withdrawal</span>
        </div>

        <button
          onClick={onWithdrawClick}
          className="mt-4 w-full py-2.5 bg-white text-indigo-650 hover:bg-indigo-50 active:scale-[0.98] transition-all rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/20 cursor-pointer"
        >
          <ArrowUpRight size={13} className="stroke-[3px]" />
          <span>Withdraw Funds</span>
        </button>
      </div>

      {/* 2. Pending Balance */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-3xs flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Pending Balance</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">
              ${pendingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Escrow holding period active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} />
          </div>
        </div>
        <div className="text-[9px] font-bold text-slate-450 border-t border-slate-50 pt-3 flex items-center gap-1">
          <span>Funds release in 3-7 business days.</span>
        </div>
      </div>

      {/* 3. Total Earnings */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-3xs flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Sales Revenue</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">
              ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">All-time checkout totals</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
        </div>
        <div className="text-[9px] font-bold text-emerald-600 border-t border-slate-50 pt-3 flex items-center gap-1">
          <span>Total historical volume.</span>
        </div>
      </div>

      {/* 4. Withdrawn Amount */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-3xs flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Withdrawn Amount</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">
              ${withdrawnAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Settled to bank accounts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Landmark size={18} />
          </div>
        </div>
        <div className="text-[9px] font-bold text-slate-450 border-t border-slate-50 pt-3 flex items-center gap-1">
          <span>Transferred successfully.</span>
        </div>
      </div>

    </div>
  );
};

export default WalletCards;
