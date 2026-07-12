// lib/mock-data/governance.ts
// ============================================================
// EcoSphere – Governance Module Mock Data
// ============================================================
import type { Policy, PolicyAcknowledgement, Audit, ComplianceIssue } from '@/types';

// ── Policies ──────────────────────────────────────────────────
export const policies: Policy[] = [
  {
    id: 'pol01', code: 'POL-ENV-001', name: 'Carbon Emissions Management Policy',
    policyType: 'environmental', category: 'Carbon',
    version: 'v2.1', owner: 'Rahul Mehta',
    effectiveDate: '2026-01-01', expiryDate: '2027-01-01',
    isMandatory: true, acknowledgementCount: 38, state: 'active', isExpired: false,
    summary: 'Governs the organization\'s approach to tracking, reporting and reducing GHG emissions across all scopes.',
  },
  {
    id: 'pol02', code: 'POL-SOC-001', name: 'CSR & Community Engagement Policy',
    policyType: 'social', category: 'CSR',
    version: 'v1.3', owner: 'Anita Sharma',
    effectiveDate: '2026-03-01',
    isMandatory: true, acknowledgementCount: 45, state: 'active', isExpired: false,
    summary: 'Defines standards for conducting and reporting corporate social responsibility activities.',
  },
  {
    id: 'pol03', code: 'POL-GOV-001', name: 'Anti-Bribery & Corruption Policy',
    policyType: 'governance', category: 'Ethics',
    version: 'v3.0', owner: 'Sunita Joshi',
    effectiveDate: '2025-06-01', expiryDate: '2026-06-01',
    isMandatory: true, acknowledgementCount: 62, state: 'active', isExpired: false,
    summary: 'Zero-tolerance policy against bribery and corruption in all business dealings.',
  },
  {
    id: 'pol04', code: 'POL-ENV-002', name: 'Water Conservation Directive',
    policyType: 'environmental', category: 'Water',
    version: 'v1.0', owner: 'Kiran Patel',
    effectiveDate: '2026-05-01',
    isMandatory: false, acknowledgementCount: 12, state: 'active', isExpired: false,
    summary: 'Guidelines for responsible water usage across office and manufacturing facilities.',
  },
  {
    id: 'pol05', code: 'POL-GEN-001', name: 'Workplace Safety & Health Policy',
    policyType: 'general', category: 'Safety',
    version: 'v2.0', owner: 'Vikram Nair',
    effectiveDate: '2025-01-01', expiryDate: '2026-01-01',
    isMandatory: true, acknowledgementCount: 72, state: 'archived', isExpired: true,
    summary: 'Previous version of the workplace safety handbook. Superseded by v3.0.',
  },
  {
    id: 'pol06', code: 'POL-GOV-002', name: 'Data Privacy & Information Security',
    policyType: 'governance', category: 'Privacy',
    version: 'v1.2', owner: 'Suresh Iyer',
    effectiveDate: '2026-02-15',
    isMandatory: true, acknowledgementCount: 8, state: 'draft', isExpired: false,
    summary: 'Draft policy covering GDPR compliance and internal data handling procedures.',
  },
  {
    id: 'pol07', code: 'POL-SOC-002', name: 'Equal Opportunity & Diversity Policy',
    policyType: 'social', category: 'Diversity',
    version: 'v1.0', owner: 'Meena Reddy',
    effectiveDate: '2026-04-01',
    isMandatory: true, acknowledgementCount: 55, state: 'active', isExpired: false,
    summary: 'Commits the organization to fair hiring, equal pay and inclusive workplace practices.',
  },
];

