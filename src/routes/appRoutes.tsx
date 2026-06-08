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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/forgot-password" element={<ForgotPasswordScreen />} />

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