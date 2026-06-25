import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import productsReducer from './slices/productsSlice';
import addressesReducer from './slices/addressesSlice';
import ordersReducer from './slices/ordersSlice';
import dashboardReducer from './slices/dashboardSlice';
import sellerProductsReducer from './slices/sellerProductsSlice';
import productCreateReducer from './slices/productCreateSlice';
import sellerOrdersReducer from './slices/sellerOrdersSlice';
import inventoryReducer from './slices/inventorySlice';
import sellerCustomersReducer from './slices/sellerCustomersSlice';
import sellerReviewsReducer from './slices/sellerReviewsSlice';
import sellerCouponsReducer from './slices/sellerCouponsSlice';
import sellerWalletReducer from './slices/sellerWalletSlice';
import sellerNotificationsReducer from './slices/sellerNotificationsSlice';
import sellerSettingsReducer from './slices/sellerSettingsSlice';
import adminReducer from './slices/adminSlice';
import { sellerApi } from './services/sellerApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    notifications: notificationReducer,
    products: productsReducer,
    addresses: addressesReducer,
    orders: ordersReducer,
    dashboard: dashboardReducer,
    sellerProducts: sellerProductsReducer,
    productCreate: productCreateReducer,
    sellerOrders: sellerOrdersReducer,
    inventory: inventoryReducer,
    sellerCustomers: sellerCustomersReducer,
    sellerReviews: sellerReviewsReducer,
    sellerCoupons: sellerCouponsReducer,
    sellerWallet: sellerWalletReducer,
    sellerNotifications: sellerNotificationsReducer,
    sellerSettings: sellerSettingsReducer,
    admin: adminReducer,
    [sellerApi.reducerPath]: sellerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sellerApi.middleware),
});

// RootState and AppDispatch types derived from the store structure
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom typed hooks to be used instead of plain useDispatch and useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

