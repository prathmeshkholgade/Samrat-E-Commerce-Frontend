import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Printer,
  Download,
  Info,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Box
} from 'lucide-react';
import { useAppSelector } from '../../../../store';
import {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} from '../../../../store/services/sellerApi';
import type { SellerOrder } from '../../../../shared/types';
import OrderStatusBadge from '../../../../features/seller/components/orders/OrderStatusBadge';
import InvoiceTemplate from '../../../../features/seller/components/orders/InvoiceTemplate';

const STATUS_STEPS = [
  { key: 'Pending', label: 'Order Placed', desc: 'Order received, awaiting acceptance' },
  { key: 'Confirmed', label: 'Accepted', desc: 'Accepted & preparing products' },
  { key: 'Packed', label: 'Packed & Ready', desc: 'Packaged & awaiting carrier pickup' },
  { key: 'Shipped', label: 'In Transit', desc: 'Handed over to logistics carrier' },
  { key: 'Out For Delivery', label: 'Out for Delivery', desc: 'Out with delivery agent' },
  { key: 'Delivered', label: 'Delivered', desc: 'Successfully delivered to customer' },
];

const STATUS_ORDER: Record<SellerOrder['status'], number> = {
  'Pending': 0,
  'Confirmed': 1,
  'Packed': 2,
  'Shipped': 3,
  'Out For Delivery': 4,
  'Delivered': 5,
  'Cancelled': -1,
  'Returned': -2,
};

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Queries & Mutations
  const { data: allOrders = [], isLoading } = useGetSellerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  // Selected Order
  const order = allOrders.find((o) => o.id === id);

  // States
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [shippingCarrier, setShippingCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showShipForm, setShowShipForm] = useState(false);
  const [shipFormError, setShipFormError] = useState('');

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin mb-4" />
        <span className="text-xs font-extrabold text-slate-450 uppercase tracking-widest">Loading Order Details...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-slate-150/40 rounded-3xl p-12 shadow-3xs text-center space-y-6 max-w-lg mx-auto mt-12">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <XCircle size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">Order Not Found</h3>
          <p className="text-xs font-semibold text-slate-450">We couldn't retrieve an order with the ID: <span className="font-mono text-slate-700">{id}</span>. It may have been deleted or doesn't exist.</p>
        </div>
        <button
          onClick={() => navigate('/seller/orders')}
          className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 inline-flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Orders List</span>
        </button>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER[order.status];
  const isTerminal = order.status === 'Cancelled' || order.status === 'Returned';

  // State Transition Handlers
  const handleStatusChange = async (targetStatus: SellerOrder['status'], carrier?: string, tracking?: string) => {
    try {
      await updateOrderStatus({
        id: order.id,
        status: targetStatus,
        shippingCarrier: carrier,
        trackingNumber: tracking,
      }).unwrap();
      setShowShipForm(false);
      setShipFormError('');
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Error updating status');
    }
  };

  const handleMarkShippedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingCarrier.trim() || !trackingNumber.trim()) {
      setShipFormError('Please fill in both carrier and tracking number fields.');
      return;
    }
    handleStatusChange('Shipped', shippingCarrier.trim(), trackingNumber.trim());
  };

  // Download Invoice text utility
  const handleDownloadInvoice = () => {
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

  return (
    <div className="space-y-6 text-left">
      
      {/* Header breadcrumb & actions */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <Link
            to="/seller/orders"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-indigo-650 hover:text-indigo-800 tracking-wider transition-colors"
          >
            <ArrowLeft size={11} className="stroke-[3px]" />
            <span>Back to Orders Registry</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase font-mono">
              {order.id}
            </h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-450 mt-1">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-slate-400" />
              <span>Placed on {order.date}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CreditCard size={13} className="text-slate-400" />
              <span>Paid via {order.paymentMethod}</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-350 bg-white text-slate-600 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-3xs"
          >
            <Download size={14} />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={() => setIsPrintModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/50 text-indigo-650 text-xs font-bold transition-all cursor-pointer shadow-3xs"
          >
            <Printer size={14} />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Terminal status warnings */}
      {order.status === 'Cancelled' && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3.5 text-rose-800">
          <ShieldAlert className="text-rose-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs">
            <p className="font-extrabold text-sm leading-normal text-rose-900">Order Cancelled</p>
            <p className="font-semibold text-rose-700/95 mt-0.5">This transaction was cancelled and a refund of ${order.amount.toFixed(2)} was credited to the buyer's billing account.</p>
          </div>
        </div>
      )}

      {order.status === 'Returned' && (
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex items-start gap-3.5 text-slate-700">
          <AlertCircle className="text-slate-500 shrink-0 mt-0.5" size={18} />
          <div className="text-xs">
            <p className="font-extrabold text-sm leading-normal text-slate-850">Order Returned</p>
            <p className="font-semibold text-slate-550 mt-0.5">The customer returned this package. The return has been logged and items have been added back to virtual inventory.</p>
          </div>
        </div>
      )}

      {/* Timeline tracker stepper card */}
      {!isTerminal && (
        <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs space-y-6">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Fulfillment Progress Tracker</h3>
          
          <div className="relative">
            {/* Timeline connectors line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-slate-100 -z-0 hidden md:block" />
            <div 
              className="absolute top-5 left-6 h-0.5 bg-indigo-500 -z-0 hidden md:block transition-all duration-500" 
              style={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 90}%` }}
            />

            {/* Stepper points grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isActive = idx === currentStatusIndex;
                const isCompleted = idx < currentStatusIndex;
                const isFuture = idx > currentStatusIndex;

                let iconBg = 'bg-white border-2 border-slate-200 text-slate-400';
                let stepIcon = <Clock size={14} />;

                if (isActive) {
                  iconBg = 'bg-indigo-600 border-2 border-indigo-600 text-white shadow-md shadow-indigo-150 scale-110';
                  stepIcon = <TrendingUp size={14} className="animate-pulse" />;
                } else if (isCompleted) {
                  iconBg = 'bg-emerald-500 border-2 border-emerald-500 text-white';
                  stepIcon = <CheckCircle2 size={14} />;
                }

                return (
                  <div key={step.key} className="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${iconBg}`}>
                      {stepIcon}
                    </div>
                    <div className="space-y-0.5">
                      <p className={`text-xs font-black leading-none ${isActive ? 'text-indigo-650' : isCompleted ? 'text-emerald-700' : 'text-slate-700'}`}>
                        {step.label}
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400 md:max-w-[130px] md:mx-auto leading-normal">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Product Ordered list & History Log */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Products Ordered Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package size={14} className="text-indigo-650" />
              <span>Products Ordered ({order.products.length})</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {order.products.map((item) => (
                <div key={item.productId} className="py-4 first:pt-1 last:pb-1 flex gap-4 items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-150 bg-slate-50 shrink-0 shadow-3xs"
                  />
                  <div className="flex-grow min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 hover:text-indigo-600 transition-colors truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5 uppercase">
                      SKU: {item.productId.toUpperCase()}
                    </p>
                    <div className="flex flex-wrap gap-2.5 mt-1">
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-150/45 rounded-md text-[9px] font-black text-slate-450 uppercase">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="px-2 py-0.5 bg-slate-50 border border-slate-150/45 rounded-md text-[9px] font-black text-slate-450 uppercase">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-slate-900">${item.price.toFixed(2)}</p>
                    <p className="text-[10px] font-semibold text-slate-450 mt-0.5">Qty: {item.quantity}</p>
                    <p className="text-[11px] font-black text-slate-900 mt-1">Sub: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Tracking Details */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info size={14} className="text-indigo-650" />
              <span>Fulfillment History Logs</span>
            </h3>

            <div className="space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-100">
              
              {/* Event Log 1 */}
              <div className="flex gap-4 items-start relative z-10">
                <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={12} />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-slate-800">Order Placed & Validated</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">The customer completed the checkout process. Payment was processed via {order.paymentMethod}.</p>
                  <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 10:42 AM</span>
                </div>
              </div>

              {/* Conditional Event Log 2: Accepted */}
              {currentStatusIndex >= 1 && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Order Accepted by Seller</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Order verified and added to the seller fulfillment backlog.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 11:15 AM</span>
                  </div>
                </div>
              )}

              {/* Conditional Event Log 3: Packed */}
              {currentStatusIndex >= 2 && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Products Packaged & Sealed</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Items verified against invoice, boxed securely, and invoice attached.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 02:30 PM</span>
                  </div>
                </div>
              )}

              {/* Conditional Event Log 4: Shipped */}
              {currentStatusIndex >= 3 && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-650">
                    <Truck size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Dispatched via {order.shippingCarrier || 'Logistics Partner'}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Handed over to carrier. Tracking ID: <span className="font-mono text-indigo-600 font-extrabold">{order.trackingNumber || 'PENDING'}</span></p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 04:00 PM</span>
                  </div>
                </div>
              )}

              {/* Conditional Event Log 5: Out For Delivery */}
              {currentStatusIndex >= 4 && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-650">
                    <Truck size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Out for Local Delivery</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">The shipment has arrived at the destination delivery hub and is out with the carrier agent.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 09:15 AM</span>
                  </div>
                </div>
              )}

              {/* Conditional Event Log 6: Delivered */}
              {currentStatusIndex >= 5 && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Delivered Successfully</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Package signed and received by recipient.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 01:20 PM</span>
                  </div>
                </div>
              )}

              {/* Cancelled Log */}
              {order.status === 'Cancelled' && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-rose-650 text-white flex items-center justify-center">
                    <XCircle size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Order Rejected / Cancelled</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Order was cancelled and refund processing initiated.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 12:00 PM</span>
                  </div>
                </div>
              )}

              {/* Returned Log */}
              {order.status === 'Returned' && (
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-650 text-white flex items-center justify-center">
                    <AlertCircle size={12} />
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-800">Package Returned to Origin</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Package return delivery completed. Items returned to inventory stock.</p>
                    <span className="text-[9px] font-bold text-slate-400 font-mono block mt-1">{order.date} 03:00 PM</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Right Side: Seller Actions, Customer info, Shipping address, Financials */}
        <div className="space-y-6">
          
          {/* Seller Action card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Box size={14} className="text-indigo-650" />
              <span>Seller Fulfillment Actions</span>
            </h3>

            {/* Contextual Buttons */}
            <div className="space-y-3">
              {order.status === 'Pending' && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusChange('Confirmed')}
                    disabled={isUpdating}
                    className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 size={14} />
                    <span>Accept & Confirm Order</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('Cancelled')}
                    disabled={isUpdating}
                    className="w-full py-2.5 bg-white hover:bg-rose-50 disabled:opacity-50 border border-slate-200 hover:border-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>Reject Order</span>
                  </button>
                </div>
              )}

              {order.status === 'Confirmed' && (
                <button
                  onClick={() => handleStatusChange('Packed')}
                  disabled={isUpdating}
                  className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Package size={14} />
                  <span>Mark as Packed (Ready to Ship)</span>
                </button>
              )}

              {order.status === 'Packed' && (
                <div className="space-y-3">
                  {!showShipForm ? (
                    <button
                      onClick={() => setShowShipForm(true)}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Truck size={14} />
                      <span>Dispatch (Mark Shipped)</span>
                    </button>
                  ) : (
                    <form onSubmit={handleMarkShippedSubmit} className="bg-slate-50 border border-slate-150/50 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-2">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Logistics Routing</p>
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 block">Shipping Carrier</label>
                        <input
                          type="text"
                          value={shippingCarrier}
                          onChange={(e) => setShippingCarrier(e.target.value)}
                          placeholder="e.g. FedEx, Delhivery"
                          className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs outline-hidden focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400 block">Tracking ID / Number</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. SMLG-984210"
                          className="w-full bg-white border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs outline-hidden focus:border-indigo-500 font-semibold"
                        />
                      </div>

                      {shipFormError && (
                        <p className="text-[10px] font-semibold text-rose-600">{shipFormError}</p>
                      )}

                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => { setShowShipForm(false); setShipFormError(''); }}
                          className="flex-grow py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-550 rounded-lg text-[10px] font-bold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="flex-grow py-2 bg-indigo-650 hover:bg-indigo-750 text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          Confirm Dispatch
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {order.status === 'Shipped' && (
                <button
                  onClick={() => handleStatusChange('Out For Delivery')}
                  disabled={isUpdating}
                  className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-violet-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck size={14} />
                  <span>Out for Delivery</span>
                </button>
              )}

              {order.status === 'Out For Delivery' && (
                <button
                  onClick={() => handleStatusChange('Delivered')}
                  disabled={isUpdating}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-150 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  <span>Mark as Delivered</span>
                </button>
              )}

              {order.status === 'Delivered' && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4.5 text-center text-emerald-800 space-y-1">
                  <CheckCircle2 className="text-emerald-600 mx-auto" size={24} />
                  <p className="font-extrabold text-xs">Fulfillment Complete</p>
                  <p className="text-[10px] font-semibold text-emerald-605">This order is closed and verified as delivered.</p>
                </div>
              )}

              {isTerminal && (
                <div className="bg-slate-50 border border-slate-150/45 rounded-2xl p-4.5 text-center text-slate-500 space-y-1">
                  <Info className="text-slate-400 mx-auto" size={24} />
                  <p className="font-extrabold text-xs">Closed Order</p>
                  <p className="text-[10px] font-semibold text-slate-400">No further workflow actions are active for this status.</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer Details Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <User size={14} className="text-indigo-650" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3 font-semibold text-xs text-slate-650">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-extrabold text-sm uppercase">
                  {order.customerName.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-900 font-extrabold">{order.customerName}</p>
                  <p className="text-[10px] text-slate-400 font-bold block mt-0.5">Verified Buyer</p>
                </div>
              </div>
              
              <div className="h-px bg-slate-100 my-2" />

              <div className="space-y-2.5">
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="flex items-center gap-2.5 hover:text-indigo-655 hover:underline transition-all"
                >
                  <Mail size={14} className="text-slate-400" />
                  <span>{order.customerEmail}</span>
                </a>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center gap-2.5 hover:text-indigo-655 hover:underline transition-all"
                >
                  <Phone size={14} className="text-slate-400" />
                  <span>{order.customerPhone}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin size={14} className="text-indigo-650" />
              <span>Shipping Address</span>
            </h3>

            <div className="space-y-3 font-semibold text-xs text-slate-650">
              <p className="text-slate-900 font-extrabold">{order.shippingAddress.fullName}</p>
              
              <div className="space-y-1 text-slate-500 leading-normal">
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black pt-1">{order.shippingAddress.country}</p>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex items-center gap-2 text-slate-500">
                <Phone size={13} className="text-slate-400" />
                <span>Mobile: {order.shippingAddress.mobile}</span>
              </div>
            </div>
          </div>

          {/* Payment Details card */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-455 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard size={14} className="text-indigo-650" />
              <span>Payment Information</span>
            </h3>

            <div className="space-y-3 font-semibold text-xs text-slate-605">
              <div className="flex items-center justify-between">
                <span className="text-slate-450">Payment Method</span>
                <span className="text-slate-800 font-black">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-450">Transaction Status</span>
                <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-black tracking-wider ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    : order.paymentStatus === 'Unpaid'
                    ? 'bg-amber-50 border-amber-100 text-amber-700'
                    : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-450">Subtotal</span>
                  <span className="text-slate-705">${order.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Shipping Fee</span>
                  <span className="text-emerald-600 uppercase font-black text-[10px]">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Estimated Tax (GST 18%)</span>
                  <span className="text-slate-705">${(order.amount * 0.18).toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-slate-900 font-black">Total Net Payable</span>
                  <span className="text-indigo-650 font-black">${order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* PRINT INVOICE MODAL OVERLAY */}
      <InvoiceTemplate
        isOpen={isPrintModalOpen}
        order={order}
        onClose={() => setIsPrintModalOpen(false)}
      />

    </div>
  );
};

export default OrderDetailPage;
