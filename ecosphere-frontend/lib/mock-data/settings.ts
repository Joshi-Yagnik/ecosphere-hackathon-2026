// lib/mock-data/settings.ts
// ============================================================
// EcoSphere – Settings Module Mock Data
// ============================================================
import type { EsgConfig } from '@/types';

export const initialConfig: EsgConfig = {
  envWeight: 40,
  socialWeight: 35,
  govWeight: 25,
  emissionTrackingEnabled: true,
  evidenceRequiredForCsr: true,
  badgeAutoAwardEnabled: true,
  overdueAlertDays: 7,
  notificationEmail: true,
  notificationInApp: true,
};

export const currentUser = {
  id: 'usr-admin-01',
  name: 'Admin User',
  role: 'ESG Administrator',
  department: 'Administration',
  email: 'admin@ecosphere.com',
  avatar: '',
  timezone: 'Asia/Kolkata',
  language: 'English (US)'
};
