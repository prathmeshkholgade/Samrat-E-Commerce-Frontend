import React from 'react';
import FormField from '../products/form/FormField';

interface StoreInfoFormProps {
  storeName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const StoreInfoForm: React.FC<StoreInfoFormProps> = ({
  storeName,
  description,
  logoUrl,
  bannerUrl,
  onFieldChange,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
      
      {/* Forms inputs panel */}
      <div className="lg:col-span-2 space-y-5">
        <FormField label="Store Name" required error={errors?.storeName}>
          <input
            type="text"
            value={storeName}
            onChange={(e) => onFieldChange('storeName', e.target.value)}
            className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-extrabold text-slate-850"
            placeholder="e.g. Samrat Enterprises"
          />
        </FormField>

        <FormField label="Store Profile Description">
          <textarea
            value={description}
            onChange={(e) => onFieldChange('description', e.target.value)}
            rows={4}
            className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-850"
            placeholder="Introduce your store, products, and specialties to marketplace buyers..."
          />
        </FormField>

        <FormField label="Store Logo Image URL">
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => onFieldChange('logoUrl', e.target.value)}
            className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono"
            placeholder="https://..."
          />
        </FormField>

        <FormField label="Store Banner Image URL">
          <input
            type="text"
            value={bannerUrl}
            onChange={(e) => onFieldChange('bannerUrl', e.target.value)}
            className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono"
            placeholder="https://..."
          />
        </FormField>
      </div>

      {/* Live Profile Card Preview panel */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Live Storefront Preview</span>
        <div className="border border-slate-150/50 rounded-3xl overflow-hidden bg-white shadow-3xs flex flex-col justify-between h-[240px]">
          {/* Banner Container */}
          <div className="h-24 w-full relative bg-slate-100 border-b border-slate-100 flex-shrink-0">
            <img
              src={bannerUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800'}
              alt="Banner Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800';
              }}
            />
            {/* Logo container */}
            <div className="absolute -bottom-6 left-6 w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center">
              <img
                src={logoUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150'}
                alt="Logo Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=150';
                }}
              />
            </div>
          </div>

          {/* Profile details */}
          <div className="p-6 pt-8 flex-grow flex flex-col justify-between text-left">
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-850 truncate">{storeName || 'My Store'}</h4>
              <p className="text-[10px] text-slate-400 font-semibold line-clamp-3 leading-normal">
                {description || 'No store profile description provided yet. Introduce your business profile to attract buyers.'}
              </p>
            </div>
            <span className="text-[8px] font-black text-indigo-650 uppercase tracking-widest block select-none border border-indigo-100 px-2 py-0.5 rounded bg-indigo-50/50 self-start leading-none mt-2">
              Samrat Registered Merchant
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreInfoForm;
