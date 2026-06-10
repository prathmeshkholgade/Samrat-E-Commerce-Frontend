import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SellerReviewsState {
  searchQuery: string;
  ratingFilter: 'All' | '5' | '4' | '3' | '2' | '1';
  statusFilter: 'All' | 'Replied' | 'Unreplied' | 'Reported';
  currentPage: number;
  itemsPerPage: number;
}

const initialState: SellerReviewsState = {
  searchQuery: '',
  ratingFilter: 'All',
  statusFilter: 'All',
  currentPage: 1,
  itemsPerPage: 10,
};

const sellerReviewsSlice = createSlice({
  name: 'sellerReviews',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setRatingFilter(state, action: PayloadAction<SellerReviewsState['ratingFilter']>) {
      state.ratingFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter(state, action: PayloadAction<SellerReviewsState['statusFilter']>) {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    resetFilters(state) {
      state.searchQuery = '';
      state.ratingFilter = 'All';
      state.statusFilter = 'All';
      state.currentPage = 1;
    },
  },
});

export const { setSearchQuery, setRatingFilter, setStatusFilter, setCurrentPage, resetFilters } = sellerReviewsSlice.actions;
export default sellerReviewsSlice.reducer;
