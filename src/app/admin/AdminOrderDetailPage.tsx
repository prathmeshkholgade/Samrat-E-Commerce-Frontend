import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store';
import { 
  ArrowLeft, 
  ShoppingCart, 
  User, 
  Store, 
  MapPin, 
  CreditCard, 
  Clock, 
  ShieldCheck,
  AlertTriangle,
  Package
} from 'lucide-react';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recentOrders, sellers, customers } = useAppSelector((state) => state.admin);

  const order = recentOrders.find((o) => o.id === id);

  // Cross-reference customer & seller details for rich display
  const customerDetails = order ? customers.find((c) => c.id === order.customerId) : null;
  const sellerDetails = order ? sellers.find((s) => s.id === order.sellerId) : null;

  if (!order) {
    return (
      <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center shadow-3xs text-xs">
        <AlertTriangle className="text-rose-500 mx-auto mb-3" size={32} />
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Order Reference Not Found</h4>
        <p className="text-[11px] text-slate-450 mt-1">No transaction order exists with Reference ID: {id}</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-650 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      
      {/* Dossier Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Back to Orders Registry"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                Order details: {order.id}
              </h2>
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
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
              Transaction Date: {order.date}
            </p>
          </div>
        </div>
        
        {/* Read only info block */}
        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-[9px] font-black text-indigo-700 uppercase tracking-wider select-none self-start sm:self-center">
          <ShieldCheck size={11} />
          <span>Audit Log Read-Only</span>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Products List, Delivery Address, Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Products Breakdown Table */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <Package className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Purchased Items</h3>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-slate-650">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-2.5 text-left">Product Name</th>
                    <th className="px-5 py-2.5 text-center">Quantity</th>
                    <th className="px-5 py-2.5 text-left font-mono">Price Unit</th>
                    <th className="px-5 py-2.5 text-right font-mono">Total Row</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.products.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/20">
                      <td className="px-5 py-3 text-left">
                        <p className="font-extrabold text-slate-850 leading-snug">{p.name}</p>
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">ID: {p.id}</span>
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-slate-800">
                        {p.quantity}
                      </td>
                      <td className="px-5 py-3 text-left font-mono font-semibold text-slate-600">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">
                        ${(p.price * p.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <MapPin className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Delivery Destination</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 leading-relaxed">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Recipient Contact</span>
                <p className="font-extrabold text-slate-800 mt-1">{order.shippingAddress.fullName}</p>
                <p className="text-slate-500 font-semibold mt-0.5">{order.shippingAddress.mobile}</p>
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Destination Address</span>
                <p className="font-semibold text-slate-600 mt-1">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}
                </p>
                <p className="font-semibold text-slate-605">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p className="font-bold text-slate-500 uppercase tracking-wide mt-0.5">{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <Clock className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Fulfillment Audit Timeline</h3>
            </div>

            <div className="space-y-6 relative before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-slate-100 pl-8">
              {order.timeline.map((checkpoint, idx) => (
                <div key={idx} className="relative text-left">
                  {/* Dot */}
                  <span className="absolute -left-[28px] top-1.5 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-4 ring-indigo-50" />
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-slate-800">{checkpoint.title}</p>
                      <span className="px-1.5 py-0.5 rounded bg-slate-50 text-[8px] font-bold text-slate-400 font-mono">
                        {checkpoint.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-450 mt-1 font-semibold leading-normal">{checkpoint.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Customer info, Seller info, Payments details */}
        <div className="lg:col-span-1 space-y-6 text-xs text-left">
          
          {/* Customer profile card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <User className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Customer Profile</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Buyer Full Name</span>
                <p className="font-extrabold text-slate-850 mt-1">{order.customerName}</p>
              </div>
              
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Profile Reference ID</span>
                <p className="font-semibold text-slate-500 font-mono mt-1">{order.customerId}</p>
              </div>

              {customerDetails && (
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Contact Email</span>
                  <p className="font-semibold text-slate-600 font-mono mt-1">{customerDetails.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Seller profile card */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <Store className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-805 tracking-wider">Fulfilling Merchant</h3>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Store Brand Name</span>
                <p className="font-extrabold text-slate-850 mt-1">{order.sellerName}</p>
              </div>

              <div>
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Merchant Reference ID</span>
                <p className="font-semibold text-slate-505 font-mono mt-1">{order.sellerId}</p>
              </div>

              {sellerDetails && (
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Contact Phone</span>
                  <p className="font-semibold text-slate-600 mt-1">{sellerDetails.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment audit details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <CreditCard className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Payment Transaction</h3>
            </div>

            <div className="space-y-4 font-semibold text-slate-700">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Gateway Method</span>
                <span className="font-bold text-slate-800">{order.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wide">Payment Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 text-emerald-705 border border-emerald-100'
                    : 'bg-rose-50 text-rose-705 border border-rose-100'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 font-mono">
                <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide font-sans">Gross Net Total</span>
                <span className="text-sm font-black text-indigo-650">${order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminOrderDetailPage;
