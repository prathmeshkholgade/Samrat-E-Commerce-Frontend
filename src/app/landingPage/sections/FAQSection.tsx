import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import SectionTitle from '../../../shared/components/SectionTitle';
import { faqData } from '../../../shared/data/mockData';
import type { FAQItem } from '../../../shared/types';

export const FAQSection: React.FC = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1'); // Default open first item

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Title */}
        <SectionTitle
          badge="Frequently Asked Questions"
          title="Got Questions? We Have Answers"
          subtitle="Everything you need to know about purchasing products, registering store accounts, and managing order payouts."
          align="center"
        />

        {/* Accordion List */}
        <div className="space-y-4">
          {faqData.map((faq: FAQItem) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-all duration-300"
              >
                {/* Header button click trigger */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left font-bold text-slate-850 dark:text-white text-base md:text-lg focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-start gap-3.5 pr-4">
                    <HelpCircle size={20} className="text-indigo-650 dark:text-indigo-400 mt-1 flex-shrink-0" />
                    <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {faq.question}
                    </span>
                  </div>

                  {/* Chevron rotate indicator */}
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''
                      }`}
                  />
                </button>

                {/* Collapsible Answer Body */}
                <div
                  className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 border-t border-slate-50 dark:border-slate-850' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
                >
                  <p className="p-5 md:p-6 text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
