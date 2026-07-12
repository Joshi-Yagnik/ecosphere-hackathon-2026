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
  id: 'usr01',
  name: 'Sunita Joshi',
  role: 'ESG Director',
  department: 'Finance',
  email: 'sunita.joshi@ecosphere.local',
  avatar: '',
  timezone: 'Asia/Kolkata',
  language: 'English (UK)'
};
