import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateStepData } from '../../../../../store/slices/productCreateSlice';
import FormField from '../form/FormField';

interface Step4InventoryProps {
  errors: Record<string, string>;
}

export const Step4Inventory: React.FC<Step4InventoryProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { sku, stock, lowStockThreshold } = useAppSelector(
    (state) => state.productCreate.formData
  );

  const handleUpdate = (fields: Partial<typeof import('../../../../../store/slices/productCreateSlice').default>) => {
    dispatch(updateStepData(fields));
  };

  const handleAutoGenerateSKU = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const skuCode = `SAM-${Date.now().toString().slice(-4)}-${random}`;
    handleUpdate({ sku: skuCode });
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs text-left">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 4: Inventory Logistics</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Setup unique SKU identifiers, stock quantities and low stock thresholds.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
        
        {/* SKU */}
        <div className="flex flex-col gap-1.5 w-full">
          <FormField label="SKU Identifier (Stock Keeping Unit) *" error={errors.sku} required>
            <div className="flex gap-2">
              <input
                type="text"
                value={sku}
                onChange={(e) => handleUpdate({ sku: e.target.value.toUpperCase() })}
                className="flex-grow bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-750 font-mono outline-hidden transition-all uppercase placeholder:text-slate-400"
                placeholder="e.g. MON-CLW-008"
              />
              <button
                type="button"
                onClick={handleAutoGenerateSKU}
                className="py-2.5 px-4 bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                Generate
              </button>
            </div>
          </FormField>
        </div>

        {/* Stock Quantity */}
        <FormField label="Initial Stock Quantity *" error={errors.stock} required>
          <input
            type="text"
            value={stock}
            onChange={(e) => handleUpdate({ stock: e.target.value })}
            className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
            placeholder="e.g. 50"
          />
        </FormField>

        {/* Low Stock Threshold */}
        <FormField label="Low Stock Warning Limit" error={errors.lowStockThreshold} required>
          <input
            type="text"
            value={lowStockThreshold}
            onChange={(e) => handleUpdate({ lowStockThreshold: e.target.value })}
            className="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-hidden transition-all placeholder:text-slate-400"
            placeholder="e.g. 5"
          />
        </FormField>

      </div>

    </div>
  );
};

export default Step4Inventory;
