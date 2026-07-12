"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  
  const handleLogin = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    router.push('/dashboard');
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'microsoft' ? 'azure' : provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      }
    });
    if (error) throw error;
  };

  const handleNavigate = (view: string) => {
    if (view === 'signup') router.push('/signup');
    if (view === 'forgot_password') router.push('/forgot-password');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your EcoSphere account"
    >
      <LoginForm onSubmit={handleLogin} onOAuthLogin={handleOAuth} onNavigate={handleNavigate} />
    </AuthLayout>
  );
}
