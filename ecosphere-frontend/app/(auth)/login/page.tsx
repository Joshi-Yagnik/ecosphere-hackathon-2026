'use client';

// app/(auth)/login/page.tsx
// ============================================================
// EcoSphere – Mock Login Page (no backend required)
// Credentials: admin@ecosphere.com / demo1234
// ============================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, Mail } from 'lucide-react';
import { mockSignIn } from '@/lib/mock-auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@ecosphere.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await mockSignIn(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* ── Left branding panel ──────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[48%] bg-gradient-to-br from-[#19513d] via-[#164434] to-[#0f271f] p-12 text-white relative overflow-hidden">
        
        {/* Top Header */}
        <div className="relative z-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">EcoSphere</h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-sm">
            The modular ESG Management Platform. Track, gamify, and report on your organization's sustainability goals.
          </p>
        </div>

        {/* Floating Globe & Orbit Circle in the Center */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          {/* Dashed outer orbit - slow rotating */}
          <motion.div
            className="w-80 h-80 rounded-full border border-dashed border-white/20 absolute"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          />

          {/* 3D Glossy Sphere - floating up & down */}
          <motion.div
            className="w-72 h-72 rounded-full absolute shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #8cbca9 0%, #3a795f 50%, #173d2f 100%)',
            }}
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* White light sheen overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none rounded-full" />
            {/* Dark inner shadows overlay for 3D depth */}
            <div className="absolute inset-0 shadow-[inset_-15px_-15px_30px_rgba(0,0,0,0.5),inset_15px_15px_30px_rgba(255,255,255,0.15)] pointer-events-none rounded-full" />
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-white/50 text-xs">
          &copy; 2026 EcoSphere. All rights reserved.
        </div>
      </div>

      {/* ── Right login panel ────────────────────── */}
      <div className="flex flex-col justify-center flex-1 bg-[#f8fafc] px-6 py-12 lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm flex flex-col items-center">

          {/* Title Headers */}
          <div className="w-full mb-6">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome back</h1>
            <p className="text-slate-400 text-sm mt-1">Log in to your EcoSphere account</p>
          </div>

          {/* Form Card Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">Email address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  placeholder="you@company.com"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox and Forgot Password link */}
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="select-none text-slate-500">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-emerald-700 font-semibold hover:underline">
                  Forgot password?
                </Link>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#247d56] hover:bg-[#1b6242] disabled:bg-emerald-400 text-white font-semibold text-sm rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 mt-4 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-2 bg-white text-slate-400 font-semibold uppercase tracking-wider">Or continue with</span>
              </div>
            </div>

            {/* OAuth Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => alert("Google sign in is not configured in this demo.")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#f1f5f9] border border-slate-200 text-slate-700 hover:bg-[#e2e8f0] text-xs font-semibold transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" /> Google
              </button>
              <button
                type="button"
                onClick={() => alert("Microsoft sign in is not configured in this demo.")}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#f1f5f9] border border-slate-200 text-slate-700 hover:bg-[#e2e8f0] text-xs font-semibold transition cursor-pointer"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#f25022" d="M1 1h9v9H1z"/>
                  <path fill="#00a4ef" d="M11 1h9v9h-9z"/>
                  <path fill="#7fba00" d="M1 11h9v9H1z"/>
                  <path fill="#ffb900" d="M11 11h9v9h-9z"/>
                </svg>
                Microsoft
              </button>
            </div>

            {/* Don't have an account? Sign up */}
            <p className="mt-8 text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-emerald-700 hover:underline">
                Sign up
              </Link>
            </p>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
