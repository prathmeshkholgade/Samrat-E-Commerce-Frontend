import React from 'react';
import { PlusCircle, ShoppingBag, Box, Tag, Wallet, Compass } from 'lucide-react';
import { useAppDispatch } from '../../../../store';
import { addNotification, type NotificationType } from '../../../../store/slices/sellerNotificationsSlice';

export const QuickActions: React.FC = () => {
  const dispatch = useAppDispatch();

  const actions = [
    { label: 'Add Product', icon: <PlusCircle size={18} />, color: 'text-indigo-650 bg-indigo-50 border-indigo-100', desc: 'Add new catalog item' },
    { label: 'Manage Orders', icon: <ShoppingBag size={18} />, color: 'text-emerald-700 bg-emerald-50 border-emerald-100', desc: 'Process store orders' },
    { label: 'View Inventory', icon: <Box size={18} />, color: 'text-amber-700 bg-amber-50 border-amber-100', desc: 'Safety restock alerts' },
    { label: 'Create Coupon', icon: <Tag size={18} />, color: 'text-purple-700 bg-purple-50 border-purple-100', desc: 'New discounts' },
    { label: 'View Earnings', icon: <Wallet size={18} />, color: 'text-blue-700 bg-blue-50 border-blue-100', desc: 'Payouts ledger logs' },
  ];

  const handleActionClick = (label: string) => {
    let type: NotificationType = 'Promotion';
    if (label === 'Manage Orders') type = 'New Order';
    else if (label === 'View Inventory') type = 'Low Stock';
    else if (label === 'View Earnings') type = 'Payout Update';

    dispatch(
      addNotification({
        id: Math.random().toString(),
        type,
        title: `${label} Shortcut Clicked`,
        message: `Navigated to ${label} page view.`
      })
    );
    alert(`This is a mock shortcut button for "${label}". The complete management sub-module is scheduled for a future release.`);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs text-left">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <Compass size={16} className="text-indigo-650" />
          <span>Quick Business Actions</span>
        </h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Shortcuts to manage products, coupons, and orders.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {actions.map((act) => (
          <button
            key={act.label}
            onClick={() => handleActionClick(act.label)}
            className="p-4 rounded-2xl border border-slate-200/60 bg-white hover:bg-slate-50/50 hover:border-slate-300/80 transition-all flex flex-col items-center justify-center text-center gap-2 group cursor-pointer shadow-3xs hover:shadow-2xs"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${act.color}`}>
              {act.icon}
            </div>
            <div>
              <span className="text-xs font-black text-slate-800 block">{act.label}</span>
              <span className="text-[9px] font-bold text-slate-400 block mt-0.5 leading-tight">{act.desc}</span>
            </div>
          </button>
        ))}
      </div>

    </div>
  );
};

export default QuickActions;
