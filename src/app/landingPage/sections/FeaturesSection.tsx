import React from 'react';
import {
  Truck,
  ShieldCheck,
  UserCheck,
  Tag,
  RotateCcw,
  UserPlus,
  Layers,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import SectionTitle from '../../../shared/components/SectionTitle';
import { chooseUsBenefits, howItWorksSteps } from '../../../shared/data/mockData';
import type { FeatureItem, StepItem } from '../../../shared/types';

// Map icon string to Lucide component
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  Truck: Truck,
  ShieldCheck: ShieldCheck,
  UserCheck: UserCheck,
  Tag: Tag,
  RotateCcw: RotateCcw,
  UserPlus: UserPlus,
  Layers: Layers,
  CreditCard: CreditCard,
  TrendingUp: TrendingUp,
};

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Part 1: Why Choose Us */}
        <div className="mb-24">
          <SectionTitle
            badge="Core Value Propositions"
            title="Why Shop & Sell With Us"
            subtitle="We provide a premium infrastructure that ensures seamless trade, buyer security, and rapid growth."
            align="center"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {chooseUsBenefits.map((benefit: FeatureItem) => {
              const Icon = iconMap[benefit.iconName] || ShieldCheck;
              return (
                <div
                  key={benefit.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg mb-2.5">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: How It Works */}
        <div>
          <SectionTitle
            badge="Platform Guide"
            title="How Our Platform Works"
            subtitle="Four simple steps to buy from verified stores or expand your commercial business online."
            align="center"
          />

          <div className="relative">
            {/* Step Connection Bar in Desktop */}
            <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-0.5 border-t-2 border-dashed border-slate-200 dark:border-slate-800 -z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
              {howItWorksSteps.map((step: StepItem) => {
                const Icon = iconMap[step.iconName] || UserPlus;
                return (
                  <div key={step.id} className="text-center group">
                    {/* Circle Icon Container */}
                    <div className="mx-auto w-24 h-24 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-850 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 relative">
                      <Icon size={32} />

                      {/* Step Number Badge */}
                      <span className="absolute top-0 right-0 w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-[11px] font-black text-white flex items-center justify-center shadow">
                        {step.stepNumber}
                      </span>
                    </div>

                    <h3 className="mt-6 font-extrabold text-slate-900 dark:text-white text-lg mb-2">
                      {step.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px] mx-auto">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
