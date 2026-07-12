// lib/mock-data/gamification.ts
// ============================================================
// EcoSphere – Gamification Module Mock Data
// ============================================================
import type { Challenge, ChallengeParticipation, Badge, Reward, LeaderboardEntry } from '@/types';

// ── Challenges ────────────────────────────────────────────────
export const challenges: Challenge[] = [
  {
    id: 'ch01', reference: 'CH-2026-001', title: 'Zero Waste Month',
    description: 'Reduce office waste by 20% compared to last month. Avoid single-use plastics.',
    xpTarget: 1000, currentXp: 850, badge: 'Zero Waste Hero', badgeId: 'bdg03',
    deadline: '2026-07-31', participantCount: 142, state: 'active', category: 'Waste', progress: 85
  },
  {
    id: 'ch02', reference: 'CH-2026-002', title: 'Cycle to Work Week',
    description: 'Commute via bicycle or walking for at least 3 days in the week.',
    xpTarget: 500, currentXp: 500, badge: 'Eco Commuter', badgeId: 'bdg01',
    deadline: '2026-06-15', participantCount: 89, state: 'completed', category: 'Transport', progress: 100
  },
  {
    id: 'ch03', reference: 'CH-2026-003', title: 'Energy Saver Sprint',
    description: 'Turn off all non-essential equipment after hours for two consecutive weeks.',
    department: 'Engineering', xpTarget: 800, currentXp: 320, badge: 'Energy Guardian', badgeId: 'bdg04',
    deadline: '2026-08-15', participantCount: 45, state: 'active', category: 'Energy', progress: 40
  },
  {
    id: 'ch04', reference: 'CH-2026-004', title: 'Paperless Quarter',
    description: 'Zero printing in the department for the entire Q3.',
    xpTarget: 1200, currentXp: 0, badge: 'Digital Native', badgeId: 'bdg06',
    deadline: '2026-09-30', participantCount: 0, state: 'draft', category: 'Resource', progress: 0
  },
  {
    id: 'ch05', reference: 'CH-2026-005', title: 'Plant a Tree',
    description: 'Participate in the upcoming weekend tree plantation drive.',
    xpTarget: 300, currentXp: 270, badge: 'Green Thumb', badgeId: 'bdg02',
    deadline: '2026-08-10', participantCount: 65, state: 'active', category: 'Community', progress: 90
  }
];

