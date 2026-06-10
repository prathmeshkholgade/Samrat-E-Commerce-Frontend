export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  category: string;
  vendorName: string;
  isFeatured: boolean;
  inStock: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string; // Refers to Lucide icon string name
  count: number;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  type: 'customer' | 'vendor';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  iconName: string;
  color: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface StepItem {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  iconName: string;
}

export interface SellerProduct {
  id: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  status: 'Draft' | 'Published' | 'Out of Stock' | 'Archived';
  sales: number;
  description: string;
  shortDescription?: string;
  subcategory?: string;
  brand?: string;
  images?: { id: string; url: string; isThumbnail: boolean }[];
  mrp?: number;
  discount?: number;
  tax?: number;
  lowStockThreshold?: number;
  variants?: { id: string; name: string; sku: string; price: number; stock: number }[];
  variantConfig?: { sizes: string[]; colors: string[]; materials: string[] };
  shipping?: { weight: number; length: number; width: number; height: number };
  seo?: { title: string; description: string };
}

export interface SellerOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
}

export interface SellerOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  products: SellerOrderItem[];
  amount: number;
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  status: 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out For Delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  date: string;
  paymentMethod: 'Credit Card' | 'UPI' | 'COD';
  shippingCarrier?: string;
  trackingNumber?: string;
}

export interface SellerCustomer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  joinedDate: string;
}

export interface SellerReview {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  date: string;
  reply?: {
    message: string;
    date: string;
  };
  status: 'Approved' | 'Reported' | 'Pending';
}

export interface SellerCoupon {
  id: string;
  code: string;
  discountType: 'Percentage' | 'Fixed Amount';
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Disabled' | 'Expired';
  usageCount: number;
  revenueGenerated: number;
}

export interface SellerTransaction {
  id: string;
  orderId?: string;
  amount: number;
  type: 'Sale' | 'Withdrawal' | 'Refund' | 'Fee';
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  description: string;
}

export interface WalletStats {
  availableBalance: number;
  pendingBalance: number;
  totalEarnings: number;
  withdrawnAmount: number;
  dailyRevenue: { date: string; amount: number }[];
  monthlyRevenue: { month: string; amount: number }[];
  productRevenue: { productName: string; salesCount: number; amount: number }[];
}
