import React, { useState, useEffect } from 'react';
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  Star,
  AlertCircle,
  Filter,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import MarketplaceProductCard from '../../shared/components/MarketplaceProductCard';
import type { Product } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import {
  setFilter,
  resetFilters,
  setSortBy,
  setViewMode,
  setCurrentPage,
  setProductsLoading
} from '../../store/slices/productsSlice';

export const ProductListing: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux states
  const {
    items: allProducts,
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    loading: isLoading
  } = useAppSelector(state => state.products);
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  // UI States
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Mock list of categories, brands, and vendors
  const categories = ['All', 'Electronics', 'Fashion', 'Grocery', 'Home & Kitchen', 'Beauty & Skincare', 'Sports & Fitness'];
  const brands = ['VoltX Audio', 'Nomad Gear Co.', 'Eero Living', 'Aero Athletics', 'GlowEssence Labs', 'BeanStreet Roasters', 'Monarch Horology'];
  const vendors = Array.from(new Set(allProducts.map(p => p.vendorName)));

  // Simulate skeleton loader on filter changes
  useEffect(() => {
    dispatch(setProductsLoading(true));
    const timer = setTimeout(() => {
      dispatch(setProductsLoading(false));
    }, 450);
    return () => clearTimeout(timer);
  }, [filters, sortBy, dispatch]);

  // Handle filter toggles
  const handleBrandToggle = (brandName: string) => {
    const activeBrands = [...filters.brand];
    if (activeBrands.includes(brandName)) {
      dispatch(setFilter({ key: 'brand', value: activeBrands.filter(b => b !== brandName) }));
    } else {
      dispatch(setFilter({ key: 'brand', value: [...activeBrands, brandName] }));
    }
  };

  const handleVendorToggle = (vendorName: string) => {
    const activeVendors = [...filters.vendor];
    if (activeVendors.includes(vendorName)) {
      dispatch(setFilter({ key: 'vendor', value: activeVendors.filter(v => v !== vendorName) }));
    } else {
      dispatch(setFilter({ key: 'vendor', value: [...activeVendors, vendorName] }));
    }
  };

  // Filter Catalog Logic
  const filteredProducts = allProducts.filter((product) => {
    // 1. Category Filter
    if (filters.category !== 'All' && product.category !== filters.category) return false;

    // 2. Brand Filter (Matches tag or title keyword for simplicity)
    if (filters.brand.length > 0) {
      const matchedBrand = filters.brand.some(b =>
        product.title.toLowerCase().includes(b.split(' ')[0].toLowerCase()) ||
        product.vendorName.toLowerCase().includes(b.split(' ')[0].toLowerCase())
      );
      if (!matchedBrand) return false;
    }

    // 3. Price Filter
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false;

    // 4. Rating Filter
    if (filters.rating && product.rating < filters.rating) return false;

    // 5. Vendor Filter
    if (filters.vendor.length > 0 && !filters.vendor.includes(product.vendorName)) return false;

    // 6. Availability Filter
    if (filters.inStockOnly && !product.inStock) return false;

    // 7. Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        product.title.toLowerCase().includes(query) ||
        product.vendorName.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Sort Catalog Logic
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    sortedProducts.sort((a, b) => b.rating - a.rating);
  }

  // Pagination Variables
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Products Catalog</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Browse and filter our comprehensive seller collection.</p>
        </div>
        
        {/* Mobile Filter Action Button */}
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex lg:hidden items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-55 border border-indigo-100 hover:bg-indigo-50 text-indigo-650 text-xs font-bold rounded-xl cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* 2. Page Core Grid: Left Sidebar + Main Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Left Sidebar Filter Dashboard */}
        <aside className="hidden lg:flex flex-col gap-6 bg-white p-5 rounded-2xl border border-slate-100/80 shadow-2xs h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal size={16} className="text-indigo-650" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Filters</h3>
            </div>
            <button
              onClick={() => dispatch(resetFilters())}
              className="text-[10px] font-bold text-slate-400 hover:text-indigo-650 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-800">Department</h4>
            <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-500">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => dispatch(setFilter({ key: 'category', value: cat }))}
                  className={`w-full text-left py-1.5 px-2 rounded-lg transition-all text-xs font-bold ${
                    filters.category === cat
                      ? 'bg-indigo-50 text-indigo-650'
                      : 'hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800">Price Range</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>$0</span>
                <span>${filters.priceMax}</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={filters.priceMax}
                onChange={(e) => dispatch(setFilter({ key: 'priceMax', value: parseInt(e.target.value) }))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800">Brands</h4>
            <div className="space-y-2 text-xs font-semibold text-slate-500 max-h-40 overflow-y-auto pr-1">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className="h-4 w-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Customer Ratings */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800">Minimum Rating</h4>
            <div className="space-y-2 text-xs font-semibold text-slate-500">
              {[4.5, 4.0, 3.5].map((rate) => (
                <label key={rate} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="sidebar-rating"
                    checked={filters.rating === rate}
                    onChange={() => dispatch(setFilter({ key: 'rating', value: rate }))}
                    className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                  />
                  <span className="flex items-center gap-1">
                    {rate.toFixed(1)} & up
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                  </span>
                </label>
              ))}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="sidebar-rating"
                  checked={filters.rating === null}
                  onChange={() => dispatch(setFilter({ key: 'rating', value: null }))}
                  className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                />
                <span>Any Rating</span>
              </label>
            </div>
          </div>

          {/* Vendors */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800">Verified Vendors</h4>
            <div className="space-y-2 text-xs font-semibold text-slate-500 max-h-40 overflow-y-auto pr-1">
              {vendors.map((vendor) => (
                <label key={vendor} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={filters.vendor.includes(vendor)}
                    onChange={() => handleVendorToggle(vendor)}
                    className="h-4 w-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                  />
                  <span>{vendor}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2.5 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800">Stock Status</h4>
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-500">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => dispatch(setFilter({ key: 'inStockOnly', value: e.target.checked }))}
                className="h-4 w-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Main Catalog View Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Toolbar */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-100 shadow-3xs gap-4">
            <span className="text-xs font-semibold text-slate-500">
              {totalItems > 0
                ? `Showing ${startIndex + 1}–${endIndex} of ${totalItems} results`
                : 'Showing 0 results'}
            </span>

            <div className="flex items-center gap-3.5">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-semibold text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value))}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-bold text-slate-650 cursor-pointer outline-hidden"
                >
                  <option value="default">Default Features</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <div className="h-5 w-px bg-slate-200" />

              {/* View Toggle Layout Icons */}
              <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-150 rounded-xl">
                <button
                  onClick={() => dispatch(setViewMode('grid'))}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="Grid Layout"
                >
                  <Grid size={15} />
                </button>
                <button
                  onClick={() => dispatch(setViewMode('list'))}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                  title="List Layout"
                >
                  <List size={15} />
                </button>
              </div>

            </div>
          </div>

          {/* Product Items List Grid */}
          {isLoading ? (
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {[...Array(itemsPerPage)].map((_, i) => (
                <MarketplaceProductCard key={i} loading viewMode={viewMode} />
              ))}
            </div>
          ) : paginatedProducts.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center p-16 bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <AlertCircle size={28} />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-slate-800 text-base">No products found</h4>
                <p className="text-xs text-slate-400 font-semibold max-w-sm">No items in the catalog match your current filter inputs. Try resetting filters.</p>
              </div>
              <button
                onClick={() => dispatch(resetFilters())}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all cursor-pointer mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Catalog Items Grid */
            <div
              className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}
            >
              {paginatedProducts.map((product) => {
                const isWishlisted = wishlistItems.some(item => item.id === product.id);
                return (
                  <MarketplaceProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={isWishlisted}
                    viewMode={viewMode}
                    onAddToCart={(p) => dispatch(addToCart(p))}
                    onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                    onQuickView={(p) => setSelectedProduct(p)}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoading && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-100/80">
              {/* Prev */}
              <button
                onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
                disabled={currentPage === 1}
                className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-650 rounded-xl transition-colors disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Pages */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => dispatch(setCurrentPage(pageNum))}
                    className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-105'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-350'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next */}
              <button
                onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))}
                disabled={currentPage === totalPages}
                className="p-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-650 rounded-xl transition-colors disabled:opacity-45 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 3. Mobile Slide-out Drawer Filter Panel */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex lg:hidden">
          {/* Overlay */}
          <div
            onClick={() => setIsMobileFiltersOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer panel */}
          <div className="w-80 bg-white h-full relative shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-1.5">
                <Filter size={16} className="text-indigo-600" />
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Filters</h3>
              </div>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-grow overflow-y-auto p-5 space-y-6">
              
              {/* Category */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => dispatch(setFilter({ key: 'category', value: cat }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        filters.category === cat
                          ? 'bg-indigo-50 border-indigo-100 text-indigo-650'
                          : 'bg-white border-slate-200/60 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Price Range</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-550">
                    <span>$0</span>
                    <span>${filters.priceMax}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="10"
                    value={filters.priceMax}
                    onChange={(e) => dispatch(setFilter({ key: 'priceMax', value: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none accent-indigo-600"
                  />
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Brands</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                        className="h-4 w-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Minimum Rating</h4>
                <div className="space-y-2 text-xs font-semibold text-slate-500">
                  {[4.5, 4.0, 3.5].map((rate) => (
                    <label key={rate} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="mobile-rating"
                        checked={filters.rating === rate}
                        onChange={() => dispatch(setFilter({ key: 'rating', value: rate }))}
                        className="h-4 w-4 rounded-full border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                      />
                      <span className="flex items-center gap-1">
                        {rate.toFixed(1)} & up
                        <Star size={11} className="fill-amber-500 text-amber-500" />
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="mobile-rating"
                      checked={filters.rating === null}
                      onChange={() => dispatch(setFilter({ key: 'rating', value: null }))}
                      className="h-4 w-4 rounded-full border-slate-350 text-indigo-600"
                    />
                    <span>Any Rating</span>
                  </label>
                </div>
              </div>

              {/* Stock status */}
              <div className="space-y-2.5 border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold text-slate-800">Stock Status</h4>
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-500">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => dispatch(setFilter({ key: 'inStockOnly', value: e.target.checked }))}
                    className="h-4 w-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500/10"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button
                onClick={() => {
                  dispatch(resetFilters());
                  setIsMobileFiltersOpen(false);
                }}
                className="w-1/2 py-3 bg-white border border-slate-200 text-slate-650 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-1/2 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100"
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Quick View Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/95 border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-850 cursor-pointer shadow-sm"
            >
              <X size={18} />
            </button>

            <div className="w-full md:w-1/2 bg-slate-50 relative aspect-square flex-shrink-0 md:h-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              {!selectedProduct.inStock && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-indigo-650 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5 uppercase block w-fit">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug mt-2">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    Uploaded by <span className="text-slate-650 hover:underline">{selectedProduct.vendorName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-xs font-extrabold">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span>{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-455 font-bold">({selectedProduct.reviewsCount} verified reviews)</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                  <span className="text-2xl font-black text-slate-900">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ${selectedProduct.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 rounded px-1.5 py-0.5">
                        {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                {selectedProduct.inStock ? (
                  <button
                    onClick={() => {
                      dispatch(addToCart(selectedProduct));
                      setSelectedProduct(null);
                    }}
                    className="flex-grow py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <span className="flex-grow py-3.5 bg-slate-50 border border-slate-150 text-slate-400 text-center text-xs font-bold rounded-xl">
                    Item Currently Out of Stock
                  </span>
                )}

                <button
                  onClick={() => dispatch(toggleWishlist(selectedProduct))}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    wishlistItems.some(item => item.id === selectedProduct.id)
                      ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-850'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={16} className={wishlistItems.some(item => item.id === selectedProduct.id) ? 'fill-rose-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductListing;
