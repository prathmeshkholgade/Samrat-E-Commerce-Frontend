import React from 'react';
import { ArrowRight, Users, ShoppingBag, CheckCircle2, Heart } from 'lucide-react';
import Button from '../../../shared/components/Button';
import { platformStats } from '../../../shared/data/mockData';
import type { StatItem } from '../../../shared/types';

// Mapping for dynamic stats icons
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  Users: Users,
  ShoppingBag: ShoppingBag,
  CheckCircle2: CheckCircle2,
  Heart: Heart,
};

export const HeroSection: React.FC = () => {
  // Navigation scrolling triggers
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
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-white dark:bg-slate-950">
      {/* Visual background gradient blurs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-3xl -z-10 dark:bg-indigo-950/20" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl -z-10 dark:bg-purple-950/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content Left Section */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Multi-Vendor Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              Your Marketplace for <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Premium Goods</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Buy directly from thousands of verified local and global vendors. Enjoy secure transactions, fast delivery, and hassle-free returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleScrollTo('products')}
                className="w-full sm:w-auto group"
              >
                Explore Products
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => handleScrollTo('become-seller')}
                className="bg-white hover:bg-slate-50 w-full sm:w-auto dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                Become a Seller
              </Button>
            </div>
          </div>

          {/* Hero Illustration Wrapper */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <img className='' src="/banner.png" alt="" />
          </div>
        </div>

        {/* Platform Statistics Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-100/50 border border-slate-100 dark:shadow-none dark:border-slate-800">
          {platformStats.map((stat: StatItem) => {
            const Icon = iconMap[stat.iconName] || ShoppingBag;
            return (
              <div
                key={stat.id}
                className="flex items-center gap-4 border-r border-slate-100 last:border-0 dark:border-slate-800 p-2 md:p-4"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Icon size={24} />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
