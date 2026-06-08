import React from 'react';
import { Smartphone, Shirt, Apple, Home, Sparkles, Dumbbell } from 'lucide-react';
import SectionTitle from '../../../shared/components/SectionTitle';
import { featuredCategories } from '../../../shared/data/mockData';
import type { Category } from '../../../shared/types';

// Map icon string to Lucide component
const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  Smartphone: Smartphone,
  Shirt: Shirt,
  Apple: Apple,
  Home: Home,
  Sparkles: Sparkles,
  Dumbbell: Dumbbell,
};

export const CategoriesSection: React.FC = () => {
  return (
    <section id="categories" className="py-20 md:py-28 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section title header */}
        <SectionTitle
          badge="Featured Categories"
          title="Browse by Department"
          subtitle="Explore thousands of curated products catalogued across our multi-vendor ecosystem."
          align="center"
        />

        {/* Categories Grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featuredCategories.map((category: Category) => {
            const Icon = iconMap[category.iconName] || Smartphone;
            return (
              <a
                key={category.id}
                href={`#products`} // Filter anchor placeholder for now
                className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-end p-5"
              >
                {/* Background image overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Glass gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent z-10" />
                </div>

                {/* Category metadata details */}
                <div className="relative z-20 space-y-2 text-white">
                  {/* Category icon */}
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-colors duration-300">
                    <Icon size={20} />
                  </div>

                  <h3 className="font-extrabold text-lg tracking-tight leading-tight">
                    {category.name}
                  </h3>

                  <p className="text-xs text-slate-300 font-medium">
                    {category.count.toLocaleString()} products
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
