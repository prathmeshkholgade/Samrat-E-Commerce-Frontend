import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import Stepper from '../../shared/components/Stepper';
import { OnboardingProvider } from './OnboardingContext';

export const SellerOnboardingScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Calculate active stepper index based on current path
  const getStepIndex = () => {
    const path = location.pathname;
    if (path.endsWith('/step-1')) return 0;
    if (path.endsWith('/step-2')) return 1;
    if (path.endsWith('/step-3')) return 2;
    return 3; // success view or default fallback
  };

  const currentStep = getStepIndex();

  const steps = [
    { title: 'Business Info', description: 'Personal & business contact details' },
    { title: 'Store Details', description: 'Store logo, banners, support info' },
    { title: 'Verification', description: 'Bank parameters & documentation' },
  ];

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 bg-white p-6 rounded-3xl shadow-xs">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Samrat Seller Onboarding
              </span>
            </div>

            {currentStep < 3 && (
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <ShieldCheck size={14} className="text-indigo-600" />
                Secure Enterprise Portal
              </span>
            )}
          </div>

          {/* Stepper (Only show in step 1-3) */}
          {currentStep < 3 && (
            <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-xs">
              <Stepper steps={steps} currentStep={currentStep} />
            </div>
          )}

          {/* Render Step Sub-page */}
          <Outlet />
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default SellerOnboardingScreen;
