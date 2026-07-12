"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const handleForgotPassword = async (data: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const handleNavigate = (view: string) => {
    if (view === 'login') router.push('/login');
  };

  return (
    <AuthLayout
      title="Authentication"
      subtitle=""
    >
      <ForgotPasswordForm onSubmit={handleForgotPassword} onNavigate={handleNavigate as any} />
    </AuthLayout>
  );
}
