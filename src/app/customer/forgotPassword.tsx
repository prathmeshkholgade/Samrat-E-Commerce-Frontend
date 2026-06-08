import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import AuthSplitLayout from '../../shared/layouts/AuthSplitLayout';
import Card from '../../shared/components/Card';
import Input from '../../shared/components/Input';
import OTPInput from '../../shared/components/OTPInput';
import PasswordInput from '../../shared/components/PasswordInput';
import Button from '../../shared/components/Button';
import authService from '../../features/auth/service';

type FlowState = 'REQUEST' | 'OTP_VERIFY' | 'NEW_PASSWORD' | 'SUCCESS';

export const ForgotPasswordScreen: React.FC = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState<FlowState>('REQUEST');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [flowId, setFlowId] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Submit step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrMobile.trim()) {
      setError('Please provide your email address or mobile number.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.requestForgotPasswordOtp(emailOrMobile);
      setFlowId(res.flowId);
      setCurrentState('OTP_VERIFY');
    } catch (err: any) {
      setError(err.message || 'Unable to request code. Check your connectivity.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setError('Please input the full 6-digit verification pin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verifyForgotPasswordOtp(flowId, otpCode);
      setVerifiedToken(res.verifiedToken);
      setCurrentState('NEW_PASSWORD');
    } catch (err: any) {
      setError(err.message || 'The OTP verification code is invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(verifiedToken, password);
      setCurrentState('SUCCESS');
    } catch (err: any) {
      setError(err.message || 'Unable to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    try {
      await authService.requestForgotPasswordOtp(emailOrMobile);
      console.log('OTP resent successfully');
    } catch (err: any) {
      setError('Failed to resend OTP code.');
    }
  };

  return (
    <AuthSplitLayout>
      <Card>
        <div className="space-y-6">
          {/* Back to Login Arrow (except in success state) */}
          {currentState !== 'SUCCESS' && (
            <button
              onClick={() => {
                if (currentState === 'OTP_VERIFY') setCurrentState('REQUEST');
                else if (currentState === 'NEW_PASSWORD') setCurrentState('OTP_VERIFY');
                else navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          )}

          {error && (
            <div className="flex gap-2.5 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Wizard Panels */}
          {currentState === 'REQUEST' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Forgot Password?
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Enter your registered email or phone number and we'll send a 6-digit OTP to reset your credentials.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <Input
                  label="Email or Mobile"
                  placeholder="name@company.com or 9876543210"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  leftIcon={<Mail size={16} />}
                  required
                />

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="py-3.5 shadow-md shadow-indigo-50">
                  Request OTP
                </Button>
              </form>
            </div>
          )}

          {currentState === 'OTP_VERIFY' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Verify OTP
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  We've sent a 6-digit verification code to <span className="font-semibold text-slate-700">{emailOrMobile}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6 pt-2">
                <OTPInput
                  value={otpCode}
                  onChange={(otp) => setOtpCode(otp)}
                  onResend={handleResendOtp}
                  error={error ? 'OTP validation failed' : undefined}
                />

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="py-3.5 shadow-md shadow-indigo-50">
                  Verify Code
                </Button>
              </form>
            </div>
          )}

          {currentState === 'NEW_PASSWORD' && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Set New Password
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Create a strong password that is at least 6 characters long.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <PasswordInput
                  label="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="py-3.5 shadow-md shadow-indigo-50">
                  Reset Password
                </Button>
              </form>
            </div>
          )}

          {currentState === 'SUCCESS' && (
            <div className="flex flex-col items-center text-center space-y-6 py-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <CheckCircle size={32} />
              </div>

              <div className="space-y-2 max-w-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Password Updated
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Your account credentials have been successfully updated. You can now use your new password to log in.
                </p>
              </div>

              <Button
                onClick={() => navigate('/login')}
                variant="primary"
                fullWidth
                className="py-3.5 shadow-md shadow-indigo-50 max-w-xs"
              >
                Go to Sign In
              </Button>
            </div>
          )}
        </div>
      </Card>
    </AuthSplitLayout>
  );
};

export default ForgotPasswordScreen;
