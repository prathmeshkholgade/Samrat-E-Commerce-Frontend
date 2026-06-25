import React, { useState } from 'react';
import { Box, History, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setCategoryFilter,
  setStockStatusFilter,
  setSortBy,
  setCurrentPage,
  setSelectedProducts,
  toggleSelectProduct,
  clearSelection,
  resetFilters,
} from '../../../../store/slices/inventorySlice';
import {
  useGetSellerProductsQuery,
  useGetSellerOrdersQuery,
  useGetInventoryHistoryQuery,
  useAdjustProductStockMutation,
  useBulkAdjustProductStockMutation,
} from '../../../../store/services/sellerApi';
import type { SellerProduct } from '../../../../shared/types';

// Components
import InventoryAnalytics from '../../../../features/seller/components/inventory/InventoryAnalytics';
import InventoryFilters from '../../../../features/seller/components/inventory/InventoryFilters';
import InventoryTable from '../../../../features/seller/components/inventory/InventoryTable';
import UpdateStockModal from '../../../../features/seller/components/inventory/UpdateStockModal';
import BulkUpdateStockModal from '../../../../features/seller/components/inventory/BulkUpdateStockModal';
import StockHistoryModal from '../../../../features/seller/components/inventory/StockHistoryModal';
import { LowStockWidget, OutOfStockWidget } from '../../../../features/seller/components/inventory/InventoryWidgets';