// ── Policy Acknowledgements ───────────────────────────────────
export const policyAcknowledgements: PolicyAcknowledgement[] = [
  { id: 'ack01', policyId: 'pol01', policyName: 'Carbon Emissions Management Policy', employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering', acknowledgedAt: '2026-01-10T09:30:00Z', isOverdue: false },
  { id: 'ack02', policyId: 'pol01', policyName: 'Carbon Emissions Management Policy', employeeId: 'e02', employeeName: 'Anita Sharma', department: 'Human Resources', acknowledgedAt: '2026-01-12T11:00:00Z', isOverdue: false },
  { id: 'ack03', policyId: 'pol02', policyName: 'CSR & Community Engagement Policy', employeeId: 'e01', employeeName: 'Rahul Mehta', department: 'Engineering', acknowledgedAt: '2026-03-05T10:00:00Z', isOverdue: false },
  { id: 'ack04', policyId: 'pol03', policyName: 'Anti-Bribery & Corruption Policy', employeeId: 'e04', employeeName: 'Sunita Joshi', department: 'Finance', acknowledgedAt: '2025-06-10T14:30:00Z', isOverdue: false },
  { id: 'ack05', policyId: 'pol03', policyName: 'Anti-Bribery & Corruption Policy', employeeId: 'e05', employeeName: 'Vikram Nair', department: 'Marketing', acknowledgedAt: '2025-06-15T09:00:00Z', isOverdue: false },
  { id: 'ack06', policyId: 'pol07', policyName: 'Equal Opportunity & Diversity Policy', employeeId: 'e03', employeeName: 'Kiran Patel', department: 'Operations', acknowledgedAt: '2026-04-03T16:00:00Z', isOverdue: false },
  { id: 'ack07', policyId: 'pol06', policyName: 'Data Privacy & Information Security', employeeId: 'e07', employeeName: 'Suresh Iyer', department: 'Engineering', acknowledgedAt: '2026-02-20T10:15:00Z', isOverdue: true },
  { id: 'ack08', policyId: 'pol01', policyName: 'Carbon Emissions Management Policy', employeeId: 'e06', employeeName: 'Priya Sharma', department: 'Engineering', acknowledgedAt: '2026-01-18T08:45:00Z', isOverdue: false },
  { id: 'ack09', policyId: 'pol04', policyName: 'Water Conservation Directive', employeeId: 'e08', employeeName: 'Arun Kumar', department: 'Finance', acknowledgedAt: '2026-05-10T13:20:00Z', isOverdue: false },
  { id: 'ack10', policyId: 'pol02', policyName: 'CSR & Community Engagement Policy', employeeId: 'e09', employeeName: 'Meena Reddy', department: 'Operations', acknowledgedAt: '2026-03-08T11:45:00Z', isOverdue: true },
];

// ── Audits ────────────────────────────────────────────────────
export const audits: Audit[] = [
  {
    id: 'aud01', reference: 'AUD-2026-001', name: 'Q1 Environmental Compliance Audit',
    auditor: 'External – EcoVerify Ltd', auditDate: '2026-04-15',
    scope: 'Carbon Emissions, Waste, Water Usage', department: 'Engineering',
    state: 'completed', score: 87,
    findings: 'Scope 2 emissions exceeded target by 8%. Waste segregation practices in engineering lab need improvement.',
  },
  {
    id: 'aud02', reference: 'AUD-2026-002', name: 'Anti-Bribery Policy Audit',
    auditor: 'Internal – Legal Team', auditDate: '2026-05-10',
    scope: 'Vendor Contracts, Procurement Policies', department: 'Finance',
    state: 'completed', score: 96,
    findings: 'No issues found. All vendor agreements comply with anti-bribery policy.',
  },
  {
    id: 'aud03', reference: 'AUD-2026-003', name: 'Q2 Safety & Health Audit',
    auditor: 'External – SafeCheck Pvt Ltd', auditDate: '2026-07-20',
    scope: 'Workplace Safety, Fire Safety, Emergency Procedures', department: 'Operations',
    state: 'scheduled',
  },
  {
    id: 'aud04', reference: 'AUD-2026-004', name: 'Data Privacy Compliance Review',
    auditor: 'Internal – IT Security', auditDate: '2026-07-12',
    scope: 'GDPR Compliance, Data Handling, Employee Data', department: 'Engineering',
    state: 'in_progress',
  },
  {
    id: 'aud05', reference: 'AUD-2026-005', name: 'Supplier Diversity Audit',
    auditor: 'External – DiversityAudit Inc', auditDate: '2026-06-01',
    scope: 'Procurement diversity, Minority vendor spend', department: 'Marketing',
    state: 'completed', score: 72,
    findings: 'Minority-owned vendor spend is at 12%, below the 20% target. Corrective action plan required.',
  },
  {
    id: 'aud06', reference: 'AUD-2026-006', name: 'Q3 CSR Impact Audit',
    auditor: 'External – GoodImpact Auditors', auditDate: '2026-09-25',
    scope: 'CSR Event Outcomes, Volunteer Hour Verification', department: 'Human Resources',
    state: 'scheduled',
  },
];

// ── Compliance Issues ─────────────────────────────────────────
export const complianceIssues: ComplianceIssue[] = [
  {
    id: 'ci01', reference: 'CI-2026-001', title: 'Scope 2 Emissions Exceed Quarterly Target',
    severity: 'high', category: 'Environmental', department: 'Engineering',
    owner: 'Rahul Mehta', dueDate: '2026-08-01',
    state: 'in_progress', isOverdue: false,
    description: 'Electricity consumption in the engineering block exceeded Q2 carbon budget by 8%. Action plan is being implemented.',
    resolution: '',
  },
  {
    id: 'ci02', reference: 'CI-2026-002', title: 'Waste Segregation Non-Compliance',
    severity: 'medium', category: 'Environmental', department: 'Engineering',
    owner: 'Priya Sharma', dueDate: '2026-07-20',
    state: 'open', isOverdue: true,
    description: 'Lab waste not being segregated as per ISO 14001 guidelines. Flagged during Q1 audit.',
  },
  {
    id: 'ci03', reference: 'CI-2026-003', title: 'Missing Policy Acknowledgements – Data Privacy',
    severity: 'medium', category: 'Governance', department: 'Engineering',
    owner: 'Suresh Iyer', dueDate: '2026-07-15',
    state: 'open', isOverdue: true,
    description: '23 employees yet to acknowledge the Data Privacy & Information Security policy (draft).',
  },
  {
    id: 'ci04', reference: 'CI-2026-004', title: 'Supplier Diversity Below Target',
    severity: 'low', category: 'Social', department: 'Marketing',
    owner: 'Vikram Nair', dueDate: '2026-10-01',
    state: 'open', isOverdue: false,
    description: 'Minority-owned vendor spending at 12% vs. 20% target. Corrective procurement plan required.',
  },
  {
    id: 'ci05', reference: 'CI-2026-005', title: 'Expired Safety Policy Not Renewed',
    severity: 'critical', category: 'Governance', department: 'Operations',
    owner: 'Kiran Patel', dueDate: '2026-07-10',
    state: 'escalated', isOverdue: true,
    description: 'POL-GEN-001 expired on 2026-01-01 and the new version v3.0 has not been published.',
    resolution: 'Escalated to Compliance Head. Draft in review.',
  },
  {
    id: 'ci06', reference: 'CI-2026-006', title: 'Incorrect Emission Factor Applied',
    severity: 'low', category: 'Environmental', department: 'Finance',
    owner: 'Arun Kumar', dueDate: '2026-08-15',
    state: 'resolved', isOverdue: false,
    description: 'IPCC 2021 electricity emission factor was incorrectly applied for Jan–Mar period.',
    resolution: 'Corrected in system and historical records recalculated.',
  },
];
