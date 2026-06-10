import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { updateStepData } from '../../../../../../store/slices/productCreateSlice';
import FormField from '../form/FormField';

interface Step3PricingProps {
  errors: Record<string, string>;
}

export const Step3Pricing: React.FC<Step3PricingProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { sellingPrice, mrp, discount, tax } = useAppSelector(
    (state) => state.productCreate.formData
  );

  const handleUpdate = (fields: Partial<typeof import('../../../store/slices/productCreateSlice').default>) => {
    dispatch(updateStepData(fields));
  };

  // Auto-calculate discount percentage if sellingPrice and mrp are provided
  useEffect(() => {
    const sPrice = parseFloat(sellingPrice);
    const mPrice = parseFloat(mrp);
    
    if (!isNaN(sPrice) && !isNaN(mPrice) && mPrice > 0 && sPrice <= mPrice) {
      const computedDiscount = Math.round(((mPrice - sPrice) / mPrice) * 100);
      if (discount !== computedDiscount.toString() && computedDiscount >= 0) {
        handleUpdate({ discount: computedDiscount.toString() });
      }
    }
  }, [sellingPrice, mrp]);

  const handleDiscountChange = (val: string) => {
    handleUpdate({ discount: val });
    const discPercent = parseFloat(val);
    const mPrice = parseFloat(mrp);
    if (!isNaN(discPercent) && !isNaN(mPrice) && mPrice > 0 && discPercent >= 0 && discPercent <= 100) {
      const computedSPrice = (mPrice * (1 - discPercent / 100)).toFixed(2);
      handleUpdate({ sellingPrice: computedSPrice });
    }
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs text-left">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 3: Pricing Configuration</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Specify selling rates, maximum retail rates, discount ratios and tax codes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* MRP */}
        <FormField label="Maximum Retail Price (MRP) *" error={errors.mrp} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <span className="text-slate-450 text-xs font-black mr-1.5">$</span>
            <input
              type="text"
              value={mrp}
              onChange={(e) => handleUpdate({ mrp: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
        </FormField>

        {/* Selling Price */}
        <FormField label="Selling Price *" error={errors.sellingPrice} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <span className="text-slate-450 text-xs font-black mr-1.5">$</span>
            <input
              type="text"
              value={sellingPrice}
              onChange={(e) => handleUpdate({ sellingPrice: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
        </FormField>

        {/* Discount */}
        <FormField label="Discount Ratio (%)" error={errors.discount} helpText="Auto-computed when MRP & Selling Price are set">
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <input
              type="text"
              value={discount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0"
            />
            <span className="text-slate-450 text-xs font-black ml-1.5">%</span>
          </div>
        </FormField>

        {/* Tax */}
        <FormField label="Tax Category (%)" error={errors.tax} required>
          <select
            value={tax}
            onChange={(e) => handleUpdate({ tax: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-10"
          >
            <option value="0">0% (GST Exempt)</option>
            <option value="5">5% (GST Lower)</option>
            <option value="12">12% (GST Standard-1)</option>
            <option value="18">18% (GST Standard-2)</option>
            <option value="28">28% (GST Luxury/Demerit)</option>
          </select>
        </FormField>

      </div>

      {/* Live calculation info box */}
      {parseFloat(mrp) > 0 && parseFloat(sellingPrice) > 0 && (
        <div className="bg-slate-50 border border-slate-150/40 rounded-2xl p-4 text-xs font-bold text-slate-600 space-y-2 mt-4">
          <h4 className="text-[10px] font-black uppercase text-indigo-650 tracking-wider">Calculations breakdown</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 font-semibold text-slate-750">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Discount Saved</span>
              <span className="text-slate-900 font-black">
                ${(parseFloat(mrp) - parseFloat(sellingPrice)).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Discount Ratio</span>
              <span className="text-emerald-700 font-black">
                {discount || '0'}% Off
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">GST Amount Included</span>
              <span className="text-slate-900">
                ${((parseFloat(sellingPrice) * parseFloat(tax)) / 100).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block">Base Price Excl. Tax</span>
              <span className="text-slate-900 font-black">
                ${(parseFloat(sellingPrice) / (1 + parseFloat(tax) / 100)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Step3Pricing;
