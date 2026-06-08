import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-4">
      {/* Mobile view */}
      <div className="md:hidden flex items-center justify-between px-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Step {currentStep + 1} of {steps.length}
          </span>
          <h2 className="text-base font-bold text-slate-800">
            {steps[currentStep].title}
          </h2>
        </div>
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-6 bg-indigo-600'
                  : index < currentStep
                  ? 'w-2 bg-emerald-500'
                  : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-start justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={index} className="flex-1 relative flex flex-col items-center group">
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div
                  className="
                    absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-slate-100 -z-10
                    overflow-hidden
                  "
                >
                  <div
                    className={`h-full bg-emerald-500 transition-all duration-500 ease-out`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}

              {/* Step indicator node */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2
                  transition-all duration-300 shadow-xs
                  ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-100/50'
                      : isActive
                      ? 'bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50/70 shadow-indigo-100/30'
                      : 'bg-white border-slate-200 text-slate-400'
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} className="animate-in zoom-in duration-300" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="text-center mt-3 max-w-[150px]">
                <p
                  className={`
                    text-sm font-semibold transition-colors duration-300
                    ${isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'}
                  `}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-slate-400 mt-0.5 font-medium leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
