import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
  vendorName?: string;
}

export interface OrderAddress {
  fullName: string;
  mobile: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface TrackingMilestone {
  title: string;
  date?: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  shippingAddress: OrderAddress;
  shippingMethod: 'standard' | 'express' | 'sameday';
  shippingCost: number;
  paymentMethod: 'card' | 'upi' | 'cod';
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  returnReason?: string;
  trackingTimeline: TrackingMilestone[];
  invoiceNumber: string;
}

interface OrdersState {
  items: Order[];
  loading: boolean;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2026-4792A',
    date: '2026-06-01',
    items: [
      {
        productId: 'prod-1',
        name: 'Elite Leather Jacket',
        price: 120.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        selectedSize: 'L',
        selectedColor: 'Classic Black',
        vendorName: 'Samrat Leather Crafts'
      }
    ],
    shippingAddress: {
      fullName: 'Prathamesh Samrat',
      mobile: '9876543210',
      addressLine1: '402, Samrat Towers, MG Road',
      addressLine2: 'Near Central Plaza Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001'
    },
    shippingMethod: 'standard',
    shippingCost: 0,
    paymentMethod: 'card',
    subtotal: 120.00,
    discount: 12.00,
    tax: 10.80,
    total: 118.80,
    status: 'delivered',
    invoiceNumber: 'INV-2026-891A',
    trackingTimeline: [
      { title: 'Order Placed', date: '2026-06-01 10:15 AM', description: 'Your order was successfully received.', completed: true },
      { title: 'Processing', date: '2026-06-01 02:30 PM', description: 'Seller has packaged and processed the items.', completed: true },
      { title: 'Shipped', date: '2026-06-02 09:00 AM', description: 'Dispatched via Samrat Logistics. Tracking ID: SMLG-984210', completed: true },
      { title: 'Delivered', date: '2026-06-04 04:45 PM', description: 'Successfully handed over to resident.', completed: true }
    ]
  },
  {
    id: 'ORD-2026-9812B',
    date: '2026-06-07',
    items: [
      {
        productId: 'prod-2',
        name: 'Premium Wireless Headphones',
        price: 85.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        selectedSize: 'One Size',
        selectedColor: 'Matte Grey',
        vendorName: 'Samrat Digital Systems'
      }
    ],
    shippingAddress: {
      fullName: 'Prathamesh Samrat',
      mobile: '9876543210',
      addressLine1: '402, Samrat Towers, MG Road',
      addressLine2: 'Near Central Plaza Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001'
    },
    shippingMethod: 'express',
    shippingCost: 15.00,
    paymentMethod: 'upi',
    subtotal: 85.00,
    discount: 0,
    tax: 8.50,
    total: 108.50,
    status: 'shipped',
    invoiceNumber: 'INV-2026-302B',
    trackingTimeline: [
      { title: 'Order Placed', date: '2026-06-07 08:30 AM', description: 'Your order was successfully received.', completed: true },
      { title: 'Processing', date: '2026-06-07 11:00 AM', description: 'Seller has packaged and processed the items.', completed: true },
      { title: 'Shipped', date: '2026-06-08 07:15 AM', description: 'Dispatched via Samrat Express Air. Tracking ID: SMEX-872910', completed: true },
      { title: 'Out for Delivery', description: 'Package is in transit with delivery executive.', completed: false },
      { title: 'Delivered', description: 'Package expected to arrive by evening.', completed: false }
    ]
  },
  {
    id: 'ORD-2026-1029C',
    date: '2026-06-09',
    items: [
      {
        productId: 'prod-3',
        name: 'Smart Espresso Coffee Maker',
        price: 150.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        selectedSize: 'Standard',
        selectedColor: 'Polished Silver',
        vendorName: 'Samrat Home Essentials'
      }
    ],
    shippingAddress: {
      fullName: 'Amit Samrat',
      mobile: '9812345678',
      addressLine1: 'Plot No. 12, Koramangala Layout',
      addressLine2: 'Opposite Wipro Park',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      pincode: '560034'
    },
    shippingMethod: 'sameday',
    shippingCost: 25.00,
    paymentMethod: 'cod',
    subtotal: 150.00,
    discount: 15.00,
    tax: 13.50,
    total: 173.50,
    status: 'processing',
    invoiceNumber: 'INV-2026-403C',
    trackingTimeline: [
      { title: 'Order Placed', date: '2026-06-09 09:00 AM', description: 'Your order was successfully received.', completed: true },
      { title: 'Processing', date: '2026-06-09 11:30 AM', description: 'Packing items at our central warehouse.', completed: true },
      { title: 'Shipped', description: 'Awaiting handoff to our courier partners.', completed: false },
      { title: 'Out for Delivery', description: 'Delivery executive assigned.', completed: false },
      { title: 'Delivered', description: 'Handoff target scheduled for today.', completed: false }
    ]
  },
  {
    id: 'ORD-2026-7839D',
    date: '2026-05-15',
    items: [
      {
        productId: 'prod-4',
        name: 'Organic Skincare Serum Duo',
        price: 45.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        selectedSize: '2x 50ml',
        selectedColor: 'Natural Gold',
        vendorName: 'Samrat Wellness Co.'
      }
    ],
    shippingAddress: {
      fullName: 'Prathamesh Samrat',
      mobile: '9876543210',
      addressLine1: '402, Samrat Towers, MG Road',
      addressLine2: 'Near Central Plaza Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001'
    },
    shippingMethod: 'standard',
    shippingCost: 15.00,
    paymentMethod: 'card',
    subtotal: 45.00,
    discount: 0,
    tax: 4.50,
    total: 64.50,
    status: 'cancelled',
    invoiceNumber: 'INV-2026-102D',
    trackingTimeline: [
      { title: 'Order Placed', date: '2026-05-15 01:20 PM', description: 'Your order was successfully received.', completed: true },
      { title: 'Cancelled', date: '2026-05-15 02:10 PM', description: 'Order cancelled by customer request.', completed: true }
    ]
  }
];

