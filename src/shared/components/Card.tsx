import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`
        bg-white border border-slate-100 rounded-3xl p-6 md:p-10
        shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-slate-100/60
        transition-all duration-300 ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
