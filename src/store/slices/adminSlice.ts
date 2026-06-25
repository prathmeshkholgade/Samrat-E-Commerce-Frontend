import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface SellerRegistration {
  id: string;
  name: string;
  storeName: string;
  email: string;
  phone: string;
  category: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Blocked';
  date: string;
  logoUrl: string;
  businessAddress: string;
  businessType: string;
  gstin: string;
  panNumber: string;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    branch: string;
    ifscCode: string;
  };
  documents: {
    gstCertificate: string;
    panCard: string;
    businessLicense: string;
  };
}

export interface ProductApproval {
  id: string;
  name: string;
  sellerName: string;
  sellerId: string;
  price: number;
  category: string;
  status: 'Pending Review' | 'Approved' | 'Rejected' | 'Blocked';
  date: string;
  productImage: string;
  images: string[];
  description: string;
  pricing: {
    mrp: number;
    sellingPrice: number;
    discountRate: number;
    taxRate: number;
  };
  adminNotes: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerId: string;
  sellerName: string;
  sellerId: string;
  amount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  paymentMethod: 'Credit Card' | 'UPI' | 'PayPal' | 'Cash on Delivery';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: {
    fullName: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  timeline: Array<{
    status: string;
    title: string;
    description: string;
    date: string;
  }>;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  totalOrders: number;
  totalSpend: number;
  registrationDate: string;
  status: 'Active' | 'Blocked';
  addresses: Array<{
    type: 'Home' | 'Work';
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
  }>;
  orderHistory: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export interface AdminCategory {
  id: string;
  name: string;
  image: string;
  description: string;
  productsCount: number;
  status: 'Active' | 'Inactive';
  parentId?: string;
}

export interface AdminSettings {
  marketplace: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
  };
  commission: {
    defaultCommissionRate: number;
  };
  order: {
    returnWindowDays: number;
    cancellationRules: string;
  };
  profile: {
    name: string;
    email: string;
  };
}

export interface AdminState {
  totalSellers: number;
  activeSellers: number;
  pendingSellers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
  sellers: SellerRegistration[];
  products: ProductApproval[];
  recentOrders: AdminOrder[];
  customers: AdminCustomer[];
  categories: AdminCategory[];
  settings: AdminSettings;
}

const initialSellers: SellerRegistration[] = [
  {
    id: 'S-101',
    name: 'Sneha Patel',
    storeName: 'GreenVibe Organics',
    email: 'sneha@greenvibe.com',
    phone: '+91 98980 12345',
    category: 'Grocery',
    status: 'Pending',
    date: '2026-06-25',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
    businessAddress: '102, Green Arcade, Corporate Road, Ahmedabad, Gujarat - 380015',
    businessType: 'Partnership',
    gstin: '24AAACG1234F1Z3',
    panNumber: 'AAACG1234F',
    bankDetails: {
      accountNumber: '918020045231012',
      bankName: 'HDFC Bank Ltd',
      branch: 'Prahladnagar Branch',
      ifscCode: 'HDFC0000128',
    },
    documents: {
      gstCertificate: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      panCard: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      businessLicense: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 'S-102',
    name: 'Amit Verma',
    storeName: 'Nova Tech Labs',
    email: 'amit@novatech.com',
    phone: '+91 98250 98765',
    category: 'Electronics',
    status: 'Pending',
    date: '2026-06-25',
    logoUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150',
    businessAddress: 'Plot No. 42, Electronic Zone, Sector 25, Gandhinagar, Gujarat - 382025',
    businessType: 'Private Limited',
    gstin: '24AAACN2234P1Z4',
    panNumber: 'AAACN2234P',
    bankDetails: {
      accountNumber: '004201509420',
      bankName: 'State Bank of India',
      branch: 'Gandhinagar Ind Estate',
      ifscCode: 'SBIN0001042',
    },
    documents: {
      gstCertificate: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      panCard: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      businessLicense: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 'S-103',
    name: 'Priya Sen',
    storeName: 'Cosmo Chic',
    email: 'priya@cosmochic.com',
    phone: '+91 97410 45678',
    category: 'Fashion',
    status: 'Pending',
    date: '2026-06-24',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150',
    businessAddress: 'Shop G-5, Royal Plaza, MG Road, Bangalore, Karnataka - 560001',
    businessType: 'Sole Proprietorship',
    gstin: '29AAACP3234A1Z5',
    panNumber: 'AAACP3234A',
    bankDetails: {
      accountNumber: '3200104523910',
      bankName: 'ICICI Bank',
      branch: 'Trinity Circle Branch',
      ifscCode: 'ICIC0000002',
    },
    documents: {
      gstCertificate: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      panCard: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      businessLicense: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 'S-104',
    name: 'Kabir Singh',
    storeName: 'WoodCraft Furnishings',
    email: 'kabir@woodcraft.com',
    phone: '+91 91234 56789',
    category: 'Furniture',
    status: 'Pending',
    date: '2026-06-24',
    logoUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150',
    businessAddress: 'Industrial Area Phase 2, Panchkula, Haryana - 134109',
    businessType: 'Sole Proprietorship',
    gstin: '06AAACW4234L1Z6',
    panNumber: 'AAACW4234L',
    bankDetails: {
      accountNumber: '1004209542012',
      bankName: 'Punjab National Bank',
      branch: 'Sector 8 Branch',
      ifscCode: 'PUNB0100200',
    },
    documents: {
      gstCertificate: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      panCard: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      businessLicense: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    },
  },
  {
    id: 'S-105',
    name: 'Elena Rostova',
    storeName: 'Zen Gardens',
    email: 'elena@zengardens.com',
    phone: '+91 99880 77665',
    category: 'Home & Decor',
    status: 'Approved',
    date: '2026-06-23',
    logoUrl: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=150',
    businessAddress: '42, Garden Way, Ooty, Tamil Nadu - 643001',
    businessType: 'Partnership',
    gstin: '33AAACZ5234M1Z7',
    panNumber: 'AAACZ5234M',
    bankDetails: {
      accountNumber: '200198421054',
      bankName: 'Axis Bank Ltd',
      branch: 'Ooty Central Branch',
      ifscCode: 'UTIB0000310',
    },
    documents: {
      gstCertificate: '',
      panCard: '',
      businessLicense: '',
    },
  },
  {
    id: 'S-106',
    name: 'Raj Malhotra',
    storeName: 'FitLife Gear',
    email: 'raj@fitlife.com',
    phone: '+91 98110 22334',
    category: 'Sports',
    status: 'Approved',
    date: '2026-06-22',
    logoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150',
    businessAddress: 'Malhotra Mansion, Sector 4, Rohini, New Delhi - 110085',
    businessType: 'Sole Proprietorship',
    gstin: '07AAACM6234N1Z8',
    panNumber: 'AAACM6234N',
    bankDetails: {
      accountNumber: '40051294821',
      bankName: 'Canara Bank',
      branch: 'Rohini Sector 4',
      ifscCode: 'CNRB0001509',
    },
    documents: {
      gstCertificate: '',
      panCard: '',
      businessLicense: '',
    },
  },
  {
    id: 'S-107',
    name: 'Diana Prince',
    storeName: 'StyleHub Clothing',
    email: 'diana@stylehub.com',
    phone: '+91 98888 77777',
    category: 'Fashion',
    status: 'Blocked',
    date: '2026-06-20',
    logoUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150',
    businessAddress: 'Gateway Towers, Sector 125, Noida, Uttar Pradesh - 201301',
    businessType: 'Sole Proprietorship',
    gstin: '09AAACS7234X1Z9',
    panNumber: 'AAACS7234X',
    bankDetails: {
      accountNumber: '110295483210',
      bankName: 'Kotak Mahindra Bank',
      branch: 'Noida Sec 125',
      ifscCode: 'KKBK0000192',
    },
    documents: {
      gstCertificate: '',
      panCard: '',
      businessLicense: '',
    },
  }
];

const initialProducts: ProductApproval[] = [
  {
    id: 'P-501',
    name: 'Ultra HD Smart Projector 4K',
    sellerName: 'Nova Tech Labs',
    sellerId: 'S-102',
    price: 899.00,
    category: 'Electronics',
    status: 'Pending Review',
    date: '2026-06-25',
    productImage: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400',
    images: [
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400',
      'https://images.unsplash.com/photo-1496181130204-7552cc14bac4?w=400',
    ],
    description: 'Cinematic experience at home with native 4K resolution, 3000 ANSI lumens, HDR10 support, and built-in Dolby Audio stereo speakers. Perfect for movie nights, gaming, and business presentations.',
    pricing: {
      mrp: 1299.00,
      sellingPrice: 899.00,
      discountRate: 30,
      taxRate: 18,
    },
    adminNotes: '',
  },
  {
    id: 'P-502',
    name: 'Organic Cold Pressed Virgin Coconut Oil',
    sellerName: 'GreenVibe Organics',
    sellerId: 'S-101',
    price: 24.99,
    category: 'Grocery',
    status: 'Pending Review',
    date: '2026-06-25',
    productImage: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    images: [
      'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400',
    ],
    description: '100% natural, raw, unrefined cold-pressed virgin coconut oil extracted from fresh coastal coconuts. Excellent for cooking, baking, skin moisturizing, and hair care nourishment.',
    pricing: {
      mrp: 29.99,
      sellingPrice: 24.99,
      discountRate: 16,
      taxRate: 5,
    },
    adminNotes: '',
  },
  {
    id: 'P-503',
    name: 'Handcrafted Teak Wood Armchair',
    sellerName: 'WoodCraft Furnishings',
    sellerId: 'S-104',
    price: 299.99,
    category: 'Furniture',
    status: 'Pending Review',
    date: '2026-06-24',
    productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
    images: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=400',
    ],
    description: 'Premium quality solid teak wood armchair handcrafted by local artisans. Elegant mid-century modern design with premium quality cushions upholstered in durable linen fabric.',
    pricing: {
      mrp: 399.99,
      sellingPrice: 299.99,
      discountRate: 25,
      taxRate: 18,
    },
    adminNotes: '',
  },
  {
    id: 'P-504',
    name: 'Designer Italian Leather Belt',
    sellerName: 'Cosmo Chic',
    sellerId: 'S-103',
    price: 79.99,
    category: 'Fashion',
    status: 'Approved',
    date: '2026-06-23',
    productImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    ],
    description: 'Elegant full-grain Italian calfskin leather belt with handcrafted brass buckle. Timeless premium design suitable for both formal coordinates and casual settings.',
    pricing: {
      mrp: 99.99,
      sellingPrice: 79.99,
      discountRate: 20,
      taxRate: 18,
    },
    adminNotes: 'Verified brand registry documents.',
  }
];

const initialCustomers: AdminCustomer[] = [
  {
    id: 'C-801',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@gmail.com',
    mobile: '+91 98980 88210',
    totalOrders: 15,
    totalSpend: 2450.00,
    registrationDate: '2025-04-12',
    status: 'Active',
    addresses: [
      {
        type: 'Home',
        addressLine1: 'B-402, Shivalik Heights, Judges Bungalow Road',
        addressLine2: 'Bodakdev',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
      },
      {
        type: 'Work',
        addressLine1: 'Nova Tech Offices, Electronic Zone, Sector 25',
        city: 'Gandhinagar',
        state: 'Gujarat',
        pincode: '382025',
      }
    ],
    orderHistory: [
      { id: 'ORD-7821', amount: 899.00, date: '2026-06-25', status: 'Completed' },
      { id: 'ORD-7512', amount: 150.00, date: '2026-05-14', status: 'Completed' },
    ]
  },
  {
    id: 'C-802',
    name: 'Neha Sharma',
    email: 'neha.sharma@yahoo.com',
    mobile: '+91 97420 54102',
    totalOrders: 8,
    totalSpend: 380.50,
    registrationDate: '2025-08-20',
    status: 'Active',
    addresses: [
      {
        type: 'Home',
        addressLine1: 'Flat 12, Rose Villa Residency, Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411038',
      }
    ],
    orderHistory: [
      { id: 'ORD-7820', amount: 49.98, date: '2026-06-25', status: 'Completed' },
    ]
  },
  {
    id: 'C-803',
    name: 'Rohan Das',
    email: 'rohan.das@hotmail.com',
    mobile: '+91 98110 54201',
    totalOrders: 3,
    totalSpend: 210.00,
    registrationDate: '2026-01-15',
    status: 'Blocked',
    addresses: [
      {
        type: 'Home',
        addressLine1: 'H-56, Pocket C, Saket',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110017',
      }
    ],
    orderHistory: [
      { id: 'ORD-7819', amount: 159.98, date: '2026-06-25', status: 'Pending' },
    ]
  },
  {
    id: 'C-804',
    name: 'Karan Johar',
    email: 'karan.j@filmdirect.com',
    mobile: '+91 99300 12345',
    totalOrders: 28,
    totalSpend: 8940.00,
    registrationDate: '2024-11-02',
    status: 'Active',
    addresses: [
      {
        type: 'Home',
        addressLine1: 'Dharma Villa, Bandra Bandstand',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      }
    ],
    orderHistory: [
      { id: 'ORD-7818', amount: 299.99, date: '2026-06-25', status: 'Completed' },
    ]
  },
  {
    id: 'C-805',
    name: 'Simran Kaur',
    email: 'simran.k@outlook.com',
    mobile: '+91 95400 98765',
    totalOrders: 1,
    totalSpend: 18.50,
    registrationDate: '2026-06-20',
    status: 'Active',
    addresses: [
      {
        type: 'Home',
        addressLine1: 'Sector 34-C, House No. 1042',
        city: 'Chandigarh',
        state: 'Chandigarh',
        pincode: '160022',
      }
    ],
    orderHistory: [
      { id: 'ORD-7817', amount: 18.50, date: '2026-06-25', status: 'Refunded' },
    ]
  }
];

const initialOrders: AdminOrder[] = [
  {
    id: 'ORD-7821',
    customerName: 'Arjun Kumar',
    customerId: 'C-801',
    sellerName: 'Nova Tech Labs',
    sellerId: 'S-102',
    amount: 899.00,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    status: 'Completed',
    date: '2026-06-25 11:30 AM',
    shippingAddress: {
      fullName: 'Arjun Kumar',
      mobile: '+91 98980 88210',
      addressLine1: 'B-402, Shivalik Heights, Judges Bungalow Road',
      addressLine2: 'Bodakdev',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380054',
      country: 'India',
    },
    products: [
      { id: 'P-501', name: 'Ultra HD Smart Projector 4K', price: 899.00, quantity: 1 }
    ],
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Order successfully registered by customer.', date: '2026-06-25 11:30 AM' },
      { status: 'Processing', title: 'Payment Confirmed', description: 'UPI gateway transaction cleared.', date: '2026-06-25 11:32 AM' },
      { status: 'Shipped', title: 'Carrier Dispatched', description: 'Shipped via BlueDart (AWB #405230).', date: '2026-06-25 01:15 PM' },
      { status: 'Delivered', title: 'Delivered', description: 'Delivered to shipping origin door details.', date: '2026-06-25 04:30 PM' },
    ]
  },
  {
    id: 'ORD-7820',
    customerName: 'Neha Sharma',
    customerId: 'C-802',
    sellerName: 'GreenVibe Organics',
    sellerId: 'S-101',
    amount: 49.98,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'Processing',
    date: '2026-06-25 10:15 AM',
    shippingAddress: {
      fullName: 'Neha Sharma',
      mobile: '+91 97420 54102',
      addressLine1: 'Flat 12, Rose Villa Residency, Kothrud',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      country: 'India',
    },
    products: [
      { id: 'P-502', name: 'Organic Cold Pressed Virgin Coconut Oil', price: 24.99, quantity: 2 }
    ],
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Order registered by customer.', date: '2026-06-25 10:15 AM' },
      { status: 'Processing', title: 'Vendor Packaging', description: 'GreenVibe Organics preparing package box.', date: '2026-06-25 10:35 AM' },
    ]
  },
  {
    id: 'ORD-7819',
    customerName: 'Rohan Das',
    customerId: 'C-803',
    sellerName: 'Cosmo Chic',
    sellerId: 'S-103',
    amount: 159.98,
    paymentStatus: 'Paid',
    paymentMethod: 'PayPal',
    status: 'Pending',
    date: '2026-06-25 09:12 AM',
    shippingAddress: {
      fullName: 'Rohan Das',
      mobile: '+91 98110 54201',
      addressLine1: 'H-56, Pocket C, Saket',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110017',
      country: 'India',
    },
    products: [
      { id: 'P-504', name: 'Designer Italian Leather Belt', price: 79.99, quantity: 2 }
    ],
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Awaiting store manager dispatch.', date: '2026-06-25 09:12 AM' },
    ]
  },
  {
    id: 'ORD-7818',
    customerName: 'Karan Johar',
    customerId: 'C-804',
    sellerName: 'WoodCraft Furnishings',
    sellerId: 'S-104',
    amount: 299.99,
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    status: 'Shipped',
    date: '2026-06-24 03:30 PM',
    shippingAddress: {
      fullName: 'Karan Johar',
      mobile: '+91 99300 12345',
      addressLine1: 'Dharma Villa, Bandra Bandstand',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
    },
    products: [
      { id: 'P-503', name: 'Handcrafted Teak Wood Armchair', price: 299.99, quantity: 1 }
    ],
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Registered.', date: '2026-06-24 03:30 PM' },
      { status: 'Processing', title: 'Approved', description: 'In progress.', date: '2026-06-24 04:00 PM' },
      { status: 'Shipped', title: 'Shipped', description: 'Dispatched via SafeExpress.', date: '2026-06-25 09:30 AM' },
    ]
  },
  {
    id: 'ORD-7817',
    customerName: 'Simran Kaur',
    customerId: 'C-805',
    sellerName: 'Samrat Enterprises',
    sellerId: 'S-108',
    amount: 18.50,
    paymentStatus: 'Paid',
    paymentMethod: 'UPI',
    status: 'Refunded',
    date: '2026-06-23 04:30 PM',
    shippingAddress: {
      fullName: 'Simran Kaur',
      mobile: '+91 95400 98765',
      addressLine1: 'Sector 34-C, House No. 1042',
      city: 'Chandigarh',
      state: 'Chandigarh',
      pincode: '160022',
      country: 'India',
    },
    products: [
      { id: 'P-900', name: 'Organic Grocery Oats Box', price: 18.50, quantity: 1 }
    ],
    timeline: [
      { status: 'Pending', title: 'Order Placed', description: 'Placed.', date: '2026-06-23 04:30 PM' },
      { status: 'Refunded', title: 'Refunded', description: 'Refunded successfully by vendor.', date: '2026-06-24 10:12 AM' },
    ]
  }
];

