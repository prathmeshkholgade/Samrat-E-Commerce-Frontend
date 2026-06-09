import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Check,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import { addToRecentlyViewed } from '../../store/slices/productsSlice';
import type { Product } from '../../shared/types';
import MarketplaceProductCard from '../../shared/components/MarketplaceProductCard';

// Extended product info lookup to make pages look premium and rich
interface ExtendedProductInfo {
  gallery: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  specifications: { label: string; value: string }[];
  reviews: { id: string; author: string; avatar: string; rating: number; date: string; comment: string; helpfulCount: number }[];
  vendorDetails: {
    rating: number;
    salesCount: string;
    responseTime: string;
    shippingOrigin: string;
  };
  stockCount: number;
}

const EXTENDED_DATA_MAP: Record<string, ExtendedProductInfo> = {
  'prod-1': {
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Matte Black', hex: '#1e1b1b' },
      { name: 'Platinum Silver', hex: '#cfd2d6' },
      { name: 'Navy Blue', hex: '#1e2d42' }
    ],
    sizes: ['Standard Fit', 'Pro Fit XL'],
    specifications: [
      { label: 'Brand', value: 'VoltX Audio' },
      { label: 'Type', value: 'Over-Ear Headphones' },
      { label: 'Connection', value: 'Bluetooth 5.2 & 3.5mm Jack' },
      { label: 'Battery Life', value: 'Up to 40 Hours (ANC On)' },
      { label: 'Driver Size', value: '40mm Dynamic Drivers' },
      { label: 'Noise Cancellation', value: 'Hybrid Active Noise Cancellation' },
      { label: 'Weight', value: '250g' },
      { label: 'Warranty', value: '1 Year Manufacturer Warranty' }
    ],
    reviews: [
      {
        id: 'rev-101',
        author: 'Arjun Sharma',
        avatar: 'A',
        rating: 5,
        date: 'June 02, 2026',
        comment: 'Absolutely love these headphones! The active noise cancellation blocks out my noisy office entirely. Battery lasts for days, and the memory foam earcups are incredibly soft.',
        helpfulCount: 42
      },
      {
        id: 'rev-102',
        author: 'Jessica Miller',
        avatar: 'J',
        rating: 4,
        date: 'May 28, 2026',
        comment: 'Sound quality is superb, with deep bass and crisp highs. My only minor complaint is that the headband feels a bit tight during long sessions, but it has started to loosen up comfortably.',
        helpfulCount: 15
      },
      {
        id: 'rev-103',
        author: 'Kunal Verma',
        avatar: 'K',
        rating: 5,
        date: 'May 14, 2026',
        comment: 'Pairs instantly with my laptop and phone. The multi-point connection works seamlessly. Definitely worth the price compared to other expensive models.',
        helpfulCount: 8
      }
    ],
    vendorDetails: {
      rating: 4.8,
      salesCount: '15,000+',
      responseTime: 'Within 2 hours',
      shippingOrigin: 'Mumbai, MH'
    },
    stockCount: 8
  },
  'prod-2': {
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1575844269151-57164468f74a?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Charcoal Gray', hex: '#374151' },
      { name: 'Olive Green', hex: '#374f35' },
      { name: 'Desert Sand', hex: '#d2b48c' }
    ],
    sizes: ['24 Liters', '32 Liters'],
    specifications: [
      { label: 'Brand', value: 'Nomad Gear Co.' },
      { label: 'Material', value: '1000D Waterproof Ballistic Nylon' },
      { label: 'Laptop Compartment', value: 'Padded Sleeve, Fits up to 16" Macbook' },
      { label: 'Dimensions', value: '18" x 12" x 6"' },
      { label: 'Zippers', value: 'YKK AquaGuard Waterproof' },
      { label: 'USB Port', value: 'Integrated USB charging pass-through' },
      { label: 'Weight', value: '950g' }
    ],
    reviews: [
      {
        id: 'rev-201',
        author: 'Rohan Gupta',
        avatar: 'R',
        rating: 5,
        date: 'June 05, 2026',
        comment: 'Commuted through heavy rain yesterday and all my books and laptop remained bone dry. Solid zippers, thick fabric. Comfortable shoulder straps even when packed to the brim.',
        helpfulCount: 18
      },
      {
        id: 'rev-202',
        author: 'Sophia Chen',
        avatar: 'S',
        rating: 4,
        date: 'May 30, 2026',
        comment: 'Lots of neat pockets for organization. The laptop pocket is suspended from the bottom, which is great for drop protection. A bit stiff at first, but built to last.',
        helpfulCount: 5
      }
    ],
    vendorDetails: {
      rating: 4.7,
      salesCount: '8,400+',
      responseTime: 'Within 4 hours',
      shippingOrigin: 'New Delhi, DL'
    },
    stockCount: 12
  },
  'prod-4': {
    gallery: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'
    ],
    colors: [
      { name: 'Aero Red', hex: '#dc2626' },
      { name: 'Neon Lime', hex: '#a3e635' },
      { name: 'Stealth Black', hex: '#090d16' }
    ],
    sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
    specifications: [
      { label: 'Brand', value: 'Aero Athletics' },
      { label: 'Type', value: 'Performance Running Shoes' },
      { label: 'Upper Material', value: 'Breathable Engineered Knit Mesh' },
      { label: 'Sole Tech', value: 'AeroCore Energy-Response Foam' },
      { label: 'Weight', value: '230g per shoe' },
      { label: 'Arch Support', value: 'Neutral / Dynamic' }
    ],
    reviews: [
      {
        id: 'rev-401',
        author: 'Priya Nair',
        avatar: 'P',
        rating: 5,
        date: 'June 01, 2026',
        comment: 'These are the lightest running shoes I have ever owned. The sole has a springy, high-rebound feel. Ran a 10K PB in them last weekend! Fits true to size.',
        helpfulCount: 29
      }
    ],
    vendorDetails: {
      rating: 4.9,
      salesCount: '24,000+',
      responseTime: 'Within 1 hour',
      shippingOrigin: 'Bengaluru, KA'
    },
    stockCount: 4
  }
};

