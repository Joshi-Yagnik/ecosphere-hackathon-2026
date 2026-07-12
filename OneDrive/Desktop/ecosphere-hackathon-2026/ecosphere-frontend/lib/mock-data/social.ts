// lib/mock-data/social.ts
// ============================================================
// EcoSphere – Social Module Mock Data
// ============================================================
import type { CsrActivity, EmployeeParticipation } from '@/types';

// ── CSR Activities ─────────────────────────────────────────────
export const csrActivities: CsrActivity[] = [
  {
    id: 'csr01', reference: 'CSR-2026-001', name: 'Annual Blood Donation Drive',
    category: 'Health', date: '2026-07-15', department: 'Human Resources', departmentId: 'd2',
    organizer: 'Anita Sharma', organizerId: 'e02', participantCount: 45, xpAwarded: 500,
    hasProof: true, state: 'approved', description: 'Company-wide blood donation camp in association with Red Cross.'
  },
  {
    id: 'csr02', reference: 'CSR-2026-002', name: 'Local Park Clean-up',
    category: 'Environment', date: '2026-07-22', department: 'Engineering', departmentId: 'd1',
    organizer: 'Rahul Mehta', organizerId: 'e01', participantCount: 18, xpAwarded: 300,
    hasProof: true, state: 'approved', description: 'Weekend clean-up drive at the city central park.'
  },
  {
    id: 'csr03', reference: 'CSR-2026-003', name: 'Digital Literacy for Seniors',
    category: 'Education', date: '2026-08-05', department: 'Operations', departmentId: 'd3',
    organizer: 'Kiran Patel', organizerId: 'e03', participantCount: 12, xpAwarded: 400,
    hasProof: false, state: 'approved', description: 'Teaching basic smartphone usage to residents of local old age home.'
  },
  {
    id: 'csr04', reference: 'CSR-2026-004', name: 'Orphanage Visit & Donation',
    category: 'Community', date: '2026-07-28', department: 'Finance', departmentId: 'd4',
    organizer: 'Sunita Joshi', organizerId: 'e04', participantCount: 8, xpAwarded: 250,
    hasProof: true, state: 'submitted', description: 'Donating clothes and books to Hope Orphanage.'
  },
  {
    id: 'csr05', reference: 'CSR-2026-005', name: 'Tree Plantation Drive',
    category: 'Environment', date: '2026-08-12', department: 'Marketing', departmentId: 'd5',
    organizer: 'Vikram Nair', organizerId: 'e05', participantCount: 30, xpAwarded: 350,
    hasProof: false, state: 'draft', description: 'Planting 100 saplings near the industrial area.'
  },
  {
    id: 'csr06', reference: 'CSR-2026-006', name: 'Food Bank Volunteering',
    category: 'Community', date: '2026-06-20', department: 'Engineering', departmentId: 'd1',
    organizer: 'Priya Sharma', organizerId: 'e06', participantCount: 15, xpAwarded: 200,
    hasProof: true, state: 'approved', description: 'Helping pack and distribute meals at the city food bank.'
  },
  {
    id: 'csr07', reference: 'CSR-2026-007', name: 'Marathon for Cancer Awareness',
    category: 'Health', date: '2026-09-10', department: 'Human Resources', departmentId: 'd2',
    organizer: 'Anita Sharma', organizerId: 'e02', participantCount: 55, xpAwarded: 600,
    hasProof: false, state: 'draft', description: 'Corporate participation in the city marathon.'
  },
  {
    id: 'csr08', reference: 'CSR-2026-008', name: 'Skill Development Workshop',
    category: 'Education', date: '2026-07-10', department: 'Engineering', departmentId: 'd1',
    organizer: 'Suresh Iyer', organizerId: 'e07', participantCount: 5, xpAwarded: 450,
    hasProof: false, state: 'rejected', description: 'Incomplete documentation submitted.'
  },
];

// ── Employee Participation ────────────────────────────────────
export const employeeParticipations: EmployeeParticipation[] = [
  {
    id: 'ep01', employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering',
    activityId: 'csr02', activityName: 'Local Park Clean-up', date: '2026-07-22',
    hoursContributed: 4, xpEarned: 300, badgeAwarded: 'Green Volunteer', state: 'approved'
  },
  {
    id: 'ep02', employeeId: 'e06', employeeName: 'Priya Sharma', department: 'Engineering',
    activityId: 'csr02', activityName: 'Local Park Clean-up', date: '2026-07-22',
    hoursContributed: 4, xpEarned: 300, state: 'approved'
  },
  {
    id: 'ep03', employeeId: 'e02', employeeName: 'Anita Sharma', department: 'Human Resources',
    activityId: 'csr01', activityName: 'Annual Blood Donation Drive', date: '2026-07-15',
    hoursContributed: 2, xpEarned: 500, badgeAwarded: 'Life Saver', state: 'approved'
  },
  {
    id: 'ep04', employeeId: 'e03', employeeName: 'Kiran Patel', department: 'Operations',
    activityId: 'csr03', activityName: 'Digital Literacy for Seniors', date: '2026-08-05',
    hoursContributed: 3, xpEarned: 400, state: 'pending'
  },
  {
    id: 'ep05', employeeId: 'e04', employeeName: 'Sunita Joshi', department: 'Finance',
    activityId: 'csr04', activityName: 'Orphanage Visit & Donation', date: '2026-07-28',
    hoursContributed: 5, xpEarned: 250, state: 'pending'
  },
  {
    id: 'ep06', employeeId: 'e05', employeeName: 'Vikram Nair', department: 'Marketing',
    activityId: 'csr05', activityName: 'Tree Plantation Drive', date: '2026-08-12',
    hoursContributed: 6, xpEarned: 350, state: 'pending'
  },
  {
    id: 'ep07', employeeId: 'e07', employeeName: 'Suresh Iyer', department: 'Engineering',
    activityId: 'csr06', activityName: 'Food Bank Volunteering', date: '2026-06-20',
    hoursContributed: 4, xpEarned: 200, state: 'approved'
  },
  {
    id: 'ep08', employeeId: 'e08', employeeName: 'Arun Kumar', department: 'Finance',
    activityId: 'csr01', activityName: 'Annual Blood Donation Drive', date: '2026-07-15',
    hoursContributed: 2, xpEarned: 500, state: 'approved'
  },
  {
    id: 'ep09', employeeId: 'e09', employeeName: 'Meena Reddy', department: 'Operations',
    activityId: 'csr03', activityName: 'Digital Literacy for Seniors', date: '2026-08-05',
    hoursContributed: 3, xpEarned: 400, state: 'pending'
  },
  {
    id: 'ep10', employeeId: 'e10', employeeName: 'Farhan Siddiqui', department: 'Finance',
    activityId: 'csr08', activityName: 'Skill Development Workshop', date: '2026-07-10',
    hoursContributed: 2, xpEarned: 0, state: 'rejected'
  }
];
