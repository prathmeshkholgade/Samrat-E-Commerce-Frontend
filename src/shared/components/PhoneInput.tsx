import React, { forwardRef, useState } from 'react';
import type { InputProps } from './Input';

interface CountryCode {
  code: string;
  flag: string;
  dialCode: string;
}

const COUNTRY_CODES: CountryCode[] = [
  { code: 'IN', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', flag: '🇬🇧', dialCode: '+44' },
  { code: 'AE', flag: '🇦🇪', dialCode: '+971' },
  { code: 'SG', flag: '🇸🇬', dialCode: '+65' },
];

export interface PhoneInputProps extends Omit<InputProps, 'leftIcon' | 'onChange' | 'value'> {
  value: string;
  dialCode: string;
  onPhoneChange: (phone: string) => void;
  onDialCodeChange: (dialCode: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      label = 'Mobile Number',
      value,
      dialCode,
      onPhoneChange,
      onDialCodeChange,
      error,
      disabled,
      placeholder = '98765 43210',
      ...props
    },
    ref
  ) => {
    const [selectedCode, setSelectedCode] = useState(dialCode || '+91');

    const handleDialCodeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      setSelectedCode(val);
      onDialCodeChange(val);
    };

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Keep only numeric characters
      const cleanVal = e.target.value.replace(/\D/g, '');
      onPhoneChange(cleanVal);
    };

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        
        <div className="flex rounded-xl shadow-xs">
          {/* Custom Select for country flag and code */}
          <div className="relative flex-shrink-0">
            <select
              value={selectedCode}
              onChange={handleDialCodeSelect}
              disabled={disabled}
              className="
                h-full rounded-l-xl border-y border-l border-slate-200 bg-slate-50 text-slate-700
                pl-3.5 pr-8 py-3 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600
                disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer appearance-none
              "
              style={{ minWidth: '90px' }}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c.code} value={c.dialCode}>
                  {c.flag} {c.dialCode}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Number Input */}
          <input
            ref={ref}
            type="tel"
            disabled={disabled}
            value={value}
            onChange={handlePhoneInput}
            placeholder={placeholder}
            className={`
              block w-full rounded-r-xl border-y border-r bg-white text-slate-900 
              placeholder-slate-400 text-sm transition-all duration-200
              focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600
              disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100
              px-4 py-3
              ${error ? 'border-rose-400 border-l focus:ring-rose-500/10 focus:border-rose-500' : 'border-slate-200'}
            `}
            {...props}
          />
        </div>

        {error && (
          <p className="text-xs font-medium text-rose-600 mt-1 animate-in fade-in-50 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
