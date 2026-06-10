import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { DashboardMetric, DashboardOrder, DashboardTopProduct, DashboardLowStockItem, DashboardReview } from '../slices/dashboardSlice';
import type { SellerProduct, SellerOrder, SellerCustomer, SellerReview, SellerCoupon, SellerTransaction, WalletStats } from '../../shared/types';

export interface DashboardDataResponse {
  metrics: DashboardMetric[];
  recentOrders: DashboardOrder[];
  topProducts: DashboardTopProduct[];
  lowStock: DashboardLowStockItem[];
  recentReviews: DashboardReview[];
}

const initialSellerProducts: SellerProduct[] = [
  {
    id: 'prod-101',
    name: 'VoltX Wireless Noise-Cancelling Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    sku: 'VLX-WNH-001',
    category: 'Electronics',
    price: 129.99,
    stock: 40,
    rating: 4.8,
    status: 'Published',
    sales: 142,
    description: 'Immersive sound with hybrid active noise cancellation, 40 hours battery life, and ultra-comfortable memory foam earcups.',
  },
  {
    id: 'prod-102',
    name: 'Urban Nomad Waterproof Backpack',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    sku: 'NOM-WPB-002',
    category: 'Fashion',
    price: 49.99,
    stock: 15,
    rating: 4.6,
    status: 'Published',
    sales: 89,
    description: 'Heavy-duty water-resistant fabrics, custom laptop sleeve for up to 16-inch laptops, and integrated USB charging port.',
  },
  {
    id: 'prod-103',
    name: 'Eero Aura Smart Aroma Diffuser',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
    sku: 'EER-SAD-003',
    category: 'Home & Kitchen',
    price: 34.99,
    stock: 0,
    rating: 4.7,
    status: 'Out of Stock',
    sales: 64,
    description: 'Sleek wood-grain finish diffuser with adjustable color LED light rings and smart schedule integration.',
  },
  {
    id: 'prod-104',
    name: 'AeroCore Lightweight Running Shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    sku: 'AER-LRS-004',
    category: 'Sports & Fitness',
    price: 89.99,
    stock: 25,
    rating: 4.9,
    status: 'Published',
    sales: 215,
    description: 'Designed for professional runners. Built with high-response shock absorbing soles and breathable knitted mesh top layers.',
  },
  {
    id: 'prod-105',
    name: 'GlowEssence Organic Face Serum',
    image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80',
    sku: 'GLW-OFS-005',
    category: 'Beauty & Skincare',
    price: 24.99,
    stock: 8,
    rating: 4.5,
    status: 'Draft',
    sales: 0,
    description: 'Nourishing facial serum infused with organic Vitamin C, Hyaluronic Acid, and Aloe Vera to lock in skin elasticity and natural glow.',
  },
  {
    id: 'prod-106',
    name: 'Premium Single-Origin Coffee Beans (1kg)',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    sku: 'BST-CFB-006',
    category: 'Grocery',
    price: 19.99,
    stock: 120,
    rating: 4.9,
    status: 'Published',
    sales: 310,
    description: '100% Arabica medium roast coffee beans sourced directly from certified organic farms in Ethiopia. Notes of berry and chocolate.',
  },
  {
    id: 'prod-107',
    name: 'AuraStream 4K Auto-Focus Web Camera',
    image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    sku: 'VLX-4KW-007',
    category: 'Electronics',
    price: 79.99,
    stock: 5,
    rating: 4.4,
    status: 'Published',
    sales: 45,
    description: 'Crystal-clear 4K streaming web camera with dual noise-reduction microphones and automated intelligence low-light balance.',
  },
  {
    id: 'prod-108',
    name: 'Classic Minimalist Leather Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    sku: 'MON-MLW-008',
    category: 'Fashion',
    price: 119.99,
    stock: 0,
    rating: 4.7,
    status: 'Archived',
    sales: 98,
    description: 'A timeless minimalist wristwatch featuring surgical-grade stainless steel framing and a genuine top-grain Italian leather strap.',
  },
  {
    id: 'prod-109',
    name: 'Smart Espresso Coffee Maker',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    sku: 'SCM-ESC-009',
    category: 'Home & Kitchen',
    price: 149.99,
    stock: 6,
    rating: 4.8,
    status: 'Published',
    sales: 42,
    description: 'Professional-grade 15 bar pump espresso machine with integrated milk frothing wand for lattes and cappuccinos.',
  },
  {
    id: 'prod-110',
    name: 'VoltX Sports Bluetooth Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    sku: 'VLX-SBE-010',
    category: 'Electronics',
    price: 39.99,
    stock: 50,
    rating: 4.3,
    status: 'Draft',
    sales: 0,
    description: 'IPX7 waterproof wireless running earbuds with earhooks, secure fit, and powerful bass response.',
  }
];

