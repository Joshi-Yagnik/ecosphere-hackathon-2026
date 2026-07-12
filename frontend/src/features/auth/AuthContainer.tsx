import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { OtpVerification } from './components/OtpVerification';
import { AuthLayout } from './components/AuthLayout';

export function AuthContainer() {
  const navigate = useNavigate();
  const [view, setView] = useState<'login' | 'signup' | 'forgot_password' | 'reset_password' | 'mfa'>('login');
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  
  // Lockout logic: use a ref for attempt count to avoid stale closures inside async handlers
  const failedAttemptsRef = useRef(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  
  const handleLogin = async (data: any) => {
    // Check lockout before attempting login
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      throw new Error(`Too many failed attempts. Try again in ${remainingSeconds}s.`);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      // Increment ref synchronously (no state batching issues)
      failedAttemptsRef.current += 1;
      if (failedAttemptsRef.current >= 5) {
        setLockoutUntil(Date.now() + 5 * 60 * 1000); // lock for 5 mins
        failedAttemptsRef.current = 0;
        throw new Error('Account locked for 5 minutes due to too many failed attempts.');
      }
      throw error;
    }
    
    // Successful login — reset failed attempts and redirect
    failedAttemptsRef.current = 0;
    navigate('/dashboard');
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
    
    // Show success message and switch to login
    setSignupSuccess("Account created! Check your email to verify your account, then sign in.");
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
      {signupSuccess && view === 'login' && (
        <div className="mb-4 p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200">
          {signupSuccess}
        </div>
      )}
      {view === 'login' && <LoginForm onSubmit={handleLogin} onOAuthLogin={handleOAuth} onNavigate={(v) => { setSignupSuccess(null); setView(v); }} />}
      {view === 'signup' && <SignupForm onSubmit={handleSignup} onNavigate={setView} />}
      {view === 'forgot_password' && <ForgotPasswordForm onSubmit={handleForgotPassword} onNavigate={setView} />}
      {view === 'reset_password' && <ResetPasswordForm onSubmit={handleResetPassword} />}
      {view === 'mfa' && <OtpVerification onSubmit={handleMfaVerify} />}
    </AuthLayout>
  );
}
