import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center items-center justify-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col mb-12 md:mb-16 max-w-3xl ${alignClass} ${align === 'center' ? 'mx-auto' : ''} ${className}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase mb-3 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/30">
          {badge}
        </span>
      )}
      
      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h2>
      
      {subtitle && (
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
