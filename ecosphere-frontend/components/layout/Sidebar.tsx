'use client';

// components/layout/Sidebar.tsx
// ============================================================
// EcoSphere – Collapsible Sidebar (desktop + mobile)
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Leaf,
  X,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { navigationItems, type NavItem } from '@/lib/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import { mockSignOut } from '@/lib/mock-auth';
import type { NavChild } from '@/types';

// ── Tooltip wrapper (shown only when collapsed) ───────────────
function NavTooltip({
  label,
  children,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);

  if (disabled) return <>{children}</>;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none"
          >
            <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-lg whitespace-nowrap">
              {label}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Single nav child (sub-item) ───────────────────────────────
function NavChildItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavChild;
  isActive: boolean;
  isCollapsed: boolean;
}) {
  const Icon = item.icon;

  return (
    <NavTooltip label={item.title} disabled={!isCollapsed}>
      <Link
        href={item.href}
        className={cn(
          'group flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all duration-150',
          isCollapsed
            ? 'justify-center p-2 mx-auto w-9 h-9'
            : 'px-3 py-2 pl-8',
          isActive
            ? 'bg-green-50 text-green-700 border-l-2 border-green-600 rounded-l-none'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <Icon
          className={cn(
            'shrink-0 transition-colors',
            isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5',
            isActive ? 'text-green-600' : 'text-slate-400 group-hover:text-slate-600'
          )}
        />
        {!isCollapsed && (
          <span className="truncate">{item.title}</span>
        )}
        {!isCollapsed && item.badge !== undefined && (
          <span className="ml-auto shrink-0 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">
            {item.badge}
          </span>
        )}
      </Link>
    </NavTooltip>
  );
}

// ── Parent nav item (with optional children) ──────────────────
function NavParentItem({
  item,
  isCollapsed,
  pathname,
}: {
  item: NavItem;
  isCollapsed: boolean;
  pathname: string;
}) {
  const Icon = item.icon;

  // Direct link (no children) – e.g. Dashboard
  if (!item.children) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <NavTooltip label={item.title} disabled={!isCollapsed}>
        <Link
          href={item.href!}
          className={cn(
            'group flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150',
            isCollapsed ? 'justify-center p-2 w-9 h-9 mx-auto' : 'px-3 py-2',
            isActive
              ? 'bg-green-50 text-green-700 border-l-2 border-green-600 rounded-l-none'
              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
          )}
        >
          <Icon
            className={cn(
              'shrink-0 w-4 h-4 transition-colors',
              isActive ? 'text-green-600' : 'text-slate-500 group-hover:text-slate-700'
            )}
          />
          {!isCollapsed && <span className="truncate">{item.title}</span>}
        </Link>
      </NavTooltip>
    );
  }

  // Parent with children
  const isGroupActive = item.children.some(
    (child) => pathname === child.href || pathname.startsWith(child.href + '/')
  );

  const [isOpen, setIsOpen] = useState(isGroupActive);

  // Auto-open if a child is active
  useEffect(() => {
    if (isGroupActive) setIsOpen(true);
  }, [isGroupActive]);

  const toggleOpen = useCallback(() => {
    if (!isCollapsed) setIsOpen((v) => !v);
  }, [isCollapsed]);

  // When collapsed, clicking opens the first child
  if (isCollapsed) {
    return (
      <div className="mb-1">
        <NavTooltip label={item.title} disabled={false}>
          <button
            onClick={() => setIsOpen((v) => !v)}
            className={cn(
              'group flex items-center justify-center p-2 w-9 h-9 mx-auto rounded-lg transition-all duration-150',
              isGroupActive
                ? 'bg-green-50 text-green-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
          </button>
        </NavTooltip>
      </div>
    );
  }

  return (
    <div className="mb-1">
      {/* Parent button */}
      <button
        onClick={toggleOpen}
        className={cn(
          'group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
          isGroupActive
            ? 'text-slate-900 bg-slate-50'
            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
        )}
      >
        <Icon
          className={cn(
            'shrink-0 w-4 h-4',
            item.color ?? 'text-slate-500',
            !isGroupActive && 'opacity-70 group-hover:opacity-100'
          )}
        />
        <span className="flex-1 text-left truncate">{item.title}</span>
        {item.badge !== undefined && (
          <span className="shrink-0 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center">
            {item.badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            'shrink-0 w-3.5 h-3.5 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Children */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 space-y-0.5">
              {item.children.map((child) => (
                <NavChildItem
                  key={child.id}
                  item={child}
                  isActive={
                    pathname === child.href ||
                    pathname.startsWith(child.href + '/')
                  }
                  isCollapsed={false}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── User Profile Footer ───────────────────────────────────────
function UserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  const router = useRouter();
  const user = {
    name: 'Admin User',
    role: 'ESG Administrator',
    initials: 'AU',
  };

  return (
    <div className="p-3 border-t border-slate-100">
      {/* Collapse toggle */}
      <button
        onClick={() => {}} // handled by parent
        className={cn(
          'eco-sidebar-toggle w-full flex items-center gap-2.5 px-3 py-2 rounded-lg',
          'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          'text-sm transition-colors mb-2',
          isCollapsed && 'justify-center px-0'
        )}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <>
            <PanelLeftClose className="w-4 h-4" />
            <span>Collapse sidebar</span>
          </>
        )}
      </button>

      {/* User info */}
      <div
        className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors',
          isCollapsed && 'justify-center p-0'
        )}
      >
        <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user.initials}
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden min-w-0 flex-1"
            >
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!isCollapsed && (
          <button
            title="Logout"
            className="shrink-0 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Sidebar ──────────────────────────────────────────────
export function Sidebar() {
  const { isCollapsed, isMobileOpen, closeMobile, toggleCollapse } =
    useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const sidebarWidth = isCollapsed ? 68 : 260;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          // Base styles
          'fixed top-0 left-0 h-full bg-white z-50',
          'flex flex-col overflow-hidden',
          'border-r border-slate-200 shadow-sm',
          // Mobile: hidden by default, shown when isMobileOpen
          !isMobileOpen && '-translate-x-full',
          isMobileOpen && 'translate-x-0',
          // Desktop: always visible
          'lg:translate-x-0',
          'transition-transform lg:transition-none duration-300'
        )}
        style={{ width: sidebarWidth }}
      >
        {/* ── Logo Header ──────────────────────────── */}
        <div
          className={cn(
            'h-16 flex items-center border-b border-slate-100 shrink-0 gap-3',
            isCollapsed ? 'justify-center px-3' : 'px-4'
          )}
        >
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            {/* Logo mark */}
            <div className="shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>

            {/* Brand text */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden whitespace-nowrap min-w-0"
                >
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    EcoSphere
                  </p>
                  <p className="text-[10px] font-semibold text-green-600 uppercase tracking-widest">
                    ESG Platform
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {/* Mobile close */}
          {isMobileOpen && !isCollapsed && (
            <button
              onClick={closeMobile}
              className="ml-auto shrink-0 p-1 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Navigation ───────────────────────────── */}
        <nav
          className={cn(
            'flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-0.5',
            isCollapsed ? 'px-2' : 'px-3'
          )}
        >
          {navigationItems.map((item) => (
            <NavParentItem
              key={item.id}
              item={item}
              isCollapsed={isCollapsed}
              pathname={pathname}
            />
          ))}
        </nav>

        {/* ── Footer ───────────────────────────────── */}
        <div
          className={cn(
            'shrink-0 border-t border-slate-100',
            isCollapsed ? 'p-2' : 'p-3'
          )}
        >
          {/* Collapse toggle */}
          <button
            onClick={toggleCollapse}
            className={cn(
              'w-full flex items-center gap-2.5 py-2 rounded-lg',
              'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
              'text-sm font-medium transition-colors mb-2',
              isCollapsed ? 'justify-center px-2' : 'px-3'
            )}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>

          {/* User profile */}
          <div
            onClick={() => router.push('/settings/profile')}
            className={cn(
              'flex items-center gap-3 p-2 rounded-lg',
              'hover:bg-slate-50 cursor-pointer group transition-colors',
              isCollapsed && 'justify-center p-2'
            )}
          >
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              AU
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    Admin User
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    ESG Administrator
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {!isCollapsed && (
              <button
                title="Sign out"
                onClick={(e) => {
                  e.stopPropagation();
                  mockSignOut();
                  router.push('/login');
                }}
                className="shrink-0 p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <LogOut className="shrink-0 w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}
