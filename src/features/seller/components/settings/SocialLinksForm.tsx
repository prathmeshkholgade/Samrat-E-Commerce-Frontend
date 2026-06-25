import React from 'react';
import FormField from '../products/form/FormField';

interface SocialLinksFormProps {
  website: string;
  facebook: string;
  instagram: string;
  onFieldChange: (field: string, value: string) => void;
}

export const SocialLinksForm: React.FC<SocialLinksFormProps> = ({
  website,
  facebook,
  instagram,
  onFieldChange,
}) => {
  return (
    <div className="space-y-5 text-left max-w-2xl">
      <FormField label="Store Website Link">
        <input
          type="url"
          value={website}
          onChange={(e) => onFieldChange('website', e.target.value)}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono text-slate-850"
          placeholder="e.g. https://www.samratenterprises.com"
        />
      </FormField>

      <FormField label="Facebook Profile Link">
        <input
          type="url"
          value={facebook}
          onChange={(e) => onFieldChange('facebook', e.target.value)}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono text-slate-850"
          placeholder="e.g. https://www.facebook.com/samratenterprises"
        />
      </FormField>

      <FormField label="Instagram Profile Link">
        <input
          type="url"
          value={instagram}
          onChange={(e) => onFieldChange('instagram', e.target.value)}
          className="w-full bg-white border border-slate-205 rounded-xl px-3.5 py-2 text-xs outline-hidden focus:border-indigo-500 font-mono text-slate-850"
          placeholder="e.g. https://www.instagram.com/samratenterprises"
        />
      </FormField>
    </div>
  );
};

export default SocialLinksForm;