const initialSellerOrders: SellerOrder[] = [
  {
    id: 'ORD-2026-8942A',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@example.com',
    customerPhone: '+91 98765 43210',
    shippingAddress: {
      fullName: 'Rohan Sharma',
      mobile: '+91 98765 43210',
      addressLine1: 'Flat 402, Royal Residency, MG Road',
      addressLine2: 'Near Central Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
    },
    products: [
      {
        productId: 'prod-101',
        name: 'VoltX Wireless Headphones',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        selectedSize: 'One Size',
        selectedColor: 'Black',
      },
      {
        productId: 'prod-102',
        name: 'Urban Nomad Waterproof Backpack',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        selectedSize: 'Large',
        selectedColor: 'Navy Blue',
      }
    ],
    amount: 179.98,
    paymentStatus: 'Paid',
    status: 'Pending',
    date: '2026-06-09',
    paymentMethod: 'UPI',
    shippingCarrier: 'Samrat Logistics',
    trackingNumber: 'SMLG-2026-984210',
  },
  {
    id: 'ORD-2026-8931B',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    customerPhone: '+91 91234 56789',
    shippingAddress: {
      fullName: 'Priya Patel',
      mobile: '+91 91234 56789',
      addressLine1: 'B-105, Shanti Vihar, Drive-in Road',
      addressLine2: 'Opposite Navrang Tower',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      pincode: '380009',
    },
    products: [
      {
        productId: 'prod-109',
        name: 'Smart Espresso Coffee Maker',
        price: 149.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
        selectedSize: 'Standard',
        selectedColor: 'Silver',
      }
    ],
    amount: 149.99,
    paymentStatus: 'Paid',
    status: 'Confirmed',
    date: '2026-06-09',
    paymentMethod: 'Credit Card',
    shippingCarrier: 'FedEx',
    trackingNumber: 'FDX-2026-778210',
  },
  {
    id: 'ORD-2026-8874C',
    customerName: 'Aditya Verma',
    customerEmail: 'aditya.v@example.com',
    customerPhone: '+91 99887 76655',
    shippingAddress: {
      fullName: 'Aditya Verma',
      mobile: '+91 99887 76655',
      addressLine1: 'C-72, Sector 45',
      addressLine2: 'Near Amity International School',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      pincode: '201301',
    },
    products: [
      {
        productId: 'prod-106',
        name: 'Premium Single-Origin Coffee Beans (1kg)',
        price: 19.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        selectedSize: '1kg',
        selectedColor: 'Ethiopian Arabica',
      },
      {
        productId: 'prod-105',
        name: 'GlowEssence Organic Face Serum',
        price: 24.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80',
        selectedSize: '50ml',
        selectedColor: 'Natural Glow',
      }
    ],
    amount: 64.97,
    paymentStatus: 'Paid',
    status: 'Shipped',
    date: '2026-06-08',
    paymentMethod: 'Credit Card',
    shippingCarrier: 'Samrat Express Air',
    trackingNumber: 'SMEX-872910',
  },
  {
    id: 'ORD-2026-8850D',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@example.com',
    customerPhone: '+91 88776 65544',
    shippingAddress: {
      fullName: 'Sneha Reddy',
      mobile: '+91 88776 65544',
      addressLine1: 'House No. 12-4-105, Koramangala',
      addressLine2: '4th Block, 8th Main',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      pincode: '560034',
    },
    products: [
      {
        productId: 'prod-106',
        name: 'Premium Single-Origin Coffee Beans (1kg)',
        price: 19.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        selectedSize: '1kg',
        selectedColor: 'Ethiopian Arabica',
      }
    ],
    amount: 19.99,
    paymentStatus: 'Paid',
    status: 'Delivered',
    date: '2026-06-07',
    paymentMethod: 'UPI',
    shippingCarrier: 'Delhivery',
    trackingNumber: 'DLV-2026-193481',
  },
  {
    id: 'ORD-2026-8812E',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram.singh@example.com',
    customerPhone: '+91 77665 54433',
    shippingAddress: {
      fullName: 'Vikram Singh',
      mobile: '+91 77665 54433',
      addressLine1: 'D-504, Heights Apartment, Tonk Road',
      addressLine2: 'Near Jaipur Exhibition Center',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      pincode: '302018',
    },
    products: [
      {
        productId: 'prod-101',
        name: 'VoltX Wireless Noise-Cancelling Headphones',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        selectedSize: 'One Size',
        selectedColor: 'Black',
      }
    ],
    amount: 129.99,
    paymentStatus: 'Refunded',
    status: 'Cancelled',
    date: '2026-06-06',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-2026-7721F',
    customerName: 'Ananya Rao',
    customerEmail: 'ananya.rao@example.com',
    customerPhone: '+91 99001 12233',
    shippingAddress: {
      fullName: 'Ananya Rao',
      mobile: '+91 99001 12233',
      addressLine1: 'Apartment 3A, Green Meadows, Gachibowli',
      addressLine2: 'Behind DLF Cyber City',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      pincode: '500032',
    },
    products: [
      {
        productId: 'prod-102',
        name: 'Urban Nomad Waterproof Backpack',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
        selectedSize: 'Large',
        selectedColor: 'Navy Blue',
      }
    ],
    amount: 49.99,
    paymentStatus: 'Paid',
    status: 'Returned',
    date: '2026-06-05',
    paymentMethod: 'COD',
  }
];

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'Adjustment' | 'Sale' | 'Fulfillment' | 'Restock';
  quantityChanged: number;
  newStockAvailable: number;
  timestamp: string;
  notes: string;
}

