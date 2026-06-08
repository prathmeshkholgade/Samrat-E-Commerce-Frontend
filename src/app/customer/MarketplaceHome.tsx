import React, { useState } from 'react';
import { Star, Sparkles, TrendingUp, Award, Clock, Heart, Flame, X, ShoppingCart } from 'lucide-react';
import MarketplaceProductCard from '../../shared/components/MarketplaceProductCard';
import SectionTitle from '../../shared/components/SectionTitle';
import { featuredCategories } from '../../shared/data/mockData';
import type { Product } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToRecentlyViewed } from '../../store/slices/productsSlice';

export const MarketplaceHome: React.FC = () => {
  const dispatch = useAppDispatch();

  // Redux States
  const products = useAppSelector(state => state.products.items);
  const recentlyViewed = useAppSelector(state => state.products.recentlyViewed);
  const wishlistItems = useAppSelector(state => state.wishlist.items);

  // Component States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Group products into sections based on properties/tags
  const trendingProducts = products.filter(p => p.rating >= 4.7 || p.tags?.includes('Popular')).slice(0, 4);
  const newArrivals = products.filter(p => p.tags?.includes('New') || p.id === 'prod-3').slice(0, 4);
  const recommendedProducts = products.filter(p => p.rating >= 4.8 || p.tags?.includes('Top Rated')).slice(0, 4);
  const bestSellers = products.filter(p => p.tags?.includes('Best Seller') || p.id === 'prod-1').slice(0, 4);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = (product: Product) => {
    dispatch(toggleWishlist(product));
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    // Dispatch to Redux Recently Viewed history
    dispatch(addToRecentlyViewed(product));
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      
      {/* 1. Featured Categories Section */}
      <section className="space-y-6">
        <SectionTitle
          title="Featured Categories"
          subtitle="Explore curated collections across our marketplace departments"
          align="left"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredCategories.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white border border-slate-100/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-2xs hover:shadow-lg hover:border-slate-200/50 transition-all duration-300 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-50 relative mb-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {cat.count.toLocaleString()} items
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Trending Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <SectionTitle
            title="Trending Products"
            subtitle="The most popular selections purchased this week"
            align="left"
            className="mb-0! md:mb-0!"
          />
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <TrendingUp size={16} />
            <span>View All</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            return (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
              />
            );
          })}
        </div>
      </section>

      {/* 3. New Arrivals Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Explore fresh catalog listings from our verified local vendors"
            align="left"
            className="mb-0! md:mb-0!"
          />
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <Sparkles size={16} />
            <span>View Newest</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            return (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Recommended Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <SectionTitle
            title="Recommended Products"
            subtitle="Personalized recommendations matching your marketplace catalog views"
            align="left"
            className="mb-0! md:mb-0!"
          />
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <Flame size={16} />
            <span>Show More</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            return (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
              />
            );
          })}
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <SectionTitle
            title="Best Sellers"
            subtitle="Top performing products across all category divisions"
            align="left"
            className="mb-0! md:mb-0!"
          />
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-700 cursor-pointer">
            <Award size={16} />
            <span>Explore Sellers</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => {
            const isWishlisted = wishlistItems.some(item => item.id === product.id);
            return (
              <MarketplaceProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted}
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                onQuickView={handleQuickView}
              />
            );
          })}
        </div>
      </section>

      {/* 6. Recently Viewed Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <SectionTitle
            title="Recently Viewed"
            subtitle="Items you viewed recently during this active browsing session"
            align="left"
            className="mb-0! md:mb-0!"
          />
          {recentlyViewed.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-700 cursor-pointer">
              <Clock size={16} />
              <span>Clear History</span>
            </div>
          )}
        </div>
        
        {recentlyViewed.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-10 bg-white border border-slate-100 rounded-2xl shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-350">
              <Clock size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Your history is empty</h4>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">Products you view will populate this row in real-time.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-300">
            {recentlyViewed.map((product) => {
              const isWishlisted = wishlistItems.some(item => item.id === product.id);
              return (
                <MarketplaceProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onQuickView={handleQuickView}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* 7. Quick View Modal Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-white/95 border border-slate-100 hover:bg-slate-100 text-slate-400 hover:text-slate-850 cursor-pointer shadow-sm"
            >
              <X size={18} />
            </button>

            <div className="w-full md:w-1/2 bg-slate-50 relative aspect-square flex-shrink-0 md:h-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              {!selectedProduct.inStock && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-between flex-grow space-y-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-indigo-650 bg-indigo-50 border border-indigo-100/50 rounded-md px-2 py-0.5 uppercase block w-fit">
                    {selectedProduct.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug mt-2">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    Uploaded by <span className="text-slate-650 hover:underline">{selectedProduct.vendorName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 text-xs font-extrabold">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span>{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-slate-450 font-bold">({selectedProduct.reviewsCount} verified reviews)</span>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="flex items-baseline gap-2 pt-2 border-t border-slate-100">
                  <span className="text-2xl font-black text-slate-900">
                    ${selectedProduct.price.toFixed(2)}
                  </span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ${selectedProduct.originalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 rounded px-1.5 py-0.5">
                        {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                {selectedProduct.inStock ? (
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-grow py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <ShoppingCart size={15} />
                    <span>Add to Cart</span>
                  </button>
                ) : (
                  <span className="flex-grow py-3.5 bg-slate-50 border border-slate-150 text-slate-400 text-center text-xs font-bold rounded-xl">
                    Item Currently Out of Stock
                  </span>
                )}

                <button
                  onClick={() => handleToggleWishlist(selectedProduct)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    wishlistItems.some(item => item.id === selectedProduct.id)
                      ? 'bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-800'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={16} className={wishlistItems.some(item => item.id === selectedProduct.id) ? 'fill-rose-500' : ''} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplaceHome;
