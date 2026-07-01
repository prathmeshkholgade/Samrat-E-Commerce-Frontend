import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import PhoneInput from '../../shared/components/PhoneInput';
import Upload from '../../shared/components/Upload';
import Button from '../../shared/components/Button';
import { useOnboarding } from './OnboardingContext';

export const Step2StoreDetails: React.FC = () => {
  const navigate = useNavigate();
  const { storeDetails, setStoreDetails, submitStep2 } = useOnboarding();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categories = ['Electronics', 'Fashion & Apparel', 'Groceries & Foods', 'Home & Living', 'Beauty & Cosmetics', 'Sports & Fitness', 'Other'];

  const validateStep2 = () => {
    const errors: { [key: string]: string } = {};
    if (!storeDetails.storeDescription.trim()) errors.storeDescription = 'Store description is required.';
    if (!storeDetails.supportEmail.trim() || !/\S+@\S+\.\S+/.test(storeDetails.supportEmail)) {
      errors.supportEmail = 'Valid support email is required.';
    }
    if (!storeDetails.supportPhone || storeDetails.supportPhone.length < 8) {
      errors.supportPhone = 'Valid support contact number is required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep2()) {
      setIsLoading(true);
      setErrorMsg('');
      try {
        await submitStep2();
        navigate('/seller/onboarding/step-3');
      } catch (err: any) {
        setErrorMsg(err.response?.data?.message || err.message || 'Failed to save store details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Card>
        <form onSubmit={handleNext} className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Store Profile</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Design your marketplace presence and provide support contacts.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-semibold text-rose-600">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Upload
                label="Store Logo"
                accept="image/*"
                value={storeDetails.storeLogo}
                onChange={(file) => setStoreDetails({ ...storeDetails, storeLogo: file })}
                error={formErrors.storeLogo}
              />

              <Upload
                label="Store Banner"
                accept="image/*"
                value={storeDetails.storeBanner}
                onChange={(file) => setStoreDetails({ ...storeDetails, storeBanner: file })}
                error={formErrors.storeBanner}
                helperText="High-res PNG/JPG up to 10MB recommended"
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-slate-700">Store Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your shop catalog, special items, and shipping capabilities..."
                  value={storeDetails.storeDescription}
                  onChange={(e) => setStoreDetails({ ...storeDetails, storeDescription: e.target.value })}
                  className={`
                    block w-full rounded-xl border bg-white text-slate-900 
                    placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600
                    px-4 py-3
                    ${formErrors.storeDescription ? 'border-rose-400 focus:ring-rose-500/10' : 'border-slate-200'}
                  `}
                />
                {formErrors.storeDescription && (
                  <p className="text-xs font-medium text-rose-600">{formErrors.storeDescription}</p>
                )}
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-sm font-semibold text-slate-700">Business Category</label>
                <select
                  value={storeDetails.businessCategory}
                  onChange={(e) => setStoreDetails({ ...storeDetails, businessCategory: e.target.value })}
                  className="
                    block w-full rounded-xl border border-slate-200 bg-white text-slate-900 
                    px-4 py-3.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600
                  "
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
            <Input
              label="Support Email"
              type="email"
              placeholder="support@mystore.com"
              value={storeDetails.supportEmail}
              onChange={(e) => setStoreDetails({ ...storeDetails, supportEmail: e.target.value })}
              error={formErrors.supportEmail}
              required
            />

            <PhoneInput
              label="Support Contact Number"
              value={storeDetails.supportPhone}
              dialCode={storeDetails.supportPhoneDialCode}
              onPhoneChange={(phone) => setStoreDetails({ ...storeDetails, supportPhone: phone })}
              onDialCodeChange={(code) => setStoreDetails({ ...storeDetails, supportPhoneDialCode: code })}
              error={formErrors.supportPhone}
              required
            />

            <Input
              label="Website URL (Optional)"
              type="url"
              placeholder="https://mystore.com"
              value={storeDetails.websiteUrl || ''}
              onChange={(e) => setStoreDetails({ ...storeDetails, websiteUrl: e.target.value })}
              error={formErrors.websiteUrl}
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller/onboarding/step-1')}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>

            <Button type="submit" variant="primary" isLoading={isLoading} className="flex items-center gap-1.5">
              <span>Continue</span>
              <ArrowRight size={16} />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Step2StoreDetails;
