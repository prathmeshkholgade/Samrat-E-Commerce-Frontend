import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import type { Product } from '../types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
  onQuickView?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
}) => {
  const {
    id,
    title,
    price,
    originalPrice,
    rating,
    reviewsCount,
    image,
    category,
    vendorName,
    inStock,
    tags,
  } = product;

  // Calculate discount percentage if original price is set
  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge Overlays (Best Seller, Sale, Discount) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {tags && tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-indigo-600 rounded-md shadow-sm"
            >
              {tag}
            </span>
          ))}
          {discountPercentage > 0 && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-rose-500 rounded-md shadow-sm">
              -{discountPercentage}% Off
            </span>
          )}
          {!inStock && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-white bg-slate-600 rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
          <button
            onClick={() => onAddToWishlist?.(id)}
            aria-label="Add to wishlist"
            className="w-10 h-10 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer active:scale-90"
          >
            <Heart size={18} />
          </button>
          
          <button
            onClick={() => onQuickView?.(id)}
            aria-label="Quick view"
            className="w-10 h-10 bg-white hover:bg-indigo-600 hover:text-white text-slate-700 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer active:scale-90"
          >
            <Eye size={18} />
          </button>
        </div>
      </div>

      {/* Product Info Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Vendor */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
            {category}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
            by {vendorName}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-800 dark:text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>

        {/* Ratings Review Star */}
        <div className="flex items-center gap-1.5 mb-3.5 mt-auto">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < Math.floor(rating) ? 'currentColor' : 'transparent'}
                className={i < Math.floor(rating) ? '' : 'text-slate-200 dark:text-slate-700'}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {rating.toFixed(1)} ({reviewsCount})
          </span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
          </div>

          <Button
            variant={inStock ? 'primary' : 'secondary'}
            size="sm"
            disabled={!inStock}
            onClick={() => onAddToCart?.(id)}
            className="flex items-center gap-1.5 rounded-lg py-2 px-3 text-xs"
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