const initialCategories: AdminCategory[] = [
  {
    id: 'cat-1',
    name: 'Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150',
    description: 'Gadgets, appliances, personal devices, and visual projectors.',
    productsCount: 120,
    status: 'Active',
  },
  {
    id: 'cat-1-1',
    name: 'Mobile Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150',
    description: 'Smartphones and cell devices.',
    productsCount: 50,
    status: 'Active',
    parentId: 'cat-1',
  },
  {
    id: 'cat-1-2',
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181130204-7552cc14bac4?w=150',
    description: 'Personal notebooks and portable workstations.',
    productsCount: 70,
    status: 'Active',
    parentId: 'cat-1',
  },
  {
    id: 'cat-2',
    name: 'Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150',
    description: 'Organic vegetables, dairy items, oils, and farm crops.',
    productsCount: 450,
    status: 'Active',
  },
  {
    id: 'cat-2-1',
    name: 'Oils & Grains',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150',
    description: 'Cooking oils, cereals, and dry farm grains.',
    productsCount: 450,
    status: 'Active',
    parentId: 'cat-2',
  },
  {
    id: 'cat-3',
    name: 'Furniture',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=150',
    description: 'Premium woodcraft tables, lounge chairs, and desk storage.',
    productsCount: 80,
    status: 'Active',
  },
  {
    id: 'cat-4',
    name: 'Fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150',
    description: 'Designer clothing, leather belts, and footwear registries.',
    productsCount: 350,
    status: 'Active',
  }
];

