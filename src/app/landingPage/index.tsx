import React from 'react';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import HeroSection from './sections/HeroSection';
import FeaturesSection from './sections/FeaturesSection';
import CategoriesSection from './sections/CategoriesSection';
import ProductsSection from './sections/ProductsSection';
import SellerBenefitsSection from './sections/SellerBenefitsSection';
import TestimonialsSection from './sections/TestimonialsSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Sticky Header navbar */}
      <Header />

      {/* Main Sections flow */}
      <main className="flex-grow">
        {/* ID 'home' is mapped inside HeroSection */}
        <HeroSection />

        {/* ID 'features' is mapped inside FeaturesSection */}
        <FeaturesSection />

        {/* ID 'categories' is mapped inside CategoriesSection */}
        <CategoriesSection />

        {/* ID 'products' is mapped inside ProductsSection */}
        <ProductsSection />

        {/* ID 'become-seller' is mapped inside SellerBenefitsSection */}
        <SellerBenefitsSection />

        {/* Testimonials Review section */}
        <TestimonialsSection />

        {/* ID 'faq' is mapped inside FAQSection */}
        <FAQSection />

        {/* Call-to-action registration section */}
        <CTASection />
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
