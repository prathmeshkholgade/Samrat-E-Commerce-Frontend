import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SellerCustomersState {
  searchQuery: string;
  sortBy: 'name-asc' | 'name-desc' | 'spend-desc' | 'orders-desc';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: SellerCustomersState = {
  searchQuery: '',
  sortBy: 'spend-desc',
  currentPage: 1,
  itemsPerPage: 10,
};

const sellerCustomersSlice = createSlice({
  name: 'sellerCustomers',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setSortBy(state, action: PayloadAction<SellerCustomersState['sortBy']>) {
      state.sortBy = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.sortBy = 'spend-desc';
      state.currentPage = 1;
    },
  },
});

export const { setSearchQuery, setSortBy, setCurrentPage, resetFilters } = sellerCustomersSlice.actions;
export default sellerCustomersSlice.reducer;
