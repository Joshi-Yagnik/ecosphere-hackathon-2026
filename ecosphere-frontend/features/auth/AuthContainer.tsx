import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { OtpVerification } from './components/OtpVerification';
import { AuthLayout } from './components/AuthLayout';

export function AuthContainer() {
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password' | 'reset_password' | 'mfa'>('login');
  
  // E.g. lock out logic could be added here
  const [, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const handleLogin = async (data: any) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      throw new Error(`Too many failed attempts. Try again later.`);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setFailedAttempts((prev: number) => {
        const newAttempts = prev + 1;
        if (newAttempts >= 5) {
          setLockoutUntil(Date.now() + 5 * 60 * 1000); // 5 mins
          throw new Error('Account locked for 5 minutes due to too many failed attempts.');
        }
        return newAttempts;
      });
      throw error;
    }
    
    // setFailedAttempts(0); // reset on success
    
    // Check if MFA is required
    // const mfaLevel = authData?.session?.user?.factors?.length;
    // In a real scenario, you'd check if the role requires MFA or if they have factors
    // if (mfaLevel > 0 && nextAssuranceLevel !== 'aal2') { setView('mfa'); }
  };

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
    
    // Suggest user checks email
    alert("Check your email to verify your account.");
    setView('login');
  };

  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'microsoft' ? 'azure' : provider,
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
  };

  const handleForgotPassword = async (data: any) => {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const handleResetPassword = async (data: any) => {
    const { error } = await supabase.auth.updateUser({
      password: data.password
    });
    if (error) throw error;
    setView('login');
  };

  const handleMfaVerify = async (otp: string) => {
    // Example MFA verification via TOTP
    // First, find the active factor
    const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) throw factorsError;
    
    const totpFactor = factorsData.totp[0];
    if (!totpFactor) throw new Error("No MFA factor found.");

    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: totpFactor.id
    });
    if (challengeError) throw challengeError;

    const { error } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challengeData.id,
      code: otp
    });

    if (error) throw error;
  };

  return (
    <AuthLayout
      title={view === 'login' ? 'Welcome back' : view === 'signup' ? 'Create an account' : 'Authentication'}
      subtitle={view === 'login' ? 'Log in to your EcoSphere account' : view === 'signup' ? 'Join your organization on EcoSphere' : ''}
    >
      {view === 'login' && <LoginForm onSubmit={handleLogin} onOAuthLogin={handleOAuth} onNavigate={setView} />}
      {view === 'signup' && <SignupForm onSubmit={handleSignup} onNavigate={setView} />}
      {view === 'forgot_password' && <ForgotPasswordForm onSubmit={handleForgotPassword} onNavigate={setView} />}
      {view === 'reset_password' && <ResetPasswordForm onSubmit={handleResetPassword} />}
      {view === 'mfa' && <OtpVerification onSubmit={handleMfaVerify} />}
    </AuthLayout>
  );
}
