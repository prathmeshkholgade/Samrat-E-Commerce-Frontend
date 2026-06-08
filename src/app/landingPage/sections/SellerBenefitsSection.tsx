import React from 'react';
import {
  ArrowUpRight,
  Database,
  BarChart3,
  Percent,
  Coins,
  Globe,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SectionTitle from '../../../shared/components/SectionTitle';
import Button from '../../../shared/components/Button';
import { sellerBenefits } from '../../../shared/data/mockData';
import type { FeatureItem } from '../../../shared/types';

// Map icon string to Lucide component
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  ArrowUpRight: ArrowUpRight,
  Database: Database,
  BarChart3: BarChart3,
  Percent: Percent,
  Coins: Coins,
  Globe: Globe,
};

export const SellerBenefitsSection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section id="become-seller" className="py-20 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Side: Mockup Vendor Portal Dashboard Preview */}
          <div className="lg:col-span-5 order-2 lg:order-1 flex items-center justify-center">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl rounded-3xl p-6 overflow-hidden">
              {/* Header inside Mockup */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
                    S
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-white leading-none">Seller Center</h4>
                    <span className="text-[10px] text-slate-400">Veridian Store</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">
                  Weekly Report
                </span>
              </div>

              {/* Stats Inside Mockup */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3.5 border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Total Revenue</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">$14,280.50</span>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">+18.4% vs last week</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-3.5 border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-bold text-slate-400 block mb-0.5">Orders Processed</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">284</span>
                  <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">100% shipping rate</span>
                </div>
              </div>

              {/* Simulated Progress / Graphic Indicator */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Commission Shared</span>
                  <span className="font-extrabold text-slate-850 dark:text-white">5% flat</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full w-[95%]" />
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />
                  <span>Next weekly payout scheduled for Friday, June 12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Benefits Details */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <SectionTitle
              badge="Partner With Us"
              title="Grow Your Store With Samrat"
              subtitle="Get access to powerful seller tools, lower commission brackets, and absolute control over your stock, pricing, and payouts."
              align="left"
              className="mb-8 md:mb-8 max-w-none"
            />

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
              {sellerBenefits.map((benefit: FeatureItem) => {
                const Icon = iconMap[benefit.iconName] || BarChart3;
                return (
                  <div key={benefit.id} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Merchant Action CTA */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/seller/onboarding')}
                className="flex items-center gap-2 shadow shadow-indigo-100 dark:shadow-none"
              >
                <span>Register Store Now</span>
                <ArrowRight size={16} />
              </Button>
              <Button
                variant="ghost"
                size="md"
                className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SellerBenefitsSection;
