import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import SectionTitle from '../../../shared/components/SectionTitle';
import ProductCard from '../../../shared/components/ProductCard';
import { apiService } from '../../../features/landingPage/apiService';
import type { Product } from '../../../shared/types';

export const ProductsSection: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // API Integration Hook: fetch products from `/api/products?featured=true`
        const data = await apiService.getFeaturedProducts();

        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to retrieve catalog products.');
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (id: string) => {
    // API Integration Hook: POST /api/cart/add { productId: id }
    console.log(`Product ${id} added to cart`);
  };

  const handleAddToWishlist = (id: string) => {
    console.log(`Product ${id} added to wishlist`);
  };

  const handleQuickView = (id: string) => {
    console.log(`Quick view for product ${id}`);
  };

  return (
    <section id="products" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Featured Products"
          subtitle="Handpicked premium selections from our verified local vendors"
          align="center"
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="space-y-4 animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-800 aspect-square rounded-xl w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-850">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-red-500 font-semibold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <ShoppingBag className="mx-auto h-12 w-12 text-slate-350 mb-3" />
            <p className="font-semibold text-lg">No products found</p>
          </div>
        ) : (
          /* Products Grid List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