const initialInventoryTransactions: InventoryTransaction[] = [
  {
    id: 'TX-1001',
    productId: 'prod-101',
    productName: 'VoltX Wireless Noise-Cancelling Headphones',
    sku: 'VLX-WNH-001',
    type: 'Restock',
    quantityChanged: 50,
    newStockAvailable: 40,
    timestamp: '2026-06-05T10:00:00Z',
    notes: 'Initial bulk restock from distributor',
  },
  {
    id: 'TX-1002',
    productId: 'prod-101',
    productName: 'VoltX Wireless Noise-Cancelling Headphones',
    sku: 'VLX-WNH-001',
    type: 'Sale',
    quantityChanged: -1,
    newStockAvailable: 39,
    timestamp: '2026-06-09T05:15:00Z',
    notes: 'Reserved for Customer Order ORD-2026-8942A',
  },
  {
    id: 'TX-1003',
    productId: 'prod-102',
    productName: 'Urban Nomad Waterproof Backpack',
    sku: 'NOM-WPB-002',
    type: 'Restock',
    quantityChanged: 20,
    newStockAvailable: 15,
    timestamp: '2026-06-04T12:00:00Z',
    notes: 'Manual warehouse stock transfer',
  },
  {
    id: 'TX-1004',
    productId: 'prod-103',
    productName: 'Eero Aura Smart Aroma Diffuser',
    sku: 'EER-SAD-003',
    type: 'Sale',
    quantityChanged: -1,
    newStockAvailable: 0,
    timestamp: '2026-06-08T18:30:00Z',
    notes: 'Fulfillment checkout sale',
  }
];

const initialSellerCustomers: SellerCustomer[] = [
  {
    id: 'cust-1',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    mobile: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
    joinedDate: '2026-01-10',
  },
  {
    id: 'cust-2',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    mobile: '+91 91234 56789',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
    pincode: '380009',
    joinedDate: '2026-02-14',
  },
  {
    id: 'cust-3',
    name: 'Aditya Verma',
    email: 'aditya.v@example.com',
    mobile: '+91 99887 76655',
    city: 'Noida',
    state: 'Uttar Pradesh',
    country: 'India',
    pincode: '201301',
    joinedDate: '2026-03-01',
  },
  {
    id: 'cust-4',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    mobile: '+91 88776 65544',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    pincode: '560034',
    joinedDate: '2026-04-18',
  },
  {
    id: 'cust-5',
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    mobile: '+91 77665 54433',
    city: 'Jaipur',
    state: 'Rajasthan',
    country: 'India',
    pincode: '302018',
    joinedDate: '2026-05-22',
  },
  {
    id: 'cust-6',
    name: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    mobile: '+91 99001 12233',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500032',
    joinedDate: '2026-05-29',
  }
];

const initialSellerReviews: SellerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-101',
    productName: 'VoltX Wireless Noise-Cancelling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    customerName: 'Rohan Sharma',
    customerEmail: 'rohan.sharma@example.com',
    rating: 5,
    comment: 'The noise cancellation is amazing. Battery lasts forever, easily got 42 hours on single charge. Highly recommended!',
    date: '2026-06-08',
    status: 'Approved',
    reply: {
      message: 'Thank you Rohan! We are thrilled to hear you are enjoying the battery life and NC performance.',
      date: '2026-06-09',
    }
  },
  {
    id: 'rev-2',
    productId: 'prod-102',
    productName: 'Urban Nomad Waterproof Backpack',
    productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    rating: 4,
    comment: 'Very solid and spacious. Handles heavy rain well, and the laptop padding is superb. The zipper is a bit tight though.',
    date: '2026-06-07',
    status: 'Approved',
  },
  {
    id: 'rev-3',
    productId: 'prod-109',
    productName: 'Smart Espresso Coffee Maker',
    productImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80',
    customerName: 'Aditya Verma',
    customerEmail: 'aditya.v@example.com',
    rating: 2,
    comment: 'Coffee tastes great but the milk frother wand is difficult to clean and stopped working after 3 days. Contacting support.',
    date: '2026-06-06',
    status: 'Pending',
  },
  {
    id: 'rev-4',
    productId: 'prod-106',
    productName: 'Premium Single-Origin Coffee Beans (1kg)',
    productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@example.com',
    rating: 5,
    comment: 'Absolutely spectacular medium roast. Incredible floral notes and very smooth. Will definitely buy again.',
    date: '2026-06-04',
    status: 'Approved',
  },
  {
    id: 'rev-5',
    productId: 'prod-101',
    productName: 'VoltX Wireless Noise-Cancelling Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    customerName: 'Ananya Rao',
    customerEmail: 'ananya.rao@example.com',
    rating: 1,
    comment: 'Fake product! The bluetooth connection drops constantly and sound is tinny. Do not buy from this seller!',
    date: '2026-06-03',
    status: 'Approved',
  }
];

