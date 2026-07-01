import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Store } from 'lucide-react';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import PhoneInput from '../../shared/components/PhoneInput';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';
import { useOnboarding } from './OnboardingContext';

export const Step1BusinessInfo: React.FC = () => {
  const navigate = useNavigate();
  const { businessInfo, setBusinessInfo, submitStep1 } = useOnboarding();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const businessTypes = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'LLP', 'Other'];

  const validateStep1 = () => {
    const errors: { [key: string]: string } = {};
    if (!businessInfo.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!businessInfo.email.trim() || !/\S+@\S+\.\S+/.test(businessInfo.email)) errors.email = 'Valid Email is required.';
    if (!businessInfo.phone || businessInfo.phone.length < 8) errors.phone = 'Valid Mobile Number is required.';
    if (!businessInfo.storeName.trim()) errors.storeName = 'Store Name is required.';
    if (!businessInfo.businessName.trim()) errors.businessName = 'Business Name is required.';
    if (!businessInfo.panNumber.trim() || businessInfo.panNumber.length !== 10) {
      errors.panNumber = 'PAN Number must be 10 characters long.';
    }
    if (!businessInfo.password || businessInfo.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (businessInfo.password !== businessInfo.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setIsLoading(true);
      setErrorMsg('');
      try {
        await submitStep1();
        navigate('/seller/onboarding/step-2');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || err.message || 'Signup failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
      {/* Form Card (8 columns width) */}
      <div className="lg:col-span-8 w-full">
        <Card>
          <form onSubmit={handleNext} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Business Information</h2>
              <p className="text-xs font-semibold text-slate-400 mt-1">Register the contact person and legal entity names.</p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="Legal representative name"
                value={businessInfo.fullName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, fullName: e.target.value })}
                error={formErrors.fullName}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="work@company.com"
                value={businessInfo.email}
                onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                error={formErrors.email}
                required
              />

              <PhoneInput
                label="Mobile Number"
                value={businessInfo.phone}
                dialCode={businessInfo.dialCode}
                onPhoneChange={(phone) => setBusinessInfo({ ...businessInfo, phone })}
                onDialCodeChange={(dialCode) => setBusinessInfo({ ...businessInfo, dialCode })}
                error={formErrors.phone}
                required
              />

              <Input
                label="Store Name"
                placeholder="Samrat Electronics Store"
                value={businessInfo.storeName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, storeName: e.target.value })}
                error={formErrors.storeName}
                required
              />

              <Input
                label="Business Name"
                placeholder="Samrat Enterprises Ltd"
                value={businessInfo.businessName}
                onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                error={formErrors.businessName}
                required
              />

              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-slate-700">Business Type</label>
                <select
                  value={businessInfo.businessType}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                  className="
                    block w-full rounded-xl border border-slate-200 bg-white text-slate-900 
                    px-4 py-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600
                  "
                >
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="GST Number (Optional)"
                placeholder="22AAAAA0000A1Z5"
                value={businessInfo.gstNumber || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, gstNumber: e.target.value })}
                error={formErrors.gstNumber}
              />

              <Input
                label="PAN Number"
                placeholder="ABCDE1234F"
                value={businessInfo.panNumber}
                onChange={(e) => setBusinessInfo({ ...businessInfo, panNumber: e.target.value })}
                error={formErrors.panNumber}
                required
              />

              <PasswordInput
                label="Password"
                value={businessInfo.password || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, password: e.target.value })}
                error={formErrors.password}
                required
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="••••••••"
                value={businessInfo.confirmPassword || ''}
                onChange={(e) => setBusinessInfo({ ...businessInfo, confirmPassword: e.target.value })}
                error={formErrors.confirmPassword}
                required
              />
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <Button type="submit" variant="primary" isLoading={isLoading} className="flex items-center gap-1.5">
                <span>Continue</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Side Preview (4 columns width) */}
      <div className="lg:col-span-4 w-full sticky top-28 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Store Preview</h3>
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-100/40 space-y-6">
          <div className="w-full h-24 bg-gradient-to-tr from-indigo-550/10 to-violet-550/15 rounded-2xl flex items-center justify-center border border-indigo-50/50">
            <Store className="text-indigo-600/40" size={32} />
          </div>

          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mt-[-40px] shadow-sm">
              <Store size={24} />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-slate-800 truncate">
                {businessInfo.storeName || 'Your Shop Name'}
              </h4>
              <p className="text-xs text-indigo-600 font-bold mt-1">
                {businessInfo.businessType || 'Sole Proprietorship'}
              </p>
            </div>

            <p className="text-xs text-slate-400 font-semibold max-w-[200px] mx-auto leading-relaxed">
              Verification files, GST and PAN declarations will be validated under Samrat.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-left">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">KYC Status</span>
              <span className="text-xs font-bold text-amber-500 block mt-0.5">Pending info</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Catalog</span>
              <span className="text-xs font-bold text-slate-500 block mt-0.5">0 Active Items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BusinessInfo;
