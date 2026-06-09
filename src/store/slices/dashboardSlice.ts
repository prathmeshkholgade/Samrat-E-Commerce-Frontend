import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  type: 'number' | 'currency' | 'rating';
  change: number;
  isPositive: boolean;
  label: string;
}

export interface DashboardOrder {
  id: string;
  customerName: string;
  productsCount: number;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  image: string;
  unitsSold: number;
  revenue: number;
}

export interface DashboardLowStockItem {
  id: string;
  name: string;
  currentStock: number;
  minimumThreshold: number;
}

export interface DashboardReview {
  id: string;
  customerName: string;
  rating: number;
  message: string;
  productName: string;
}

interface DashboardState {
  metrics: DashboardMetric[];
  recentOrders: DashboardOrder[];
  topProducts: DashboardTopProduct[];
  lowStock: DashboardLowStockItem[];
  recentReviews: DashboardReview[];
  loading: boolean;
}

const initialMetrics: DashboardMetric[] = [
  { id: 'total-products', title: 'Total Products', value: 142, type: 'number', change: 8.4, isPositive: true, label: 'vs last month' },
  { id: 'total-orders', title: 'Total Orders', value: 890, type: 'number', change: 12.5, isPositive: true, label: 'vs last month' },
  { id: 'pending-orders', title: 'Pending Orders', value: 45, type: 'number', change: -4.2, isPositive: true, label: 'vs yesterday' },
  { id: 'delivered-orders', title: 'Delivered Orders', value: 812, type: 'number', change: 14.2, isPositive: true, label: 'vs last month' },
  { id: 'total-revenue', title: 'Total Revenue', value: 24890.00, type: 'currency', change: 18.2, isPositive: true, label: 'vs last month' },
  { id: 'monthly-revenue', title: 'Monthly Revenue', value: 4550.00, type: 'currency', change: 5.6, isPositive: true, label: 'vs last month' },
  { id: 'store-rating', title: 'Store Rating', value: 4.8, type: 'rating', change: 0.1, isPositive: true, label: 'vs last month' },
  { id: 'low-stock', title: 'Low Stock Products', value: 4, type: 'number', change: -50.0, isPositive: true, label: 'vs last week' },
];

const mockRecentOrders: DashboardOrder[] = [
  { id: 'ORD-8942A', customerName: 'Rohan Sharma', productsCount: 2, amount: 145.00, status: 'pending', date: '2026-06-09' },
  { id: 'ORD-8931B', customerName: 'Priya Patel', productsCount: 1, amount: 89.99, status: 'processing', date: '2026-06-09' },
  { id: 'ORD-8874C', customerName: 'Aditya Verma', productsCount: 3, amount: 320.50, status: 'shipped', date: '2026-06-08' },
  { id: 'ORD-8850D', customerName: 'Sneha Reddy', productsCount: 1, amount: 45.00, status: 'delivered', date: '2026-06-07' },
  { id: 'ORD-8812E', customerName: 'Vikram Singh', productsCount: 2, amount: 110.00, status: 'cancelled', date: '2026-06-06' },
];

const mockTopProducts: DashboardTopProduct[] = [
  { id: 'tp-1', name: 'Elite Leather Jacket', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&auto=format&fit=crop&q=60', unitsSold: 120, revenue: 14400.00 },
  { id: 'tp-2', name: 'Premium Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=60', unitsSold: 98, revenue: 8330.00 },
  { id: 'tp-3', name: 'Smart Espresso Coffee Maker', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&auto=format&fit=crop&q=60', unitsSold: 45, revenue: 6750.00 },
  { id: 'tp-4', name: 'Organic Skincare Serum Duo', image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=200&auto=format&fit=crop&q=60', unitsSold: 110, revenue: 4950.00 },
];

const mockLowStock: DashboardLowStockItem[] = [
  { id: 'ls-1', name: 'Premium Wireless Headphones (Grey)', currentStock: 3, minimumThreshold: 10 },
  { id: 'ls-2', name: 'Elite Leather Jacket (Medium)', currentStock: 2, minimumThreshold: 5 },
  { id: 'ls-3', name: 'Smart Espresso Coffee Maker', currentStock: 4, minimumThreshold: 8 },
  { id: 'ls-4', name: 'Organic Skincare Serum Duo', currentStock: 5, minimumThreshold: 12 },
];

const mockRecentReviews: DashboardReview[] = [
  { id: 'rev-1', customerName: 'Arjun Mehta', rating: 5, message: 'Absolutely stunning quality, the leather is thick and premium. Highly recommended!', productName: 'Elite Leather Jacket' },
  { id: 'rev-2', customerName: 'Neha Kapoor', rating: 4, message: 'Great sound isolation and battery backup. Wish it came with a hard storage case.', productName: 'Premium Wireless Headphones' },
  { id: 'rev-3', customerName: 'Rajesh Sen', rating: 5, message: 'Brews a perfect rich cup of espresso. Very easy to clean and setup.', productName: 'Smart Espresso Coffee Maker' },
];

const initialState: DashboardState = {
  metrics: initialMetrics,
  recentOrders: mockRecentOrders,
  topProducts: mockTopProducts,
  lowStock: mockLowStock,
  recentReviews: mockRecentReviews,
  loading: false,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    restockProduct(state, action: PayloadAction<{ id: string; amount: number }>) {
      const { id, amount } = action.payload;
      const item = state.lowStock.find(i => i.id === id);
      if (item) {
        item.currentStock += amount;
        
        // If current stock exceeds minimumThreshold, update low stock products metric counts
        const stillLow = state.lowStock.filter(i => i.currentStock < i.minimumThreshold).length;
        const lowStockMetric = state.metrics.find(m => m.id === 'low-stock');
        if (lowStockMetric) {
          lowStockMetric.value = stillLow;
        }
      }
    }
  }
});

export const { restockProduct } = dashboardSlice.actions;
export default dashboardSlice.reducer;