const initialSettings: AdminSettings = {
  marketplace: {
    platformName: 'Samrat Enterprises',
    supportEmail: 'support@samrat.com',
    supportPhone: '+91 99887 76655',
  },
  commission: {
    defaultCommissionRate: 8,
  },
  order: {
    returnWindowDays: 7,
    cancellationRules: 'Allow cancellation before packaging is completed by seller.',
  },
  profile: {
    name: 'Admin Samrat',
    email: 'admin@samrat.com',
  },
};

const initialState: AdminState = {
  totalSellers: 142,
  activeSellers: 138,
  pendingSellers: 4,
  totalProducts: 1240,
  pendingProducts: 4,
  totalOrders: 4210,
  totalRevenue: 342950,
  activeCustomers: 2840,
  sellers: initialSellers,
  products: initialProducts,
  recentOrders: initialOrders,
  customers: initialCustomers,
  categories: initialCategories,
  settings: initialSettings,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateSellerStatus(
      state,
      action: PayloadAction<{ id: string; status: SellerRegistration['status'] }>
    ) {
      const seller = state.sellers.find((s) => s.id === action.payload.id);
      if (seller) {
        const oldStatus = seller.status;
        const newStatus = action.payload.status;
        
        if (oldStatus !== newStatus) {
          seller.status = newStatus;
          
          state.pendingSellers = state.sellers.filter((s) => s.status === 'Pending').length;
          state.activeSellers = state.sellers.filter((s) => s.status === 'Approved').length;
          state.totalSellers = state.sellers.length;
        }
      }
    },
    updateProductStatus(
      state,
      action: PayloadAction<{ id: string; status: ProductApproval['status'] }>
    ) {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        const oldStatus = product.status;
        const newStatus = action.payload.status;

        if (oldStatus !== newStatus) {
          product.status = newStatus;
          
          state.pendingProducts = state.products.filter((p) => p.status === 'Pending Review').length;
          state.totalProducts = state.products.filter((p) => p.status === 'Approved').length + 1236;
        }
      }
    },
    updateProductNotes(state, action: PayloadAction<{ id: string; notes: string }>) {
      const product = state.products.find((p) => p.id === action.payload.id);
      if (product) {
        product.adminNotes = action.payload.notes;
      }
    },
    updateCustomerStatus(
      state,
      action: PayloadAction<{ id: string; status: AdminCustomer['status'] }>
    ) {
      const customer = state.customers.find((c) => c.id === action.payload.id);
      if (customer) {
        customer.status = action.payload.status;
      }
    },
    addMockCategory(state) {
      state.totalProducts += 5;
    },
    addCategory(
      state,
      action: PayloadAction<Omit<AdminCategory, 'id' | 'productsCount'>>
    ) {
      const id = `cat-${Date.now()}`;
      state.categories.push({
        ...action.payload,
        id,
        productsCount: 0,
      });
    },
    updateCategory(state, action: PayloadAction<AdminCategory>) {
      const idx = state.categories.findIndex((c) => c.id === action.payload.id);
      if (idx !== -1) {
        state.categories[idx] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      const catId = action.payload;
      state.categories = state.categories.filter((c) => c.id !== catId);
      state.categories = state.categories.filter((c) => c.parentId !== catId);
    },
    updateAdminSettings(state, action: PayloadAction<AdminSettings>) {
      state.settings = action.payload;
    },
  },
});

export const {
  updateSellerStatus,
  updateProductStatus,
  updateProductNotes,
  updateCustomerStatus,
  addMockCategory,
  addCategory,
  updateCategory,
  deleteCategory,
  updateAdminSettings,
} = adminSlice.actions;

export default adminSlice.reducer;
