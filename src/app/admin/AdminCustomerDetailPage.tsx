import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateCustomerStatus } from '../../store/slices/adminSlice';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  ShoppingCart, 
  Ban, 
  Unlock, 
  ShieldCheck,
  AlertTriangle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

export const AdminCustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.admin);

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center shadow-3xs text-xs">
        <AlertTriangle className="text-rose-500 mx-auto mb-3" size={32} />
        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Customer Dossier Not Found</h4>
        <p className="text-[11px] text-slate-450 mt-1">No customer profile exists with ID: {id}</p>
        <button
          onClick={() => navigate('/admin/customers')}
          className="mt-5 px-4 py-2 bg-slate-50 border border-slate-200 text-slate-655 hover:bg-slate-100 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
        >
          <ArrowLeft size={13} />
          <span>Back to List</span>
        </button>
      </div>
    );
  }

  const handleStatusUpdate = (status: 'Active' | 'Blocked') => {
    dispatch(updateCustomerStatus({ id: customer.id, status }));
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/customers')}
            className="p-2.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            title="Back to Customer Directory"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight leading-none">
                {customer.name}
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                customer.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {customer.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-1 uppercase tracking-wider">
              Customer ID: {customer.id} • Registered on {customer.registrationDate}
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-full text-[9px] font-black text-indigo-700 uppercase tracking-wider select-none self-start sm:self-center">
          <ShieldCheck size={11} />
          <span>Profile Dossier</span>
        </span>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Addresses, Orders history */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Addresses Directory */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <MapPin className="text-indigo-650" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Registered Shipping Addresses</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {customer.addresses.map((addr, idx) => (
                <div key={idx} className="p-4 bg-slate-50/70 border border-slate-150/40 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-200 text-slate-700">
                      {addr.type} Address
                    </span>
                  </div>
                  <p className="font-semibold text-slate-655 leading-relaxed">
                    {addr.addressLine1}
                    {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                  </p>
                  <p className="font-extrabold text-slate-700">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order history */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-3xs text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
              <ShoppingCart className="text-indigo-655" size={18} />
              <h3 className="text-xs font-black uppercase text-slate-805 tracking-wider">Order & Checkout Ledger</h3>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-slate-650">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-2.5 text-left font-mono">Order ID</th>
                    <th className="px-5 py-2.5 text-left">Fulfillment</th>
                    <th className="px-5 py-2.5 text-left font-mono">Date</th>
                    <th className="px-5 py-2.5 text-right font-mono">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customer.orderHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-slate-50/20">
                      <td className="px-5 py-3 text-left">
                        <button
                          onClick={() => navigate(`/admin/orders/${history.id}`)}
                          className="font-mono font-bold text-indigo-650 hover:underline hover:text-indigo-750 cursor-pointer"
                        >
                          {history.id}
                        </button>
                      </td>
                      <td className="px-5 py-3 text-left">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                          history.status === 'Completed' || history.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-105'
                        }`}>
                          {history.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-left font-medium text-slate-500 font-mono">
                        {history.date}
                      </td>
                      <td className="px-5 py-3 text-right font-mono font-bold text-slate-800">
                        ${history.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Profile details, actions */}
        <div className="lg:col-span-1 space-y-6 text-xs text-left">
          
          {/* Profile details */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <User className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Contact Information</h3>
            </div>

            <div className="space-y-4 font-semibold text-slate-700">
              <div className="flex items-start gap-2.5">
                <Mail size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Email Address</span>
                  <p className="font-mono text-slate-800 mt-0.5">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Mobile Number</span>
                  <p className="text-slate-800 mt-0.5">{customer.mobile}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Account Onboarded</span>
                  <p className="text-slate-850 mt-0.5">{customer.registrationDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action box */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-3.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
              <Ban className="text-indigo-650" size={16} />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider">Account Moderation</h3>
            </div>

            <p className="text-[10px] font-bold text-slate-450 leading-normal">
              Restricting a customer account hides catalog checkouts and blocks the user profile session instantly.
            </p>

            {customer.status === 'Active' ? (
              <button
                onClick={() => handleStatusUpdate('Blocked')}
                className="w-full py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors text-xs font-black shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Ban size={13} />
                <span>Block Customer Profile</span>
              </button>
            ) : (
              <button
                onClick={() => handleStatusUpdate('Active')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-705 transition-colors text-xs font-black shadow-3xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Unlock size={13} />
                <span>Unblock Customer Profile</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminCustomerDetailPage;
