import React, { useState, useEffect, useRef } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onResend: () => void;
  countdownMinutes?: number;
  error?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onResend,
  countdownMinutes = 2,
  error,
}) => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(length).fill(''));
  const [secondsLeft, setSecondsLeft] = useState(countdownMinutes * 60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Update values from parent
  useEffect(() => {
    if (value.length === 0) {
      setOtpValues(Array(length).fill(''));
    } else {
      const arr = value.split('').slice(0, length);
      setOtpValues([...arr, ...Array(length - arr.length).fill('')]);
    }
  }, [value, length]);

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleChange = (val: string, index: number) => {
    // Only numbers
    const num = val.replace(/\D/g, '');
    if (!num) return;

    const newOtp = [...otpValues];
    newOtp[index] = num.charAt(num.length - 1); // Last character typed
    setOtpValues(newOtp);

    const otpStr = newOtp.join('');
    onChange(otpStr);

    // Shift focus to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otpValues];
      
      // If current element has value, clear it.
      // If empty, clear preceding and move focus back.
      if (newOtp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        inputRefs.current[index - 1]?.focus();
      }
      
      setOtpValues(newOtp);
      onChange(newOtp.join(''));
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasteData) return;

    const newOtp = [...otpValues];
    for (let i = 0; i < length; i++) {
      newOtp[i] = pasteData[i] || '';
    }
    setOtpValues(newOtp);
    onChange(newOtp.join(''));

    // Set focus to the last filled input or the last input
    const focusIndex = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResendClick = () => {
    if (!canResend) return;
    setSecondsLeft(countdownMinutes * 60);
    setCanResend(false);
    onChange('');
    onResend();
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="flex gap-2 sm:gap-3 justify-center">
        {otpValues.map((val, index) => (
          <input
            key={index}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={val}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`
              w-12 h-14 sm:w-14 sm:h-16 rounded-xl border bg-white text-center font-bold text-lg sm:text-xl text-slate-800
              transition-all duration-200 outline-hidden
              focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:scale-105
              ${error ? 'border-rose-400 focus:ring-rose-500/10 focus:border-rose-500' : 'border-slate-200'}
            `}
          />
        ))}
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-600 animate-in fade-in-50 duration-200">
          {error}
        </p>
      )}

      {/* Countdown timer / Resend button */}
      <div className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
        {canResend ? (
          <>
            <span>Didn't receive the code?</span>
            <button
              type="button"
              onClick={handleResendClick}
              className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold transition-all cursor-pointer"
            >
              Resend Code
            </button>
          </>
        ) : (
          <>
            <span>Resend code in</span>
            <span className="text-indigo-600 font-bold bg-indigo-50 border border-indigo-100/30 px-2 py-0.5 rounded-md text-xs">
              {formatTime(secondsLeft)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPInput;
