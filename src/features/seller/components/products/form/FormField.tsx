import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helpText?: string;
  children: React.ReactElement;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  helpText,
  children,
}) => {
  // Clone element to inject custom error styling if needed
  const child = React.cloneElement(children as React.ReactElement<any>, {
    className: `${(children.props as any).className || ''} ${
      error
        ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
    }`,
  });

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          {label} {required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {helpText && (
          <span className="text-[9px] font-bold text-slate-400" title={helpText}>
            ⓘ Info
          </span>
        )}
      </div>

      {child}

      {error && (
        <span className="text-[10px] text-rose-600 font-bold animate-in fade-in slide-in-from-top-1 duration-150">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