// ── Challenge Participation ───────────────────────────────────
export const challengeParticipations: ChallengeParticipation[] = [
  { id: 'cp01', employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering', challengeId: 'ch01', challengeTitle: 'Zero Waste Month', xpEarned: 850, badgeAwarded: false, status: 'active', joinedAt: '2026-07-02' },
  { id: 'cp02', employeeId: 'e02', employeeName: 'Anita Sharma', department: 'Human Resources', challengeId: 'ch02', challengeTitle: 'Cycle to Work Week', xpEarned: 500, badgeAwarded: true, badgeName: 'Eco Commuter', status: 'completed', joinedAt: '2026-06-08' },
  { id: 'cp03', employeeId: 'e03', employeeName: 'Kiran Patel', department: 'Operations', challengeId: 'ch01', challengeTitle: 'Zero Waste Month', xpEarned: 400, badgeAwarded: false, status: 'active', joinedAt: '2026-07-05' },
  { id: 'cp04', employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering', challengeId: 'ch03', challengeTitle: 'Energy Saver Sprint', xpEarned: 320, badgeAwarded: false, status: 'active', joinedAt: '2026-07-20' },
  { id: 'cp05', employeeId: 'e05', employeeName: 'Vikram Nair', department: 'Marketing', challengeId: 'ch02', challengeTitle: 'Cycle to Work Week', xpEarned: 200, badgeAwarded: false, status: 'withdrawn', joinedAt: '2026-06-09' },
];

// ── Badges ────────────────────────────────────────────────────
export const badges: Badge[] = [
  { id: 'bdg01', name: 'Eco Commuter', description: 'Awarded for using sustainable transport to work.', xpValue: 100, unlockRule: 'challenge_complete', category: 'Transport', awardedCount: 145, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', active: true },
  { id: 'bdg02', name: 'Green Thumb', description: 'Awarded for planting a tree or participating in gardening.', xpValue: 150, unlockRule: 'activity_count', requiredActivityCount: 1, category: 'Community', awardedCount: 82, color: 'text-green-700 bg-green-50 border-green-200', active: true },
  { id: 'bdg03', name: 'Zero Waste Hero', description: 'Awarded for completing the Zero Waste challenge.', xpValue: 300, unlockRule: 'challenge_complete', category: 'Waste', awardedCount: 0, color: 'text-amber-700 bg-amber-50 border-amber-200', active: true },
  { id: 'bdg04', name: 'Energy Guardian', description: 'Awarded for reducing energy consumption by 15%.', xpValue: 250, unlockRule: 'carbon_reduction', category: 'Energy', awardedCount: 34, color: 'text-yellow-700 bg-yellow-50 border-yellow-200', active: true },
  { id: 'bdg05', name: 'CSR Champion', description: 'Earned 5,000 Total XP across all CSR activities.', xpValue: 500, unlockRule: 'xp_threshold', xpThreshold: 5000, category: 'General', awardedCount: 12, color: 'text-purple-700 bg-purple-50 border-purple-200', active: true },
  { id: 'bdg06', name: 'Digital Native', description: 'Maintained zero printing for an entire quarter.', xpValue: 200, unlockRule: 'challenge_complete', category: 'Resource', awardedCount: 0, color: 'text-blue-700 bg-blue-50 border-blue-200', active: false },
];

// ── Rewards ───────────────────────────────────────────────────
export const rewards: Reward[] = [
  { id: 'rw01', name: 'Extra Paid Leave (1 Day)', description: 'Redeem your XP for an extra day of paid time off.', xpCost: 5000, isUnlimited: false, totalQuantity: 100, remainingQuantity: 45, redeemedCount: 55, state: 'available', category: 'Perk' },
  { id: 'rw02', name: '$50 Eco-Store Gift Card', description: 'Gift card to the corporate sustainable merch store.', xpCost: 2000, isUnlimited: false, totalQuantity: 200, remainingQuantity: 12, redeemedCount: 188, state: 'limited', category: 'Merch' },
  { id: 'rw03', name: 'Premium Coffee Mug', description: 'Reusable insulated stainless steel coffee mug.', xpCost: 1000, isUnlimited: false, totalQuantity: 50, remainingQuantity: 0, redeemedCount: 50, state: 'exhausted', category: 'Merch' },
  { id: 'rw04', name: 'Donate $10 to Charity', description: 'Convert your XP into a corporate donation.', xpCost: 800, isUnlimited: true, totalQuantity: 0, remainingQuantity: 999, redeemedCount: 342, state: 'available', category: 'Donation' },
  { id: 'rw05', name: 'Lunch with the CEO', description: 'Exclusive 1-on-1 lunch meeting.', xpCost: 10000, isUnlimited: false, totalQuantity: 5, remainingQuantity: 4, redeemedCount: 1, state: 'available', category: 'Experience' },
];

// ── Leaderboard ───────────────────────────────────────────────
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering', totalXp: 8450, badgeCount: 12, challengesCompleted: 5, trend: 'stable', rankChange: 0 },
  { rank: 2, employeeId: 'e02', employeeName: 'Anita Sharma', department: 'Human Resources', totalXp: 8120, badgeCount: 10, challengesCompleted: 6, trend: 'up', rankChange: 2 },
  { rank: 3, employeeId: 'e04', employeeName: 'Sunita Joshi', department: 'Finance', totalXp: 7900, badgeCount: 9, challengesCompleted: 4, trend: 'down', rankChange: -1 },
  { rank: 4, employeeId: 'e06', employeeName: 'Priya Sharma', department: 'Engineering', totalXp: 7200, badgeCount: 8, challengesCompleted: 5, trend: 'up', rankChange: 1 },
  { rank: 5, employeeId: 'e03', employeeName: 'Kiran Patel', department: 'Operations', totalXp: 6850, badgeCount: 7, challengesCompleted: 3, trend: 'down', rankChange: -2 },
  { rank: 6, employeeId: 'e05', employeeName: 'Vikram Nair', department: 'Marketing', totalXp: 6500, badgeCount: 6, challengesCompleted: 3, trend: 'stable', rankChange: 0 },
  { rank: 7, employeeId: 'e08', employeeName: 'Arun Kumar', department: 'Finance', totalXp: 5900, badgeCount: 5, challengesCompleted: 2, trend: 'up', rankChange: 3 },
  { rank: 8, employeeId: 'e09', employeeName: 'Meena Reddy', department: 'Operations', totalXp: 5400, badgeCount: 4, challengesCompleted: 2, trend: 'stable', rankChange: 0 },
  { rank: 9, employeeId: 'e07', employeeName: 'Suresh Iyer', department: 'Engineering', totalXp: 5100, badgeCount: 4, challengesCompleted: 1, trend: 'down', rankChange: -2 },
  { rank: 10, employeeId: 'e10', employeeName: 'Farhan Siddiqui', department: 'Finance', totalXp: 4800, badgeCount: 3, challengesCompleted: 1, trend: 'stable', rankChange: 0 },
];
