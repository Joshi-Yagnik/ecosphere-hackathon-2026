import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";

export function OtpVerification({ 
  onSubmit, 
  onResend 
}: { 
  onSubmit: (otp: string) => Promise<void>,
  onResend?: () => Promise<void>
}) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const submitOtp = async (currentOtp: string) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(currentOtp);
    } catch (error: any) {
      setServerError(error.message || "Invalid code. Please try again.");
      triggerShake();
      // Clear OTP on error to retry
      setOtp(new Array(6).fill(""));
      setActiveOTPIndex(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.substring(e.target.value.length - 1);
    
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    const otpString = newOTP.join('');
    
    if (value && index < 5) {
      setActiveOTPIndex(index + 1);
    }

    // Auto submit when 6 digits are entered
    if (otpString.length === 6) {
      submitOtp(otpString);
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOTP = [...otp];
      if (otp[index]) {
        newOTP[index] = "";
        setOtp(newOTP);
      } else if (index > 0) {
        newOTP[index - 1] = "";
        setOtp(newOTP);
        setActiveOTPIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      setActiveOTPIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      setActiveOTPIndex(index + 1);
    } else if (e.key === "Enter" && otp.join('').length === 6) {
      submitOtp(otp.join(''));
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6).trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOTP = [...otp];
    let lastFilledIndex = 0;
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newOTP[i] = pastedData[i];
        lastFilledIndex = i;
      }
    }
    
    setOtp(newOTP);
    setActiveOTPIndex(lastFilledIndex < 5 ? lastFilledIndex + 1 : 5);
    
    if (newOTP.join('').length === 6) {
      submitOtp(newOTP.join(''));
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !onResend) return;
    try {
      await onResend();
      setCountdown(30);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-6">
        
        {serverError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200" aria-live="assertive">
            {serverError}
          </div>
        )}

        <div>
          <Label className="block mb-3 text-center">Enter 6-digit code</Label>
          <div 
            className="flex justify-center items-center gap-2"
            onPaste={handlePaste}
          >
            {otp.map((_, index) => (
              <input
                key={index}
                ref={index === activeOTPIndex ? inputRef : null}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{1}"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-semibold border border-slate-300 rounded-md focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all bg-white dark:bg-slate-900 dark:border-slate-800"
                value={otp[index]}
                onChange={(e) => handleOnChange(e, index)}
                onKeyDown={(e) => handleOnKeyDown(e, index)}
                onFocus={() => setActiveOTPIndex(index)}
                disabled={isSubmitting}
                aria-label={`Digit ${index + 1} of 6`}
              />
            ))}
          </div>
        </div>

        <Button 
          type="button" 
          onClick={() => submitOtp(otp.join(''))} 
          className="w-full mt-6" 
          disabled={otp.join('').length !== 6 || isSubmitting}
          isLoading={isSubmitting}
        >
          Verify
        </Button>

        {onResend && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || isSubmitting}
              className="text-sm font-medium text-brand-primary hover:underline disabled:text-slate-400 disabled:no-underline transition-colors"
            >
              {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
