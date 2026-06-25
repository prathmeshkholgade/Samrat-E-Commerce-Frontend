import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationType = 'New Order' | 'Review' | 'Low Stock' | 'Payout Update' | 'Promotion';

export interface SellerNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  targetId?: string; // e.g. orderId, reviewId, productId
}

interface SellerNotificationsState {
  items: SellerNotification[];
}

const mockNotifications: SellerNotification[] = [
  {
    id: 'sn-1',
    type: 'New Order',
    title: 'New Order Received',
    message: 'Order ORD-8942A placed by Rohan Sharma ($145.00) containing 3 items.',
    read: false,
    timestamp: 'Just now',
    targetId: 'ORD-8942A',
  },
  {
    id: 'sn-2',
    type: 'Low Stock',
    title: 'Low Stock Alert',
    message: 'Premium Wireless Headphones (Grey) is running low (3 remaining). Please restock.',
    read: false,
    timestamp: '20 minutes ago',
    targetId: 'prod-1',
  },
  {
    id: 'sn-3',
    type: 'Review',
    title: 'New Product Review',
    message: 'Customer Aarav Mehta left a 5-star review on "Ergonomic Office Chair".',
    read: false,
    timestamp: '2 hours ago',
    targetId: 'rev-102',
  },
  {
    id: 'sn-4',
    type: 'Payout Update',
    title: 'Payout Disbursed Successfully',
    message: 'Weekly disbursement of $2,450.00 has been transferred to your registered bank account.',
    read: true,
    timestamp: 'Yesterday at 4:30 PM',
  },
  {
    id: 'sn-5',
    type: 'Promotion',
    title: 'Weekend Flash Sale Coupon Active',
    message: 'Your discount campaign "WEEKEND20" is now active and valid until Sunday midnight.',
    read: true,
    timestamp: '2 days ago',
    targetId: 'coupon-weekend20',
  },
  {
    id: 'sn-6',
    type: 'Low Stock',
    title: 'Out of Stock Alert',
    message: 'Smart Fitness Band (Black) has reached 0 units in stock. Buy buttons are hidden.',
    read: false,
    timestamp: '3 days ago',
    targetId: 'prod-4',
  },
  {
    id: 'sn-7',
    type: 'New Order',
    title: 'New Order Received',
    message: 'Order ORD-8940B placed by Priya Patel ($79.99). Awaiting verification.',
    read: true,
    timestamp: '4 days ago',
    targetId: 'ORD-8940B',
  }
];

const initialState: SellerNotificationsState = {
  items: mockNotifications,
};

const sellerNotificationsSlice = createSlice({
  name: 'sellerNotifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<SellerNotification, 'read' | 'timestamp'>>) {
      state.items.unshift({
        ...action.payload,
        read: false,
        timestamp: 'Just now',
      });
    },
    markAsRead(state, action: PayloadAction<string>) {
      const item = state.items.find(n => n.id === action.payload);
      if (item) {
        item.read = true;
      }
    },
    toggleReadStatus(state, action: PayloadAction<string>) {
      const item = state.items.find(n => n.id === action.payload);
      if (item) {
        item.read = !item.read;
      }
    },
    markAllAsRead(state) {
      state.items.forEach(n => {
        n.read = true;
      });
    },
    deleteNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter(n => n.id !== action.payload);
    },
    clearAllNotifications(state) {
      state.items = [];
    },
  },
});

export const { 
  addNotification, 
  markAsRead, 
  toggleReadStatus, 
  markAllAsRead, 
  deleteNotification, 
  clearAllNotifications 
} = sellerNotificationsSlice.actions;

export default sellerNotificationsSlice.reducer;
