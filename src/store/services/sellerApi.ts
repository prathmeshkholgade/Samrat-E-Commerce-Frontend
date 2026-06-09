import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DashboardMetric, DashboardOrder, DashboardTopProduct, DashboardLowStockItem, DashboardReview } from '../slices/dashboardSlice';

export interface DashboardDataResponse {
  metrics: DashboardMetric[];
  recentOrders: DashboardOrder[];
  topProducts: DashboardTopProduct[];
  lowStock: DashboardLowStockItem[];
  recentReviews: DashboardReview[];
}

export const sellerApi = createApi({
  reducerPath: 'sellerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/seller',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('samrat_auth_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboardData: builder.query<DashboardDataResponse, void>({
      query: () => '/dashboard',
    }),
    getRecentOrders: builder.query<DashboardOrder[], void>({
      query: () => '/orders/recent',
    }),
    restockItem: builder.mutation<{ success: boolean; itemId: string; newStock: number }, { itemId: string; quantity: number }>({
      query: (body) => ({
        url: '/inventory/restock',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetRecentOrdersQuery,
  useRestockItemMutation,
} = sellerApi;
