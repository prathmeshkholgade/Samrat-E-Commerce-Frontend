import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Printer, Download, ArrowLeft, ArrowRight, MoreVertical, Edit2 } from 'lucide-react';
import type { SellerOrder } from '../../../../shared/types';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderTableProps {
  orders: SellerOrder[];
  totalCount: number;
  selectedIds: string[];
  currentPage: number;
  itemsPerPage: number;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onPageChange: (page: number) => void;
  onViewOrder: (order: SellerOrder) => void;
  onUpdateStatus: (order: SellerOrder, status: SellerOrder['status']) => void;
  onPrintInvoice: (order: SellerOrder) => void;
  onDownloadInvoice: (order: SellerOrder) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  totalCount,
  selectedIds,
  currentPage,
  itemsPerPage,
  onToggleSelect,
  onSelectAll,
  onPageChange,
  onViewOrder,
  onUpdateStatus,
  onPrintInvoice,
  onDownloadInvoice,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Determine if all items on the current page are selected
  const currentPageIds = orders.map((o) => o.id);
  const isAllSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      onSelectAll(selectedIds.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelections = [...selectedIds];
      currentPageIds.forEach((id) => {
        if (!newSelections.includes(id)) {
          newSelections.push(id);
        }
      });
      onSelectAll(newSelections);
    }
  };

  const getPaymentBadge = (status: SellerOrder['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Unpaid':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'Refunded':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      default:
        return 'bg-slate-50 border-slate-250 text-slate-700';
    }
  };

  // Pagination bounds
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Actions dropdown per row state
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    if (activeDropdownId) {
      document.addEventListener('mousedown', clickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', clickOutside);
    };
  }, [activeDropdownId]);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col justify-between text-left h-full space-y-6">
      
      {/* Table grid */}
      <div className="overflow-x-auto min-h-[250px]" ref={dropdownRef}>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <Eye size={24} className="stroke-slate-350" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Orders Found</h4>
              <p className="text-xs text-slate-400 font-semibold mt-1">Try refining search parameters or filters.</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                <th className="py-3 px-2 w-8">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllToggle}
                    className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                  />
                </th>
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Products</th>
                <th className="py-3 px-2 text-right">Amount</th>
                <th className="py-3 px-2 text-center">Payment</th>
                <th className="py-3 px-2 text-center">Order Status</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold text-slate-650">
              {orders.map((order) => {
                const isChecked = selectedIds.includes(order.id);
                const isDropdownOpen = activeDropdownId === order.id;

                // Brief text summary of purchased items
                const productSummary = order.products
                  .map((p) => `${p.name} (x${p.quantity})`)
                  .join(', ');

                return (
                  <tr key={order.id} className={`hover:bg-slate-50/40 transition-colors ${isChecked ? 'bg-indigo-50/10' : ''}`}>
                    
                    {/* Checkbox */}
                    <td className="py-3.5 px-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => onToggleSelect(order.id)}
                        className="w-3.5 h-3.5 rounded-sm border-slate-300 text-indigo-650 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                    </td>
                    
                    {/* Order ID */}
                    <td className="py-3.5 px-2 text-slate-900 font-extrabold font-mono text-[11px] uppercase">
                      <Link to={`/seller/orders/${order.id}`} className="text-indigo-650 hover:text-indigo-855 hover:underline transition-colors">
                        {order.id}
                      </Link>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-2 text-slate-800">
                      {order.customerName}
                    </td>

                    {/* Products summary */}
                    <td className="py-3.5 px-2 max-w-[200px] truncate text-slate-500" title={productSummary}>
                      {productSummary}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-2 text-right text-slate-900 font-black">
                      ${order.amount.toFixed(2)}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-extrabold tracking-wider ${getPaymentBadge(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="py-3.5 px-2 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-2 text-slate-400 font-semibold text-[11px]">
                      {order.date}
                    </td>

                    {/* Actions dropdown */}
                    <td className="py-3.5 px-2 text-right relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdownId(isDropdownOpen ? null : order.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-850 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute right-2 mt-1 w-40 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-40 text-left animate-in fade-in slide-in-from-top-2">
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onViewOrder(order);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Eye size={13} className="text-slate-400" />
                            <span>View Details</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onViewOrder(order); // Open details sheet which has inline update dropdown
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 size={13} className="text-slate-400" />
                            <span>Update Status</span>
                          </button>

                          <div className="h-px bg-slate-100 my-1" />

                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onPrintInvoice(order);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Printer size={13} className="text-slate-400" />
                            <span>Print Invoice</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveDropdownId(null);
                              onDownloadInvoice(order);
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-55 hover:text-indigo-650 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Download size={13} className="text-slate-400" />
                            <span>Download Invoice</span>
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
      {orders.length > 0 && (
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <span className="text-xs font-bold text-slate-450">
            Showing <span className="text-slate-800 font-black">{startItem}</span> to{' '}
            <span className="text-slate-800 font-black">{endItem}</span> of{' '}
            <span className="text-slate-800 font-black">{totalCount}</span> orders
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => onPageChange(pg)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPage === pg
                    ? 'bg-indigo-650 text-white shadow-md shadow-indigo-150'
                    : 'bg-white hover:bg-slate-50 text-slate-550 border border-slate-200/40 hover:border-slate-200'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200/50 hover:border-slate-350/50 bg-white rounded-xl text-slate-500 hover:text-slate-850 disabled:opacity-40 disabled:hover:border-slate-200/50 disabled:hover:text-slate-500 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
