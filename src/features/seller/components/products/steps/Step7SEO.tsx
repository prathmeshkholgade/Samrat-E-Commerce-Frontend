import React from 'react';
import { Globe } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateStepData } from '../../../../../store/slices/productCreateSlice';
import FormField from '../form/FormField';

interface Step7SEOProps {
  errors: Record<string, string>;
}

export const Step7SEO: React.FC<Step7SEOProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { name, shortDescription, seoTitle, seoDescription } = useAppSelector(
    (state) => state.productCreate.formData
  );

  const handleUpdate = (fields: Partial<typeof import('../../../../../store/slices/productCreateSlice').default>) => {
    dispatch(updateStepData(fields));
  };

  // Compute fallback values for preview
  const displayTitle = seoTitle.trim() || name.trim() || 'Product Name Preview';
  const displayDesc = seoDescription.trim() || shortDescription.trim() || 'Provide a compelling meta description to improve click-through rates on search engines...';
  const slug = (name.trim() || 'product-url').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs text-left">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 7: Search Engine Optimization (SEO)</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Configure search meta tags to maximize visibility on Google, Bing and other engines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Fields Column */}
        <div className="space-y-4">
          
          {/* SEO Title */}
          <FormField label="SEO Title Tags" error={errors.seoTitle} helpText="Max 60 characters recommended">
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => handleUpdate({ seoTitle: e.target.value })}
              maxLength={70}
              className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
              placeholder="e.g. Buy Premium Wireless Headphones Online | Samrat Store"
            />
          </FormField>

          {/* SEO Description */}
          <FormField label="Meta Description Tags" error={errors.seoDescription} helpText="Max 160 characters recommended">
            <textarea
              value={seoDescription}
              onChange={(e) => handleUpdate({ seoDescription: e.target.value })}
              rows={4}
              maxLength={200}
              className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400 resize-none"
              placeholder="e.g. Purchase our active noise-cancelling headphones today. Enjoy 40 hours battery backup, custom EQ profiles, and nationwide express shipping."
            />
          </FormField>

        </div>

        {/* Live Preview Column */}
        <div className="space-y-3 bg-slate-50/50 border border-slate-150/50 rounded-2xl p-5">
          <div className="flex items-center gap-1.5 text-slate-450 text-[10px] font-black uppercase tracking-wider">
            <Globe size={13} />
            <span>Search Snippet Live Preview</span>
          </div>

          {/* Simulated Google Search Result */}
          <div className="bg-white border border-slate-150/40 rounded-xl p-4 shadow-3xs space-y-1.5 leading-normal font-sans">
            {/* Title */}
            <h4 className="text-[#1a0dab] font-medium text-base hover:underline cursor-pointer line-clamp-1">
              {displayTitle}
            </h4>
            
            {/* URL */}
            <div className="text-[#202124] text-xs flex items-center gap-1">
              <span className="text-slate-400">https://samrat.com</span>
              <span className="text-slate-350">›</span>
              <span className="text-slate-400">products</span>
              <span className="text-slate-350">›</span>
              <span className="text-slate-500 font-semibold truncate max-w-[150px]">{slug}</span>
            </div>

            {/* Description */}
            <p className="text-[#4d5156] text-xs font-normal line-clamp-2 leading-relaxed">
              {displayDesc}
            </p>
          </div>
          
          <div className="text-[9px] text-slate-400 font-semibold leading-normal pl-1">
            * This represents a simulated visual rendering of how your product listing may appear in web search queries.
          </div>
        </div>

      </div>

    </div>
  );
};

export default Step7SEO;
