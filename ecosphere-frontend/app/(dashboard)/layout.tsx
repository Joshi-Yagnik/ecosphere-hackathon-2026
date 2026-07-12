// app/(dashboard)/layout.tsx
// ============================================================
// Dashboard Route Group Layout
// ============================================================
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
