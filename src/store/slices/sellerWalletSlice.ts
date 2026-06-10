import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SellerWalletState {
  searchQuery: string;
  typeFilter: 'All' | 'Sale' | 'Withdrawal' | 'Refund' | 'Fee';
  statusFilter: 'All' | 'Completed' | 'Pending' | 'Failed';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: SellerWalletState = {
  searchQuery: '',
  typeFilter: 'All',
  statusFilter: 'All',
  currentPage: 1,
  itemsPerPage: 10,
};

const sellerWalletSlice = createSlice({
  name: 'sellerWallet',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setTypeFilter(state, action: PayloadAction<SellerWalletState['typeFilter']>) {
      state.typeFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<SellerWalletState['statusFilter']>) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.typeFilter = 'All';
      state.statusFilter = 'All';
      state.currentPage = 1;
    },
  },
});

export const {
  setSearchQuery,
  setTypeFilter,
  setStatusFilter,
  setCurrentPage,
  resetFilters,
} = sellerWalletSlice.actions;

export default sellerWalletSlice.reducer;
