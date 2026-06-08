import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../shared/types';
import { featuredProducts } from '../../shared/data/mockData';

export interface ProductsFilters {
  category: string;
  brand: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  vendor: string[];
  inStockOnly: boolean;
  searchQuery: string;
}

interface ProductsState {
  items: Product[];
  recentlyViewed: Product[];
  filters: ProductsFilters;
  sortBy: string;
  viewMode: 'grid' | 'list';
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

const initialFilters: ProductsFilters = {
  category: 'All',
  brand: [],
  priceMin: 0,
  priceMax: 300,
  rating: null,
  vendor: [],
  inStockOnly: false,
  searchQuery: '',
};

const initialState: ProductsState = {
  items: featuredProducts,
  recentlyViewed: [],
  filters: initialFilters,
  sortBy: 'default',
  viewMode: 'grid',
  currentPage: 1,
  itemsPerPage: 6,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    addToRecentlyViewed(state, action: PayloadAction<Product>) {
      const product = action.payload;
      // Move to front and filter out duplicates, limit to 6 items
      state.recentlyViewed = [
        product,
        ...state.recentlyViewed.filter(p => p.id !== product.id),
      ].slice(0, 6);
    },
    setFilter(state, action: PayloadAction<{ key: keyof ProductsFilters; value: any }>) {
      const { key, value } = action.payload;
      state.filters[key] = value as never;
      state.currentPage = 1; // Reset to page 1 on filter change
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setViewMode(state, action: PayloadAction<'grid' | 'list'>) {
      state.viewMode = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setProductsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setProductsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setProducts,
  addToRecentlyViewed,
  setFilter,
  resetFilters,
  setSortBy,
  setViewMode,
  setCurrentPage,
  setProductsLoading,
  setProductsError,
} = productsSlice.actions;
export default productsSlice.reducer;
export type { ProductsState };
