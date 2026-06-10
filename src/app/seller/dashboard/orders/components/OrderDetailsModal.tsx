import React from 'react';
import { X, User, Mail, Phone, MapPin, DollarSign, Calendar, Truck, CreditCard, Printer, Download } from 'lucide-react';
import type { SellerOrder } from '../../../../../shared/types';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: SellerOrder | null;
  onClose: () => void;
  onStatusChange: (status: SellerOrder['status']) => void;
  onPrint: () => void;
  onDownload: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  order,
  onClose,
  onStatusChange,
  onPrint,
  onDownload,
}) => {
  if (!isOpen || !order) return null;

  const statuses: SellerOrder['status'][] = [
    'Pending',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out For Delivery',
    'Delivered',
    'Cancelled',
    'Returned',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base leading-none">Order Information Sheet</h3>
            <p className="text-[10px] text-slate-450 font-bold mt-1">Order Ref: {order.id}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onPrint}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800 transition-all cursor-pointer bg-white"
              title="Print Invoice"
            >
              <Printer size={15} />
            </button>
            <button
              onClick={onDownload}
              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-350 text-slate-500 hover:text-slate-800 transition-all cursor-pointer bg-white"
              title="Download Invoice"
            >
              <Download size={15} />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-1" />
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status and Action bar */}
          <div className="bg-slate-50 border border-slate-150/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Current Status:</span>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Change Status Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap">Change Status:</label>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(e.target.value as SellerOrder['status'])}
                className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-705 outline-hidden cursor-pointer h-8"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid: Customer Details and Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details */}
            <div className="border border-slate-150/40 rounded-2xl p-4 space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <User size={13} className="text-indigo-650" />
                <span>Customer Registry</span>
              </h4>
              <div className="space-y-2 text-xs font-bold text-slate-650">
                <p className="text-slate-800 font-extrabold text-sm">{order.customerName}</p>
                <p className="flex items-center gap-2">
                  <Mail size={12} className="text-slate-400" />
                  <span>{order.customerEmail}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400" />
                  <span>{order.customerPhone}</span>
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-slate-150/40 rounded-2xl p-4 space-y-3">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <MapPin size={13} className="text-indigo-650" />
                <span>Delivery Address</span>
              </h4>
              <div className="space-y-1.5 text-xs font-bold text-slate-650">
                <p className="text-slate-800 font-extrabold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                <p className="text-[10px] text-slate-450 uppercase tracking-wider">{order.shippingAddress.country}</p>
              </div>
            </div>

          </div>

          {/* Items Table list */}
          <div className="border border-slate-150/40 rounded-2xl p-4 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-slate-450 tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Box size={13} className="text-indigo-650" />
              <span>Purchased Items List</span>
            </h4>
            <div className="divide-y divide-slate-100 space-y-3">
              {order.products.map((item, idx) => (
                <div key={idx} className="flex gap-4 pt-3 first:pt-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex justify-between items-center text-xs font-bold">
                    <div className="space-y-1">
                      <p className="text-slate-850 font-black leading-tight max-w-[280px]">{item.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {item.selectedSize && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            Color: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <p className="text-slate-800 font-extrabold">${item.price.toFixed(2)} x {item.quantity}</p>
                      <p className="text-indigo-650 font-black">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Grid: Shipping specifications / Payment details & Financial Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Payment & Logistics details */}
            <div className="border border-slate-150/40 rounded-2xl p-4 space-y-4 text-xs font-bold text-slate-600">
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block border-b border-slate-100 pb-1.5">Logistics & Tracking</span>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <Truck size={13} />
                    <span>Shipping Method</span>
                  </span>
                  <span>{order.shippingCarrier || 'Samrat Logistics'}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex items-center justify-between text-slate-850">
                    <span className="text-slate-450 font-semibold">Tracking Number</span>
                    <span className="font-mono text-[10px] bg-slate-50 border border-slate-200/40 px-2 py-0.5 rounded select-all uppercase">
                      {order.trackingNumber}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block border-b border-slate-100 pb-1.5">Payment Information</span>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-450 font-semibold flex items-center gap-1.5">
                    <CreditCard size={13} />
                    <span>Payment Method</span>
                  </span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between text-slate-800">
                  <span className="text-slate-450 font-semibold">Payment Status</span>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] uppercase font-extrabold tracking-wider ${
                    order.paymentStatus === 'Paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                    order.paymentStatus === 'Unpaid' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                    'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="border border-slate-150/40 rounded-2xl p-4 bg-slate-50/50 space-y-2.5 text-xs font-bold text-slate-550">
              <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 block border-b border-slate-100 pb-1.5">Financial Statement</span>
              
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-850 font-extrabold">${order.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span className="text-emerald-750 font-black">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (18%)</span>
                <span className="text-slate-850 font-extrabold">${(order.amount * 0.18).toFixed(2)}</span>
              </div>
              
              <div className="h-px bg-slate-200 my-1" />
              
              <div className="flex justify-between text-sm text-slate-900 font-black">
                <span className="flex items-center gap-1">
                  <DollarSign size={15} className="text-indigo-650" />
                  <span>Total Amount</span>
                </span>
                <span className="text-indigo-650 text-base font-black">${order.amount.toFixed(2)}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            Dismiss Details
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetailsModal;
