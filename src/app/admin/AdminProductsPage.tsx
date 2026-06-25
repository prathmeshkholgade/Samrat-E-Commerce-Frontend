import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateProductStatus } from '../../store/slices/adminSlice';
import { 
  ShoppingBag, 
  Search, 
  Eye, 
  Check, 
  X, 
  Ban, 
  Unlock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { ProductApproval } from '../../store/slices/adminSlice';

export const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.admin);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | ProductApproval['status']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Map activeFilter tabs
    let matchesStatus = true;
    if (activeFilter !== 'All') {
      matchesStatus = product.status === activeFilter;
    }

    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusUpdate = (id: string, status: ProductApproval['status']) => {
    dispatch(updateProductStatus({ id, status }));
  };

  const tabs = [
    { id: 'All', label: 'All Catalog', count: products.length },
    { id: 'Pending Review', label: 'Pending Review', count: products.filter((p) => p.status === 'Pending Review').length },
    { id: 'Approved', label: 'Approved', count: products.filter((p) => p.status === 'Approved').length },
    { id: 'Rejected', label: 'Rejected', count: products.filter((p) => p.status === 'Rejected').length },
    { id: 'Blocked', label: 'Blocked', count: products.filter((p) => p.status === 'Blocked').length },
  ] as const;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <ShoppingBag className="text-indigo-650" size={24} />
            <span>Product Moderation Catalog</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Audit catalog listings, check item prices, inspect descriptions, and publish or reject products.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
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
              placeholder="Search product name, category or seller..."
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
                <th className="px-5 py-3 font-black text-left">Product Details</th>
                <th className="px-5 py-3 font-black text-left">Merchant Seller</th>
                <th className="px-5 py-3 font-black text-left">Category</th>
                <th className="px-5 py-3 font-black text-left">Price (USD)</th>
                <th className="px-5 py-3 font-black text-left">Submitted On</th>
                <th className="px-5 py-3 font-black text-left">Status</th>
                <th className="px-5 py-3 font-black text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/20">
                    
                    {/* Image & name */}
                    <td className="px-5 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={product.productImage || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150'}
                            alt="Product"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-805 leading-snug truncate max-w-[200px]" title={product.name}>
                            {product.name}
                          </p>
                          <span className="text-[9px] font-black uppercase text-indigo-650 tracking-wider">
                            SKU ID: {product.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-3 text-left font-semibold text-slate-700">
                      {product.sellerName}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3 text-left">
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-transparent">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3 text-left font-mono font-bold text-slate-850">
                      ${product.price.toFixed(2)}
                    </td>

                    {/* Submission Date */}
                    <td className="px-5 py-3 text-left font-medium text-slate-500 font-mono">
                      {product.date}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none ${
                        product.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : product.status === 'Pending Review'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                          : product.status === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {product.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}`)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-650 transition-colors cursor-pointer"
                          title="View Product Details"
                        >
                          <Eye size={13} />
                        </button>

                        {product.status === 'Pending Review' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(product.id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title="Approve Catalog Item"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(product.id, 'Rejected')}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Reject Catalog Item"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {product.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(product.id, 'Blocked')}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Block Catalog Item"
                          >
                            <Ban size={13} />
                          </button>
                        )}

                        {product.status === 'Blocked' && (
                          <button
                            onClick={() => handleStatusUpdate(product.id, 'Approved')}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Unblock Catalog Item"
                          >
                            <Unlock size={13} />
                          </button>
                        )}
                      </div>
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
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} products
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

export default AdminProductsPage;
