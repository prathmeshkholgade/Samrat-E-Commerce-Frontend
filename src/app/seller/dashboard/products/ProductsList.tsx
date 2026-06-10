import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Plus, 
  Download, 
  Calendar, 
  DollarSign, 
  Box, 
  CheckCircle2, 
  TrendingUp, 
  X, 
  Folder, 
  FileText, 
  Eye, 
  Barcode 
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  setCurrentPage,
  setSelectedProducts,
  toggleSelectProduct,
  clearSelection,
  resetFilters,
} from '../../../../store/slices/sellerProductsSlice';
import {
  useGetSellerProductsQuery,
  useAddSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
  useDuplicateSellerProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateStatusMutation,
} from '../../../../store/services/sellerApi';
import type { SellerProduct } from '../../../../shared/types';

// Reusable components
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import ProductModal from './components/ProductModal';

export const ProductsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux Selectors
  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    sortBy,
    currentPage,
    itemsPerPage,
    selectedProductIds,
  } = useAppSelector((state) => state.sellerProducts);

  // RTK Query hooks
  const { data: allProducts = [], isLoading, refetch } = useGetSellerProductsQuery();
  const [addProduct] = useAddSellerProductMutation();
  const [updateProduct] = useUpdateSellerProductMutation();
  const [deleteProduct] = useDeleteSellerProductMutation();
  const [duplicateProduct] = useDuplicateSellerProductMutation();
  const [bulkDelete] = useBulkDeleteProductsMutation();
  const [bulkUpdateStatus] = useBulkUpdateStatusMutation();

  // Local UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<SellerProduct | null>(null);

  const [previewProduct, setPreviewProduct] = useState<SellerProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  // Categories list derived or static
  const categories = ['Electronics', 'Fashion', 'Grocery', 'Home & Kitchen', 'Beauty & Skincare', 'Sports & Fitness'];

  // 1. Process Filters, Search and Sorting
  const filteredProducts = allProducts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'All' || 
      p.status === statusFilter;
      
    const matchesCategory = 
      categoryFilter === 'All' || 
      p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'stock-asc':
        return a.stock - b.stock;
      case 'stock-desc':
        return b.stock - a.stock;
      case 'sales-desc':
        return b.sales - a.sales;
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  // Pagination slicing
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // 2. Metrics Summaries
  const totalProductsCount = allProducts.length;
  const publishedCount = allProducts.filter((p) => p.status === 'Published').length;
  const draftCount = allProducts.filter((p) => p.status === 'Draft').length;
  const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock < 10).length;

  // 3. Handlers
  const handleOpenAddModal = () => {
    navigate('/seller/products/create');
  };

  const handleOpenEditModal = (product: SellerProduct) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSubmit = async (formData: Omit<SellerProduct, 'id' | 'rating' | 'sales'> & { id?: string }) => {
    try {
      if (modalMode === 'add') {
        await addProduct(formData).unwrap();
      } else if (modalMode === 'edit' && formData.id) {
        // preserve original ratings and sales
        const original = allProducts.find(p => p.id === formData.id);
        const updatedPayload: SellerProduct = {
          ...formData,
          id: formData.id,
          rating: original ? original.rating : 0,
          sales: original ? original.sales : 0,
        };
        await updateProduct(updatedPayload).unwrap();
      }
      handleModalClose();
    } catch (err) {
      console.error('Failed to submit product form:', err);
      alert('Error saving product. Please verify inputs.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete).unwrap();
        // Clear selection if deleted
        if (selectedProductIds.includes(productToDelete)) {
          dispatch(toggleSelectProduct(productToDelete));
        }
        setProductToDelete(null);
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await duplicateProduct(id).unwrap();
    } catch (err) {
      console.error('Failed to duplicate product:', err);
    }
  };

  // Bulk actions handlers
  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete the ${selectedProductIds.length} selected products?`)) {
      try {
        await bulkDelete(selectedProductIds).unwrap();
        dispatch(setSelectedProducts([]));
      } catch (err) {
        console.error('Failed to bulk delete products:', err);
      }
    }
  };

  const handleBulkStatusUpdate = async (status: SellerProduct['status']) => {
    try {
      await bulkUpdateStatus({ ids: selectedProductIds, status }).unwrap();
      dispatch(setSelectedProducts([]));
    } catch (err) {
      console.error('Failed to bulk update status:', err);
    }
  };

  // CSV Export Utility
  const handleExportCSV = () => {
    if (sortedProducts.length === 0) {
      alert('No products available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price ($)', 'Stock', 'Rating', 'Status', 'Sales', 'Description'];
    const rows = sortedProducts.map((p) => [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.price.toFixed(2),
      p.stock,
      p.rating,
      p.status,
      p.sales,
      `"${(p.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' // include BOM for Excel encoding support
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `samrat_seller_products_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* Greetings Header Panel */}
      <div className="bg-white border border-slate-100 p-6 md:p-8 rounded-3xl shadow-3xs flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
            <ShoppingBag className="text-indigo-650" size={24} />
            <span>Store Products Inventory</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Manage catalog listings, check stock states, monitor sales, and apply batch bulk operations.</p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-350 text-slate-650 hover:text-slate-800 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 transition-all"
            title="Export to Excel CSV"
          >
            <Download size={15} />
            <span>Export Products</span>
          </button>
          
          <button
            onClick={handleOpenAddModal}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-150 flex items-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Grid Stats Mini widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Products */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Total Catalog</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{totalProductsCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-650">
            <Box size={18} />
          </div>
        </div>

        {/* Published */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Published</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{publishedCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Drafts</span>
            <span className="text-2xl font-black text-slate-900 block leading-none">{draftCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100/50 flex items-center justify-center text-slate-450">
            <FileText size={18} />
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-3xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Low Stock</span>
            <span className={`text-2xl font-black block leading-none ${lowStockCount > 0 ? 'text-amber-600 animate-pulse' : 'text-slate-900'}`}>{lowStockCount}</span>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-650'}`}>
            <TrendingUp size={18} />
          </div>
        </div>

      </div>

      {/* Filters Toolbar */}
      <ProductFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        sortBy={sortBy}
        categories={categories}
        selectedCount={selectedProductIds.length}
        onSearchChange={(q) => dispatch(setSearchQuery(q))}
        onStatusChange={(s) => dispatch(setStatusFilter(s))}
        onCategoryChange={(c) => dispatch(setCategoryFilter(c))}
        onSortChange={(sort) => dispatch(setSortBy(sort))}
        onResetFilters={() => dispatch(resetFilters())}
        onBulkDelete={handleBulkDelete}
        onBulkStatusUpdate={handleBulkStatusUpdate}
      />

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-16 shadow-3xs flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-650 animate-spin" />
        </div>
      ) : (
        /* Table Registry */
        <ProductTable
          products={paginatedProducts}
          totalCount={sortedProducts.length}
          selectedIds={selectedProductIds}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onToggleSelect={(id) => dispatch(toggleSelectProduct(id))}
          onSelectAll={(ids) => dispatch(setSelectedProducts(ids))}
          onPageChange={(p) => dispatch(setCurrentPage(p))}
          onViewProduct={(p) => setPreviewProduct(p)}
          onEditProduct={handleOpenEditModal}
          onDeleteProduct={(id) => setProductToDelete(id)}
          onDuplicateProduct={handleDuplicate}
        />
      )}

      {/* ADD/EDIT FORM MODAL */}
      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        categories={categories}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />

      {/* VIEW PREVIEW MODAL OVERLAY */}
      {previewProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-none">Catalog Card</h3>
                <p className="text-[10px] text-slate-450 font-bold mt-1">Product ID: {previewProduct.id}</p>
              </div>
              <button 
                onClick={() => setPreviewProduct(null)} 
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800 cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              
              {/* Product Thumbnail Banner */}
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1.5">
                  <span className={`px-2 py-0.5 rounded-full border text-[8px] uppercase font-black tracking-wider inline-block ${
                    previewProduct.status === 'Published' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                    previewProduct.status === 'Draft' ? 'bg-slate-55 bg-slate-50 border-slate-200 text-slate-500' :
                    previewProduct.status === 'Out of Stock' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                    'bg-rose-50 border-rose-100 text-rose-700'
                  }`}>
                    {previewProduct.status}
                  </span>
                  <h4 className="font-black text-slate-900 text-sm leading-tight">{previewProduct.name}</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-450 text-[10px] flex items-center gap-1">
                      <Barcode size={12} />
                      <span className="font-mono uppercase select-all">{previewProduct.sku}</span>
                    </span>
                    <span className="text-slate-450 text-[10px] flex items-center gap-1">
                      <Folder size={12} />
                      <span>{previewProduct.category}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Description box */}
              {previewProduct.description && (
                <div className="bg-slate-50/70 border border-slate-150/40 rounded-2xl p-4 space-y-1">
                  <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">Description</span>
                  <p className="text-xs text-slate-650 font-semibold leading-relaxed">{previewProduct.description}</p>
                </div>
              )}

              {/* Data numbers grid */}
              <div className="grid grid-cols-3 gap-3.5 text-center">
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Pricing</span>
                  <span className="text-xs font-black text-slate-900">${previewProduct.price.toFixed(2)}</span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Stock level</span>
                  <span className={`text-xs font-black ${previewProduct.stock === 0 ? 'text-rose-600' : previewProduct.stock < 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
                    {previewProduct.stock} items
                  </span>
                </div>
                <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl">
                  <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Lifetime Sales</span>
                  <span className="text-xs font-black text-slate-900">{previewProduct.sales} units</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setPreviewProduct(null)}
                className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Dismiss Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL OVERLAY */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in scale-in duration-200 text-left">
            <div className="p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base leading-none">Confirm Deletion</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                Are you absolutely sure you want to delete this product? This action is permanent and cannot be reversed.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-350 text-slate-600 text-xs font-bold rounded-xl cursor-pointer"
              >
                No, Keep Product
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-100 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsList;
