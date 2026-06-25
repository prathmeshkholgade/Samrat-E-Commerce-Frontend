import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store';
import { addMockCategory } from '../../../store/slices/adminSlice';
import { CheckSquare, Eye, ShoppingCart, FolderPlus, Zap } from 'lucide-react';

interface QuickActionsWidgetProps {
  onScrollToModeration?: (tab: 'sellers' | 'products') => void;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  onScrollToModeration,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddCategory = () => {
    const name = window.prompt('Enter new category name:');
    if (name && name.trim()) {
      dispatch(addMockCategory());
      alert(`Category "${name}" created successfully! Simulated: +5 products added to catalog inventory.`);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs p-5 text-left flex flex-col h-full justify-between">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
        <Zap className="text-indigo-650 animate-pulse" size={16} />
        <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">
          Quick Admin Actions
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-3.5 flex-grow">
        {/* Approve Sellers */}
        <button
          onClick={() => onScrollToModeration?.('sellers')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-150/40 rounded-xl hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-750 transition-all duration-300 text-slate-650 cursor-pointer active:scale-95 group text-center"
        >
          <CheckSquare size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-wider">Approve Sellers</span>
        </button>

        {/* Review Products */}
        <button
          onClick={() => onScrollToModeration?.('products')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-150/40 rounded-xl hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-750 transition-all duration-300 text-slate-650 cursor-pointer active:scale-95 group text-center"
        >
          <Eye size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-wider">Review Products</span>
        </button>

        {/* View Orders */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-150/40 rounded-xl hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-750 transition-all duration-300 text-slate-650 cursor-pointer active:scale-95 group text-center"
        >
          <ShoppingCart size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-wider">View Orders</span>
        </button>

        {/* Create Category */}
        <button
          onClick={handleAddCategory}
          className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 border border-slate-150/40 rounded-xl hover:bg-indigo-50 hover:border-indigo-150 hover:text-indigo-750 transition-all duration-300 text-slate-650 cursor-pointer active:scale-95 group text-center"
        >
          <FolderPlus size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-wider">Add Category</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsWidget;
