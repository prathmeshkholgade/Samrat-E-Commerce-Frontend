import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, TrendingUp, CheckCircle2, Clock, Truck, Printer, Download } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setStatusFilter,
  setPaymentStatusFilter,
  setSortBy,
  setCurrentPage,
  setSelectedOrders,
  toggleSelectOrder,
  clearSelection,
  resetFilters,
} from '../../../../store/slices/sellerOrdersSlice';
import {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useBulkUpdateOrderStatusMutation,
} from '../../../../store/services/sellerApi';
import type { SellerOrder } from '../../../../shared/types';

// Reusable components
import OrderTable from '../../../../features/seller/components/orders/OrderTable';
import OrderFilters from '../../../../features/seller/components/orders/OrderFilters';
import OrderDetailsModal from '../../../../features/seller/components/orders/OrderDetailsModal';
import InvoiceTemplate from '../../../../features/seller/components/orders/InvoiceTemplate';

export const OrdersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux filters state selector
  const {
    searchQuery,
    statusFilter,
    paymentStatusFilter,
    sortBy,
    currentPage,
    itemsPerPage,
    selectedOrderIds,
  } = useAppSelector((state) => state.sellerOrders);

  // RTK Query hooks
  const { data: allOrders = [], isLoading } = useGetSellerOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [bulkUpdateStatus] = useBulkUpdateOrderStatusMutation();

  // Local Modal States
  const [selectedDetailsOrder, setSelectedDetailsOrder] = useState<SellerOrder | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<SellerOrder | null>(null);

  // 1. Process search, filters and sorting client-side
  const filteredOrders = allOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      o.status === statusFilter;

    const matchesPayment =
      paymentStatusFilter === 'All' ||
      o.paymentStatus === paymentStatusFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return b.date.localeCompare(a.date);
      case 'date-asc':
        return a.date.localeCompare(b.date);
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // Pagination bounds slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

  // 2. Metrics summary widgets values
  const totalOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter((o) => o.status === 'Pending').length;
  const shippedOrdersCount = allOrders.filter((o) => o.status === 'Shipped').length;
  const deliveredOrdersCount = allOrders.filter((o) => o.status === 'Delivered').length;

  // 3. Handlers
  const handleSingleStatusChange = async (orderId: string, status: SellerOrder['status']) => {
    try {
      await updateOrderStatus({ id: orderId, status }).unwrap();
      // Update local preview if currently open
      if (selectedDetailsOrder && selectedDetailsOrder.id === orderId) {
        setSelectedDetailsOrder((prev) => prev ? { ...prev, status } : null);
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Error updating order status.');
    }
  };

  const handleBulkStatusChange = async (status: SellerOrder['status']) => {
    try {
      await bulkUpdateStatus({ ids: selectedOrderIds, status }).unwrap();
      dispatch(setSelectedOrders([]));
    } catch (err) {
      console.error('Failed to bulk update status:', err);
      alert('Error during batch status update.');
    }
  };

  const handleDownloadInvoice = (order: SellerOrder) => {
    const invoiceNum = `INV-2026-${order.id.split('-').pop()}`;
    const content = `
==================================================
               SAMRAT ENTERPRISES
                 TAX INVOICE
==================================================
Invoice Reference : ${invoiceNum}
Invoice Date      : ${order.date}
Order Reference   : ${order.id}
Payment Mode      : ${order.paymentMethod}
Payment Status    : ${order.paymentStatus}
Order Status      : ${order.status}

Billed To (Buyer):
------------------
Name    : ${order.shippingAddress.fullName}
Mobile  : ${order.shippingAddress.mobile}
Address : ${order.shippingAddress.addressLine1}
          ${order.shippingAddress.addressLine2 || ''}
          ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
          ${order.shippingAddress.country}
          
Purchased Products:
-------------------
${order.products.map(p => `- ${p.name} (Qty: ${p.quantity}) @ $${p.price.toFixed(2)} = $${(p.price * p.quantity).toFixed(2)}`).join('\n')}

--------------------------------------------------
Taxable Value     : $${(order.amount / 1.18).toFixed(2)}
Integrated GST 18%: $${(order.amount * 0.18).toFixed(2)}
Shipping Cost     : FREE
Total Net Payable : $${order.amount.toFixed(2)}
==================================================
Thank you for shopping on Samrat Enterprises!
    `;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `invoice_inv_2026_${order.id.split('-').pop()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintTrigger = (order: SellerOrder) => {
    setSelectedInvoiceOrder(order);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Greetings Header Title */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <ShoppingBag className="text-indigo-650" size={24} />
            <span>Customer Orders Registry</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Monitor buyer transactions, assign carriers, track deliveries, and print tax invoices.</p>
        </div>
      </div>

      {/* Stats row widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Orders */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Bookings</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{totalOrdersCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-650">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Pending</span>
            <span className={`text-2xl font-black block leading-none ${pendingOrdersCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>{pendingOrdersCount}</span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${pendingOrdersCount > 0 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-650'}`}>
            <Clock size={18} />
          </div>
        </div>

        {/* Shipped Orders */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">In Transit</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{shippedOrdersCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Truck size={18} />
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Delivered</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{deliveredOrdersCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
        </div>

      </div>

      {/* Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        paymentStatusFilter={paymentStatusFilter}
        sortBy={sortBy}
        selectedCount={selectedOrderIds.length}
        onSearchChange={(q) => dispatch(setSearchQuery(q))}
        onStatusChange={(s) => dispatch(setStatusFilter(s))}
        onPaymentStatusChange={(p) => dispatch(setPaymentStatusFilter(p))}
        onSortChange={(sort) => dispatch(setSortBy(sort))}
        onResetFilters={() => dispatch(resetFilters())}
        onBulkStatusUpdate={handleBulkStatusChange}
      />

      {/* Loading & Table grid */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <OrderTable
          orders={paginatedOrders}
          totalCount={sortedOrders.length}
          selectedIds={selectedOrderIds}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onToggleSelect={(id) => dispatch(toggleSelectOrder(id))}
          onSelectAll={(ids) => dispatch(setSelectedOrders(ids))}
          onPageChange={(p) => dispatch(setCurrentPage(p))}
          onViewOrder={(order) => navigate(`/seller/orders/${order.id}`)}
          onUpdateStatus={(order, status) => handleSingleStatusChange(order.id, status)}
          onPrintInvoice={handlePrintTrigger}
          onDownloadInvoice={handleDownloadInvoice}
        />
      )}

      {/* DETAILS VIEW MODAL OVERLAY */}
      <OrderDetailsModal
        isOpen={selectedDetailsOrder !== null}
        order={selectedDetailsOrder}
        onClose={() => setSelectedDetailsOrder(null)}
        onStatusChange={(status) => {
          if (selectedDetailsOrder) {
            handleSingleStatusChange(selectedDetailsOrder.id, status);
          }
        }}
        onPrint={() => {
          if (selectedDetailsOrder) {
            handlePrintTrigger(selectedDetailsOrder);
          }
        }}
        onDownload={() => {
          if (selectedDetailsOrder) {
            handleDownloadInvoice(selectedDetailsOrder);
          }
        }}
      />

      {/* PRINT INVOICE MODAL OVERLAY */}
      <InvoiceTemplate
        isOpen={selectedInvoiceOrder !== null}
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

    </div>
  );
};

export default OrdersList;
