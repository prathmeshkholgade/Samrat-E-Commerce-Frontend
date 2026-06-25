import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateSellerStatus } from '../../store/slices/adminSlice';
import { 
  ShieldCheck, 
  Search, 
  Eye, 
  Check, 
  X, 
  Ban, 
  Unlock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { SellerRegistration } from '../../store/slices/adminSlice';

export const AdminSellersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sellers } = useAppSelector((state) => state.admin);

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | SellerRegistration['status']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredSellers = sellers.filter((seller) => {
    const matchesSearch = 
      seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeFilter === 'All' || seller.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalItems = filteredSellers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSellers = filteredSellers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusUpdate = (id: string, status: SellerRegistration['status']) => {
    dispatch(updateSellerStatus({ id, status }));
  };

  const tabs = [
    { id: 'All', label: 'All Sellers', count: sellers.length },
    { id: 'Pending', label: 'Pending', count: sellers.filter((s) => s.status === 'Pending').length },
    { id: 'Approved', label: 'Approved', count: sellers.filter((s) => s.status === 'Approved').length },
    { id: 'Rejected', label: 'Rejected', count: sellers.filter((s) => s.status === 'Rejected').length },
    { id: 'Blocked', label: 'Blocked', count: sellers.filter((s) => s.status === 'Blocked').length },
  ] as const;

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <ShieldCheck className="text-indigo-650" size={24} />
            <span>Sellers Directory</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Moderate and onboard store sellers, inspect business files, or restrict merchant privileges.
          </p>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs space-y-6">
        
        {/* Search and Tabs Row */}
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
              placeholder="Search store, owner or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Sellers Ledger Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-slate-650 border-collapse">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
              <tr>
                <th className="px-5 py-3 font-black text-left">Store Profile</th>
                <th className="px-5 py-3 font-black text-left">Owner / Email</th>
                <th className="px-5 py-3 font-black text-left">Phone</th>
                <th className="px-5 py-3 font-black text-left">Registered On</th>
                <th className="px-5 py-3 font-black text-left">Status</th>
                <th className="px-5 py-3 font-black text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedSellers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400 font-bold">
                    No merchants found matching the filters.
                  </td>
                </tr>
              ) : (
                paginatedSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/20">
                    {/* Logo & Store Name */}
                    <td className="px-5 py-3 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={seller.logoUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150'}
                            alt="Logo"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150';
                            }}
                          />
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-850 leading-snug">{seller.storeName}</p>
                          <span className="text-[9px] font-black uppercase text-indigo-650 tracking-wider">
                            ID: {seller.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Owner details */}
                    <td className="px-5 py-3 text-left">
                      <p className="font-semibold text-slate-700 leading-none">{seller.name}</p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">{seller.email}</span>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3 text-left font-semibold text-slate-600">
                      {seller.phone}
                    </td>

                    {/* Reg Date */}
                    <td className="px-5 py-3 text-left font-medium text-slate-500 font-mono">
                      {seller.date}
                    </td>

                    {/* Status Badge */}
                    <td className="px-5 py-3 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider leading-none ${
                        seller.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : seller.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse'
                          : seller.status === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {seller.status}
                      </span>
                    </td>

                    {/* Moderation actions */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/sellers/${seller.id}`)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-650 transition-colors cursor-pointer"
                          title="View Compliance Dossier"
                        >
                          <Eye size={13} />
                        </button>
                        
                        {seller.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(seller.id, 'Approved')}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                              title="Approve Store"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(seller.id, 'Rejected')}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                              title="Reject Store"
                            >
                              <X size={13} />
                            </button>
                          </>
                        )}

                        {seller.status === 'Approved' && (
                          <button
                            onClick={() => handleStatusUpdate(seller.id, 'Blocked')}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Block Store"
                          >
                            <Ban size={13} />
                          </button>
                        )}

                        {seller.status === 'Blocked' && (
                          <button
                            onClick={() => handleStatusUpdate(seller.id, 'Approved')}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Unblock Store"
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

        {/* Pagination Row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-[10px] font-bold text-slate-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} sellers
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

export default AdminSellersPage;
