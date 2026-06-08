import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Store } from 'lucide-react';
import Button from '../../../shared/components/Button';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white border-t border-slate-100 dark:bg-slate-950 dark:border-slate-900">
      {/* Decorative gradient glowing mesh rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl -z-10 dark:bg-indigo-950/10" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-violet-200/15 rounded-full blur-3xl -z-10 dark:bg-violet-950/10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">

        {/* Badge */}
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 uppercase dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400">
          Start Your Journey
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
          Ready to Grow Your E-Commerce Business? <br />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Join Samrat Marketplace Today.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Whether you want to shop high-quality verified products from top regional brands or launch your own merchant business with weekly payouts, we have you covered.
        </p>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Seller Action */}
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/seller/onboarding')}
            className="flex items-center gap-2 w-full sm:w-auto shadow-lg shadow-indigo-100 dark:shadow-none bg-gradient-to-r from-indigo-550 to-violet-550 hover:from-indigo-650 hover:to-violet-650 border-0"
          >
            <Store size={18} />
            <span>Create Seller Store</span>
            <ArrowRight size={16} />
          </Button>

          {/* Buyer Action */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleScrollTo('products')}
            className="border-slate-200 hover:bg-slate-100 text-slate-700 w-full sm:w-auto flex items-center justify-center gap-2 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-350"
          >
            <ShoppingCart size={18} />
            <span>Start Shopping</span>
          </Button>
        </div>

        {/* Small Trust Markers */}
        <div className="pt-6 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">✓ No credit card required</span>
          <span className="flex items-center gap-1.5">✓ Flat 5% seller commissions</span>
          <span className="flex items-center gap-1.5">✓ 30-day customer warranty</span>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
