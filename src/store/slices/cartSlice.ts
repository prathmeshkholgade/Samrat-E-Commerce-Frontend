import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../shared/types';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  appliedCoupon: { code: string; rate: number } | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  appliedCoupon: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(
      state,
      action: PayloadAction<Product | { product: Product; quantity: number; color?: string; size?: string }>
    ) {
      let product: Product;
      let quantity = 1;
      let color: string | undefined;
      let size: string | undefined;

      if ('product' in action.payload) {
        product = action.payload.product;
        quantity = action.payload.quantity;
        color = action.payload.color;
        size = action.payload.size;
      } else {
        product = action.payload;
      }

      const existingItem = state.items.find(
        item =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          selectedColor: color,
          selectedSize: size,
        });
      }
      
      state.totalQuantity += quantity;
      state.totalAmount += product.price * quantity;
    },
    removeFromCart(
      state,
      action: PayloadAction<string | { productId: string; color?: string; size?: string }>
    ) {
      let id: string;
      let color: string | undefined;
      let size: string | undefined;

      if (typeof action.payload === 'string') {
        id = action.payload;
      } else {
        id = action.payload.productId;
        color = action.payload.color;
        size = action.payload.size;
      }

      const existingItem = state.items.find(
        item =>
          item.product.id === id &&
          (color === undefined || item.selectedColor === color) &&
          (size === undefined || item.selectedSize === size)
      );
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.product.price * existingItem.quantity;
        state.items = state.items.filter(
          item =>
            !(
              item.product.id === id &&
              (color === undefined || item.selectedColor === color) &&
              (size === undefined || item.selectedSize === size)
            )
        );
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number; color?: string; size?: string }>
    ) {
      const { productId, quantity, color, size } = action.payload;
      const item = state.items.find(
        item =>
          item.product.id === productId &&
          (color === undefined || item.selectedColor === color) &&
          (size === undefined || item.selectedSize === size)
      );
      
      if (item && quantity > 0) {
        const diff = quantity - item.quantity;
        item.quantity = quantity;
        state.totalQuantity += diff;
        state.totalAmount += item.product.price * diff;
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.appliedCoupon = null;
    },
    applyCoupon(state, action: PayloadAction<{ code: string; rate: number }>) {
      state.appliedCoupon = action.payload;
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;

