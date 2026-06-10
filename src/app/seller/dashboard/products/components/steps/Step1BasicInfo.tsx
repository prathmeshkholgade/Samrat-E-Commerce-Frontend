import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { updateStepData } from '../../../../../../store/slices/productCreateSlice';
import FormField from '../form/FormField';

interface Step1BasicInfoProps {
  errors: Record<string, string>;
}

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { name, shortDescription, fullDescription, category, subcategory, brand } = useAppSelector(
    (state) => state.productCreate.formData
  );

  const categories = ['Electronics', 'Fashion', 'Grocery', 'Home & Kitchen', 'Beauty & Skincare', 'Sports & Fitness'];

  const handleUpdate = (fields: Partial<typeof import('../../../store/slices/productCreateSlice').default>) => {
    dispatch(updateStepData(fields));
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 1: Basic Information Registry</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Configure your product brand, name, catalog categories and descriptions.</p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <FormField label="Product Name" error={errors.name} required>
          <input
            type="text"
            value={name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
            placeholder="e.g. VoltX Smart Bluetooth Headset"
          />
        </FormField>

        {/* Short Description */}
        <FormField label="Short Description" error={errors.shortDescription}>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => handleUpdate({ shortDescription: e.target.value })}
            className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
            placeholder="A single line summary, e.g. Noise cancelling wireless sport headset with 30hr playback."
          />
        </FormField>

        {/* Category, Subcategory, Brand Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <FormField label="Category" error={errors.category} required>
            <select
              value={category}
              onChange={(e) => handleUpdate({ category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all cursor-pointer h-10"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          {/* Subcategory */}
          <FormField label="Subcategory" error={errors.subcategory}>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => handleUpdate({ subcategory: e.target.value })}
              className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
              placeholder="e.g. Audio Accessories"
            />
          </FormField>

          {/* Brand */}
          <FormField label="Brand" error={errors.brand}>
            <input
              type="text"
              value={brand}
              onChange={(e) => handleUpdate({ brand: e.target.value })}
              className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
              placeholder="e.g. VoltX Audio"
            />
          </FormField>
        </div>

        {/* Full Description */}
        <FormField label="Full Description" error={errors.fullDescription}>
          <textarea
            value={fullDescription}
            onChange={(e) => handleUpdate({ fullDescription: e.target.value })}
            rows={5}
            className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400 resize-none"
            placeholder="Detailed features, pack lists, dimensions, guidelines, or materials specification..."
          />
        </FormField>
      </div>

    </div>
  );
};

export default Step1BasicInfo;
