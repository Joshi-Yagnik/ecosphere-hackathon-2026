// src/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { SidebarProvider, useSidebar } from '@/hooks/useSidebar';
import { cn } from '@/lib/utils';

function InnerLayout() {
  const { isCollapsed } = useSidebar();
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />
      <div className={cn(
        'flex-1 flex flex-col overflow-hidden',
        'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)]',
        isCollapsed ? 'lg:ml-[68px]' : 'lg:ml-[260px]'
      )}>
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <InnerLayout />
    </SidebarProvider>
  );
}
