'use client';

// app/(auth)/forgot-password/page.tsx
// ============================================================
// EcoSphere – Forgot Password Page matching Login redesign
// ============================================================
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockResetPassword } from '@/lib/mock-auth';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleForgotPassword = async (data: any) => {
    await mockResetPassword(data.email);
  };

  const handleNavigate = (view: string) => {
    if (view === 'login') {
      router.push('/login');
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
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Reset your password</h1>
            <p className="text-slate-400 text-sm mt-1">Enter your email to receive recovery instructions</p>
          </div>

          {/* Form Card Container */}
          <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.03)] p-8">
            <ForgotPasswordForm onSubmit={handleForgotPassword} onNavigate={handleNavigate} />
          </div>

        </div>
      </div>
    </div>
  );
}
