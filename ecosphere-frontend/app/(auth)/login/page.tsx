'use client';

// app/(auth)/login/page.tsx
// ============================================================
// EcoSphere – Mock Login Page (no backend required)
// Credentials: admin@ecosphere.com / demo1234
// ============================================================
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Leaf, Eye, EyeOff, Loader2, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';
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
    <div className="min-h-screen flex bg-slate-50">
      {/* ── Left branding panel ──────────────────── */}
      <div className="hidden lg:flex flex-col justify-between flex-1 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-12 text-white relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">EcoSphere</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-1 bg-white/40 rounded-full" />
          <h2 className="text-4xl font-extrabold leading-tight">
            Track. Engage.<br />Report. Sustain.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            A modular ESG Management Platform designed for mid-to-large enterprises. Centralize your Environmental, Social, and Governance data in one place.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Modules', value: '7' },
            { label: 'ESG Pillars', value: '3' },
            { label: 'Real-time', value: '100%' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-white/70 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right login panel ────────────────────── */}
      <div className="flex flex-col justify-center flex-1 px-6 py-12 lg:px-20 xl:px-28">
        <div className="mx-auto w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">EcoSphere</span>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-8">Sign in to your EcoSphere account to continue.</p>

            {/* Demo hint */}
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-800 text-xs font-bold mb-0.5">Demo Credentials Pre-filled</p>
                <p className="text-emerald-700 text-xs">Email: <strong>admin@ecosphere.com</strong> &nbsp;|&nbsp; Password: <strong>demo1234</strong></p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
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

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                ) : (
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-400">
              EcoSphere ESG Platform &bull; Hackathon Demo 2026
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
