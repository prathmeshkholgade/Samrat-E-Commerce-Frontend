import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SellerProductsState {
  searchQuery: string;
  statusFilter: string; // 'All' | status value
  categoryFilter: string; // 'All' | category value
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
  selectedProductIds: string[];
}

const initialState: SellerProductsState = {
  searchQuery: '',
  statusFilter: 'All',
  categoryFilter: 'All',
  sortBy: 'name-asc',
  currentPage: 1,
  itemsPerPage: 5,
  selectedProductIds: [],
};

const sellerProductsSlice = createSlice({
  name: 'sellerProducts',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to page 1
    },
    setStatusFilter(state, action: PayloadAction<string>) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<string>) {
      state.sortBy = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setItemsPerPage(state, action: PayloadAction<number>) {
      state.itemsPerPage = action.payload;
      state.currentPage = 1;
    },
    toggleSelectProduct(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedProductIds.includes(id)) {
        state.selectedProductIds = state.selectedProductIds.filter(item => item !== id);
      } else {
        state.selectedProductIds.push(id);
      }
    },
    setSelectedProducts(state, action: PayloadAction<string[]>) {
      state.selectedProductIds = action.payload;
    },
    clearSelection(state) {
      state.selectedProductIds = [];
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.statusFilter = 'All';
      state.categoryFilter = 'All';
      state.sortBy = 'name-asc';
      state.currentPage = 1;
      state.selectedProductIds = [];
    }
  }
});

export const {
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
  setSortBy,
  setCurrentPage,
  setItemsPerPage,
  toggleSelectProduct,
  setSelectedProducts,
  clearSelection,
  resetFilters
} = sellerProductsSlice.actions;

export default sellerProductsSlice.reducer;
