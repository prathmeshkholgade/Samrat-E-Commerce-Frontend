import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Eye, ShoppingCart, Heart } from 'lucide-react';
import type { Product } from '../types';

interface MarketplaceProductCardProps {
  product?: Product;
  loading?: boolean;
  isWishlisted?: boolean;
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

export const MarketplaceProductCard: React.FC<MarketplaceProductCardProps> = ({
  product,
  loading = false,
  isWishlisted = false,
  viewMode = 'grid',
  onAddToCart,
  onToggleWishlist,
  onQuickView,
}) => {
  // 1. Loading Skeleton State
  if (loading || !product) {
    if (viewMode === 'list') {
      return (
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 animate-pulse">
          <div className="bg-slate-100 rounded-xl w-full sm:w-48 h-48 flex-shrink-0" />
          <div className="flex-grow space-y-3 py-2">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-5 bg-slate-100 rounded w-3/4" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
            <div className="h-4 bg-slate-100 rounded w-2/3" />
            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
              <div className="h-6 bg-slate-100 rounded w-20" />
              <div className="h-8 bg-slate-100 rounded-lg w-24 ml-auto" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-4 animate-pulse">
        <div className="bg-slate-100 rounded-xl aspect-square w-full" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-5 bg-slate-100 rounded w-full" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-slate-50">
          <div className="h-6 bg-slate-100 rounded w-1/4" />
          <div className="h-8 bg-slate-100 rounded-lg w-1/3" />
        </div>
      </div>
    );
  }

  // 2. Discount Calculation
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // 3. Render List Layout Mode
  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-slate-100/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-200/50 transition-all duration-300 flex flex-col sm:flex-row p-4 gap-6 relative">
        
        {/* Wishlist Button */}
        <button
          onClick={() => onToggleWishlist?.(product)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50/80 hover:bg-white hover:shadow-md border border-slate-100 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
          aria-label="Toggle wishlist"
        >
          <Heart
            size={18}
            className={`${isWishlisted ? 'fill-rose-500 text-rose-500' : 'transition-colors'}`}
          />
        </button>

        {/* Product Image Section */}
        <Link to={`/home/products/${product.id}`} className="w-full sm:w-48 h-48 bg-slate-50 rounded-xl relative overflow-hidden flex-shrink-0 border border-slate-100/55 flex items-center justify-center cursor-pointer block">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ${
              !product.inStock ? 'opacity-60 grayscale-[40%]' : ''
            }`}
          />
          
          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {!product.inStock && (
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 bg-slate-100/90 rounded border border-slate-200/60 uppercase">
                Out of Stock
              </span>
            )}
            {product.inStock && hasDiscount && (
              <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider text-emerald-700 bg-emerald-50/90 rounded border border-emerald-100 uppercase">
                {discountPercent}% OFF
              </span>
            )}
          </div>
        </Link>

        {/* Details & Actions Section */}
        <div className="flex-grow flex flex-col justify-between py-1">
          <div className="space-y-2.5">
            <div>
              {/* Vendor & Category */}
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                <span>{product.vendorName}</span>
                <span>•</span>
                <span className="text-indigo-650">{product.category}</span>
              </div>
              
              {/* Title */}
              <Link to={`/home/products/${product.id}`} className="block cursor-pointer">
                <h3 className="text-base font-bold text-slate-850 group-hover:text-indigo-600 transition-colors mt-1 leading-snug">
                  {product.title}
                </h3>
              </Link>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-[10px] font-black">
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-400 font-semibold">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Description (Visible in list view) */}
            <p className="text-xs text-slate-550 font-semibold line-clamp-2 leading-relaxed max-w-2xl">
              {product.description}
            </p>
          </div>

          {/* Pricing & Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100/60 mt-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-xs font-semibold text-slate-400 line-through">
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wide mt-0.5">
                Excluding Taxes & shipping fees
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onQuickView?.(product)}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-650 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-slate-150"
              >
                <Eye size={14} />
                <span>Quick View</span>
              </button>

              {product.inStock ? (
                <button
                  onClick={() => onAddToCart?.(product)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-100/50 hover:scale-[1.01] cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingCart size={14} />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <span className="px-4 py-2.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
                  Sold Out
                </span>
              )}
            </div>
          </div>

        </div>

      </div>
    );
  }

  // 4. Render Grid Layout Mode (Default)
  return (
    <div className="group bg-white border border-slate-100/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:border-slate-200/50 transition-all duration-300 flex flex-col relative">
      
      {/* Badges / Wishlist Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {!product.inStock && (
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-700 bg-slate-100 border border-slate-200/60 rounded-full uppercase">
            Out of Stock
          </span>
        )}
        {product.inStock && hasDiscount && (
          <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full uppercase">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      <button
        onClick={() => onToggleWishlist?.(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:shadow-md border border-slate-100 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
        aria-label="Toggle wishlist"
      >
        <Heart
          size={18}
          className={`${isWishlisted ? 'fill-rose-500 text-rose-500' : 'transition-colors'}`}
        />
      </button>

      {/* Product Image Section */}
      <div className="aspect-square bg-slate-50 relative overflow-hidden flex-shrink-0">
        <Link to={`/home/products/${product.id}`} className="block w-full h-full cursor-pointer">
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              !product.inStock ? 'opacity-60 grayscale-[40%]' : ''
            }`}
          />
        </Link>
        
        {/* Quick Actions Hover Drawer */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 pointer-events-none">
          {product.inStock && (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart?.(product); }}
              className="p-3 bg-white text-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 cursor-pointer pointer-events-auto"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
            className="p-3 bg-white text-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-[50ms] hover:scale-105 cursor-pointer pointer-events-auto"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4 flex-grow flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Vendor */}
          <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase block">
            {product.vendorName}
          </span>
          
          {/* Title */}
          <Link to={`/home/products/${product.id}`} className="block cursor-pointer">
            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors h-10">
              {product.title}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-xs font-extrabold">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-slate-400 font-semibold">
              ({product.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100/60">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs font-semibold text-slate-400 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-bold block pt-0.5">
              Excluding Taxes
            </span>
          </div>

          {product.inStock ? (
            <button
              onClick={() => onAddToCart?.(product)}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer flex items-center gap-1.5"
            >
              <ShoppingCart size={13} />
              <span>Add</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 bg-slate-50 text-slate-400 text-xs font-bold rounded-xl border border-slate-100">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceProductCard;
