import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  updateSellerStatus,
  updateProductStatus,
} from '../../../store/slices/adminSlice';
import { Check, X, ShieldAlert, ShoppingBag, Users } from 'lucide-react';

export const PendingApprovalsWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sellers, products } = useAppSelector((state) => state.admin);
  const pendingSellerList = sellers.filter((s) => s.status === 'Pending');
  const pendingProductList = products.filter((p) => p.status === 'Pending Review');
  const [activeTab, setActiveTab] = useState<'sellers' | 'products'>('sellers');

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden text-left flex flex-col h-full">
      {/* Header Tabs */}
      <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-indigo-650" size={16} />
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Pending Moderation Queue
          </h4>
        </div>
        
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
          <button
            onClick={() => setActiveTab('sellers')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black transition-all ${
              activeTab === 'sellers'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-550 hover:text-slate-800'
            }`}
          >
            <Users size={12} />
            <span>Sellers ({pendingSellerList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-black transition-all ${
              activeTab === 'products'
                ? 'bg-white text-slate-800 shadow-2xs'
                : 'text-slate-550 hover:text-slate-800'
            }`}
          >
            <ShoppingBag size={12} />
            <span>Products ({pendingProductList.length})</span>
          </button>
        </div>
      </div>

      {/* List content area */}
      <div className="flex-grow overflow-x-auto min-h-[250px]">
        {activeTab === 'sellers' ? (
          pendingSellerList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[250px]">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <Check size={20} />
              </div>
              <p className="text-xs font-black text-slate-700">All Sellers Approved!</p>
              <p className="text-[10px] text-slate-450 mt-0.5">No pending registration requests in queue.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-slate-650 border-collapse">
              <thead>
                <tr className="bg-slate-50/20 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
                  <th className="px-5 py-2.5 font-black text-left">Vendor Store</th>
                  <th className="px-5 py-2.5 font-black text-left">Applicant</th>
                  <th className="px-5 py-2.5 font-black text-left">Category</th>
                  <th className="px-5 py-2.5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingSellerList.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3 text-left">
                      <p className="font-extrabold text-slate-800 leading-normal">{seller.storeName}</p>
                      <span className="text-[9px] font-bold text-slate-400 block">{seller.date}</span>
                    </td>
                    <td className="px-5 py-3 text-left">
                      <p className="font-semibold text-slate-705 leading-none">{seller.name}</p>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 block">{seller.email}</span>
                    </td>
                    <td className="px-5 py-3 text-left">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                        {seller.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => dispatch(updateSellerStatus({ id: seller.id, status: 'Approved' }))}
                          className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="Approve Store"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => dispatch(updateSellerStatus({ id: seller.id, status: 'Rejected' }))}
                          className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title="Reject Store"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          pendingProductList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center min-h-[250px]">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                <Check size={20} />
              </div>
              <p className="text-xs font-black text-slate-700">All Products Reviewed!</p>
              <p className="text-[10px] text-slate-450 mt-0.5">No products currently awaiting catalog review.</p>
            </div>
          ) : (
            <table className="w-full text-xs text-slate-650 border-collapse">
              <thead>
                <tr className="bg-slate-50/20 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
                  <th className="px-5 py-2.5 font-black text-left">Product Details</th>
                  <th className="px-5 py-2.5 font-black text-left">Seller</th>
                  <th className="px-5 py-2.5 font-black text-left">Price</th>
                  <th className="px-5 py-2.5 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingProductList.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30">
                    <td className="px-5 py-3 text-left">
                      <p className="font-extrabold text-slate-805 leading-normal truncate max-w-[200px]" title={product.name}>
                        {product.name}
                      </p>
                      <span className="text-[9px] font-black text-indigo-650 uppercase tracking-widest block mt-0.5">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-left font-semibold text-slate-700">
                      {product.sellerName}
                    </td>
                    <td className="px-5 py-3 text-left font-mono font-bold text-slate-850">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => dispatch(updateProductStatus({ id: product.id, status: 'Approved' }))}
                          className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                          title="Approve Catalog Item"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => dispatch(updateProductStatus({ id: product.id, status: 'Rejected' }))}
                          className="p-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                          title="Reject Catalog Item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsWidget;
