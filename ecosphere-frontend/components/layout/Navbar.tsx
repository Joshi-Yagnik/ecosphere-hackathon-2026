'use client';

// components/layout/Navbar.tsx
// ============================================================
// EcoSphere – Top Navigation Bar
// ============================================================
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  X,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Leaf,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/useSidebar';
import { Breadcrumb } from './Breadcrumb';

// ── Mock notifications ────────────────────────────────────────
const notifications = [
  {
    id: '1',
    type: 'warning',
    title: '3 Compliance Issues Overdue',
    body: 'Finance dept has 3 overdue compliance issues.',
    time: '5m ago',
    unread: true,
  },
  {
    id: '2',
    type: 'success',
    title: 'Badge Awarded!',
    body: 'Priya S. earned the "Carbon Neutral Hero" badge.',
    time: '1h ago',
    unread: true,
  },
  {
    id: '3',
    type: 'info',
    title: 'CSR Activity Submitted',
    body: 'HR team submitted "Tree Plantation Drive" for approval.',
    time: '3h ago',
    unread: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Monthly ESG Report Ready',
    body: 'June 2026 ESG Summary Report has been generated.',
    time: '1d ago',
    unread: false,
  },
];

// ── Notification icon colors ──────────────────────────────────
const notifColors: Record<string, string> = {
  warning: 'bg-orange-100 text-orange-600',
  success: 'bg-green-100 text-green-600',
  info: 'bg-blue-100 text-blue-600',
  error: 'bg-red-100 text-red-600',
};

// ── Search Box ────────────────────────────────────────────────
function SearchBox() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded) inputRef.current?.focus();
  }, [isExpanded]);

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative mr-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search EcoSphere…"
                className="w-full pl-8 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsExpanded((v) => !v)}
        className={cn(
          'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
          isExpanded
            ? 'bg-slate-100 text-slate-700'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
        )}
        title="Search"
      >
        {isExpanded ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── Notification Panel ────────────────────────────────────────
function NotificationPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button className="text-xs text-green-600 font-medium hover:text-green-700">
                Mark all read
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'flex gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors',
                    notif.unread && 'bg-green-50/40'
                  )}
                >
                  <div
                    className={cn(
                      'shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs',
                      notifColors[notif.type] ?? notifColors.info
                    )}
                  >
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 leading-snug">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                  </div>
                  {notif.unread && (
                    <div className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 border-t border-slate-100 text-center">
              <button className="text-xs text-green-600 font-medium hover:text-green-700">
                View all notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── User Dropdown ─────────────────────────────────────────────
function UserDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const menuItems = [
    { icon: User, label: 'My Profile', href: '#' },
    { icon: Settings, label: 'Settings', href: '/settings/configuration' },
    { icon: HelpCircle, label: 'Help & Support', href: '#' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden"
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-900">Admin User</p>
              <p className="text-xs text-slate-500">admin@ecosphere.app</p>
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-semibold rounded-full">
                <Leaf className="w-2.5 h-2.5" />
                ESG Administrator
              </span>
            </div>

            {/* Menu */}
            <div className="py-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  {item.label}
                </a>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t border-slate-100 py-1">
              <button className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Navbar ───────────────────────────────────────────────
export function Navbar() {
  const { isCollapsed, toggleMobile } = useSidebar();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-sm flex items-center px-4 gap-4">
      {/* Left: hamburger + breadcrumb */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggleMobile}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="min-w-0 flex-1">
          <Breadcrumb />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Search */}
        <SearchBox />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen((v) => !v);
              setUserOpen(false);
            }}
            className={cn(
              'relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
              notifOpen
                ? 'bg-slate-100 text-slate-700'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            )}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel
            isOpen={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200 mx-2" />

        {/* User Avatar */}
        <div className="relative">
          <button
            onClick={() => {
              setUserOpen((v) => !v);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              AU
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Admin User
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Administrator
              </p>
            </div>
            <ChevronDown
              className={cn(
                'hidden sm:block w-3 h-3 text-slate-400 transition-transform',
                userOpen && 'rotate-180'
              )}
            />
          </button>
          <UserDropdown
            isOpen={userOpen}
            onClose={() => setUserOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
