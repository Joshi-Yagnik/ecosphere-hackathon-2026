'use client';

// app/not-found.tsx
// ============================================================
// EcoSphere – 404 Not Found Page
// ============================================================
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Leaf, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative text-center max-w-md"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Leaf className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className="text-xl font-bold text-slate-900">EcoSphere</p>
            <p className="text-xs text-green-600 font-semibold uppercase tracking-widest">
              ESG Platform
            </p>
          </div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-600 leading-none">
            404
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
          <p className="text-slate-500 leading-relaxed">
            The ESG record you're looking for seems to have left a smaller carbon
            footprint than expected — it doesn't exist.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/dashboard" className="eco-btn-primary">
            <Home className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="eco-btn-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>

        {/* ESG Score decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-10 flex items-center justify-center gap-4 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            Environmental
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Social
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            Governance
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