const initialState: OrdersState = {
  items: mockOrders,
  loading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder(state, action: PayloadAction<Omit<Order, 'id' | 'date' | 'invoiceNumber' | 'trackingTimeline'>>) {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}X`;
      const invoiceNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      
      const newOrder: Order = {
        ...action.payload,
        id: orderId,
        date: dateString,
        invoiceNumber: invoiceNum,
        trackingTimeline: [
          { title: 'Order Placed', date: `${dateString} ${timeString}`, description: 'Your order was successfully received.', completed: true },
          { title: 'Processing', description: 'Awaiting warehouse validation and dispatch.', completed: false },
          { title: 'Shipped', description: 'Handoff to Samrat Logistics.', completed: false },
          { title: 'Out for Delivery', description: 'Delivery partner dispatch.', completed: false },
          { title: 'Delivered', description: 'Delivery validation scan.', completed: false }
        ]
      };
      
      // Place new orders at the top of the list
      state.items.unshift(newOrder);
    },
    cancelOrder(state, action: PayloadAction<string>) {
      const orderId = action.payload;
      const order = state.items.find(o => o.id === orderId);
      if (order && (order.status === 'pending' || order.status === 'processing')) {
        order.status = 'cancelled';
        
        // Add cancelled milestone to timeline
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Find existing milestones that are incomplete, remove them, and add Cancelled milestone
        order.trackingTimeline = order.trackingTimeline.filter(milestone => milestone.completed);
        order.trackingTimeline.push({
          title: 'Cancelled',
          date: `${dateString} ${timeString}`,
          description: 'This order was cancelled and refunds are being processed.',
          completed: true
        });
      }
    },
    returnOrder(state, action: PayloadAction<{ orderId: string; reason: string }>) {
      const { orderId, reason } = action.payload;
      const order = state.items.find(o => o.id === orderId);
      if (order && order.status === 'delivered') {
        order.status = 'returned';
        order.returnReason = reason;
        
        // Add returned milestone to timeline
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const timeString = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        order.trackingTimeline.push({
          title: 'Returned',
          date: `${dateString} ${timeString}`,
          description: `Return requested. Reason: "${reason}"`,
          completed: true
        });
      }
    }
  }
});

export const { placeOrder, cancelOrder, returnOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