export const InventoryList: React.FC = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const {
    searchQuery,
    categoryFilter,
    stockStatusFilter,
    sortBy,
    currentPage,
    itemsPerPage,
    selectedProductIds,
  } = useAppSelector((state) => state.inventory);

  // RTK Query endpoints
  const { data: allProducts = [], isLoading: isLoadingProducts } = useGetSellerProductsQuery();
  const { data: allOrders = [], isLoading: isLoadingOrders } = useGetSellerOrdersQuery();
  const { data: historyLogs = [], isLoading: isLoadingHistory } = useGetInventoryHistoryQuery();

  const [adjustStock] = useAdjustProductStockMutation();
  const [bulkAdjustStock] = useBulkAdjustProductStockMutation();

  // Modals Local States
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState<SellerProduct | null>(null);
  const [selectedProductForHistory, setSelectedProductForHistory] = useState<SellerProduct | null>(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isHistoryLogsOpen, setIsHistoryLogsOpen] = useState(false);

  // 1. Calculate Reserved Stock Map dynamically
  // Scan all active orders (status !== Cancelled && status !== Returned) and sum quantity per product
  const reservedStockMap: Record<string, number> = {};
  allOrders.forEach((order) => {
    if (order.status !== 'Cancelled' && order.status !== 'Returned') {
      order.products.forEach((p) => {
        reservedStockMap[p.productId] = (reservedStockMap[p.productId] || 0) + p.quantity;
      });
    }
  });

  // 2. Fetch categories list dynamically from products catalog
  const categories = Array.from(new Set(allProducts.map((p) => p.category))).sort();

  // 3. Apply filters and sorting client-side
  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      p.category === categoryFilter;

    const threshold = p.lowStockThreshold ?? 10;
    
    let matchesStatus = true;
    if (stockStatusFilter === 'In Stock') {
      matchesStatus = p.stock > threshold;
    } else if (stockStatusFilter === 'Low Stock') {
      matchesStatus = p.stock > 0 && p.stock <= threshold;
    } else if (stockStatusFilter === 'Out of Stock') {
      matchesStatus = p.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const reservedA = reservedStockMap[a.id] || 0;
    const reservedB = reservedStockMap[b.id] || 0;
    const totalA = a.stock + reservedA;
    const totalB = b.stock + reservedB;

    switch (sortBy) {
      case 'sku-asc':
        return a.sku.localeCompare(b.sku);
      case 'sku-desc':
        return b.sku.localeCompare(a.sku);
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      case 'total-stock-desc':
        return totalB - totalA;
      default:
        return 0;
    }
  });

  // Pagination bounds slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Handlers
  const handleSingleStockSave = async (amount: number, isAbsolute: boolean, lowStockThreshold: number, notes: string) => {
    if (!selectedProductForUpdate) return;
    try {
      await adjustStock({
        productId: selectedProductForUpdate.id,
        amount,
        isAbsolute,
        lowStockThreshold,
        notes,
      }).unwrap();
    } catch (err) {
      console.error('Failed to update stock:', err);
      alert('Error updating stock levels.');
    }
  };

  const handleBulkStockSave = async (amount: number, isAbsolute: boolean, lowStockThreshold: number | undefined, notes: string) => {
    try {
      await bulkAdjustStock({
        productIds: selectedProductIds,
        amount,
        isAbsolute,
        lowStockThreshold,
        notes,
      }).unwrap();
      dispatch(setSelectedProducts([]));
    } catch (err) {
      console.error('Failed bulk stock adjust:', err);
      alert('Error updating batch stock levels.');
    }
  };

  const handleQuickWidgetRestock = async (productId: string, quantity: number) => {
    try {
      await adjustStock({
        productId,
        amount: quantity,
        isAbsolute: false,
        notes: 'Inline quick widget restock',
      }).unwrap();
    } catch (err) {
      console.error('Widget restock failed:', err);
      alert('Error during widget restock.');
    }
  };

  const isLoading = isLoadingProducts || isLoadingOrders || isLoadingHistory;

  return (
    <div className="space-y-6 text-left">
      
      {/* Page Header */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2.5">
            <Box className="text-indigo-650" size={24} />
            <span>Store Inventory Controller</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Audit stock levels, update reserves, review transaction history logs, and set threshold boundaries.</p>
        </div>
        <div>
          <button
            onClick={() => {
              setSelectedProductForHistory(null);
              setIsHistoryLogsOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-205 hover:border-slate-350 bg-white text-slate-600 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer shadow-3xs"
          >
            <History size={14} />
            <span>Full History Registry</span>
          </button>
        </div>
      </div>

      {/* Loading state indicator */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        <>
          {/* Analytics cards */}
          <InventoryAnalytics products={allProducts} />

          {/* Widgets and alerts row split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockWidget products={allProducts} onRestock={handleQuickWidgetRestock} />
            <OutOfStockWidget products={allProducts} onRestock={handleQuickWidgetRestock} />
          </div>

          {/* Filters controls */}
          <InventoryFilters
            searchQuery={searchQuery}
            categoryFilter={categoryFilter}
            stockStatusFilter={stockStatusFilter}
            sortBy={sortBy}
            selectedCount={selectedProductIds.length}
            categories={categories}
            onSearchChange={(q) => dispatch(setSearchQuery(q))}
            onCategoryChange={(c) => dispatch(setCategoryFilter(c))}
            onStockStatusChange={(s) => dispatch(setStockStatusFilter(s))}
            onSortChange={(sort) => dispatch(setSortBy(sort))}
            onResetFilters={() => dispatch(resetFilters())}
            onBulkUpdateStock={() => setIsBulkModalOpen(true)}
          />

          {/* Data grid table */}
          <InventoryTable
            products={paginatedProducts}
            reservedStockMap={reservedStockMap}
            selectedIds={selectedProductIds}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalCount={sortedProducts.length}
            onToggleSelect={(id) => dispatch(toggleSelectProduct(id))}
            onSelectAll={(ids) => dispatch(setSelectedProducts(ids))}
            onPageChange={(page) => dispatch(setCurrentPage(page))}
            onUpdateStock={(prod) => setSelectedProductForUpdate(prod)}
            onViewHistory={(prod) => {
              setSelectedProductForHistory(prod);
              setIsHistoryLogsOpen(true);
            }}
          />
        </>
      )}

      {/* SINGLE SKU UPDATE MODAL OVERLAY */}
      <UpdateStockModal
        isOpen={selectedProductForUpdate !== null}
        product={selectedProductForUpdate}
        onClose={() => setSelectedProductForUpdate(null)}
        onSave={handleSingleStockSave}
      />

      {/* BULK UPDATE SETTINGS MODAL OVERLAY */}
      <BulkUpdateStockModal
        isOpen={isBulkModalOpen}
        selectedCount={selectedProductIds.length}
        onClose={() => setIsBulkModalOpen(false)}
        onSave={handleBulkStockSave}
      />

      {/* TRANSACTION TIMELINE LOG DRAWERS */}
      <StockHistoryModal
        isOpen={isHistoryLogsOpen}
        product={selectedProductForHistory}
        onClose={() => {
          setIsHistoryLogsOpen(false);
          setSelectedProductForHistory(null);
        }}
        transactions={historyLogs}
      />

    </div>
  );
};

export default InventoryList;
