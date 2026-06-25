import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../store';
import { updateStepData } from '../../../../../store/slices/productCreateSlice';
import FormField from '../form/FormField';

interface Step6ShippingProps {
  errors: Record<string, string>;
}

export const Step6Shipping: React.FC<Step6ShippingProps> = ({ errors }) => {
  const dispatch = useAppDispatch();
  const { weight, length, width, height } = useAppSelector(
    (state) => state.productCreate.formData
  );

  const handleUpdate = (fields: Partial<typeof import('../../../../../store/slices/productCreateSlice').default>) => {
    dispatch(updateStepData(fields));
  };

  return (
    <div className="space-y-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-3xs text-left">
      
      {/* Step Header */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Step 6: Shipping & Logistics Specs</h3>
        <p className="text-[10px] text-slate-450 font-semibold mt-1">Configure package physical parameters to help courier partners calculate delivery costs.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Weight */}
        <FormField label="Package Weight (kg) *" error={errors.weight} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <input
              type="text"
              value={weight}
              onChange={(e) => handleUpdate({ weight: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0.00"
            />
            <span className="text-slate-450 text-xs font-black ml-1.5">kg</span>
          </div>
        </FormField>

        {/* Length */}
        <FormField label="Box Length (cm) *" error={errors.length} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <input
              type="text"
              value={length}
              onChange={(e) => handleUpdate({ length: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0"
            />
            <span className="text-slate-450 text-xs font-black ml-1.5">cm</span>
          </div>
        </FormField>

        {/* Width */}
        <FormField label="Box Width (cm) *" error={errors.width} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <input
              type="text"
              value={width}
              onChange={(e) => handleUpdate({ width: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0"
            />
            <span className="text-slate-450 text-xs font-black ml-1.5">cm</span>
          </div>
        </FormField>

        {/* Height */}
        <FormField label="Box Height (cm) *" error={errors.height} required>
          <div className="relative flex items-center bg-slate-50 border rounded-xl px-3.5 py-2.5 transition-all">
            <input
              type="text"
              value={height}
              onChange={(e) => handleUpdate({ height: e.target.value })}
              className="bg-transparent text-xs font-bold text-slate-700 outline-hidden w-full placeholder:text-slate-400"
              placeholder="0"
            />
            <span className="text-slate-450 text-xs font-black ml-1.5">cm</span>
          </div>
        </FormField>

      </div>

    </div>
  );
};

export default Step6Shipping;