const initialSellerCoupons: SellerCoupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    discountType: 'Percentage',
    discountValue: 10,
    minPurchase: 50,
    maxDiscount: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'Active',
    usageCount: 154,
    revenueGenerated: 1245.50,
  },
  {
    id: 'coupon-2',
    code: 'SAMRAT50',
    discountType: 'Fixed Amount',
    discountValue: 50,
    minPurchase: 300,
    maxDiscount: 50,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    status: 'Active',
    usageCount: 42,
    revenueGenerated: 2100.00,
  },
  {
    id: 'coupon-3',
    code: 'SUMMER20',
    discountType: 'Percentage',
    discountValue: 20,
    minPurchase: 100,
    maxDiscount: 50,
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    status: 'Active',
    usageCount: 89,
    revenueGenerated: 4560.00,
  },
  {
    id: 'coupon-4',
    code: 'EXPIRED30',
    discountType: 'Percentage',
    discountValue: 30,
    minPurchase: 80,
    maxDiscount: 30,
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    status: 'Expired',
    usageCount: 310,
    revenueGenerated: 9300.00,
  },
  {
    id: 'coupon-5',
    code: 'DISABLEDFREE',
    discountType: 'Fixed Amount',
    discountValue: 15,
    minPurchase: 50,
    maxDiscount: 15,
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    status: 'Disabled',
    usageCount: 15,
    revenueGenerated: 225.00,
  }
];

const initialSellerTransactions: SellerTransaction[] = [
  {
    id: 'TXN-90241A',
    orderId: 'ORD-2026-8942A',
    amount: 179.98,
    type: 'Sale',
    status: 'Completed',
    date: '2026-06-09T10:30:00Z',
    description: 'Payout for Order ORD-2026-8942A (Rohan Sharma)'
  },
  {
    id: 'TXN-90241B',
    orderId: 'ORD-2026-8931B',
    amount: 149.99,
    type: 'Sale',
    status: 'Completed',
    date: '2026-06-09T08:15:00Z',
    description: 'Payout for Order ORD-2026-8931B (Priya Patel)'
  },
  {
    id: 'TXN-90241C',
    orderId: 'ORD-2026-8874C',
    amount: 64.97,
    type: 'Sale',
    status: 'Completed',
    date: '2026-06-08T15:20:00Z',
    description: 'Payout for Order ORD-2026-8874C (Aditya Verma)'
  },
  {
    id: 'TXN-90241D',
    orderId: 'ORD-2026-8850D',
    amount: 19.99,
    type: 'Sale',
    status: 'Completed',
    date: '2026-06-07T12:00:00Z',
    description: 'Payout for Order ORD-2026-8850D (Sneha Reddy)'
  },
  {
    id: 'TXN-PAYOUT-001',
    amount: -150.00,
    type: 'Withdrawal',
    status: 'Completed',
    date: '2026-06-06T14:00:00Z',
    description: 'Withdrawal to HDFC Bank A/c (...8921)'
  },
  {
    id: 'TXN-90241E',
    orderId: 'ORD-2026-8812E',
    amount: -129.99,
    type: 'Refund',
    status: 'Completed',
    date: '2026-06-06T11:45:00Z',
    description: 'Refund processed for Order ORD-2026-8812E'
  },
  {
    id: 'TXN-90241F',
    orderId: 'ORD-2026-7721F',
    amount: 49.99,
    type: 'Sale',
    status: 'Completed',
    date: '2026-06-05T16:30:00Z',
    description: 'Payout for Order ORD-2026-7721F (Ananya Rao)'
  },
  {
    id: 'TXN-FEE-001',
    amount: -5.00,
    type: 'Fee',
    status: 'Completed',
    date: '2026-06-05T00:05:00Z',
    description: 'Monthly platform transaction processing fee'
  }
];

