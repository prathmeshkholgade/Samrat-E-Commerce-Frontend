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

      {/* Multi-page Onboarding Stepper */}
      <Route path="/seller/onboarding" element={<SellerOnboardingScreen />}>
        <Route index element={<Navigate to="step-1" replace />} />
        <Route path="step-1" element={<Step1BusinessInfo />} />
        <Route path="step-2" element={<Step2StoreDetails />} />
        <Route path="step-3" element={<Step3BankDetails />} />
        <Route path="success" element={<OnboardingSuccess />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;