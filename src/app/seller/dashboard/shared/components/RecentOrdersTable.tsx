import React, { useState } from 'react';
import { ShoppingBag, Eye, X, Calendar, User, ShieldCheck } from 'lucide-react';
import type { DashboardOrder } from '../../../../../store/slices/dashboardSlice';

interface RecentOrdersTableProps {
  orders: DashboardOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<DashboardOrder | null>(null);

  const getStatusBadge = (status: DashboardOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-50 border-amber-250 text-amber-700';
      case 'processing':
        return 'bg-indigo-50 border-indigo-250 text-indigo-700';
      case 'shipped':
        return 'bg-blue-50 border-blue-250 text-blue-700';
      case 'delivered':
        return 'bg-emerald-50 border-emerald-250 text-emerald-700';
      case 'cancelled':
        return 'bg-rose-50 border-rose-250 text-rose-700';
      default:
        return 'bg-slate-50 border-slate-250 text-slate-700';
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 mb-4">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 leading-none">
          <ShoppingBag size={16} className="text-indigo-650" />
          <span>Recent Orders Registry</span>
        </h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Latest client checkouts placed on your vendor storefront.</p>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase">
              <th className="py-3 px-2">Order ID</th>
              <th className="py-3 px-2">Customer</th>
              <th className="py-3 px-2 text-center">Items</th>
              <th className="py-3 px-2 text-right">Amount</th>
              <th className="py-3 px-2 text-center">Status</th>
              <th className="py-3 px-2">Date</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold text-slate-650">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-2 text-slate-900 font-extrabold">{order.id}</td>
                <td className="py-3.5 px-2 text-slate-800">{order.customerName}</td>
                <td className="py-3.5 px-2 text-center">{order.productsCount} items</td>
                <td className="py-3.5 px-2 text-right text-slate-900 font-black">${order.amount.toFixed(2)}</td>
                <td className="py-3.5 px-2 text-center">
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-extrabold tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3.5 px-2 font-semibold text-slate-450">{order.date}</td>
                <td className="py-3.5 px-2 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-1 text-slate-400 hover:text-indigo-650 rounded-lg hover:bg-indigo-50 border border-transparent hover:border-indigo-100/50 transition-all cursor-pointer"
                    title="View Details"
                  >
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-none">Order Details</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-1">Reference: {selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs font-bold text-slate-600 text-left">
              
              <div className="space-y-1 bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4">
                <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">Customer Details</p>
                <div className="flex items-center gap-2 text-slate-800 pt-1">
                  <User size={14} className="text-slate-400" />
                  <span>{selectedOrder.customerName}</span>
                </div>
                <p className="text-slate-450 font-semibold text-[10px] pl-6">Registered Buyer</p>
              </div>

              <div className="space-y-1 bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4">
                <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">Order Information</p>
                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] block">Order Date</span>
                    <span className="text-slate-850 flex items-center gap-1 mt-0.5">
                      <Calendar size={13} className="text-slate-400" />
                      {selectedOrder.date}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] block">Total Amount</span>
                    <span className="text-indigo-650 font-black text-sm block">${selectedOrder.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4">
                <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">Status & Compliance</p>
                <div className="flex justify-between items-center pt-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[9px] uppercase font-extrabold tracking-wider ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                  <span className="text-[10px] text-emerald-650 flex items-center gap-1 font-bold">
                    <ShieldCheck size={13} />
                    Verified Order
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default RecentOrdersTable;
