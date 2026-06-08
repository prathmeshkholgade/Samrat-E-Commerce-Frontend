import React from 'react';
import { Check } from 'lucide-react';
import Button from './Button';

export interface TimelineStep {
  label: string;
  description?: string;
  status: 'completed' | 'active' | 'upcoming';
}

interface SuccessProps {
  title: string;
  description: string;
  timelineSteps?: TimelineStep[];
  primaryBtnText: string;
  primaryBtnOnClick: () => void;
  secondaryBtnText?: string;
  secondaryBtnOnClick?: () => void;
}

export const Success: React.FC<SuccessProps> = ({
  title,
  description,
  timelineSteps,
  primaryBtnText,
  primaryBtnOnClick,
  secondaryBtnText,
  secondaryBtnOnClick,
}) => {
  return (
    <div className="w-full flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Animated Success Badge */}
      <div className="relative">
        {/* Pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping duration-1000" />
        <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-100/50">
          <Check size={36} strokeWidth={3} className="animate-in zoom-in duration-300 delay-100" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-3 max-w-md mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* Status Timeline */}
      {timelineSteps && timelineSteps.length > 0 && (
        <div className="w-full max-w-md bg-slate-50 border border-slate-100 rounded-3xl p-6 sm:p-8 text-left space-y-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Application Status Timeline
          </h3>
          
          <div className="relative pl-6 space-y-6 border-l-2 border-slate-200/60 ml-2.5">
            {timelineSteps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isActive = step.status === 'active';

              return (
                <div key={index} className="relative group">
                  {/* Step node indicator */}
                  <div
                    className={`
                      absolute -left-[32px] top-0.5 w-4.5 h-4.5 rounded-full border-2 transition-all duration-300
                      ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-50 shadow-xs'
                          : isActive
                          ? 'bg-white border-indigo-600 ring-4 ring-indigo-50 shadow-xs'
                          : 'bg-white border-slate-300'
                      }
                    `}
                  />
                  
                  <div>
                    <h4
                      className={`
                        text-sm font-bold transition-colors duration-300
                        ${isCompleted ? 'text-slate-800' : isActive ? 'text-indigo-600' : 'text-slate-400'}
                      `}
                    >
                      {step.label}
                    </h4>
                    {step.description && (
                      <p
                        className={`
                          text-xs mt-0.5 leading-relaxed font-medium
                          ${isCompleted || isActive ? 'text-slate-500' : 'text-slate-400'}
                        `}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
        <Button variant="primary" size="md" fullWidth onClick={primaryBtnOnClick}>
          {primaryBtnText}
        </Button>
        
        {secondaryBtnText && secondaryBtnOnClick && (
          <Button variant="outline" size="md" fullWidth onClick={secondaryBtnOnClick}>
            {secondaryBtnText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Success;
