// app/layout.tsx
// ============================================================
// EcoSphere – Root Layout
// ============================================================
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EcoSphere – ESG Management Platform',
    template: '%s | EcoSphere',
  },
  description:
    'Enterprise ESG Management Platform for measuring, monitoring and improving Environmental, Social and Governance performance.',
  keywords: ['ESG', 'sustainability', 'environmental', 'carbon', 'governance', 'CSR'],
  authors: [{ name: 'EcoSphere Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
