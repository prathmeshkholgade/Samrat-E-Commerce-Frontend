import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Success, { type TimelineStep } from '../../shared/components/Success';
import { useOnboarding } from './OnboardingContext';

export const OnboardingSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { applicationId, clearOnboarding } = useOnboarding();

  // If no applicationId is found, redirect back to step 1
  useEffect(() => {
    if (!applicationId) {
      navigate('/seller/onboarding/step-1');
    }
  }, [applicationId, navigate]);

  const successTimeline: TimelineStep[] = [
    { label: 'Submitted', description: 'Onboarding application successfully submitted', status: 'completed' },
    { label: 'Under Review', description: 'Validation team checking compliance certificates', status: 'active' },
    { label: 'Verification', description: 'Bank mandate check & address setup', status: 'upcoming' },
    { label: 'Approved', description: 'Store catalog enabled on Samrat Enterprises', status: 'upcoming' },
  ];

  const handleHomeRedirect = () => {
    clearOnboarding(); // clean cache
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 animate-in fade-in duration-300">
      <Success
        title="Your Seller Account Application Has Been Submitted"
        description="Our onboarding compliance team will verify your submitted business certificates and bank details within 24-48 hours."
        timelineSteps={successTimeline}
        primaryBtnText="Track Application Status"
        primaryBtnOnClick={() => alert(`Tracking Application Reference: ${applicationId}`)}
        secondaryBtnText="Back To Home"
        secondaryBtnOnClick={handleHomeRedirect}
      />
    </div>
  );
};

export default OnboardingSuccess;
