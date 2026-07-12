import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LoginForm } from './components/LoginForm';
import { SignupForm } from './components/SignupForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { OtpVerification } from './components/OtpVerification';
import { AuthLayout } from './components/AuthLayout';

type View =
  | 'login'
  | 'signup'
  | 'verify_signup'      // OTP after signup
  | 'forgot_password'
  | 'verify_reset'       // OTP after forgot-password request
  | 'reset_password';    // new password form (after OTP verified)

const VIEW_TITLES: Record<View, string> = {
  login:            'Welcome back',
  signup:           'Create an account',
  verify_signup:    'Verify your email',
  forgot_password:  'Forgot password',
  verify_reset:     'Check your email',
  reset_password:   'Set new password',
};

const VIEW_SUBTITLES: Record<View, string> = {
  login:            'Log in to your EcoSphere account',
  signup:           'Join your organization on EcoSphere',
  verify_signup:    'Enter the 6-digit code sent to your email',
  forgot_password:  'Enter your email and we\'ll send you a reset code',
  verify_reset:     'Enter the 6-digit code sent to your email',
  reset_password:   'Choose a strong new password',
};

export function AuthContainer() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('login');

  // Store email across views (needed for OTP verification)
  const pendingEmailRef = useRef<string>('');

  // For reset flow: store the OTP token after verification so we can update password
  const resetTokenRef = useRef<string>('');

  // Lockout logic
  const failedAttemptsRef = useRef(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  // ── Login ─────────────────────────────────────────────────
  const handleLogin = async (data: any) => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const remainingSeconds = Math.ceil((lockoutUntil - Date.now()) / 1000);
      throw new Error(`Too many failed attempts. Try again in ${remainingSeconds}s.`);
    }

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      failedAttemptsRef.current += 1;
      if (failedAttemptsRef.current >= 5) {
        setLockoutUntil(Date.now() + 5 * 60 * 1000);
        failedAttemptsRef.current = 0;
        throw new Error('Account locked for 5 minutes due to too many failed attempts.');
      }
      // Friendly message for unverified email
      if (error.message.toLowerCase().includes('email not confirmed')) {
        pendingEmailRef.current = data.email;
        // Resend OTP and show verify view
        await supabase.auth.resend({ type: 'signup', email: data.email });
        throw new Error('Email not verified. We sent a new code — please check your inbox.');
      }
      throw error;
    }

    if (!signInData.user) throw new Error('Login failed. Please try again.');

    failedAttemptsRef.current = 0;
    navigate('/dashboard');
  };

  // ── Signup ────────────────────────────────────────────────
  const handleSignup = async (data: any) => {
    const { error, data: authData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
      },
    });

    if (error) throw error;

    // If identities is empty the email is already registered
    if (authData?.user?.identities?.length === 0) {
      throw new Error('This email is already registered. Please sign in.');
    }

    // Store email so OTP view can use it
    pendingEmailRef.current = data.email;
    setView('verify_signup');
  };

  // ── Verify signup OTP ─────────────────────────────────────
  const handleVerifySignupOtp = async (otp: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmailRef.current,
      token: otp,
      type: 'signup',
    });

    if (error) throw error;

    // After verification Supabase auto-signs in — sign them back out
    // since we use persistSession: false and want explicit login
    await supabase.auth.signOut();
    setView('login');
  };

  // ── Resend signup OTP ──────────────────────────────────────
  const handleResendSignupOtp = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: pendingEmailRef.current,
    });
    if (error) throw error;
  };

  // ── OAuth ─────────────────────────────────────────────────
  const handleOAuth = async (provider: 'google' | 'microsoft') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'microsoft' ? 'azure' : provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  };

  // ── Forgot password ────────────────────────────────────────
  const handleForgotPassword = async (data: any) => {
    // Use OTP (email) flow instead of magic link so user enters code in-app
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) throw error;

    pendingEmailRef.current = data.email;
    setView('verify_reset');
  };

  // ── Verify reset OTP ──────────────────────────────────────
  const handleVerifyResetOtp = async (otp: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: pendingEmailRef.current,
      token: otp,
      type: 'recovery',
    });

    if (error) throw error;

    // Store the access token — we need it to update the password
    if (data.session?.access_token) {
      resetTokenRef.current = data.session.access_token;
    }

    setView('reset_password');
  };

  // ── Resend reset OTP ───────────────────────────────────────
  const handleResendResetOtp = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(
      pendingEmailRef.current,
      { redirectTo: `${window.location.origin}/auth` }
    );
    if (error) throw error;
  };

  // ── Set new password ────────────────────────────────────────
  const handleResetPassword = async (data: any) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) throw error;

    // Sign out and go to login
    await supabase.auth.signOut();
    setView('login');
  };

  const goTo = (v: View) => {
    setView(v);
  };

  return (
    <AuthLayout title={VIEW_TITLES[view]} subtitle={VIEW_SUBTITLES[view]}>

      {/* Login */}
      {view === 'login' && (
        <LoginForm
          onSubmit={handleLogin}
          onOAuthLogin={handleOAuth}
          onNavigate={(v) => goTo(v as View)}
        />
      )}

      {/* Sign up */}
      {view === 'signup' && (
        <SignupForm
          onSubmit={handleSignup}
          onNavigate={(v) => goTo(v as View)}
        />
      )}

      {/* Email OTP after signup */}
      {view === 'verify_signup' && (
        <>
          <p className="mb-4 text-sm text-slate-500 text-center">
            A 6-digit code was sent to{' '}
            <span className="font-medium text-slate-800">{pendingEmailRef.current}</span>
          </p>
          <OtpVerification
            onSubmit={handleVerifySignupOtp}
            onResend={handleResendSignupOtp}
          />
          <button
            type="button"
            className="mt-6 w-full text-center text-sm text-slate-500 hover:text-slate-700"
            onClick={() => goTo('signup')}
          >
            ← Back to sign up
          </button>
        </>
      )}

      {/* Forgot password */}
      {view === 'forgot_password' && (
        <ForgotPasswordForm
          onSubmit={handleForgotPassword}
          onNavigate={(v) => goTo(v as View)}
        />
      )}

      {/* OTP after forgot password */}
      {view === 'verify_reset' && (
        <>
          <p className="mb-4 text-sm text-slate-500 text-center">
            A 6-digit reset code was sent to{' '}
            <span className="font-medium text-slate-800">{pendingEmailRef.current}</span>
          </p>
          <OtpVerification
            onSubmit={handleVerifyResetOtp}
            onResend={handleResendResetOtp}
          />
          <button
            type="button"
            className="mt-6 w-full text-center text-sm text-slate-500 hover:text-slate-700"
            onClick={() => goTo('forgot_password')}
          >
            ← Back
          </button>
        </>
      )}

      {/* New password form */}
      {view === 'reset_password' && (
        <ResetPasswordForm onSubmit={handleResetPassword} />
      )}

    </AuthLayout>
  );
}
