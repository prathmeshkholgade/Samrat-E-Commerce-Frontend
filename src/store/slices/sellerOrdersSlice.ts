import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SellerOrdersState {
  searchQuery: string;
  statusFilter: string; // 'All' | status value
  paymentStatusFilter: string; // 'All' | payment status value
  sortBy: string;
  currentPage: number;
  itemsPerPage: number;
  selectedOrderIds: string[];
}

const initialState: SellerOrdersState = {
  searchQuery: '',
  statusFilter: 'All',
  paymentStatusFilter: 'All',
  sortBy: 'date-desc',
  currentPage: 1,
  itemsPerPage: 5,
  selectedOrderIds: [],
};

const sellerOrdersSlice = createSlice({
  name: 'sellerOrders',
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
    setPaymentStatusFilter(state, action: PayloadAction<string>) {
      state.paymentStatusFilter = action.payload;
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
    toggleSelectOrder(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedOrderIds.includes(id)) {
        state.selectedOrderIds = state.selectedOrderIds.filter(item => item !== id);
      } else {
        state.selectedOrderIds.push(id);
      }
    },
    setSelectedOrders(state, action: PayloadAction<string[]>) {
      state.selectedOrderIds = action.payload;
    },
    clearSelection(state) {
      state.selectedOrderIds = [];
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.statusFilter = 'All';
      state.paymentStatusFilter = 'All';
      state.sortBy = 'date-desc';
      state.currentPage = 1;
      state.selectedOrderIds = [];
    }
  }
});

export const {
  setSearchQuery,
  setStatusFilter,
  setPaymentStatusFilter,
  setSortBy,
  setCurrentPage,
  setItemsPerPage,
  toggleSelectOrder,
  setSelectedOrders,
  clearSelection,
  resetFilters
} = sellerOrdersSlice.actions;

export default sellerOrdersSlice.reducer;
