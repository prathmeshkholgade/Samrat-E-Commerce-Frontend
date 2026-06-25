import React from 'react';
import type { SellerOrder } from '../../../../shared/types';

interface OrderStatusBadgeProps {
  status: SellerOrder['status'];
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (statusVal: SellerOrder['status']) => {
    switch (statusVal) {
      case 'Pending':
        return 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400';
      case 'Confirmed':
        return 'bg-indigo-50 border-indigo-200 text-indigo-750 dark:bg-indigo-950/20 dark:border-indigo-900/50 dark:text-indigo-400';
      case 'Packed':
        return 'bg-sky-50 border-sky-200 text-sky-700 dark:bg-sky-950/20 dark:border-sky-900/50 dark:text-sky-450';
      case 'Shipped':
        return 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900/50 dark:text-blue-400';
      case 'Out For Delivery':
        return 'bg-purple-50 border-purple-200 text-purple-750 dark:bg-purple-950/20 dark:border-purple-900/50 dark:text-purple-400';
      case 'Delivered':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-450';
      case 'Cancelled':
        return 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400';
      case 'Returned':
        return 'bg-slate-50 border-slate-200 text-slate-550 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-400';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[9px] uppercase font-black tracking-wider select-none ${getBadgeStyles(status)}`}>
      {status}
    </span>
  );
};

export default OrderStatusBadge;
