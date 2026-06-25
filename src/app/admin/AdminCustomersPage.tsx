import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateCustomerStatus } from '../../store/slices/adminSlice';
import { 
  Users, 
  Search, 
  Eye, 
  Ban, 
  Unlock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { AdminCustomer } from '../../store/slices/adminSlice';

export const AdminCustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.admin);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | AdminCustomer['status']>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filters logic
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.mobile.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = activeFilter === 'All' || customer.status === activeFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleStatusUpdate = (id: string, status: AdminCustomer['status']) => {
    dispatch(updateCustomerStatus({ id, status }));
  };

  const tabs = [
    { id: 'All', label: 'All Users', count: customers.length },
    { id: 'Active', label: 'Active', count: customers.filter((c) => c.status === 'Active').length },
    { id: 'Blocked', label: 'Blocked', count: customers.filter((c) => c.status === 'Blocked').length },
  ] as const;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <Users className="text-indigo-655" size={24} />
            <span>Customers Directory</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Manage global marketplace user profiles, audit purchase ledgers, and adjust account access.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
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
                    : 'bg-slate-50 text-slate-500 hover:text-slate-805 border border-slate-200/40 hover:bg-slate-100'
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
              placeholder="Search customer name, email or mobile..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs font-bold text-slate-705 outline-hidden w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Directory Ledger Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
          <table className="w-full text-xs text-slate-650 border-collapse">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100 select-none">
              <tr>
                <th className="px-5 py-3 font-black text-left">Buyer Profile</th>
                <th className="px-5 py-3 font-black text-left">Contact Info</th>
                <th className="px-5 py-3 font-black text-left">Orders Count</th>
                <th className="px-5 py-3 font-black text-left">Gross Spend</th>
                <th className="px-5 py-3 font-black text-left">Member Since</th>
                <th className="px-5 py-3 font-black text-left">Status</th>
                <th className="px-5 py-3 font-black text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-bold">
                    No customers found matching the search.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/20">
                    
                    {/* Name & ID */}
                    <td className="px-5 py-3 text-left">
                      <div>
                        <p className="font-extrabold text-slate-850 leading-snug">{customer.name}</p>
                        <span className="text-[9px] font-black uppercase text-indigo-650 tracking-wider">
                          ID: {customer.id}
                        </span>
                      </div>
                    </td>

                    {/* Email / Mobile */}
                    <td className="px-5 py-3 text-left">
                      <p className="font-semibold text-slate-700 leading-none">{customer.mobile}</p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">{customer.email}</span>
                    </td>

                    {/* Orders count */}
                    <td className="px-5 py-3 text-left font-mono font-bold text-slate-800">
                      {customer.totalOrders} checkouts
                    </td>

                    {/* Total spend */}
                    <td className="px-5 py-3 text-left font-mono font-bold text-slate-850">
                      ${customer.totalSpend.toFixed(2)}
                    </td>

                    {/* Registration date */}
                    <td className="px-5 py-3 text-left font-medium text-slate-500 font-mono">
                      {customer.registrationDate}
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-3 text-left">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider leading-none ${
                        customer.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {customer.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/admin/customers/${customer.id}`)}
                          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-indigo-650 transition-colors cursor-pointer"
                          title="View Customer Dossier"
                        >
                          <Eye size={13} />
                        </button>
                        
                        {customer.status === 'Active' ? (
                          <button
                            onClick={() => handleStatusUpdate(customer.id, 'Blocked')}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                            title="Block Customer Account"
                          >
                            <Ban size={13} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusUpdate(customer.id, 'Active')}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                            title="Unblock Customer Account"
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

        {/* Pagination row */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-[10px] font-bold text-slate-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} customers
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

export default AdminCustomersPage;
