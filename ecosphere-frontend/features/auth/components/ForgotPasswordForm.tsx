import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ onSubmit, onNavigate }: { 
  onSubmit: (data: ForgotPasswordValues) => Promise<void>,
  onNavigate: (view: 'login') => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  // Handle 30s cooldown timer
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

  const handleFormSubmit = async (data: ForgotPasswordValues) => {
    if (countdown > 0) return;
    
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(data);
      setIsSuccess(true);
      setCountdown(30);
    } catch (error: any) {
      setServerError(error.message || "An error occurred.");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-brand-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-900">Check your email</h3>
          <p className="mt-2 text-sm text-slate-600">
            If an account exists for <span className="font-medium text-slate-900">{getValues().email}</span>, you will receive a password reset link shortly.
          </p>
        </div>
        
        <div className="pt-4 flex flex-col space-y-3">
          <Button 
            variant="outline" 
            onClick={() => handleFormSubmit(getValues())}
            disabled={countdown > 0 || isSubmitting}
            isLoading={isSubmitting}
          >
            {countdown > 0 ? `Resend email in ${countdown}s` : "Click to resend"}
          </Button>
          
          <button type="button" onClick={() => onNavigate('login')} className="text-sm font-medium text-brand-primary hover:underline flex items-center justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        
        {serverError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200" aria-live="assertive">
            {serverError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
          Send reset instructions
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button type="button" onClick={() => onNavigate('login')} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </button>
      </div>
    </motion.div>
  );
}
