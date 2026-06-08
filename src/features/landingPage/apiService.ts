import type { Product, Category } from '../../shared/types';
import { featuredCategories, featuredProducts } from '../../shared/data/mockData';

/**
 * Service to simulate backend API calls for the e-commerce platform.
 * Replace the implementations here with fetch/axios calls once the backend is ready.
 */

// Simulated network delay (in milliseconds)
const NETWORK_DELAY = 600;

export const apiService = {
  /**
   * Fetches all featured categories.
   * // API Integration Hook: GET /api/categories
   */
  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Backend integration example:
        // const response = await fetch('/api/categories');
        // return await response.json();
        resolve([...featuredCategories]);
      }, NETWORK_DELAY);
    });
  },

  /**
   * Fetches products flagged for the landing page.
   * // API Integration Hook: GET /api/products?featured=true
   */
  async getFeaturedProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Backend integration example:
        // const response = await fetch('/api/products?featured=true');
        // return await response.json();
        const featured = featuredProducts.filter((product) => product.isFeatured);
        resolve(featured);
      }, NETWORK_DELAY);
    });
  },

  /**
   * Fetches all products.
   * // API Integration Hook: GET /api/products
   */
  async getAllProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Backend integration example:
        // const response = await fetch('/api/products');
        // return await response.json();
        resolve([...featuredProducts]);
      }, NETWORK_DELAY);
    });
  },

  /**
   * Fetches products filterable by category.
   * // API Integration Hook: GET /api/products?category=:categoryName
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Backend integration example:
        // const response = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`);
        // return await response.json();
        const filtered = featuredProducts.filter(
          (product) => product.category.toLowerCase() === categoryName.toLowerCase()
        );
        resolve(filtered);
      }, NETWORK_DELAY);
    });
  },

  /**
   * Fetches a single product details.
   * // API Integration Hook: GET /api/products/:id
   */
  async getProductById(id: string): Promise<Product | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Backend integration example:
        // const response = await fetch(`/api/products/${id}`);
        // return await response.json();
        const product = featuredProducts.find((p) => p.id === id) || null;
        resolve(product);
      }, NETWORK_DELAY);
    });
  },
};
