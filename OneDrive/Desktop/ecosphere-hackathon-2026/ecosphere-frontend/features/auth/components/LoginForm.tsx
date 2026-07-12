import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ onSubmit, onOAuthLogin, onNavigate }: { 
  onSubmit: (data: LoginFormValues) => Promise<void>,
  onOAuthLogin: (provider: 'google' | 'microsoft') => void,
  onNavigate: (view: 'signup' | 'forgot_password') => void
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false
    }
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFormSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(data);
    } catch (error: any) {
      setServerError(error.message || "An error occurred during login.");
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

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] font-semibold text-[#0f172a]">Email address</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="h-10 text-[14px] border-slate-200 focus-visible:ring-[#2f655d] focus-visible:border-[#2f655d]"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600" aria-live="polite">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-[13px] font-semibold text-[#0f172a]">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="h-10 text-[14px] border-slate-200 focus-visible:ring-[#2f655d] focus-visible:border-[#2f655d]"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="text-xs text-red-600" aria-live="polite">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              {...register("rememberMe")}
              className="h-4 w-4 rounded border-slate-300 text-[#2f655d] focus:ring-[#2f655d]"
            />
            <Label htmlFor="rememberMe" className="font-normal text-[13px] text-slate-500 cursor-pointer">Remember me</Label>
          </div>
          <button type="button" onClick={() => onNavigate('forgot_password')} className="text-[13px] font-medium text-[#2f655d] hover:underline">
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="w-full h-10 bg-[#2f655d] hover:bg-[#25504a] text-white font-medium" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[13px]">
            <span className="px-3 bg-white text-slate-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => onOAuthLogin('google')}
            className="bg-[#8c94a3] hover:bg-[#7b8392] text-white border-0 h-9 font-medium"
          >
            <Mail className="mr-2 h-4 w-4 text-white" /> Google
          </Button>
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => onOAuthLogin('microsoft')}
            className="bg-[#8c94a3] hover:bg-[#7b8392] text-white border-0 h-9 font-medium"
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <path fill="#f25022" d="M1 1h9v9H1z"/>
              <path fill="#00a4ef" d="M11 1h9v9h-9z"/>
              <path fill="#7fba00" d="M1 11h9v9H1z"/>
              <path fill="#ffb900" d="M11 11h9v9h-9z"/>
            </svg>
            Microsoft
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-[13px] text-slate-500">
        Don't have an account?{" "}
        <button type="button" onClick={() => onNavigate('signup')} className="font-medium text-[#2f655d] hover:underline">
          Sign up
        </button>
      </p>
    </motion.div>
  );
}