const DEFAULT_EXTENDED_DATA = (product: Product): ExtendedProductInfo => ({
  gallery: [
    product.image,
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
  ],
  colors: [
    { name: 'Standard Color', hex: '#6366f1' },
    { name: 'Dark Tint', hex: '#1e293b' }
  ],
  sizes: ['Standard Size'],
  specifications: [
    { label: 'Brand', value: product.vendorName },
    { label: 'Category', value: product.category },
    { label: 'Model Status', value: '2026 Verified Release' },
    { label: 'Packaging', value: 'Secure Premium Retail Box' }
  ],
  reviews: [
    {
      id: 'rev-def-1',
      author: 'Sameer Patel',
      avatar: 'S',
      rating: 5,
      date: 'May 12, 2026',
      comment: 'Excellent product, matching the description exactly. Shipping was fast and the vendor was helpful.',
      helpfulCount: 3
    }
  ],
  vendorDetails: {
    rating: 4.6,
    salesCount: '1,200+',
    responseTime: 'Within 6 hours',
    shippingOrigin: 'Mumbai, MH'
  },
  stockCount: product.inStock ? 10 : 0
});

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux Store selectors
  const allProducts = useAppSelector(state => state.products.items);
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  // States
  const [product, setProduct] = useState<Product | null>(null);
  const [extendedInfo, setExtendedInfo] = useState<ExtendedProductInfo | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Zoom magnifier states
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Find the product by ID
    const foundProduct = allProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      dispatch(addToRecentlyViewed(foundProduct));
      
      const extInfo = EXTENDED_DATA_MAP[foundProduct.id] || DEFAULT_EXTENDED_DATA(foundProduct);
      setExtendedInfo(extInfo);
      
      setActiveImage(extInfo.gallery[0] || foundProduct.image);
      setSelectedColor(extInfo.colors[0]?.name || '');
      setSelectedSize(extInfo.sizes[0] || '');
      setQuantity(1);
    } else {
      // Product not found, go back
      navigate('/home/products');
    }
  }, [id, allProducts, navigate, dispatch]);

  if (!product || !extendedInfo) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-400">Loading premium details...</span>
      </div>
    );
  }

  // Discount calculation
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  // Gallery zoom mouse handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  // Dispatch helpers
  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
        color: selectedColor,
        size: selectedSize
      })
    );
    dispatch(
      addNotification({
        id: Math.random().toString(),
        title: 'Added to Cart',
        message: `Successfully added ${quantity}x ${product.title} (${selectedColor || 'Standard'}, ${selectedSize || 'Standard'}) to your cart.`
      })
    );
  };

  const handleBuyNow = () => {
    // Add to cart with current quantity/variants
    dispatch(
      addToCart({
        product,
        quantity,
        color: selectedColor,
        size: selectedSize
      })
    );
    // Directly simulate checkout redirection
    alert(`Checkout initiated for ${quantity}x ${product.title}.\nSelected: Color - ${selectedColor}, Size - ${selectedSize}`);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  // Find related products (same category, excluding current product)
  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Link to="/home" className="hover:text-indigo-600 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/home/products" className="hover:text-indigo-600 transition-colors">Products</Link>
        <ChevronRight size={12} />
        <span className="text-slate-700 truncate max-w-[200px] md:max-w-none">{product.title}</span>
      </nav>

      {/* 2. Main Product Core Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Product Gallery */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Display Image Container with Magnifier Zoom */}
          <div
            className="relative overflow-hidden aspect-square rounded-2xl border border-slate-100 bg-white shadow-xs cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-75"
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(2.2)' }
                  : { transform: 'scale(1)' }
              }
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none">
              {!product.inStock && (
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-700 bg-white/90 backdrop-blur-xs border border-slate-200 rounded-full uppercase">
                  Sold Out
                </span>
              )}
              {product.inStock && hasDiscount && (
                <span className="px-3 py-1 text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50/90 backdrop-blur-xs border border-emerald-100 rounded-full uppercase">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-200">
            {extendedInfo.gallery.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border-2 transition-all cursor-pointer ${
                  activeImage === imgUrl
                    ? 'border-indigo-650 ring-2 ring-indigo-50 shadow-sm'
                    : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Information & Selection Panel */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category, Status & Title */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-650 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5 uppercase block w-fit">
                {product.category}
              </span>
              
              {/* Stock Status Badge */}
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                <span className={`text-xs font-bold ${product.inStock ? 'text-emerald-700' : 'text-rose-650'}`}>
                  {product.inStock
                    ? `In Stock (${extendedInfo.stockCount} units remaining)`
                    : 'Out of Stock'}
                </span>
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Ratings & Reviews Counter */}
          <div className="flex items-center gap-4 py-1.5 border-y border-slate-100">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={i < Math.floor(product.rating) ? 'fill-amber-500' : ''}
                />
              ))}
              <span className="text-xs font-black text-slate-800 ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="h-4 w-px bg-slate-200" />
            <button
              onClick={() => {
                setActiveTab('reviews');
                document.getElementById('product-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-bold text-indigo-650 hover:underline cursor-pointer flex items-center gap-1.5"
            >
              <MessageSquare size={13} />
              <span>{product.reviewsCount} Verified Buyer Reviews</span>
            </button>
          </div>

          {/* Pricing Panel */}
          <div className="space-y-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base font-semibold text-slate-400 line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-0.5">
                    Save ${((product.originalPrice || 0) - product.price).toFixed(2)} ({discountPercent}%)
                  </span>
                </>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-bold tracking-wide block pt-1">
              Price excludes local VAT. Free standard shipping nationwide.
            </span>
          </div>

          {/* Product Variants: Size & Color */}
          {product.inStock && (
            <div className="space-y-5 py-2">
              
              {/* Color Selector */}
              {extendedInfo.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Selected Color:</span>
                    <span className="text-slate-500">{selectedColor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {extendedInfo.colors.map((color) => {
                      const isActive = selectedColor === color.name;
                      return (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative border cursor-pointer hover:scale-105 ${
                            isActive
                              ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xs'
                              : 'border-slate-200 hover:border-slate-350'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isActive && (
                            <Check
                              size={14}
                              className={
                                color.hex === '#cfd2d6' || color.hex === '#fff'
                                  ? 'text-slate-950 font-black'
                                  : 'text-white font-black'
                              }
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {extendedInfo.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Choose Size:</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {extendedInfo.sizes.map((size) => {
                      const isActive = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                              : 'bg-white border-slate-200 text-slate-650 hover:border-slate-350 hover:bg-slate-50/50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Action Box: Quantity + Buttons */}
          <div className="space-y-4 pt-2">
            {product.inStock ? (
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Quantity Control */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 h-12 w-full sm:w-32 flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-1.5 text-slate-500 hover:text-indigo-650 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-sm font-black text-slate-800 px-3">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(extendedInfo.stockCount, quantity + 1))}
                    disabled={quantity >= extendedInfo.stockCount}
                    className="p-1.5 text-slate-500 hover:text-indigo-650 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow h-12 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now */}
                <button
                  onClick={handleBuyNow}
                  className="flex-grow h-12 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl flex items-center justify-center hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>

                {/* Wishlist Toggle Button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100'
                      : 'bg-white border-slate-200 text-slate-400 hover:border-slate-350 hover:text-slate-800'
                  }`}
                  aria-label="Wishlist Toggle"
                >
                  <Heart size={18} className={isWishlisted ? 'fill-rose-500' : ''} />
                </button>

              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 text-center text-xs font-bold text-slate-400 leading-normal flex items-center justify-center gap-2">
                <Info size={14} className="text-slate-400" />
                <span>We are sorry! This premium item is currently sold out.</span>
              </div>
            )}
          </div>

          {/* Shipping / Trust Badges */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50/50 border border-slate-100/70 rounded-2xl p-4 text-center">
            <div className="flex flex-col items-center space-y-1.5">
              <Truck size={16} className="text-indigo-650" />
              <span className="text-[10px] font-bold text-slate-700">Fast Shipping</span>
              <p className="text-[9px] font-semibold text-slate-400 leading-none">Delivered in 2-3 days</p>
            </div>
            <div className="flex flex-col items-center space-y-1.5 border-x border-slate-200">
              <RotateCcw size={16} className="text-indigo-650" />
              <span className="text-[10px] font-bold text-slate-700">30-Day Returns</span>
              <p className="text-[9px] font-semibold text-slate-400 leading-none">Easy, hassle-free claims</p>
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <ShieldCheck size={16} className="text-indigo-650" />
              <span className="text-[10px] font-bold text-slate-700">100% Secure</span>
              <p className="text-[9px] font-semibold text-slate-400 leading-none">Escrow-backed checkout</p>
            </div>
          </div>

          {/* Compact Verified Vendor Card */}
          <div className="border border-slate-150 rounded-2xl p-4 space-y-3 shadow-3xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold flex items-center justify-center text-sm border border-indigo-100 shadow-3xs uppercase">
                  {product.vendorName.charAt(0)}
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-800">{product.vendorName}</h4>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5">
                    <span>Verified Samrat Vendor</span>
                  </p>
                </div>
              </div>
              <Link
                to="/home/products"
                className="text-[10px] font-bold text-indigo-650 hover:underline"
              >
                Visit Store
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-y-2 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-500">
              <div className="flex justify-between pr-4 border-r border-slate-100">
                <span>Vendor Rating</span>
                <span className="font-extrabold text-slate-800 flex items-center gap-0.5">
                  {extendedInfo.vendorDetails.rating} <Star size={10} className="fill-amber-500 text-amber-500" />
                </span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Total Sales</span>
                <span className="font-extrabold text-slate-800">{extendedInfo.vendorDetails.salesCount}</span>
              </div>
              <div className="flex justify-between pr-4 border-r border-slate-100">
                <span>Response Rate</span>
                <span className="font-extrabold text-slate-800">{extendedInfo.vendorDetails.responseTime}</span>
              </div>
              <div className="flex justify-between pl-4">
                <span>Ships From</span>
                <span className="font-extrabold text-slate-800">{extendedInfo.vendorDetails.shippingOrigin}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Specifications, Description & Reviews Tabs Section */}
      <div id="product-tabs-section" className="border-t border-slate-150 pt-10">
        
        {/* Navigation Tabs Header */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-4 px-6 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'description'
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <span>Description</span>
            {activeTab === 'description' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-t-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('specifications')}
            className={`pb-4 px-6 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'specifications'
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <span>Specifications</span>
            {activeTab === 'specifications' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-t-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-6 text-xs font-black uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === 'reviews'
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            <span>Reviews ({product.reviewsCount})</span>
            {activeTab === 'reviews' && (
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-600 rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tabs Render Pane */}
        <div className="py-8 animate-in fade-in duration-200 text-left">
          {activeTab === 'description' && (
            <div className="space-y-4 text-xs font-semibold text-slate-500 leading-relaxed max-w-4xl">
              <p className="text-sm text-slate-850 font-bold">About this product</p>
              <p>{product.description}</p>
              <p>
                Engineered for quality and longevity, this product has been thoroughly evaluated by our certified testing labs. Samrat Marketplace enforces high quality-assurance guidelines so you can buy with confidence from local storefronts.
              </p>
              <div className="pt-2 flex items-center gap-2.5 text-indigo-650 font-bold">
                <Sparkles size={14} className="animate-pulse" />
                <span>100% Genuine and Original Merchandise Sourced Directly from the brand.</span>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="max-w-2xl border border-slate-150 rounded-2xl overflow-hidden shadow-3xs">
              <table className="w-full text-xs text-slate-650">
                <tbody className="divide-y divide-slate-150">
                  {extendedInfo.specifications.map((spec) => (
                    <tr key={spec.label} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-black bg-slate-50/50 w-1/3 text-slate-700">{spec.label}</td>
                      <td className="px-5 py-4 font-semibold text-slate-500">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Ratings Aggregation Metrics (Left side of Reviews) */}
              <div className="lg:col-span-4 space-y-5">
                <div>
                  <h4 className="text-sm font-black text-slate-850">Customer Rating Distribution</h4>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-black text-slate-900">{product.rating.toFixed(1)}</span>
                    <span className="text-xs font-semibold text-slate-400">out of 5</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-500 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        className={i < Math.floor(product.rating) ? 'fill-amber-500' : ''}
                      />
                    ))}
                  </div>
                </div>

                {/* Rating bars */}
                <div className="space-y-2 text-xs font-semibold text-slate-450">
                  <div className="flex items-center gap-3">
                    <span className="w-10">5 Star</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="w-6 text-right">85%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10">4 Star</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }} />
                    </div>
                    <span className="w-6 text-right">10%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10">3 Star</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '3%' }} />
                    </div>
                    <span className="w-6 text-right">3%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10">2 Star</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '2%' }} />
                    </div>
                    <span className="w-6 text-right">2%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-10">1 Star</span>
                    <div className="flex-grow h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '0%' }} />
                    </div>
                    <span className="w-6 text-right">0%</span>
                  </div>
                </div>
              </div>

              {/* Individual reviews listing (Right side of Reviews) */}
              <div className="lg:col-span-8 space-y-6 divide-y divide-slate-100">
                {extendedInfo.reviews.map((rev, idx) => (
                  <div key={rev.id} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 flex items-center justify-center font-extrabold text-xs uppercase">
                          {rev.avatar}
                        </div>
                        <div className="text-left">
                          <h5 className="text-xs font-black text-slate-800">{rev.author}</h5>
                          <span className="text-[10px] text-slate-400 font-semibold">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.rating ? 'fill-amber-500' : ''}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-550 font-semibold leading-relaxed">
                      {rev.comment}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-650 flex items-center gap-1 cursor-pointer">
                        <ThumbsUp size={11} />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* 4. Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-150 pt-12 space-y-6">
          <div className="text-left">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Related Products</h3>
            <p className="text-xs text-slate-400 font-semibold mt-1">Explore similar curated listings in the {product.category} department.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => {
              const isRelWishlisted = wishlistItems.some(item => item.id === relProduct.id);
              return (
                <MarketplaceProductCard
                  key={relProduct.id}
                  product={relProduct}
                  isWishlisted={isRelWishlisted}
                  onAddToCart={(p) => dispatch(addToCart(p))}
                  onToggleWishlist={(p) => dispatch(toggleWishlist(p))}
                />
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
