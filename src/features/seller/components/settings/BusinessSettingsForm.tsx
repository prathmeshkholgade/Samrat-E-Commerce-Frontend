import React from 'react';
import FormField from '../products/form/FormField';

interface BusinessSettingsFormProps {
  gst: string;
  pan: string;
  taxConfig: number;
  onFieldChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export const BusinessSettingsForm: React.FC<BusinessSettingsFormProps> = ({
  gst,
  pan,
  taxConfig,
  onFieldChange,
  errors,
}) => {
  return (
    <div className="space-y-5 text-left max-w-2xl">
      <FormField label="GSTIN (Goods and Services Tax Identification Number)" required error={errors?.gst}>
        <input
          type="text"
          value={gst}
          onChange={(e) => onFieldChange('gst', e.target.value.toUpperCase())}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono font-bold text-slate-850"
          placeholder="e.g. 24AAACS1234A1Z5"
          maxLength={15}
        />
      </FormField>

      <FormField label="PAN (Permanent Account Number)" required error={errors?.pan}>
        <input
          type="text"
          value={pan}
          onChange={(e) => onFieldChange('pan', e.target.value.toUpperCase())}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono font-bold text-slate-850"
          placeholder="e.g. AAACS1234A"
          maxLength={10}
        />
      </FormField>

      <FormField label="Standard Tax / GST Rate (%)" required>
        <select
          value={taxConfig}
          onChange={(e) => onFieldChange('taxConfig', Number(e.target.value))}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-850"
        >
          <option value={0}>0% (Tax Exempt / Nil Rated)</option>
          <option value={5}>5% GST</option>
          <option value={12}>12% GST</option>
          <option value={18}>18% GST (Standard Rate)</option>
          <option value={28}>28% GST (Luxury / demerit goods)</option>
        </select>
      </FormField>
    </div>
  );
};

export default BusinessSettingsForm;
