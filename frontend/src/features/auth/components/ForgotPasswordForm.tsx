import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleFormSubmit = async (data: ForgotPasswordValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      await onSubmit(data);
      // AuthContainer switches view to 'verify_reset' on success
    } catch (error: any) {
      setServerError(error.message || "An error occurred. Please try again.");
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
          <Label htmlFor="fp-email">Email address</Label>
          <Input
            id="fp-email"
            type="email"
            placeholder="you@company.com"
            {...register("email")}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full mt-4" isLoading={isSubmitting}>
          Send reset code
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="flex items-center justify-center w-full text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </button>
      </div>
    </motion.div>
  );
}
