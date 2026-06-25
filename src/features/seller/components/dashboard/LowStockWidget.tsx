import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { useAppDispatch } from '../../../../store';
import { restockProduct, type DashboardLowStockItem } from '../../../../store/slices/dashboardSlice';
import { addNotification } from '../../../../store/slices/sellerNotificationsSlice';

interface LowStockWidgetProps {
  items: DashboardLowStockItem[];
}

export const LowStockWidget: React.FC<LowStockWidgetProps> = ({ items }) => {
  const dispatch = useAppDispatch();

  const handleRestock = (id: string, name: string) => {
    // Restock with 15 units
    dispatch(restockProduct({ id, amount: 15 }));
    dispatch(
      addNotification({
        id: Math.random().toString(),
        type: 'Low Stock',
        title: 'Inventory Restocked',
        message: `Successfully restocked 15 units for ${name}.`,
        targetId: id
      })
    );
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <AlertTriangle size={16} className="text-amber-500" />
          <span>Low Stock Alerts</span>
        </h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Catalog items running below your set safety limit.</p>
      </div>

      {/* List */}
      <div className="space-y-4 flex-grow overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6 text-slate-400">
            <p className="font-bold text-xs">All products are healthy!</p>
          </div>
        ) : (
          items.map((item) => {
            const safetyRatio = Math.min((item.currentStock / item.minimumThreshold) * 100, 100);
            return (
              <div key={item.id} className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                <div className="space-y-1.5 flex-1 max-w-[70%]">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">{item.name}</h4>
                  
                  {/* Progress stock bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          safetyRatio <= 30 
                            ? 'bg-rose-500' 
                            : safetyRatio <= 60 
                              ? 'bg-amber-500' 
                              : 'bg-indigo-500'
                        }`}
                        style={{ width: `${safetyRatio}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                      <span>Stock: <strong className="text-slate-700">{item.currentStock}</strong></span>
                      <span>Min: <strong>{item.minimumThreshold}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRestock(item.id, item.name)}
                  className="py-1.5 px-3 bg-indigo-50 hover:bg-indigo-650 hover:text-white border border-indigo-150 text-indigo-750 text-[10px] font-black rounded-lg transition-all flex items-center gap-1 cursor-pointer self-start sm:self-center uppercase tracking-wider"
                >
                  <Plus size={12} />
                  <span>Restock</span>
                </button>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default LowStockWidget;
