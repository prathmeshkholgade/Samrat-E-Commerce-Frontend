import React from 'react';
import { Users, TrendingUp, DollarSign, Award, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setSortBy,
  setCurrentPage,
  resetFilters,
} from '../../../../store/slices/sellerCustomersSlice';
import {
  useGetSellerCustomersQuery,
  useGetSellerOrdersQuery,
} from '../../../../store/services/sellerApi';

// Reusable components
import CustomerFilters from './components/CustomerFilters';
import CustomerTable from './components/CustomerTable';

export const CustomersList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux filters state
  const { searchQuery, sortBy, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.sellerCustomers
  );

  // RTK Query fetches
  const { data: allCustomers = [], isLoading: isLoadingCustomers } = useGetSellerCustomersQuery();
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();

  // 1. Dynamic Statistics Computations per Customer
  const ordersCountMap: Record<string, number> = {};
  const totalSpendMap: Record<string, number> = {};
  const lastOrderDateMap: Record<string, string> = {};

  allOrders.forEach((order) => {
    if (!order || !order.customerEmail) return;
    const email = order.customerEmail;
    // Track orders count
    ordersCountMap[email] = (ordersCountMap[email] || 0) + 1;

    // Track total spend (excluding Cancelled)
    if (order.status !== 'Cancelled') {
      totalSpendMap[email] = (totalSpendMap[email] || 0) + (order.amount || 0);
    }

    // Track last order date
    const currentDate = order.date || '';
    const existingDate = lastOrderDateMap[email];
    if (currentDate && (!existingDate || currentDate.localeCompare(existingDate) > 0)) {
      lastOrderDateMap[email] = currentDate;
    }
  });

  // 2. Filter & Sort client-side
  const filtered = allCustomers.filter((c) => {
    if (!c || !c.name || !c.email) return false;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    const spendA = totalSpendMap[a.email] || 0;
    const spendB = totalSpendMap[b.email] || 0;
    const countA = ordersCountMap[a.email] || 0;
    const countB = ordersCountMap[b.email] || 0;

    switch (sortBy) {
      case 'spend-desc':
        return spendB - spendA;
      case 'orders-desc':
        return countB - countA;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Pagination bounds slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sorted.slice(startIndex, startIndex + itemsPerPage);

  // 3. Overall Dashboard Metrics summaries
  const totalRegisteredCount = allCustomers.length;
  const totalNetRevenue = allOrders
    .filter((o) => o.status !== 'Cancelled' && o.status !== 'Returned')
    .reduce((acc, o) => acc + o.amount, 0);

  // High spending customer (spend > $100) count
  const highValueBuyersCount = allCustomers.filter(c => c && c.email && (totalSpendMap[c.email] || 0) > 100).length;

  // Average orders count per customer
  const totalCompletedOrders = allOrders.filter(o => o.status !== 'Cancelled').length;
  const avgOrdersCount = totalRegisteredCount > 0 ? (totalCompletedOrders / totalRegisteredCount).toFixed(1) : '0';

  const isLoading = isLoadingCustomers || isLoadingOrders;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Title Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Users className="text-indigo-650" size={24} />
            <span>Store Customer Registry</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit customer purchase profiles, monitor total spending volumes, and inspect individual transaction logs.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* Analytics Widgets Cards Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Registered customers */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Registered Buyers</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">{totalRegisteredCount}</span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Total accounts created</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-655">
                <Users size={18} />
              </div>
            </div>

            {/* Overall store spend */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Net Revenue Gained</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">
                  ${totalNetRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Excludes cancelled/refunds</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-655 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
            </div>

            {/* High-value customers */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">VIP High-Spend Buyers</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">{highValueBuyersCount}</span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Spend exceeds $100.00</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-655 flex items-center justify-center">
                <Award size={18} />
              </div>
            </div>

            {/* Average orders ratio */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Avg Orders / Account</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">{avgOrdersCount}</span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Fulfillment count ratio</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-655 flex items-center justify-center">
                <ShoppingBag size={18} />
              </div>
            </div>

          </div>

          {/* Filters controls */}
          <CustomerFilters
            searchQuery={searchQuery}
            sortBy={sortBy}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            onSortChange={(sort) => dispatch(setSortBy(sort))}
            onResetFilters={() => dispatch(resetFilters())}
          />

          {/* Listing registry grid */}
          <CustomerTable
            customers={paginatedCustomers}
            ordersCountMap={ordersCountMap}
            totalSpendMap={totalSpendMap}
            lastOrderDateMap={lastOrderDateMap}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={sorted.length}
            onPageChange={(p) => dispatch(setCurrentPage(p))}
          />
        </>
      )}

    </div>
  );
};

export default CustomersList;
