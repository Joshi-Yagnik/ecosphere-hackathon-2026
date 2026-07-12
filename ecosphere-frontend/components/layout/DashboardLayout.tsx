'use client';

// components/layout/DashboardLayout.tsx
// ============================================================
// EcoSphere – Dashboard Layout Wrapper
// Sidebar + Navbar + scrollable content area
// ============================================================
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarProvider, useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

// ── Inner layout reads sidebar context ───────────────────────
function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/*
        Main area – offset by sidebar width using Tailwind classes.
        lg: prefix ensures no margin on mobile (sidebar is overlay).
        transition-all animates the margin when sidebar collapses.
      */}
      <div
        className={cn(
          'flex-1 flex flex-col overflow-hidden',
          'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
          isCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
        )}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Exported layout wraps InnerLayout with the provider ──────
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <InnerLayout>{children}</InnerLayout>
    </SidebarProvider>
  );
}