const initialWalletStats: WalletStats = {
  availableBalance: 299.93,
  pendingBalance: 125.50,
  totalEarnings: 464.92,
  withdrawnAmount: 150.00,
  dailyRevenue: [
    { date: 'Mon', amount: 45.00 },
    { date: 'Tue', amount: 80.00 },
    { date: 'Wed', amount: 65.00 },
    { date: 'Thu', amount: 120.00 },
    { date: 'Fri', amount: 95.00 },
    { date: 'Sat', amount: 150.05 },
    { date: 'Sun', amount: 110.00 }
  ],
  monthlyRevenue: [
    { month: 'Jan', amount: 1200.00 },
    { month: 'Feb', amount: 1450.00 },
    { month: 'Mar', amount: 1900.00 },
    { month: 'Apr', amount: 2100.00 },
    { month: 'May', amount: 2600.00 },
    { month: 'Jun', amount: 3100.00 }
  ],
  productRevenue: [
    { productName: 'VoltX Noise-Cancelling Headphones', salesCount: 142, amount: 18458.58 },
    { productName: 'Urban Nomad Waterproof Backpack', salesCount: 89, amount: 4449.11 },
    { productName: 'Premium Coffee Beans (Ethiopian)', salesCount: 310, amount: 6196.90 },
    { productName: 'Smart Espresso Coffee Maker', salesCount: 42, amount: 6299.58 }
  ]
};

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
  tagTypes: ['Dashboard', 'SellerProducts', 'SellerOrders', 'InventoryHistory', 'SellerCustomers', 'SellerReviews', 'SellerCoupons', 'SellerWallet'],
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
    // Seller Dashboard Product CRUD mock endpoints
    getSellerProducts: builder.query<SellerProduct[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = [];
        if (stored) {
          products = JSON.parse(stored);
        } else {
          products = initialSellerProducts;
          localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        }
        return { data: products };
      },
      providesTags: ['SellerProducts'],
    }),
    addSellerProduct: builder.mutation<SellerProduct, Omit<SellerProduct, 'id' | 'rating' | 'sales'>>({
      async queryFn(newProduct) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        const created: SellerProduct = {
          ...newProduct,
          id: `prod-${Date.now()}`,
          rating: 0,
          sales: 0,
        };
        
        products = [created, ...products];
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: created };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    updateSellerProduct: builder.mutation<SellerProduct, SellerProduct>({
      async queryFn(updatedProduct) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        // Handle out of stock status if stock drops to 0 or becomes positive
        let finalProduct = { ...updatedProduct };
        if (finalProduct.stock === 0 && finalProduct.status === 'Published') {
          finalProduct.status = 'Out of Stock';
        } else if (finalProduct.stock > 0 && finalProduct.status === 'Out of Stock') {
          finalProduct.status = 'Published';
        }
        
        products = products.map(p => p.id === finalProduct.id ? finalProduct : p);
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: finalProduct };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    deleteSellerProduct: builder.mutation<{ success: boolean; id: string }, string>({
      async queryFn(id) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        products = products.filter(p => p.id !== id);
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: { success: true, id } };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    duplicateSellerProduct: builder.mutation<SellerProduct, string>({
      async queryFn(id) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        const sourceProduct = products.find(p => p.id === id);
        if (!sourceProduct) {
          return { error: { status: 404, statusText: 'Product not found', data: 'Product not found' } };
        }
        
        const duplicated: SellerProduct = {
          ...sourceProduct,
          id: `prod-${Date.now()}`,
          name: `${sourceProduct.name} (Copy)`,
          sku: `${sourceProduct.sku}-copy`,
          status: 'Draft',
          sales: 0,
        };
        
        products = [duplicated, ...products];
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: duplicated };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    bulkDeleteProducts: builder.mutation<{ success: boolean }, string[]>({
      async queryFn(ids) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        products = products.filter(p => !ids.includes(p.id));
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: { success: true } };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    bulkUpdateStatus: builder.mutation<{ success: boolean }, { ids: string[]; status: SellerProduct['status'] }>({
      async queryFn({ ids, status }) {
        const stored = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = stored ? JSON.parse(stored) : initialSellerProducts;
        
        products = products.map(p => {
          if (ids.includes(p.id)) {
            let newStock = p.stock;
            if (status === 'Out of Stock') {
              newStock = 0;
            } else if (p.stock === 0 && (status === 'Published' || status === 'Draft')) {
              newStock = 10;
            }
            return { ...p, status, stock: newStock };
          }
          return p;
        });
        
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        return { data: { success: true } };
      },
      invalidatesTags: ['SellerProducts'],
    }),
    
    // Seller Dashboard Orders mock endpoints
    getSellerOrders: builder.query<SellerOrder[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_orders');
        let orders: SellerOrder[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            orders = Array.isArray(parsed) ? parsed : initialSellerOrders;
          } catch (e) {
            orders = initialSellerOrders;
          }
        } else {
          orders = initialSellerOrders;
          localStorage.setItem('samrat_seller_orders', JSON.stringify(orders));
        }
        return { data: orders };
      },
      providesTags: ['SellerOrders'],
    }),
    updateOrderStatus: builder.mutation<
      SellerOrder,
      {
        id: string;
        status: SellerOrder['status'];
        shippingCarrier?: string;
        trackingNumber?: string;
      }
    >({
      async queryFn({ id, status, shippingCarrier, trackingNumber }) {
        const stored = localStorage.getItem('samrat_seller_orders');
        let orders: SellerOrder[] = stored ? JSON.parse(stored) : initialSellerOrders;
        
        orders = orders.map(o => {
          if (o.id === id) {
            // Auto update paymentStatus if delivered or cancelled/returned
            let paymentStatus = o.paymentStatus;
            if (status === 'Delivered') {
              paymentStatus = 'Paid';
            } else if (status === 'Cancelled') {
              paymentStatus = 'Refunded';
            }
            return {
              ...o,
              status,
              paymentStatus,
              shippingCarrier: shippingCarrier !== undefined ? shippingCarrier : o.shippingCarrier,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            };
          }
          return o;
        });
        
        localStorage.setItem('samrat_seller_orders', JSON.stringify(orders));
        const updatedOrder = orders.find(o => o.id === id);
        if (!updatedOrder) {
          return { error: { status: 404, statusText: 'Order not found', data: 'Order not found' } };
        }
        return { data: updatedOrder };
      },
      invalidatesTags: ['SellerOrders'],
    }),
    bulkUpdateOrderStatus: builder.mutation<{ success: boolean }, { ids: string[]; status: SellerOrder['status'] }>({
      async queryFn({ ids, status }) {
        const stored = localStorage.getItem('samrat_seller_orders');
        let orders: SellerOrder[] = stored ? JSON.parse(stored) : initialSellerOrders;
        
        orders = orders.map(o => {
          if (ids.includes(o.id)) {
            let paymentStatus = o.paymentStatus;
            if (status === 'Delivered') {
              paymentStatus = 'Paid';
            } else if (status === 'Cancelled') {
              paymentStatus = 'Refunded';
            }
            return { ...o, status, paymentStatus };
          }
          return o;
        });
        
        localStorage.setItem('samrat_seller_orders', JSON.stringify(orders));
        return { data: { success: true } };
      },
      invalidatesTags: ['SellerOrders'],
    }),
    getInventoryHistory: builder.query<InventoryTransaction[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_inventory_history');
        let transactions: InventoryTransaction[] = [];
        if (stored) {
          transactions = JSON.parse(stored);
        } else {
          transactions = initialInventoryTransactions;
          localStorage.setItem('samrat_inventory_history', JSON.stringify(transactions));
        }
        const sorted = [...transactions].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        return { data: sorted };
      },
      providesTags: ['InventoryHistory'],
    }),
    adjustProductStock: builder.mutation<
      { success: boolean },
      { productId: string; amount: number; isAbsolute: boolean; lowStockThreshold?: number; notes: string }
    >({
      async queryFn({ productId, amount, isAbsolute, lowStockThreshold, notes }) {
        const storedProducts = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = storedProducts ? JSON.parse(storedProducts) : initialSellerProducts;
        
        const index = products.findIndex(p => p.id === productId);
        if (index === -1) {
          return { error: { status: 404, statusText: 'Product not found', data: 'Product not found' } };
        }
        
        const targetProduct = { ...products[index] };
        const oldStock = targetProduct.stock;
        let newStock = isAbsolute ? amount : targetProduct.stock + amount;
        if (newStock < 0) newStock = 0;
        
        targetProduct.stock = newStock;
        if (lowStockThreshold !== undefined) {
          targetProduct.lowStockThreshold = lowStockThreshold;
        }
        
        if (targetProduct.stock === 0 && targetProduct.status === 'Published') {
          targetProduct.status = 'Out of Stock';
        } else if (targetProduct.stock > 0 && targetProduct.status === 'Out of Stock') {
          targetProduct.status = 'Published';
        }
        
        products = products.map(p => p.id === productId ? targetProduct : p);
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        
        const storedHistory = localStorage.getItem('samrat_inventory_history');
        let history: InventoryTransaction[] = storedHistory ? JSON.parse(storedHistory) : initialInventoryTransactions;
        
        const change = isAbsolute ? (newStock - oldStock) : amount;
        
        const transaction: InventoryTransaction = {
          id: `TX-${Date.now()}`,
          productId,
          productName: targetProduct.name,
          sku: targetProduct.sku,
          type: change >= 0 ? 'Restock' : 'Adjustment',
          quantityChanged: change,
          newStockAvailable: newStock,
          timestamp: new Date().toISOString(),
          notes: notes || 'Manual stock adjustment',
        };
        
        history = [transaction, ...history];
        localStorage.setItem('samrat_inventory_history', JSON.stringify(history));
        
        return { data: { success: true } };
      },
      invalidatesTags: ['SellerProducts', 'InventoryHistory', 'Dashboard'],
    }),
    bulkAdjustProductStock: builder.mutation<
      { success: boolean },
      { productIds: string[]; amount: number; isAbsolute: boolean; lowStockThreshold?: number; notes: string }
    >({
      async queryFn({ productIds, amount, isAbsolute, lowStockThreshold, notes }) {
        const storedProducts = localStorage.getItem('samrat_seller_products');
        let products: SellerProduct[] = storedProducts ? JSON.parse(storedProducts) : initialSellerProducts;
        
        const storedHistory = localStorage.getItem('samrat_inventory_history');
        let history: InventoryTransaction[] = storedHistory ? JSON.parse(storedHistory) : initialInventoryTransactions;
        
        const timestamp = new Date().toISOString();
        const batchId = Date.now();
        
        products = products.map((p, idx) => {
          if (productIds.includes(p.id)) {
            const oldStock = p.stock;
            let newStock = isAbsolute ? amount : p.stock + amount;
            if (newStock < 0) newStock = 0;
            
            let updated = { ...p, stock: newStock };
            if (lowStockThreshold !== undefined) {
              updated.lowStockThreshold = lowStockThreshold;
            }
            
            if (updated.stock === 0 && updated.status === 'Published') {
              updated.status = 'Out of Stock';
            } else if (updated.stock > 0 && updated.status === 'Out of Stock') {
              updated.status = 'Published';
            }
            
            const change = isAbsolute ? (newStock - oldStock) : amount;
            const transaction: InventoryTransaction = {
              id: `TX-${batchId}-${idx}`,
              productId: p.id,
              productName: p.name,
              sku: p.sku,
              type: change >= 0 ? 'Restock' : 'Adjustment',
              quantityChanged: change,
              newStockAvailable: newStock,
              timestamp,
              notes: notes || 'Bulk stock adjustment',
            };
            history.unshift(transaction);
            return updated;
          }
          return p;
        });
        
        localStorage.setItem('samrat_seller_products', JSON.stringify(products));
        localStorage.setItem('samrat_inventory_history', JSON.stringify(history));
        
        return { data: { success: true } };
      },
      invalidatesTags: ['SellerProducts', 'InventoryHistory', 'Dashboard'],
    }),
    getSellerCustomers: builder.query<SellerCustomer[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_customers');
        let customers: SellerCustomer[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            customers = Array.isArray(parsed) ? parsed : initialSellerCustomers;
          } catch (e) {
            customers = initialSellerCustomers;
          }
        } else {
          customers = initialSellerCustomers;
          localStorage.setItem('samrat_seller_customers', JSON.stringify(customers));
        }
        return { data: customers };
      },
      providesTags: ['SellerCustomers'],
    }),
    getSellerReviews: builder.query<SellerReview[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_reviews');
        let reviews: SellerReview[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            reviews = Array.isArray(parsed) ? parsed : initialSellerReviews;
          } catch (e) {
            reviews = initialSellerReviews;
          }
        } else {
          reviews = initialSellerReviews;
          localStorage.setItem('samrat_seller_reviews', JSON.stringify(reviews));
        }
        return { data: reviews };
      },
      providesTags: ['SellerReviews'],
    }),
    replyToReview: builder.mutation<SellerReview, { id: string; replyMessage: string }>({
      async queryFn({ id, replyMessage }) {
        const stored = localStorage.getItem('samrat_seller_reviews');
        let reviews: SellerReview[] = stored ? JSON.parse(stored) : initialSellerReviews;
        
        reviews = reviews.map(r => {
          if (r.id === id) {
            return {
              ...r,
              reply: {
                message: replyMessage,
                date: new Date().toISOString().split('T')[0],
              }
            };
          }
          return r;
        });
        
        localStorage.setItem('samrat_seller_reviews', JSON.stringify(reviews));
        const updated = reviews.find(r => r.id === id);
        if (!updated) {
          return { error: { status: 404, statusText: 'Review not found', data: 'Review not found' } };
        }
        return { data: updated };
      },
      invalidatesTags: ['SellerReviews', 'Dashboard'],
    }),
    reportReview: builder.mutation<SellerReview, string>({
      async queryFn(id) {
        const stored = localStorage.getItem('samrat_seller_reviews');
        let reviews: SellerReview[] = stored ? JSON.parse(stored) : initialSellerReviews;
        
        reviews = reviews.map(r => {
          if (r.id === id) {
            return { ...r, status: 'Reported' };
          }
          return r;
        });
        
        localStorage.setItem('samrat_seller_reviews', JSON.stringify(reviews));
        const updated = reviews.find(r => r.id === id);
        if (!updated) {
          return { error: { status: 404, statusText: 'Review not found', data: 'Review not found' } };
        }
        return { data: updated };
      },
      invalidatesTags: ['SellerReviews', 'Dashboard'],
    }),
    getSellerCoupons: builder.query<SellerCoupon[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_coupons');
        let coupons: SellerCoupon[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            coupons = Array.isArray(parsed) ? parsed : initialSellerCoupons;
          } catch (e) {
            coupons = initialSellerCoupons;
          }
        } else {
          coupons = initialSellerCoupons;
          localStorage.setItem('samrat_seller_coupons', JSON.stringify(coupons));
        }
        return { data: coupons };
      },
      providesTags: ['SellerCoupons'],
    }),
    addSellerCoupon: builder.mutation<SellerCoupon, Omit<SellerCoupon, 'id' | 'usageCount' | 'revenueGenerated'>>({
      async queryFn(newCoupon) {
        const stored = localStorage.getItem('samrat_seller_coupons');
        let coupons: SellerCoupon[] = stored ? JSON.parse(stored) : initialSellerCoupons;
        
        const created: SellerCoupon = {
          ...newCoupon,
          id: `coupon-${Date.now()}`,
          usageCount: 0,
          revenueGenerated: 0,
        };
        
        coupons = [created, ...coupons];
        localStorage.setItem('samrat_seller_coupons', JSON.stringify(coupons));
        return { data: created };
      },
      invalidatesTags: ['SellerCoupons'],
    }),
    updateSellerCoupon: builder.mutation<SellerCoupon, SellerCoupon>({
      async queryFn(updatedCoupon) {
        const stored = localStorage.getItem('samrat_seller_coupons');
        let coupons: SellerCoupon[] = stored ? JSON.parse(stored) : initialSellerCoupons;
        
        coupons = coupons.map(c => c.id === updatedCoupon.id ? updatedCoupon : c);
        localStorage.setItem('samrat_seller_coupons', JSON.stringify(coupons));
        return { data: updatedCoupon };
      },
      invalidatesTags: ['SellerCoupons'],
    }),
    deleteSellerCoupon: builder.mutation<{ success: boolean; id: string }, string>({
      async queryFn(id) {
        const stored = localStorage.getItem('samrat_seller_coupons');
        let coupons: SellerCoupon[] = stored ? JSON.parse(stored) : initialSellerCoupons;
        
        coupons = coupons.filter(c => c.id !== id);
        localStorage.setItem('samrat_seller_coupons', JSON.stringify(coupons));
        return { data: { success: true, id } };
      },
      invalidatesTags: ['SellerCoupons'],
    }),
    getWalletStats: builder.query<WalletStats, void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_wallet_data');
        let stats: WalletStats;
        if (stored) {
          try {
            stats = JSON.parse(stored);
          } catch (e) {
            stats = initialWalletStats;
          }
        } else {
          stats = initialWalletStats;
          localStorage.setItem('samrat_seller_wallet_data', JSON.stringify(stats));
        }
        return { data: stats };
      },
      providesTags: ['SellerWallet'],
    }),
    getWalletTransactions: builder.query<SellerTransaction[], void>({
      async queryFn() {
        const stored = localStorage.getItem('samrat_seller_transactions_ledger');
        let txs: SellerTransaction[] = [];
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            txs = Array.isArray(parsed) ? parsed : initialSellerTransactions;
          } catch (e) {
            txs = initialSellerTransactions;
          }
        } else {
          txs = initialSellerTransactions;
          localStorage.setItem('samrat_seller_transactions_ledger', JSON.stringify(txs));
        }
        return { data: txs };
      },
      providesTags: ['SellerWallet'],
    }),
    requestWithdrawal: builder.mutation<{ success: boolean; transaction: SellerTransaction }, { amount: number; bankName: string }>({
      async queryFn({ amount, bankName }) {
        const storedStats = localStorage.getItem('samrat_seller_wallet_data');
        let stats: WalletStats = storedStats ? JSON.parse(storedStats) : initialWalletStats;
        
        const storedTxs = localStorage.getItem('samrat_seller_transactions_ledger');
        let txs: SellerTransaction[] = storedTxs ? JSON.parse(storedTxs) : initialSellerTransactions;
        
        if (amount <= 0 || amount > stats.availableBalance) {
          return { error: { status: 400, statusText: 'Invalid withdrawal amount', data: 'Invalid withdrawal amount' } };
        }
        
        // Process withdrawal
        stats.availableBalance = parseFloat((stats.availableBalance - amount).toFixed(2));
        stats.withdrawnAmount = parseFloat((stats.withdrawnAmount + amount).toFixed(2));
        localStorage.setItem('samrat_seller_wallet_data', JSON.stringify(stats));
        
        const newTx: SellerTransaction = {
          id: `TXN-WITHDRAW-${Date.now()}`,
          amount: -amount,
          type: 'Withdrawal',
          status: 'Pending',
          date: new Date().toISOString(),
          description: `Withdrawal request to ${bankName}`
        };
        
        txs = [newTx, ...txs];
        localStorage.setItem('samrat_seller_transactions_ledger', JSON.stringify(txs));
        
        return { data: { success: true, transaction: newTx } };
      },
      invalidatesTags: ['SellerWallet'],
    }),
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetRecentOrdersQuery,
  useRestockItemMutation,
  useGetSellerProductsQuery,
  useAddSellerProductMutation,
  useUpdateSellerProductMutation,
  useDeleteSellerProductMutation,
  useDuplicateSellerProductMutation,
  useBulkDeleteProductsMutation,
  useBulkUpdateStatusMutation,
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useBulkUpdateOrderStatusMutation,
  useGetInventoryHistoryQuery,
  useAdjustProductStockMutation,
  useBulkAdjustProductStockMutation,
  useGetSellerCustomersQuery,
  useGetSellerReviewsQuery,
  useReplyToReviewMutation,
  useReportReviewMutation,
  useGetSellerCouponsQuery,
  useAddSellerCouponMutation,
  useUpdateSellerCouponMutation,
  useDeleteSellerCouponMutation,
  useGetWalletStatsQuery,
  useGetWalletTransactionsQuery,
  useRequestWithdrawalMutation,
} = sellerApi;
