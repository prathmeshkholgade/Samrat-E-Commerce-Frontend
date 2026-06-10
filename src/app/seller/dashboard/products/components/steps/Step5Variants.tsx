import React, { useState } from 'react';
import { Plus, X, Trash2, Sliders, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import { updateStepData, type WizardVariant } from '../../../../../../store/slices/productCreateSlice';

interface Step5VariantsProps {
  errors: Record<string, string>;
}

export const Step5Variants: React.FC<Step5VariantsProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { formData } = useAppSelector((state) => state.productCreate);
  const { variants, variantConfig, sku, sellingPrice, stock } = formData;

  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [materialInput, setMaterialInput] = useState('');

  const handleUpdate = (fields: Partial<typeof formData>) => {
    dispatch(updateStepData(fields));
  };

  // Helper to merge and generate combinations, preserving existing customizations if name matches
  const regenerateVariants = (newConfig: typeof variantConfig) => {
    const { sizes, colors, materials } = newConfig;
    
    if (sizes.length === 0 && colors.length === 0 && materials.length === 0) {
      handleUpdate({ variants: [], variantConfig: newConfig });
      return;
    }

    const sArr = sizes.length > 0 ? sizes : [null];
    const cArr = colors.length > 0 ? colors : [null];
    const mArr = materials.length > 0 ? materials : [null];

    const newVariants: WizardVariant[] = [];
    const baseSku = sku || 'PROD';

    sArr.forEach((s) => {
      cArr.forEach((c) => {
        mArr.forEach((m) => {
          const parts = [s, c, m].filter((p): p is string => p !== null);
          const name = parts.join(' / ');
          
          // Check if variant combination already exists to preserve custom price/stock/sku
          const existing = variants.find((v) => v.name === name);
          if (existing) {
            newVariants.push(existing);
          } else {
            const skuSuffix = parts.map((p) => p.slice(0, 3).toUpperCase().replace(/\s+/g, '')).join('-');
            newVariants.push({
              id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name,
              sku: `${baseSku}-${skuSuffix}`,
              price: parseFloat(sellingPrice) || 0,
              stock: parseInt(stock, 10) || 0,
            });
          }
        });
      });
    });

    handleUpdate({ variants: newVariants, variantConfig: newConfig });
  };

  const addOption = (type: 'sizes' | 'colors' | 'materials', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const currentList = variantConfig[type];
    if (currentList.includes(trimmed)) return;

    const updatedConfig = {
      ...variantConfig,
      [type]: [...currentList, trimmed],
    };
    regenerateVariants(updatedConfig);
  };

  const removeOption = (type: 'sizes' | 'colors' | 'materials', value: string) => {
    const updatedConfig = {
      ...variantConfig,
      [type]: variantConfig[type].filter((item) => item !== value),
    };
    regenerateVariants(updatedConfig);
  };

  const handleVariantFieldChange = (id: string, field: keyof WizardVariant, value: string) => {
    const updatedVariants = variants.map((v) => {
      if (v.id === id) {
        let finalVal: any = value;
        if (field === 'price') {
          finalVal = parseFloat(value) || 0;
        } else if (field === 'stock') {
          finalVal = parseInt(value, 10) || 0;
        }
        return {
          ...v,
          [field]: finalVal,
        };
      }
      return v;
    });
    handleUpdate({ variants: updatedVariants });
  };

  const handleDeleteVariant = (id: string) => {
    const updated = variants.filter((v) => v.id !== id);
    handleUpdate({ variants: updated });
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs text-left">
      
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 leading-none">
            <Sliders size={16} className="text-indigo-650" />
            <span>Step 5: Dynamic Product Variants Builder</span>
          </h3>
          <p className="text-[10px] text-slate-450 font-semibold mt-1">Configure size, color, or material options to automatically generate catalog variants.</p>
        </div>
      </div>

      {/* Option Input Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sizes */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Sizes (e.g. S, M, L, XL)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={sizeInput}
              onChange={(e) => setSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOption('sizes', sizeInput);
                  setSizeInput('');
                }
              }}
              className="flex-grow bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400 h-9"
              placeholder="Type size and press Add"
            />
            <button
              type="button"
              onClick={() => {
                addOption('sizes', sizeInput);
                setSizeInput('');
              }}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {variantConfig.sizes.map((sz) => (
              <span key={sz} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/40 text-[10px] font-bold text-slate-700 px-2.5 py-1 rounded-lg">
                <span>{sz}</span>
                <button type="button" onClick={() => removeOption('sizes', sz)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Colors (e.g. Red, Blue, Black)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOption('colors', colorInput);
                  setColorInput('');
                }
              }}
              className="flex-grow bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400 h-9"
              placeholder="Type color and press Add"
            />
            <button
              type="button"
              onClick={() => {
                addOption('colors', colorInput);
                setColorInput('');
              }}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {variantConfig.colors.map((col) => (
              <span key={col} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/40 text-[10px] font-bold text-slate-700 px-2.5 py-1 rounded-lg">
                <span>{col}</span>
                <button type="button" onClick={() => removeOption('colors', col)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Materials */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Materials (e.g. Leather, Cotton)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={materialInput}
              onChange={(e) => setMaterialInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addOption('materials', materialInput);
                  setMaterialInput('');
                }
              }}
              className="flex-grow bg-slate-50 border rounded-xl px-3.5 py-2 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400 h-9"
              placeholder="Type material and press Add"
            />
            <button
              type="button"
              onClick={() => {
                addOption('materials', materialInput);
                setMaterialInput('');
              }}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Add
            </button>
          </div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {variantConfig.materials.map((mat) => (
              <span key={mat} className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200/40 text-[10px] font-bold text-slate-700 px-2.5 py-1 rounded-lg">
                <span>{mat}</span>
                <button type="button" onClick={() => removeOption('materials', mat)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Generated Combinations Grid list */}
      {variants.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <h4 className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Dynamic Combinations Registry</h4>
            <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100/30 text-[9px] font-bold text-indigo-700">
              {variants.length} combinations generated
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-150/45 rounded-2xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150/40 text-[9px] font-black text-slate-400 uppercase select-none">
                  <th className="py-3 px-4">Variant Attributes</th>
                  <th className="py-3 px-4">Variant SKU *</th>
                  <th className="py-3 px-4">Price ($) *</th>
                  <th className="py-3 px-4 text-center">Stock Level *</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-650">
                {variants.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Attributes name */}
                    <td className="py-3 px-4 text-slate-900 font-extrabold select-none">
                      {v.name}
                    </td>

                    {/* Variant SKU */}
                    <td className="py-2.5 px-4 w-48">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => handleVariantFieldChange(v.id, 'sku', e.target.value.toUpperCase())}
                        className="w-full bg-slate-50/70 border border-slate-200/50 focus:border-indigo-500 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-750 font-mono outline-hidden uppercase"
                      />
                    </td>

                    {/* Variant Price */}
                    <td className="py-2.5 px-4 w-36">
                      <div className="relative flex items-center bg-slate-50/70 border border-slate-200/50 focus-within:border-indigo-500 rounded-lg px-2 py-1">
                        <span className="text-slate-450 text-[10px] mr-1">$</span>
                        <input
                          type="text"
                          value={v.price}
                          onChange={(e) => handleVariantFieldChange(v.id, 'price', e.target.value)}
                          className="bg-transparent text-[11px] font-bold text-slate-700 outline-hidden w-full"
                        />
                      </div>
                    </td>

                    {/* Variant Stock */}
                    <td className="py-2.5 px-4 w-32">
                      <input
                        type="text"
                        value={v.stock}
                        onChange={(e) => handleVariantFieldChange(v.id, 'stock', e.target.value)}
                        className="w-full bg-slate-50/70 border border-slate-200/50 focus:border-indigo-500 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-700 text-center outline-hidden"
                      />
                    </td>

                    {/* Delete item */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteVariant(v.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-100/50 transition-all cursor-pointer"
                        title="Delete variant combination"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Warning Tip */}
      {variants.length === 0 && (
        <div className="bg-slate-50 border border-slate-200/40 p-4 rounded-2xl flex gap-3 text-xs font-semibold text-slate-500 leading-normal">
          <Info size={16} className="text-indigo-600 flex-shrink-0" />
          <p>
            You have not specified any sizes, colors, or materials. The product will be created as a **Single Standard Variant** using the primary price and SKU values set in Steps 3 and 4. Add attributes above to create multiple options.
          </p>
        </div>
      )}

    </div>
  );
};

export default Step5Variants;
