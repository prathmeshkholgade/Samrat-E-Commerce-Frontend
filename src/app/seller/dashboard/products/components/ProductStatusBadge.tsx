import React from 'react';
import type { SellerProduct } from '../../../../../shared/types';

interface ProductStatusBadgeProps {
  status: SellerProduct['status'];
}

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  const getBadgeStyles = (statusVal: SellerProduct['status']) => {
    switch (statusVal) {
      case 'Published':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400';
      case 'Draft':
        return 'bg-slate-50 border-slate-200 text-slate-550 dark:bg-slate-900/20 dark:border-slate-800 dark:text-slate-400';
      case 'Out of Stock':
        return 'bg-amber-50 border-amber-250 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-400';
      case 'Archived':
        return 'bg-rose-50 border-rose-250 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400';
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

export default ProductStatusBadge;
