import React, { useState } from 'react';
import { Tag, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  resetFilters,
} from '../../../../store/slices/sellerCouponsSlice';
import {
  useGetSellerCouponsQuery,
  useAddSellerCouponMutation,
  useUpdateSellerCouponMutation,
  useDeleteSellerCouponMutation,
} from '../../../../store/services/sellerApi';

import CouponFilters from './components/CouponFilters';
import CouponTable from './components/CouponTable';
import CouponFormModal from './components/CouponFormModal';
import type { SellerCoupon } from '../../../../shared/types';

export const CouponsList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux filters state
  const { searchQuery, statusFilter, currentPage, itemsPerPage } = useAppSelector(
    (state) => state.sellerCoupons
  );

  // RTK Query fetches
  const { data: allCoupons = [], isLoading } = useGetSellerCouponsQuery();
  const [addCoupon] = useAddSellerCouponMutation();
  const [updateCoupon] = useUpdateSellerCouponMutation();
  const [deleteCoupon] = useDeleteSellerCouponMutation();

  // Local Modal controller states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<SellerCoupon | null>(null);

  // 1. Calculations & Summaries for Analytics Cards
  const activeCouponsCount = allCoupons.filter((c) => c.status === 'Active').length;
  const totalUsageCount = allCoupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);
  const totalRevenueGenerated = allCoupons.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);

  // 2. Client-side Search and Status Filters
  const filtered = allCoupons.filter((c) => {
    if (!c || !c.code) return false;
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'All') {
      matchesStatus = c.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  // 3. Slice for Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filtered.slice(startIndex, startIndex + itemsPerPage);

  // 4. Mutation handlers
  const handleOpenCreateModal = () => {
    setSelectedCoupon(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: SellerCoupon) => {
    setSelectedCoupon(coupon);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (coupon: SellerCoupon) => {
    const newStatus: SellerCoupon['status'] = coupon.status === 'Active' ? 'Disabled' : 'Active';
    try {
      await updateCoupon({
        ...coupon,
        status: newStatus,
      }).unwrap();
    } catch (err) {
      console.error('Failed to toggle coupon status:', err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    try {
      await deleteCoupon(id).unwrap();
    } catch (err) {
      console.error('Failed to delete coupon:', err);
    }
  };

  const handleSaveCoupon = async (data: Omit<SellerCoupon, 'id' | 'usageCount' | 'revenueGenerated'> & { id?: string }) => {
    if (data.id) {
      // Find original to retain usage count and revenue values
      const original = allCoupons.find((c) => c.id === data.id);
      if (original) {
        await updateCoupon({
          ...original,
          ...data,
        } as SellerCoupon).unwrap();
      }
    } else {
      await addCoupon(data).unwrap();
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Tag className="text-indigo-650" size={24} />
            <span>Store Coupons & Discounts</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage discount coupon campaigns, enforce checkout minimum spending requirements, and audit coupon performance indicators.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center min-h-[350px]">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* Analytics Cards Widget row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Active coupons */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Active Coupons</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">{activeCouponsCount}</span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Live promotion codes</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-655 flex items-center justify-center">
                <Percent size={18} />
              </div>
            </div>

            {/* Total usage */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Claims Used</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">{totalUsageCount}</span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Applied at checkouts</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-655 flex items-center justify-center">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Revenue Generated */}
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Coupon Volume Sales</span>
                <span className="text-2xl font-black text-slate-900 block leading-none">
                  ${totalRevenueGenerated.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">Generated store revenue</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 text-purple-655 flex items-center justify-center">
                <DollarSign size={18} />
              </div>
            </div>

          </div>

          {/* Filters */}
          <CouponFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            onStatusChange={(st) => dispatch(setStatusFilter(st))}
            onResetFilters={() => dispatch(resetFilters())}
            onAddClick={handleOpenCreateModal}
          />

          {/* Table list */}
          <CouponTable
            coupons={paginatedCoupons}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={filtered.length}
            onPageChange={(p) => dispatch(setCurrentPage(p))}
            onEditClick={handleOpenEditModal}
            onDeleteClick={handleDeleteCoupon}
            onToggleStatus={handleToggleStatus}
          />

          {/* Coupon Form Modal */}
          <CouponFormModal
            isOpen={isModalOpen}
            coupon={selectedCoupon}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveCoupon}
          />
        </>
      )}

    </div>
  );
};

export default CouponsList;
