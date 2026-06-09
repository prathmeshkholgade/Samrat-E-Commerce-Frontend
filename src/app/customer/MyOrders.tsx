import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Truck,
  CreditCard,
  Download,
  Undo2,
  Eye,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  Printer,
  ChevronRight
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { cancelOrder, returnOrder, type Order } from '../../store/slices/ordersSlice';
import { addNotification } from '../../store/slices/notificationSlice';

export const MyOrders: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(state => state.orders.items);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'>('all');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeModal, setActiveModal] = useState<'details' | 'track' | 'invoice' | 'return' | null>(null);

  // Return form state
  const [returnReason, setReturnReason] = useState('');
  const [returnError, setReturnError] = useState('');

  // Handle Action Triggers
  const openModal = (order: Order, type: 'details' | 'track' | 'invoice' | 'return') => {
    setSelectedOrder(order);
    setActiveModal(type);
    if (type === 'return') {
      setReturnReason('');
      setReturnError('');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setActiveModal(null);
  };

  // Cancel order handler
  const handleCancelClick = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(orderId));
      dispatch(
        addNotification({
          id: Math.random().toString(),
          title: 'Order Cancelled',
          message: `Order ${orderId} has been successfully cancelled. Refunds are being processed.`
        })
      );
    }
  };

  // Return order handler
  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      setReturnError('Please provide a reason for the return.');
      return;
    }

    if (selectedOrder) {
      dispatch(
        returnOrder({
          orderId: selectedOrder.id,
          reason: returnReason.trim()
        })
      );
      dispatch(
        addNotification({
          id: Math.random().toString(),
          title: 'Return Request Submitted',
          message: `Return request submitted successfully for Order ${selectedOrder.id}.`
        })
      );
      closeModal();
    }
  };

  // Print invoice simulator
  const handlePrintInvoice = () => {
    window.print();
  };

  // Status Counts
  const getCount = (status: 'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned') => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  // Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const matchesFilter = activeFilter === 'all' || order.status === activeFilter;
    
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Get status color helper
  const getStatusDetails = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-50 border-amber-200 text-amber-700', label: 'Pending Approval' };
      case 'processing':
        return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', label: 'Processing' };
      case 'shipped':
        return { bg: 'bg-blue-50 border-blue-200 text-blue-700', label: 'In Transit / Shipped' };
      case 'delivered':
        return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', label: 'Delivered' };
      case 'cancelled':
        return { bg: 'bg-rose-50 border-rose-200 text-rose-700', label: 'Cancelled' };
      case 'returned':
        return { bg: 'bg-purple-50 border-purple-200 text-purple-700', label: 'Returned' };
      default:
        return { bg: 'bg-slate-50 border-slate-200 text-slate-700', label: 'Unknown' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 text-left">
        <Link to="/home" className="hover:text-indigo-650 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700">My Orders</span>
      </nav>

      {/* Page Header */}
      <div className="text-left border-b border-slate-100 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>My Orders Registry</span>
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage and track your marketplace orders, view tracking history, invoices, or request product returns.</p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col gap-4 bg-white border border-slate-100 p-5 md:p-6 rounded-3xl shadow-3xs text-left">
        
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search by Order ID, Product name, or Invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-hidden focus:border-indigo-650 focus:bg-white transition-all text-slate-700"
          />
          <Search size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2.5 pt-1.5">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled' },
            { id: 'returned', label: 'Returned' }
          ].map((filter) => {
            const count = getCount(filter.id as any);
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-650 border-indigo-650 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                }`}
              >
                {filter.label} <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Orders List Container */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-3xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 mx-auto">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">No orders found</h3>
              <p className="text-xs text-slate-450 font-semibold mt-1">
                {searchQuery || activeFilter !== 'all' 
                  ? 'Try relaxing your search terms or filter constraints.'
                  : 'You have not placed any orders yet on our portal.'
                }
              </p>
            </div>
            <Link
              to="/home/products"
              className="inline-block py-2.5 px-6 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusStyle = getStatusDetails(order.status);
            return (
              <div 
                key={order.id} 
                className="bg-white border border-slate-100 hover:border-slate-200 rounded-3xl overflow-hidden transition-all shadow-3xs hover:shadow-2xs text-left"
              >
                
                {/* Order Header */}
                <div className="bg-slate-50/70 border-b border-slate-100 px-5 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-bold text-slate-500">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <span className="uppercase text-[9px] tracking-wider text-slate-400 block mb-0.5">Order ID</span>
                      <span className="text-slate-800 font-extrabold">{order.id}</span>
                    </div>
                    <div>
                      <span className="uppercase text-[9px] tracking-wider text-slate-400 block mb-0.5">Date Placed</span>
                      <span className="text-slate-850 flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {order.date}
                      </span>
                    </div>
                    <div>
                      <span className="uppercase text-[9px] tracking-wider text-slate-400 block mb-0.5">Grand Total</span>
                      <span className="text-slate-900 font-black">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1.5 rounded-full border text-[10px] uppercase font-black tracking-wider ${statusStyle.bg}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-5 md:p-6 divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 first:pt-0 last:pb-0 gap-4">
                      
                      <div className="flex gap-4 items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-slate-150/60 bg-slate-50"
                        />
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-sm text-slate-900 leading-snug hover:text-indigo-650 transition-colors">
                            <Link to={`/home/products/${item.productId}`}>{item.name}</Link>
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-3 text-[10px] font-bold text-slate-400">
                            {item.selectedSize && (
                              <span>Size: <strong className="text-slate-600">{item.selectedSize}</strong></span>
                            )}
                            {item.selectedColor && (
                              <span className="flex items-center gap-1">
                                Color: <strong className="text-slate-600">{item.selectedColor}</strong>
                              </span>
                            )}
                            <span>Qty: <strong className="text-slate-600">{item.quantity}</strong></span>
                          </div>
                          {item.vendorName && (
                            <p className="text-[10px] font-bold text-slate-400">
                              Seller: <span className="text-indigo-600">{item.vendorName}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-left sm:text-right space-y-1">
                        <p className="text-xs font-bold text-slate-400">Per unit: ${item.price.toFixed(2)}</p>
                        <p className="text-sm font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/20 flex flex-wrap items-center justify-between gap-4">
                  
                  {/* Left Cancel / Status Message */}
                  <div>
                    {(order.status === 'pending' || order.status === 'processing') && (
                      <button
                        onClick={() => handleCancelClick(order.id)}
                        className="flex items-center gap-1.5 text-xs font-black text-rose-600 hover:text-rose-800 transition-colors py-1.5 px-3 hover:bg-rose-50 rounded-lg"
                      >
                        <X size={14} />
                        <span>Cancel Order</span>
                      </button>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md">
                        Order was cancelled and refunded.
                      </span>
                    )}
                    {order.status === 'returned' && (
                      <span className="text-[10px] font-bold text-purple-650 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-md">
                        Item returned. Refund Completed.
                      </span>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    <button
                      onClick={() => openModal(order, 'details')}
                      className="py-2 px-3.5 border border-slate-250 hover:border-slate-350 bg-white text-slate-650 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                    >
                      <Eye size={13} />
                      <span>Details</span>
                    </button>

                    {order.status !== 'cancelled' && (
                      <button
                        onClick={() => openModal(order, 'track')}
                        className="py-2 px-3.5 border border-slate-250 hover:border-slate-350 bg-white text-slate-650 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                      >
                        <Truck size={13} />
                        <span>Track</span>
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <>
                        <button
                          onClick={() => openModal(order, 'invoice')}
                          className="py-2 px-3.5 bg-indigo-50 border border-indigo-150 hover:border-indigo-250 text-indigo-750 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                        >
                          <Download size={13} />
                          <span>Invoice</span>
                        </button>

                        <button
                          onClick={() => openModal(order, 'return')}
                          className="py-2 px-3.5 bg-rose-50 border border-rose-150 hover:border-rose-250 text-rose-750 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                        >
                          <Undo2 size={13} />
                          <span>Return</span>
                        </button>
                      </>
                    )}

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: VIEW DETAILS                                     */}
      {/* ======================================================== */}
      {activeModal === 'details' && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Order Details Breakdown</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">Reference: {selectedOrder.id}</p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-left max-h-[70vh] overflow-y-auto">
              
              {/* Shipping & Payment Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                
                {/* Shipping Details */}
                <div className="space-y-2.5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Shipping Destination</h4>
                  <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-4 space-y-1">
                    <p className="text-xs font-extrabold text-slate-800">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-xs text-slate-500 font-semibold">{selectedOrder.shippingAddress.addressLine1}</p>
                    {selectedOrder.shippingAddress.addressLine2 && (
                      <p className="text-xs text-slate-500 font-semibold">{selectedOrder.shippingAddress.addressLine2}</p>
                    )}
                    <p className="text-xs text-slate-500 font-semibold">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold">{selectedOrder.shippingAddress.country}</p>
                    <p className="text-xs text-slate-450 font-bold mt-1.5 flex items-center gap-1">
                      <CreditCard size={12} className="text-slate-400" />
                      Contact: {selectedOrder.shippingAddress.mobile}
                    </p>
                  </div>
                </div>

                {/* Delivery & Payment Modes */}
                <div className="space-y-4">
                  
                  {/* Logistics info */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Logistics Speed</h4>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2">
                      <Truck size={14} className="text-indigo-600" />
                      <span className="capitalize">{selectedOrder.shippingMethod} Delivery</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Payment Mode</h4>
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2">
                      <CreditCard size={14} className="text-indigo-600" />
                      <span className="uppercase">{selectedOrder.paymentMethod}</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Items in Order</h4>
                <div className="divide-y divide-slate-100 bg-slate-50/30 rounded-2xl border border-slate-150/60 p-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">
                            {item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`} | Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation details */}
              <div className="bg-slate-50/50 rounded-2xl border border-slate-200/60 p-4 space-y-2.5 text-xs font-bold text-slate-550">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-slate-800 font-extrabold">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount:</span>
                    <span>-${selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Charges:</span>
                  <span className="text-slate-850">
                    {selectedOrder.shippingCost === 0 ? 'FREE' : `$${selectedOrder.shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (10%):</span>
                  <span className="text-slate-800">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-indigo-650">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeModal}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: TRACK ORDER                                      */}
      {/* ======================================================== */}
      {activeModal === 'track' && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-black">Shipment Tracker</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">Reference ID: {selectedOrder.id}</p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Vertical timeline body */}
            <div className="p-6 space-y-8 text-left max-h-[60vh] overflow-y-auto">
              
              {/* Summary speed */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-4 text-xs font-bold text-slate-650 flex items-center justify-between">
                <span>Shipping Speed:</span>
                <span className="uppercase text-indigo-650 font-black">{selectedOrder.shippingMethod} delivery</span>
              </div>

              {/* Milestones list */}
              <div className="relative border-l-2 border-slate-100 ml-3.5 space-y-6">
                {selectedOrder.trackingTimeline.map((milestone, idx) => {
                  const isCompleted = milestone.completed;
                  return (
                    <div key={idx} className="relative pl-6">
                      
                      {/* Milestone Check Circle dot */}
                      <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isCompleted 
                          ? 'bg-indigo-600 border-indigo-650 text-white' 
                          : 'bg-white border-slate-200 text-slate-300'
                      }`}>
                        {isCompleted && <CheckCircle size={10} />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className={`text-xs font-black ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                            {milestone.title}
                          </span>
                          {milestone.date && (
                            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 border px-1.5 py-0.5 rounded-md">
                              {milestone.date}
                            </span>
                          )}
                        </div>
                        <p className={`text-[10px] font-semibold leading-relaxed ${isCompleted ? 'text-slate-500' : 'text-slate-350'}`}>
                          {milestone.description}
                        </p>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={closeModal}
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: DOWNLOAD INVOICE SHEET (SIMULATION)              */}
      {/* ======================================================== */}
      {activeModal === 'invoice' && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left print:hidden">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-black">Customer Invoice Preview</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">Download / Print PDF billing documentation.</p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Print Document content */}
            <div className="p-8 space-y-6 text-left max-h-[70vh] overflow-y-auto" id="printable-invoice">
              
              {/* Header company logo & Inv info */}
              <div className="flex justify-between items-start border-b-2 border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black text-sm">
                      S
                    </div>
                    <span className="text-base font-black text-slate-900 tracking-tight">SAMRAT ENTERPRISES</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 max-w-[200px]">
                    402, Samrat Trade Center, MG Road, Mumbai, Maharashtra - 400001
                  </p>
                </div>
                <div className="text-right space-y-1 font-bold text-slate-650 text-xs">
                  <p className="font-black text-slate-900 text-sm">TAX INVOICE</p>
                  <p>Invoice #: <span className="text-slate-850 font-extrabold">{selectedOrder.invoiceNumber}</span></p>
                  <p>Date Placed: <span>{selectedOrder.date}</span></p>
                  <p>Order ID: <span>{selectedOrder.id}</span></p>
                </div>
              </div>

              {/* Bill to / Ship to */}
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Billed To:</p>
                  <p className="text-slate-800 font-extrabold">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-500 font-semibold">{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p className="text-slate-500 font-semibold">{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-slate-500 font-semibold">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p>Contact: {selectedOrder.shippingAddress.mobile}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Logistics Info:</p>
                  <p className="text-slate-800 uppercase font-extrabold">{selectedOrder.shippingMethod} Delivery</p>
                  <p>Payment: <span className="uppercase text-slate-800 font-extrabold">{selectedOrder.paymentMethod}</span></p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-xs text-left border-collapse mt-4">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase">
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-center">Qty</th>
                    <th className="py-2.5 px-2 text-right">Unit Price</th>
                    <th className="py-2.5 px-2 text-right">Total Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-2">
                        <p className="font-extrabold text-slate-900">{item.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold">
                          {item.selectedSize && `Size: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`}
                        </p>
                      </td>
                      <td className="py-3 px-2 text-center text-slate-850 font-bold">{item.quantity}</td>
                      <td className="py-3 px-2 text-right text-slate-650">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right text-slate-900 font-extrabold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Breakdown */}
              <div className="flex justify-end pt-4 border-t-2 border-slate-100">
                <div className="w-64 space-y-2.5 text-xs font-bold text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="text-slate-800 font-extrabold">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span>-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges:</span>
                    <span>{selectedOrder.shippingCost === 0 ? 'FREE' : `$${selectedOrder.shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span className="text-slate-800">${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-slate-200 text-sm font-black text-slate-900">
                    <span>Grand Total:</span>
                    <span className="text-indigo-650">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer notes */}
              <div className="border-t border-slate-100 pt-6 text-center text-[10px] text-slate-400 font-semibold leading-relaxed">
                <p>This is a computer generated document. No signature is required.</p>
                <p className="mt-0.5">Thank you for shopping with Samrat Enterprises! For assistance, please contact support@samrat.com.</p>
              </div>

            </div>

            {/* Footer Print trigger */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center print:hidden">
              <span className="text-[10px] text-slate-450 font-bold">Press Print to trigger browser pdf printer.</span>
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="py-2 px-4 border border-slate-250 hover:border-slate-350 bg-white text-slate-650 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePrintInvoice}
                  className="py-2 px-5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Printer size={13} />
                  <span>Print Invoice</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: RETURN ORDER REQUEST                             */}
      {/* ======================================================== */}
      {activeModal === 'return' && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base font-black">Return Request Portal</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-0.5">Submit return details for Order: {selectedOrder.id}</p>
              </div>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleReturnSubmit}>
              <div className="p-6 space-y-4 text-left">
                
                {/* Warning note */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 text-amber-850">
                  <AlertCircle size={20} className="flex-shrink-0 text-amber-700 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-xs font-extrabold">Return & Refund Terms</h5>
                    <p className="text-[10px] font-semibold leading-relaxed text-amber-800">
                      Returns must be submitted within 30 days of delivery. Upon approval, funds will be refunded back to the original payment source.
                    </p>
                  </div>
                </div>

                {/* Return Reason selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Return Reason *</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about why you want to return these items (e.g. incorrect sizing, damaged on arrival, color discrepancy)..."
                    value={returnReason}
                    onChange={(e) => {
                      setReturnReason(e.target.value);
                      if (e.target.value.trim()) setReturnError('');
                    }}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-hidden focus:bg-white focus:border-indigo-650 transition-all ${
                      returnError ? 'border-rose-350' : 'border-slate-200'
                    }`}
                  />
                  {returnError && (
                    <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {returnError}
                    </p>
                  )}
                </div>

              </div>

              {/* Form actions */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-2 px-4 border border-slate-250 hover:border-slate-350 bg-white text-slate-655 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Submit Request
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default MyOrders;
