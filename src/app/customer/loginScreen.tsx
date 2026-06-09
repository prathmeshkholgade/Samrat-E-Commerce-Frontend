import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';
import AuthSplitLayout from '../../shared/layouts/AuthSplitLayout';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';
import authService from '../../features/auth/service';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile || !password) {
      setError('Please fill in all credentials.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        emailOrMobile,
        password,
        rememberMe,
      });
      
      // Redirect based on user role
      if (response.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/home'); // Go to marketplace Home
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please try again.');
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
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Log in to manage your customer account or vendor storefront.
            </p>
          </div>

          {error && (
            <div className="flex gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email or Mobile Number"
              placeholder="name@company.com or 9876543210"
              value={emailOrMobile}
              onChange={(e) => setEmailOrMobile(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                {/* Handled inside password component */}
              </div>
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="
                  h-4 w-4 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500/10 cursor-pointer
                "
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs font-semibold text-slate-600 select-none cursor-pointer"
              >
                Keep me signed in on this device
              </label>
            </div>

            {/* Actions */}
            <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="py-3.5 shadow-md shadow-indigo-50">
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-100" />
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
              Or
            </span>
            <div className="flex-grow border-t border-slate-100" />
          </div>

          {/* Google Login button */}
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                navigate('/home');
              }, 800);
            }}
            className="flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-800 text-sm font-semibold transition-all py-3 shadow-2xs"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.626 5.626 0 018.3 12.985a5.626 5.626 0 015.69-5.615c2.316 0 4.095 1.05 4.887 1.83l3.226-3.225C20.17 4.08 17.27 2.5 13.99 2.5a9.497 9.497 0 00-9.5 9.5 9.497 9.497 0 009.5 9.5c5.38 0 9.5-3.8 9.5-9.5 0-.645-.075-1.285-.215-1.93H12.24z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Create Account Link */}
          <div className="text-center text-xs text-slate-500 font-semibold pt-2">
            New to Samrat?{' '}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
            >
              Create Customer Account
            </Link>
            <span className="mx-2 text-slate-300">|</span>
            <Link
              to="/seller/onboarding"
              className="text-purple-600 hover:text-purple-700 font-bold hover:underline transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default LoginScreen;
