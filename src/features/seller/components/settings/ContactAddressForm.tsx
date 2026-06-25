import React from 'react';
import FormField from '../products/form/FormField';

interface ContactAddressFormProps {
  email: string;
  phone: string;
  address: string;
  onFieldChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const ContactAddressForm: React.FC<ContactAddressFormProps> = ({
  email,
  phone,
  address,
  onFieldChange,
  errors,
}) => {
  return (
    <div className="space-y-5 text-left max-w-2xl">
      <FormField label="Email Address" required error={errors?.email}>
        <input
          type="email"
          value={email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-850"
          placeholder="e.g. partners@samratenterprises.com"
        />
      </FormField>

      <FormField label="Phone Number" required error={errors?.phone}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => onFieldChange('phone', e.target.value)}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-850"
          placeholder="e.g. +91 98765 43210"
        />
      </FormField>

      <FormField label="Business Address" required error={errors?.address}>
        <textarea
          value={address}
          onChange={(e) => onFieldChange('address', e.target.value)}
          rows={4}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-semibold text-slate-850"
          placeholder="e.g. Plot No. 42, Industrial Area, Sector 5..."
        />
      </FormField>
    </div>
  );
};

export default ContactAddressForm;
