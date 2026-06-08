import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

interface NotificationState {
  items: NotificationItem[];
}

const defaultNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Welcome Discount!',
    message: 'Welcome to Samrat Marketplace. Enjoy 10% off your first checkout using code WELCOME10.',
    read: false,
    timestamp: 'Just now',
  },
  {
    id: 'n-2',
    title: 'Verify Account',
    message: 'Please link your active delivery addresses in Settings to enable Express shipping lanes.',
    read: false,
    timestamp: '2 hours ago',
  },
  {
    id: 'n-3',
    title: 'Order Delivered',
    message: 'Your order #OD-920481 has been successfully delivered. Tap to leave review.',
    read: true,
    timestamp: '1 day ago',
  },
];

const initialState: NotificationState = {
  items: defaultNotifications,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<NotificationItem, 'read' | 'timestamp'>>) {
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
    markAllAsRead(state) {
      state.items.forEach(n => {
        n.read = true;
      });
    },
    clearAllNotifications(state) {
      state.items = [];
    },
  },
});

export const { addNotification, markAsRead, markAllAsRead, clearAllNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
