import { Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "../app/landingPage";
import LoginScreen from "../app/customer/loginScreen";
import SignupScreen from "../app/customer/signupScreen";
import ForgotPasswordScreen from "../app/customer/forgotPassword";
import SellerOnboardingScreen from "../app/seller/onboardingScreen";
import Step1BusinessInfo from "../app/seller/Step1BusinessInfo";
import Step2StoreDetails from "../app/seller/Step2StoreDetails";
import Step3BankDetails from "../app/seller/Step3BankDetails";
import OnboardingSuccess from "../app/seller/OnboardingSuccess";
import MarketplaceLayout from "../shared/layouts/MarketplaceLayout";
import MarketplaceHome from "../app/customer/MarketplaceHome";
import ProductListing from "../app/customer/ProductListing";
import ProductDetails from "../app/customer/ProductDetails";
import ShoppingCart from "../app/customer/ShoppingCart";
import AddressManagement from "../app/customer/AddressManagement";
import CheckoutPage from "../app/customer/CheckoutPage";
import MyOrders from "../app/customer/MyOrders";
import SellerLayout from "../app/seller/dashboard/SellerLayout";
import DashboardHome from "../app/seller/dashboard/DashboardHome";
import ProductsList from "../app/seller/dashboard/products/ProductsList";
import CreateProduct from "../app/seller/dashboard/products/CreateProduct";
import OrdersList from "../app/seller/dashboard/orders/OrdersList";
import OrderDetailPage from "../app/seller/dashboard/orders/OrderDetailPage";
import InventoryList from "../app/seller/dashboard/inventory/InventoryList";
import CustomersList from "../app/seller/dashboard/customers/CustomersList";
import CustomerDetailPage from "../app/seller/dashboard/customers/CustomerDetailPage";
import ReviewsList from "../app/seller/dashboard/reviews/ReviewsList";
import CouponsList from "../app/seller/dashboard/coupons/CouponsList";
import WalletList from "../app/seller/dashboard/wallet/WalletList";
import NotificationsScreen from "../app/seller/dashboard/notifications/NotificationsScreen";
import AnalyticsScreen from "../app/seller/dashboard/analytics/AnalyticsScreen";
import SettingsScreen from "../app/seller/dashboard/settings/SettingsScreen";
import AdminLayout from "../app/admin/AdminLayout";
import AdminDashboard from "../app/admin/AdminDashboard";
import AdminSellersPage from "../app/admin/AdminSellersPage";
import AdminSellerDetailsPage from "../app/admin/AdminSellerDetailsPage";
import AdminProductsPage from "../app/admin/AdminProductsPage";
import AdminProductReviewPage from "../app/admin/AdminProductReviewPage";
import { AdminOrdersPage } from "../app/admin/AdminOrdersPage";
import { AdminOrderDetailPage } from "../app/admin/AdminOrderDetailPage";
import { AdminCustomersPage } from "../app/admin/AdminCustomersPage";
import { AdminCustomerDetailPage } from "../app/admin/AdminCustomerDetailPage";
import { AdminCategoriesPage } from "../app/admin/AdminCategoriesPage";
import { AdminAnalyticsPage } from "../app/admin/AdminAnalyticsPage";
import { AdminSettingsPage } from "../app/admin/AdminSettingsPage";

function AppRoutes() {
  return (
    // done with prompt 4 start from 5
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

      {/* Customer Marketplace Layout */}
      <Route path="/home" element={<MarketplaceLayout />}>
        <Route index element={<MarketplaceHome />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<ShoppingCart />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="addresses" element={<AddressManagement />} />
        <Route path="orders" element={<MyOrders />} />
      </Route>

      {/* Seller Dashboard */}
      <Route path="/seller" element={<SellerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="products" element={<ProductsList />} />
        <Route path="products/create" element={<CreateProduct />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="customers" element={<CustomersList />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="reviews" element={<ReviewsList />} />
        <Route path="coupons" element={<CouponsList />} />
        <Route path="wallet" element={<WalletList />} />
        <Route path="notifications" element={<NotificationsScreen />} />
        <Route path="analytics" element={<AnalyticsScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>

      {/* Multi-page Onboarding Stepper */}
      <Route path="/seller/onboarding" element={<SellerOnboardingScreen />}>
        <Route index element={<Navigate to="step-1" replace />} />
        <Route path="step-1" element={<Step1BusinessInfo />} />
        <Route path="step-2" element={<Step2StoreDetails />} />
        <Route path="step-3" element={<Step3BankDetails />} />
        <Route path="success" element={<OnboardingSuccess />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminSellersPage />} />
        <Route path="sellers/:id" element={<AdminSellerDetailsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/:id" element={<AdminProductReviewPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="customers/:id" element={<AdminCustomerDetailPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="analytics" element={<AdminAnalyticsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;