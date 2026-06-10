import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setTypeFilter,
  setStatusFilter,
  setCurrentPage,
  resetFilters,
} from '../../../../store/slices/sellerWalletSlice';
import {
  useGetWalletStatsQuery,
  useGetWalletTransactionsQuery,
  useRequestWithdrawalMutation,
} from '../../../../store/services/sellerApi';

import WalletCards from './components/WalletCards';
import RevenueCharts from './components/RevenueCharts';
import TransactionTable from './components/TransactionTable';
import WithdrawModal from './components/WithdrawModal';

export const WalletList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux filters state
  const { searchQuery, typeFilter, statusFilter, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.sellerWallet
  );

  // RTK Query fetches
  const { data: stats, isLoading: isLoadingStats } = useGetWalletStatsQuery();
  const { data: transactions = [], isLoading: isLoadingTxs } = useGetWalletTransactionsQuery();
  const [withdrawFunds] = useRequestWithdrawalMutation();

  // Payout Modal trigger state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  // Client-side transaction ledger filtering
  const filteredTxs = transactions.filter((tx) => {
    if (!tx) return false;
    
    // Search filter (Transaction ID or Order ID match)
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (tx.orderId && tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category Type filter
    let matchesType = true;
    if (typeFilter !== 'All') {
      matchesType = tx.type === typeFilter;
    }

    // Status filter
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = tx.status === statusFilter;
    }

    return matchesSearch && matchesType && matchesStatus;
  });

  // Ledger Slicing for Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTxs = filteredTxs.slice(startIndex, startIndex + itemsPerPage);

  const handleWithdrawFunds = async (amount: number, bankName: string) => {
    await withdrawFunds({ amount, bankName }).unwrap();
  };

  const isLoading = isLoadingStats || isLoadingTxs;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Title Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Wallet className="text-indigo-650" size={24} />
            <span>Wallet & Financial Dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit payouts, withdraw earnings to bank accounts, trace transactions history, and inspect revenue charts.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* 1. Wallet Balance Summary Cards Row */}
          {stats && (
            <WalletCards
              availableBalance={stats.availableBalance}
              pendingBalance={stats.pendingBalance}
              totalEarnings={stats.totalEarnings}
              withdrawnAmount={stats.withdrawnAmount}
              onWithdrawClick={() => setIsWithdrawOpen(true)}
            />
          )}

          {/* 2. Visual Revenue Graphs Row */}
          {stats && (
            <RevenueCharts
              dailyRevenue={stats.dailyRevenue}
              monthlyRevenue={stats.monthlyRevenue}
              productRevenue={stats.productRevenue}
            />
          )}

          {/* 3. Transaction Ledger Table list */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-905 uppercase tracking-wider pl-1">Ledger Transaction History</h3>
            <TransactionTable
              transactions={paginatedTxs}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalCount={filteredTxs.length}
              onPageChange={(p) => dispatch(setCurrentPage(p))}
              searchQuery={searchQuery}
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              onSearchChange={(q) => dispatch(setSearchQuery(q))}
              onTypeChange={(t) => dispatch(setTypeFilter(t))}
              onStatusChange={(s) => dispatch(setStatusFilter(s))}
              onResetFilters={() => dispatch(resetFilters())}
            />
          </div>

          {/* 4. Withdraw Modal overlay */}
          {stats && (
            <WithdrawModal
              isOpen={isWithdrawOpen}
              availableBalance={stats.availableBalance}
              onClose={() => setIsWithdrawOpen(false)}
              onWithdrawSubmit={handleWithdrawFunds}
            />
          )}
        </>
      )}

    </div>
  );
};

export default WalletList;
