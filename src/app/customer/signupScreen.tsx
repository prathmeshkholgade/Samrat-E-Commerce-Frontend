import React, { useState } from 'react';
import { useNavigate as useNav, Link as RouterLink } from 'react-router-dom';
import { User, Mail, AlertCircle } from 'lucide-react';
import AuthSplitLayout from '../../shared/layouts/AuthSplitLayout';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import PhoneInput from '../../shared/components/PhoneInput';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';
import authService from '../../features/auth/service';

export const SignupScreen: React.FC = () => {
  const navigate = useNav();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dialCode, setDialCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required.';
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!phone || phone.length < 8) {
      errors.phone = 'Please provide a valid mobile number.';
    }

    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await authService.signup({
        fullName,
        email,
        mobile: `${dialCode} ${phone}`,
        password,
      });
      // Redirect to home/dashboard
      navigate('/home');
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthSplitLayout>
      <Card>
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create Customer Account
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Join Samrat Enterprises to buy products and review shops.
            </p>
          </div>

          {apiError && (
            <div className="flex gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User size={16} />}
              error={formErrors.fullName}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              error={formErrors.email}
              required
            />

            <PhoneInput
              label="Mobile Number"
              value={phone}
              dialCode={dialCode}
              onPhoneChange={(val) => setPhone(val)}
              onDialCodeChange={(code) => setDialCode(code)}
              error={formErrors.phone}
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
              required
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={formErrors.confirmPassword}
              required
            />

            {/* Actions */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              className="py-3.5 shadow-md shadow-indigo-50 mt-2"
            >
              Create Account
            </Button>
          </form>

          {/* Link back to login */}
          <div className="text-center text-xs text-slate-500 font-semibold pt-2">
            Already have an account?{' '}
            <RouterLink
              to="/login"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
            >
              Sign In
            </RouterLink>
          </div>
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default SignupScreen;
