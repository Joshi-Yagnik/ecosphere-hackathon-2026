// src/components/layout/Navbar.tsx
import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Bell, ChevronDown, X, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { breadcrumbLabels } from '@/lib/navigation';

const notifications = [
  { id: '1', type: 'warning', title: '3 Compliance Issues Overdue', body: 'Finance dept has 3 overdue compliance issues.', time: '5m ago', unread: true },
  { id: '2', type: 'success', title: 'Badge Awarded!', body: 'Priya S. earned the "Carbon Neutral Hero" badge.', time: '1h ago', unread: true },
  { id: '3', type: 'info', title: 'CSR Activity Submitted', body: 'HR team submitted "Tree Plantation Drive" for approval.', time: '3h ago', unread: false },
  { id: '4', type: 'info', title: 'Monthly ESG Report Ready', body: 'June 2026 ESG Summary Report has been generated.', time: '1d ago', unread: false },
];

const notifColors: Record<string, string> = {
  warning: 'bg-orange-100 text-orange-600',
  success: 'bg-green-100 text-green-600',
  info: 'bg-blue-100 text-blue-600',
  error: 'bg-red-100 text-red-600',
};

function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  return (
    <nav className="hidden sm:flex items-center gap-1 text-sm">
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        return (
          <span key={seg} className="flex items-center gap-1">
            {i > 0 && <span className="text-slate-300">/</span>}
            <span className={isLast ? 'font-semibold text-slate-900' : 'text-slate-400'}>
              {breadcrumbLabels[seg] ?? seg}
            </span>
          </span>
        );
      })}
    </nav>
  );
}

export function Navbar() {
  const { toggleMobile } = useSidebar();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center px-4 gap-3 z-30 relative">
      <button onClick={toggleMobile} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      <Breadcrumb />

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotifs((v) => !v)} className="relative p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-sm text-slate-900">Notifications</span>
                  <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                </div>
                <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className={cn('px-4 py-3 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors', n.unread && 'bg-blue-50/30')}>
                      <div className={cn('shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold', notifColors[n.type])}>
                        {n.type === 'warning' ? '!' : n.type === 'success' ? '✓' : 'i'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{n.body}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                      </div>
                      {n.unread && <div className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User */}
        <div className="relative" ref={userRef}>
          <button onClick={() => setShowUser((v) => !v)} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold">AU</div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">Admin User</p>
              <p className="text-[10px] text-slate-500">ESG Administrator</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <AnimatePresence>
            {showUser && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                {[
                  { icon: User, label: 'Profile', onClick: () => {} },
                  { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
                  { icon: HelpCircle, label: 'Help', onClick: () => {} },
                ].map(({ icon: Icon, label, onClick }) => (
                  <button key={label} onClick={() => { onClick(); setShowUser(false); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Icon className="w-4 h-4 text-slate-400" /> {label}
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-1" />
                <button onClick={() => navigate('/login')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
