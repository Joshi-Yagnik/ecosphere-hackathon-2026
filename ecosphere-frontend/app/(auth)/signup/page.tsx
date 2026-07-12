"use client";

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SignupForm } from '@/features/auth/components/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  
  const handleSignup = async (data: any) => {
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        }
      }
    });

    if (error) throw error;
    
    if (authData?.user && authData.user.identities && authData.user.identities.length === 0) {
      throw new Error("This email is already registered.");
    }
    
    alert("Check your email to verify your account.");
    router.push('/login');
  };

  const handleNavigate = (view: string) => {
    if (view === 'login') router.push('/login');
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Join your organization on EcoSphere"
    >
      <SignupForm onSubmit={handleSignup} onNavigate={handleNavigate as any} />
    </AuthLayout>
  );
}
