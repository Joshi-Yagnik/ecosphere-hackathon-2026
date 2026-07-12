// types/index.ts
// ============================================================
// EcoSphere – Global TypeScript Definitions
// ============================================================

// ── Navigation ───────────────────────────────────────────────
export interface NavChild {
  id: string;
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export interface NavItem {
  id: string;
  title: string;
  icon: React.ElementType;
  href?: string;
  color?: string;
  badge?: string | number;
  children?: NavChild[];
}

// ── ESG Score ─────────────────────────────────────────────────
export interface EsgScore {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  trend: 'up' | 'down' | 'stable';
  delta: number;
}

// ── KPI ───────────────────────────────────────────────────────
export interface KpiCard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  delta?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  iconColor: string;
}

// ── Department ────────────────────────────────────────────────
export interface Department {
  id: string;
  name: string;
  manager: string;
  esgScore: number;
  envScore: number;
  socialScore: number;
  govScore: number;
  carbonTarget: number;
  carbonActual: number;
  employeeCount: number;
  rank: number;
}

// ── Environmental ─────────────────────────────────────────────
export type GhgScope = 'scope1' | 'scope2' | 'scope3';
export type ActivityType =
  | 'electricity' | 'fuel' | 'travel_air' | 'travel_road'
  | 'travel_rail' | 'water' | 'waste' | 'refrigerant' | 'material' | 'other';

export interface EmissionFactor {
  id: string;
  code: string;
  name: string;
  scope: GhgScope;
  activityType: ActivityType;
  factorValue: number;
  factorUnit: string;
  activityUnit: string;
  source: string;
  year: number;
  category: string;
  active: boolean;
}

export type CarbonTransactionState = 'draft' | 'confirmed' | 'cancelled';

export interface CarbonTransaction {
  id: string;
  reference: string;
  date: string;
  department: string;
  departmentId: string;
  category: string;
  emissionFactor: string;
  emissionFactorId: string;
  quantity: number;
  unit: string;
  co2Equivalent: number;
  scope: GhgScope;
  sourceDocument?: string;
  state: CarbonTransactionState;
  notes?: string;
}

export type GoalState = 'draft' | 'active' | 'achieved' | 'missed';

export interface EnvironmentalGoal {
  id: string;
  reference: string;
  name: string;
  department: string;
  departmentId: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;
  startDate: string;
  deadline: string;
  daysRemaining: number;
  responsiblePerson: string;
  state: GoalState;
  isOverdue: boolean;
  priority: '0' | '1' | '2';
}

// ── Social ────────────────────────────────────────────────────
export type CsrState = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface CsrActivity {
  id: string;
  reference: string;
  name: string;
  category: string;
  date: string;
  department: string;
  departmentId: string;
  organizer: string;
  organizerId: string;
  participantCount: number;
  xpAwarded: number;
  hasProof: boolean;
  proofUrl?: string;
  state: CsrState;
  description?: string;
}

export interface EmployeeParticipation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  activityId: string;
  activityName: string;
  date: string;
  hoursContributed: number;
  xpEarned: number;
  badgeAwarded?: string;
  state: 'pending' | 'approved' | 'rejected';
}

// ── Governance ────────────────────────────────────────────────
export type PolicyState = 'draft' | 'active' | 'archived';
export type PolicyType = 'environmental' | 'social' | 'governance' | 'general';

export interface Policy {
  id: string;
  code: string;
  name: string;
  policyType: PolicyType;
  category: string;
  version: string;
  owner: string;
  effectiveDate: string;
  expiryDate?: string;
  isMandatory: boolean;
  acknowledgementCount: number;
  state: PolicyState;
  isExpired: boolean;
  summary?: string;
}

export interface PolicyAcknowledgement {
  id: string;
  policyId: string;
  policyName: string;
  employeeId: string;
  employeeName: string;
  department: string;
  acknowledgedAt: string;
  isOverdue: boolean;
}

export type AuditState = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface Audit {
  id: string;
  reference: string;
  name: string;
  auditor: string;
  auditDate: string;
  scope: string;
  department: string;
  state: AuditState;
  score?: number;
  findings?: string;
}

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type ComplianceState = 'open' | 'in_progress' | 'resolved' | 'escalated';

export interface ComplianceIssue {
  id: string;
  reference: string;
  title: string;
  severity: Severity;
  category: string;
  department: string;
  owner: string;
  dueDate: string;
  state: ComplianceState;
  isOverdue: boolean;
  description?: string;
  resolution?: string;
}

// ── Gamification ──────────────────────────────────────────────
export type ChallengeState = 'draft' | 'active' | 'under_review' | 'completed' | 'archived';

export interface Challenge {
  id: string;
  reference: string;
  title: string;
  description: string;
  department?: string;
  xpTarget: number;
  currentXp: number;
  badge?: string;
  badgeId?: string;
  deadline: string;
  participantCount: number;
  state: ChallengeState;
  category: string;
  progress: number;
}

export interface ChallengeParticipation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  challengeId: string;
  challengeTitle: string;
  xpEarned: number;
  badgeAwarded: boolean;
  badgeName?: string;
  status: 'active' | 'completed' | 'withdrawn';
  joinedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  image?: string;
  xpValue: number;
  unlockRule: 'none' | 'xp_threshold' | 'activity_count' | 'challenge_complete' | 'carbon_reduction';
  xpThreshold?: number;
  requiredActivityCount?: number;
  category: string;
  awardedCount: number;
  color: string;
  active: boolean;
}

export type RewardState = 'available' | 'limited' | 'exhausted';

export interface Reward {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  isUnlimited: boolean;
  totalQuantity?: number;
  remainingQuantity?: number;
  redeemedCount: number;
  state: RewardState;
  expiryDate?: string;
  isExpired: boolean;
  category: string;
  image?: string;
}

export interface LeaderboardEntry {
  rank: number;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  totalXp: number;
  badgeCount: number;
  challengesCompleted: number;
  trend: 'up' | 'down' | 'stable';
  rankChange: number;
}

// ── Reports ───────────────────────────────────────────────────
export type ReportFormat = 'pdf' | 'excel' | 'csv';

export interface ReportFilter {
  dateFrom?: string;
  dateTo?: string;
  departmentId?: string;
  categoryId?: string;
  employeeId?: string;
  format: ReportFormat;
}

// ── Settings ──────────────────────────────────────────────────
export interface EsgConfig {
  envWeight: number;
  socialWeight: number;
  govWeight: number;
  emissionTrackingEnabled: boolean;
  evidenceRequiredForCsr: boolean;
  badgeAutoAwardEnabled: boolean;
  overdueAlertDays: number;
  notificationEmail: boolean;
  notificationInApp: boolean;
}

// ── Recent Activity ───────────────────────────────────────────
export interface RecentActivity {
  id: string;
  type: 'carbon' | 'csr' | 'policy' | 'badge' | 'compliance' | 'audit' | 'challenge';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  userAvatar?: string;
  department?: string;
}

// ── Chart Data ────────────────────────────────────────────────
export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}
