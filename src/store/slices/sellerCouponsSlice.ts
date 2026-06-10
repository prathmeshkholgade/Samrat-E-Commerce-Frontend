import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SellerCouponsState {
  searchQuery: string;
  statusFilter: 'All' | 'Active' | 'Disabled' | 'Expired';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: SellerCouponsState = {
  searchQuery: '',
  statusFilter: 'All',
  currentPage: 1,
  itemsPerPage: 10,
};

const sellerCouponsSlice = createSlice({
  name: 'sellerCoupons',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<SellerCouponsState['statusFilter']>) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.statusFilter = 'All';
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchQuery,
  setStatusFilter,
  setCurrentPage,
  resetFilters,
} = sellerCouponsSlice.actions;

export default sellerCouponsSlice.reducer;
