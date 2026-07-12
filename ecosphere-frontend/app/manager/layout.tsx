'use client';

// app/manager/layout.tsx
// ============================================================
// Department Manager Route Group Layout
// ============================================================
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockGetSession } from '@/lib/mock-auth';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const session = mockGetSession();
    if (!session || session.user?.role !== 'manager') {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) return null; // or a loading spinner

  return <DashboardLayout>{children}</DashboardLayout>;
}
