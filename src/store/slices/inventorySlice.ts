import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface InventoryState {
  searchQuery: string;
  categoryFilter: string;
  stockStatusFilter: 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';
  sortBy: 'sku-asc' | 'sku-desc' | 'stock-asc' | 'stock-desc' | 'total-stock-desc';
  currentPage: number;
  itemsPerPage: number;
  selectedProductIds: string[];
}

const initialState: InventoryState = {
  searchQuery: '',
  categoryFilter: 'All',
  stockStatusFilter: 'All',
  sortBy: 'stock-asc',
  currentPage: 1,
  itemsPerPage: 10,
  selectedProductIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset page index
    },
    setCategoryFilter(state, action: PayloadAction<string>) {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
    setStockStatusFilter(state, action: PayloadAction<InventoryState['stockStatusFilter']>) {
      state.stockStatusFilter = action.payload;
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<InventoryState['sortBy']>) {
      state.sortBy = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSelectedProducts(state, action: PayloadAction<string[]>) {
      state.selectedProductIds = action.payload;
    },
    toggleSelectProduct(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedProductIds.includes(id)) {
        state.selectedProductIds = state.selectedProductIds.filter(pid => pid !== id);
      } else {
        state.selectedProductIds.push(id);
      }
    },
    clearSelection(state) {
      state.selectedProductIds = [];
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.categoryFilter = 'All';
      state.stockStatusFilter = 'All';
      state.sortBy = 'stock-asc';
      state.currentPage = 1;
      state.selectedProductIds = [];
    },
  },
});

export const {
  setSearchQuery,
  setCategoryFilter,
  setStockStatusFilter,
  setSortBy,
  setCurrentPage,
  setSelectedProducts,
  toggleSelectProduct,
  clearSelection,
  resetFilters,
} = inventorySlice.actions;

export default inventorySlice.reducer;
