import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { AdminOrder } from '../../store/slices/adminSlice';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { recentOrders } = useAppSelector((state) => state.admin);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | AdminOrder['status']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters logic
  const filteredOrders = recentOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeFilter === 'All' || order.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tabs = [
    { id: 'All', label: 'All Orders', count: recentOrders.length },
    { id: 'Pending', label: 'Pending', count: recentOrders.filter((o) => o.status === 'Pending').length },
    { id: 'Processing', label: 'Processing', count: recentOrders.filter((o) => o.status === 'Processing').length },
    { id: 'Shipped', label: 'Shipped', count: recentOrders.filter((o) => o.status === 'Shipped').length },
    { id: 'Delivered', label: 'Delivered', count: recentOrders.filter((o) => o.status === 'Delivered').length },
    { id: 'Refunded', label: 'Refunded', count: recentOrders.filter((o) => o.status === 'Refunded').length },
  ] as const;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <ShoppingCart className="text-indigo-650" size={24} />
            <span>Order Monitoring Registry</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Track and monitor platform sales, payment status values, and merchant shipping timelines.
          </p>
        </div>
      </div>

      {/* Table & filter card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-6">
        
        {/* Filters and search row */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between border-b border-slate-100 pb-5">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 order-2 xl:order-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-indigo-650 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200/40 hover:bg-slate-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex items-center bg-slate-50 border border-slate-200/50 rounded-xl px-3.5 py-2.5 max-w-sm w-full order-1 xl:order-2">
            <Search size={14} className="text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search order ID, customer or store..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-slate-650 border-collapse">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
              <tr>
                <th className="px-5 py-3 font-black text-left">Order Reference</th>
                <th className="px-5 py-3 font-black text-left">Customer Profile</th>
                <th className="px-5 py-3 font-black text-left">Merchant Seller</th>
                <th className="px-5 py-3 font-black text-left">Total Value</th>
                <th className="px-5 py-3 font-black text-left">Payment Status</th>
                <th className="px-5 py-3 font-black text-left">Fulfillment</th>
                <th className="px-5 py-3 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold">
                    No matching orders registered.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/20">
                    
                    {/* Order ID & Date */}
                    <td className="px-5 py-3 text-left">
                      <p className="font-mono font-bold text-slate-850">{order.id}</p>
                      <span className="text-[9px] text-slate-400 font-bold block mt-0.5 font-mono">
                        {order.date}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3 text-left">
                      <p className="font-semibold text-slate-705 leading-none">{order.customerName}</p>
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-3 text-left">
                      <p className="font-semibold text-slate-705 leading-none">{order.sellerName}</p>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 block">ID: {order.sellerId}</span>
                    </td>

                    {/* Value */}
                    <td className="px-5 py-3 text-left font-mono font-bold text-slate-850">
                      ${order.amount.toFixed(2)}
                    </td>

                    {/* Payment Status */}
                    <td className="px-5 py-3 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                        order.paymentStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-705 border border-emerald-100'
                          : 'bg-rose-50 text-rose-705 border border-rose-100'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>

                    {/* Order Status */}
                    <td className="px-5 py-3 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                        order.status === 'Completed' || order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : order.status === 'Processing' || order.status === 'Shipped'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : order.status === 'Pending'
                          ? 'bg-amber-50 text-amber-705 border border-amber-105 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {order.status}
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-650 transition-colors cursor-pointer"
                        title="View Order Details"
                      >
                        <Eye size={13} />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-[10px] font-bold text-slate-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} orders
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs font-black text-slate-700 font-mono px-3">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminOrdersPage;
