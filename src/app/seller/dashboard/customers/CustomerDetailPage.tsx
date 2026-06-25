import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Eye,
  ShieldCheck,
  User
} from 'lucide-react';
import {
  useGetSellerCustomersQuery,
  useGetSellerOrdersQuery,
} from '../../../../store/services/sellerApi';
import OrderStatusBadge from '../../../../features/seller/components/orders/OrderStatusBadge';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Queries
  const { data: allCustomers = [], isLoading: isLoadingCustomers } = useGetSellerCustomersQuery();
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();

  // Find target customer
  const customer = allCustomers.find((c) => c.id === id);

  if (isLoadingCustomers || isLoadingOrders) {
    return (
      <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin mb-4" />
        <span className="text-xs font-extrabold text-slate-450 uppercase tracking-widest">Retrieving Customer Profile...</span>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white border border-slate-150/40 rounded-3xl p-12 shadow-3xs text-center space-y-6 max-w-lg mx-auto mt-12 text-left">
        <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto">
          <User size={28} />
        </div>
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-black text-slate-900">Buyer Profile Not Found</h3>
          <p className="text-xs font-semibold text-slate-450">We couldn't retrieve a buyer account with the ID: <span className="font-mono text-slate-700">{id}</span>.</p>
        </div>
        <div className="text-center">
          <button
            onClick={() => navigate('/seller/customers')}
            className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-150 inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Back to Customers List</span>
          </button>
        </div>
      </div>
    );
  }

  // Filter orders matching customer email
  const customerOrders = allOrders
    .filter((o) => o.customerEmail === customer.email)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Compute spend analytics
  const ordersCount = customerOrders.length;
  
  const completedOrders = customerOrders.filter((o) => o.status !== 'Cancelled');
  const totalSpend = completedOrders.reduce((acc, o) => acc + o.amount, 0);
  
  const avgOrderValue = ordersCount > 0 ? totalSpend / ordersCount : 0;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header breadcrumb & actions */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Link
            to="/seller/customers"
            className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-indigo-650 hover:text-indigo-800 tracking-wider transition-colors"
          >
            <ArrowLeft size={11} className="stroke-[3px]" />
            <span>Back to Customer Directory</span>
          </Link>
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none">
              {customer.name}
            </h2>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-[9px] font-black text-indigo-700 uppercase tracking-wider select-none shadow-3xs">
              <ShieldCheck size={11} />
              <span>Customer Account</span>
            </span>
          </div>
        </div>
      </div>

      {/* Split details layout grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left column: Profile card */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-5">
            
            {/* Initials & ID */}
            <div className="text-center space-y-3 pb-4 border-b border-slate-100">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-black text-3xl uppercase shadow-3xs mx-auto">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="font-extrabold text-slate-900 text-base leading-none">{customer.name}</p>
                <span className="text-[10px] text-slate-400 font-bold block mt-1.5 uppercase font-mono bg-slate-50 border border-slate-100 rounded-md px-2 py-0.5 inline-block">
                  ID: {customer.id.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Profile fields */}
            <div className="space-y-3 font-semibold text-xs text-slate-655">
              
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <a href={`mailto:${customer.email}`} className="text-slate-700 hover:text-indigo-650 hover:underline truncate">
                  {customer.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <a href={`tel:${customer.mobile}`} className="text-slate-700 hover:text-indigo-650 hover:underline">
                  {customer.mobile}
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-500 leading-normal">
                  <p>{customer.city}, {customer.state}</p>
                  <p>{customer.pincode}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black pt-0.5">{customer.country}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex items-center gap-2.5 text-slate-455">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <span>Joined store on {customer.joinedDate}</span>
              </div>

            </div>

          </div>

        </div>

        {/* Right column: Analytics and order logs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Revenue Analytics Row */}
          <div className="grid grid-cols-3 gap-6">
            
            {/* Total spend */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total spend</span>
              <span className="text-lg md:text-xl font-black text-indigo-655 block leading-none mt-2">${totalSpend.toFixed(2)}</span>
            </div>

            {/* Orders count */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Orders placed</span>
              <span className="text-lg md:text-xl font-black text-slate-900 block leading-none mt-2">{ordersCount}</span>
            </div>

            {/* Avg order value */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs text-left">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Avg Order Value</span>
              <span className="text-lg md:text-xl font-black text-slate-900 block leading-none mt-2">${avgOrderValue.toFixed(2)}</span>
            </div>

          </div>

          {/* Orders log table */}
          <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-450 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShoppingBag size={14} className="text-indigo-655" />
              <span>Orders Purchase History ({customerOrders.length})</span>
            </h3>

            <div className="overflow-x-auto">
              {customerOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  This customer hasn't placed any orders yet.
                </div>
              ) : (
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider select-none">
                      <th className="py-2.5 px-2">Order ID</th>
                      <th className="py-2.5 px-2">Date</th>
                      <th className="py-2.5 px-2 text-right">Items</th>
                      <th className="py-2.5 px-2 text-right">Total Amount</th>
                      <th className="py-2.5 px-2 text-center">Fulfillment</th>
                      <th className="py-2.5 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold text-slate-655">
                    {customerOrders.map((o) => {
                      const totalQty = o.products.reduce((acc, item) => acc + item.quantity, 0);
                      return (
                        <tr key={o.id} className="hover:bg-slate-50/40">
                          
                          {/* Order ID */}
                          <td className="py-3 px-2 font-mono text-[11px] text-slate-900 font-extrabold uppercase">
                            {o.id}
                          </td>

                          {/* Date */}
                          <td className="py-3 px-2 text-slate-400 text-[11px] font-semibold">
                            {o.date}
                          </td>

                          {/* Items count */}
                          <td className="py-3 px-2 text-right text-slate-800">
                            {totalQty} {totalQty === 1 ? 'item' : 'items'}
                          </td>

                          {/* Amount */}
                          <td className="py-3 px-2 text-right text-slate-900 font-black">
                            ${o.amount.toFixed(2)}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-2 text-center">
                            <OrderStatusBadge status={o.status} />
                          </td>

                          {/* Action view redirect */}
                          <td className="py-3 px-2 text-right">
                            <Link
                              to={`/seller/orders/${o.id}`}
                              className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer inline-flex items-center justify-center"
                              title="View Order Details"
                            >
                              <Eye size={14} />
                            </Link>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CustomerDetailPage;
