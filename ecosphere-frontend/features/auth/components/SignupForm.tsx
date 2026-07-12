import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { usePasswordStrength } from "../hooks/usePasswordStrength";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Please enter a valid work email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ onSubmit, onNavigate }: { 
  onSubmit: (data: SignupFormValues) => Promise<void>,
  onNavigate: (view: 'login') => void
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch("password", "");
  const strength = usePasswordStrength(password);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFormSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      setServerError(error.message || "An error occurred during sign up.");
      triggerShake();
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            aria-invalid={!!errors.fullName}
          />
          {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Work Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          <div className="mt-2 space-y-1">
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${(strength.score / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 text-right">{strength.label}</p>
          </div>
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            id="termsAccepted"
            {...register("termsAccepted")}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
          />
          <Label htmlFor="termsAccepted" className="font-normal text-slate-600 text-sm leading-snug">
            I agree to the <a href="/terms" className="text-brand-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</a>
          </Label>
        </div>
        {errors.termsAccepted && <p className="text-sm text-red-600 mt-1">{errors.termsAccepted.message}</p>}

        <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <button type="button" onClick={() => onNavigate('login')} className="font-medium text-brand-primary hover:underline">
          Sign in
        </button>
      </p>
    </motion.div>
  );
}
