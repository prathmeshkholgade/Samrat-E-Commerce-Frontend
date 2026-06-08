import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import Upload from '../../shared/components/Upload';
import Button from '../../shared/components/Button';
import { useOnboarding } from './OnboardingContext';

export const Step3BankDetails: React.FC = () => {
  const navigate = useNavigate();
  const { businessInfo, bankDetails, setBankDetails, submitApplication } = useOnboarding();
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateStep3 = () => {
    const errors: { [key: string]: string } = {};
    if (!bankDetails.panCardDoc) errors.panCardDoc = 'PAN Card copy is required.';
    if (!bankDetails.gstCertDoc && businessInfo.gstNumber) errors.gstCertDoc = 'GST Certificate is required as GST is declared.';
    if (!bankDetails.businessRegDoc) errors.businessRegDoc = 'Business registration copy is required.';
    if (!bankDetails.identityProofDoc) errors.identityProofDoc = 'Identity proof is required.';
    if (!bankDetails.accountHolderName.trim()) errors.accountHolderName = 'Account holder name is required.';
    if (!bankDetails.bankName.trim()) errors.bankName = 'Bank name is required.';
    if (!bankDetails.accountNumber.trim() || bankDetails.accountNumber.length < 9) {
      errors.accountNumber = 'Valid bank account number is required.';
    }
    if (!bankDetails.ifscCode.trim() || bankDetails.ifscCode.length !== 11) {
      errors.ifscCode = 'IFSC code must be 11 characters long.';
    }
    if (!bankDetails.acceptTerms) errors.acceptTerms = 'You must accept the terms and conditions.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      await submitApplication();
      navigate('/seller/onboarding/success');
    } catch (err: any) {
      alert(err.message || 'Submission failed. Please check files and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Verification & Payout Routing</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1">Upload files for KYC and enter bank payout parameters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Documents Upload Grid */}
            <div className="space-y-6">
              <Upload
                label="PAN Card Copy"
                accept="image/*,application/pdf"
                value={bankDetails.panCardDoc}
                onChange={(file) => setBankDetails({ ...bankDetails, panCardDoc: file })}
                error={formErrors.panCardDoc}
              />

              {businessInfo.gstNumber && (
                <Upload
                  label="GST Registration Certificate"
                  accept="image/*,application/pdf"
                  value={bankDetails.gstCertDoc}
                  onChange={(file) => setBankDetails({ ...bankDetails, gstCertDoc: file })}
                  error={formErrors.gstCertDoc}
                />
              )}

              <Upload
                label="Business Registration Certificate"
                accept="image/*,application/pdf"
                value={bankDetails.businessRegDoc}
                onChange={(file) => setBankDetails({ ...bankDetails, businessRegDoc: file })}
                error={formErrors.businessRegDoc}
              />

              <Upload
                label="Representative Identity Proof (Aadhaar / Passport)"
                accept="image/*,application/pdf"
                value={bankDetails.identityProofDoc}
                onChange={(file) => setBankDetails({ ...bankDetails, identityProofDoc: file })}
                error={formErrors.identityProofDoc}
              />
            </div>

            {/* Bank Fields and T&C Card panel */}
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Bank Account Particulars
              </h3>

              <Input
                label="Account Holder Name"
                placeholder="Name as in bank passbook"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                error={formErrors.accountHolderName}
                required
              />

              <Input
                label="Bank Name"
                placeholder="State Bank of India"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                error={formErrors.bankName}
                required
              />

              <Input
                label="Account Number"
                placeholder="30849204920"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                error={formErrors.accountNumber}
                required
              />

              <Input
                label="IFSC Code"
                placeholder="SBIN0001234"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                error={formErrors.ifscCode}
                required
              />

              {/* Terms Checkbox */}
              <div className="space-y-1.5 pt-4 border-t border-slate-200/50">
                <div className="flex items-start">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={bankDetails.acceptTerms}
                    onChange={(e) => setBankDetails({ ...bankDetails, acceptTerms: e.target.checked })}
                    className="h-4.5 w-4.5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500/10 cursor-pointer mt-0.5"
                  />
                  <label
                    htmlFor="accept-terms"
                    className="ml-2.5 block text-xs font-semibold text-slate-600 leading-relaxed select-none cursor-pointer"
                  >
                    I hereby declare that the certificates uploaded above are genuine, and I accept the Samrat Multi-Vendor Store Agreement.
                  </label>
                </div>
                {formErrors.acceptTerms && (
                  <p className="text-xs font-semibold text-rose-600">{formErrors.acceptTerms}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller/onboarding/step-2')}
              className="flex items-center gap-1.5"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              <span>Submit Application</span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Step3BankDetails;
