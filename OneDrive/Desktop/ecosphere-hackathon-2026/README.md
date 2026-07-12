# EcoSphere — ESG Management Platform
## Technical & Architecture Specification (Development Prompt)

> Purpose: This document is written as a build-ready specification/prompt that can be handed to a development team or an AI coding assistant to implement the EcoSphere platform end-to-end — architecture, database, API, business rules, and modules — following an Odoo-style modular ERP pattern.

---

## 1. Project Overview

Build **EcoSphere**, a modular ESG (Environmental, Social, Governance) Management Platform that plugs into day-to-day ERP operations. The system must:

- Convert operational transactions (purchases, manufacturing, expenses, fleet) into carbon accounting entries
- Track social initiatives, employee participation, diversity, and training
- Manage governance policies, audits, and compliance issues
- Gamify sustainable behavior via XP, badges, challenges, rewards, and leaderboards
- Aggregate everything into department and organization-level ESG scores
- Produce configurable, exportable reports

Design it like an Odoo application suite: a set of independently-installable **modules**, each with its own models, views, access rules, and business logic, all sharing a common ORM/database layer and a unified dashboard shell.

---

## 2. System Architecture

### 2.1 High-Level Architecture (Layered / Modular Monolith)

```
┌──────────────────────────────────────────────────────────────┐
│                        Presentation Layer                     │
│  Web App (React/Vue) · Mobile-responsive UI · Admin Console   │
└───────────────────────────┬────────────────────────────────────┘
                            │ REST / GraphQL (JSON, JWT auth)
┌───────────────────────────▼────────────────────────────────────┐
│                         API Gateway Layer                      │
│   Auth · Rate limiting · Request routing · Versioning (/v1)   │
└───────────────────────────┬────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                      Application / Module Layer                │
│  ┌───────────┐ ┌─────────┐ ┌────────────┐ ┌─────────────────┐ │
│  │Environment│ │ Social  │ │ Governance │ │  Gamification    │ │
│  │  Module   │ │ Module  │ │  Module    │ │    Module        │ │
│  └───────────┘ └─────────┘ └────────────┘ └─────────────────┘ │
│  ┌───────────┐ ┌─────────┐ ┌────────────┐                     │
│  │ Scoring   │ │ Report  │ │Notification│                     │
│  │  Engine   │ │ Engine  │ │  Engine    │                     │
│  └───────────┘ └─────────┘ └────────────┘                     │
└───────────────────────────┬────────────────────────────────────┘
                            │ ORM
┌───────────────────────────▼────────────────────────────────────┐
│                          Data Layer                             │
│   PostgreSQL (transactional) · Redis (cache/queue) · S3/Blob   │
│   (proof files, evidence, report exports)                      │
└──────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────────────┐
│                    Integration Layer (ERP Bridge)               │
│  Connectors: Purchase · Manufacturing · Expense · Fleet modules│
│  (pull operational data to auto-calculate emissions)            │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Recommended Tech Stack

| Layer | Recommendation | Notes |
|---|---|---|
| Backend framework | Odoo (Python) **or** NestJS/Django + PostgreSQL | Odoo gives ERP integration, ORM, access rules, and a module system out of the box |
| Frontend | Odoo Web (OWL) or a decoupled React/Next.js SPA | Needed for gamified UI (leaderboards, badges, XP bars) |
| Database | PostgreSQL 15+ | Relational, strong for scoring aggregations |
| Cache/Queue | Redis + Celery (or Odoo's built-in cron) | For async score recalculation, notifications, badge checks |
| File storage | S3-compatible object storage | Evidence/proof files, report exports |
| Auth | OAuth2 / JWT, role-based access control (RBAC) | Integrated with existing ERP user directory |
| Reporting | QWeb / WeasyPrint (PDF), openpyxl (Excel), pandas (CSV) | Matches "PDF / Excel / CSV" export requirement |
| Notifications | Email (SMTP) + in-app (WebSocket/bus) | Configurable per event type |

### 2.3 Module Breakdown (Odoo-style apps)

Each module below should be buildable/installable independently, with its own models, security groups, menus, and views:

1. `esg_base` — shared Category, Department, ESG Configuration, weighting rules
2. `esg_environmental` — Emission Factor, Carbon Transaction, Environmental Goal, Product ESG Profile
3. `esg_social` — CSR Activity, Employee Participation, Diversity Metrics, Training Completion
4. `esg_governance` — ESG Policy, Policy Acknowledgement, Audit, Compliance Issue
5. `esg_gamification` — Challenge, Challenge Participation, Badge, Reward, Leaderboard, XP Ledger
6. `esg_scoring` — Department Score, Overall ESG Score engine (weighted aggregation)
7. `esg_reports` — Report templates + Custom Report Builder
8. `esg_notifications` — Notification templates, triggers, delivery channels

---

## 3. Database Schema

### 3.1 Master Data Tables

**`department`**
| Field | Type | Notes |
|---|---|---|
| id | UUID / int PK | |
| name | varchar | |
| code | varchar unique | |
| head_employee_id | FK → employee | Department Head |
| parent_department_id | FK → department (self) | Hierarchy |
| employee_count | int | Can be computed |
| status | enum(active, inactive) | |

**`category`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | |
| type | enum(csr_activity, challenge) | Shared across Social & Gamification |
| status | enum(active, inactive) | |

**`emission_factor`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | e.g. "Diesel (litre)" |
| category | varchar/FK | Fuel, Electricity, Material, Travel, etc. |
| unit | varchar | kg, litre, kWh |
| co2e_per_unit | decimal | Emission factor value |
| source | varchar | e.g. DEFRA, EPA reference |
| valid_from / valid_to | date | Versioning for factor changes |

**`product_esg_profile`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| product_id | FK → product | ERP product link |
| default_emission_factor_id | FK → emission_factor | |
| lifecycle_notes | text | |
| sustainability_rating | int/enum | |

**`environmental_goal`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| department_id | FK → department (nullable = org-wide) | |
| metric | enum(emission, energy, water, waste) | |
| target_value | decimal | |
| baseline_value | decimal | |
| target_date | date | |
| status | enum(on_track, at_risk, achieved, missed) | Computed |

**`esg_policy`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title | varchar | |
| category | enum(environmental, social, governance) | |
| version | varchar | |
| document_file | file/attachment | |
| effective_date | date | |
| status | enum(draft, published, archived) | |

**`badge`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | |
| description | text | |
| icon | image/attachment | |
| unlock_rule | JSON | e.g. `{"metric":"xp_total","operator":">=","value":500}` |
| status | enum(active, inactive) | |

**`reward`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| name | varchar | |
| description | text | |
| points_required | int | |
| stock | int | Decremented on redemption |
| status | enum(active, out_of_stock, inactive) | |

### 3.2 Transactional Data Tables

**`carbon_transaction`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| source_document_type | enum(purchase, manufacturing, expense, fleet, manual) | |
| source_document_id | FK (polymorphic) | Link to originating ERP record |
| department_id | FK → department | |
| emission_factor_id | FK → emission_factor | |
| quantity | decimal | |
| co2e_calculated | decimal | quantity × factor |
| calculation_mode | enum(auto, manual) | Governed by Settings toggle |
| date | date | |
| status | enum(draft, confirmed) | |

**`csr_activity`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title | varchar | |
| category_id | FK → category (type=csr_activity) | |
| description | text | |
| department_id | FK → department | Organizer |
| start_date / end_date | date | |
| points_value | int | Base points for participation |
| status | enum(draft, active, completed, archived) | |

**`employee_participation`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| employee_id | FK → employee | |
| activity_id | FK → csr_activity | |
| proof_file | attachment | Required if Evidence Requirement enabled |
| approval_status | enum(pending, approved, rejected) | |
| points_earned | int | Set on approval |
| completion_date | date | |

**`challenge`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title | varchar | |
| category_id | FK → category (type=challenge) | |
| description | text | |
| xp_value | int | |
| difficulty | enum(easy, medium, hard) | |
| evidence_required | boolean | |
| deadline | date | |
| status | enum(draft, active, under_review, completed, archived) | |

**`challenge_participation`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| challenge_id | FK → challenge | |
| employee_id | FK → employee | |
| progress | decimal/percent | |
| proof_file | attachment | |
| approval_status | enum(pending, approved, rejected) | |
| xp_awarded | int | |

**`policy_acknowledgement`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| policy_id | FK → esg_policy | |
| employee_id | FK → employee | |
| acknowledged_at | datetime | |
| status | enum(pending, acknowledged, overdue) | |

**`audit`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| title | varchar | |
| department_id | FK → department | |
| auditor | varchar/FK → employee | |
| audit_date | date | |
| scope | text | |
| status | enum(planned, in_progress, completed) | |

**`compliance_issue`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| audit_id | FK → audit | |
| severity | enum(low, medium, high, critical) | |
| description | text | |
| owner_id | FK → employee | **Required** |
| due_date | date | **Required** |
| status | enum(open, in_progress, resolved, overdue) | Auto-flagged overdue via cron |

**`department_score`**
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| department_id | FK → department | |
| period | date/month | Scores computed per reporting period |
| environmental_score | decimal(5,2) | |
| social_score | decimal(5,2) | |
| governance_score | decimal(5,2) | |
| total_score | decimal(5,2) | Weighted per org configuration |

**`xp_ledger`** *(supporting Gamification, recommended addition)*
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| employee_id | FK → employee | |
| source_type | enum(challenge, csr_activity, manual_adjustment) | |
| source_id | FK (polymorphic) | |
| xp_delta | int | |
| points_delta | int | |
| created_at | datetime | |

**`reward_redemption`** *(supporting Reward Redemption, recommended addition)*
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| employee_id | FK → employee | |
| reward_id | FK → reward | |
| points_spent | int | |
| redeemed_at | datetime | |
| status | enum(pending, fulfilled, cancelled) | |

**`esg_configuration`** *(org-level settings)*
| Field | Type | Notes |
|---|---|---|
| id | PK | |
| environmental_weight | decimal | Default 0.40 |
| social_weight | decimal | Default 0.30 |
| governance_weight | decimal | Default 0.30 |
| auto_emission_calculation | boolean | |
| evidence_required_default | boolean | |
| badge_auto_award | boolean | |
| notification_settings | JSON | |

### 3.3 Key Relationships (ERD summary)

- `department` 1—N `carbon_transaction`, `csr_activity`, `department_score`
- `employee` 1—N `employee_participation`, `challenge_participation`, `xp_ledger`, `policy_acknowledgement`
- `challenge` 1—N `challenge_participation`
- `csr_activity` 1—N `employee_participation`
- `audit` 1—N `compliance_issue`
- `badge` N—N `employee` (via an `employee_badge` join table, auto-populated when unlock_rule is satisfied)
- `reward` 1—N `reward_redemption`

---

## 4. API Design (REST, versioned `/api/v1`)

Authentication: Bearer JWT; all endpoints scoped by organization and RBAC role (Admin, ESG Manager, Department Head, Employee, Auditor).

### 4.1 Environmental

```
GET    /api/v1/emission-factors
POST   /api/v1/emission-factors
PUT    /api/v1/emission-factors/{id}
GET    /api/v1/carbon-transactions?department_id=&date_from=&date_to=
POST   /api/v1/carbon-transactions              # manual entry
POST   /api/v1/carbon-transactions/calculate     # trigger auto-calc batch
GET    /api/v1/environmental-goals
POST   /api/v1/environmental-goals
GET    /api/v1/dashboard/environmental
```

### 4.2 Social

```
GET    /api/v1/csr-activities
POST   /api/v1/csr-activities
GET    /api/v1/csr-activities/{id}/participants
POST   /api/v1/employee-participation             # employee joins/submits proof
PATCH  /api/v1/employee-participation/{id}/approve
PATCH  /api/v1/employee-participation/{id}/reject
GET    /api/v1/diversity-metrics
GET    /api/v1/training-completion
```

### 4.3 Governance

```
GET    /api/v1/policies
POST   /api/v1/policies
POST   /api/v1/policies/{id}/acknowledge           # employee action
GET    /api/v1/policies/acknowledgement-status
GET    /api/v1/audits
POST   /api/v1/audits
GET    /api/v1/compliance-issues?status=overdue
POST   /api/v1/compliance-issues
PATCH  /api/v1/compliance-issues/{id}
```

### 4.4 Gamification

```
GET    /api/v1/challenges?status=active
POST   /api/v1/challenges
POST   /api/v1/challenge-participation              # join challenge
PATCH  /api/v1/challenge-participation/{id}/progress
PATCH  /api/v1/challenge-participation/{id}/approve
GET    /api/v1/badges
GET    /api/v1/employees/{id}/badges
GET    /api/v1/rewards
POST   /api/v1/rewards/{id}/redeem
GET    /api/v1/leaderboard?scope=department|organization&period=
```

### 4.5 Scoring

```
GET    /api/v1/scores/department/{id}
GET    /api/v1/scores/organization
POST   /api/v1/scores/recalculate      # admin-triggered or cron
```

### 4.6 Reports

```
GET    /api/v1/reports/environmental
GET    /api/v1/reports/social
GET    /api/v1/reports/governance
GET    /api/v1/reports/esg-summary
POST   /api/v1/reports/custom-builder     # body: {filters: {department, date_range, module, employee, challenge, esg_category}, export_format: pdf|excel|csv}
```

### 4.7 Settings & Administration

```
GET/PUT /api/v1/config/esg-weighting
GET/PUT /api/v1/config/toggles            # auto_emission_calculation, evidence_required, badge_auto_award
GET/PUT /api/v1/config/notifications
GET/POST /api/v1/departments
GET/POST /api/v1/categories
```

### 4.8 Notifications

```
GET  /api/v1/notifications                # in-app feed
POST /api/v1/notifications/mark-read
```

---

## 5. Core Business Rules Engine

Implement each as a discrete, testable rule/service:

1. **Auto Emission Calculation** — Cron/event listener on Purchase/Manufacturing/Expense/Fleet creation → resolves Emission Factor → writes Carbon Transaction. Toggle-gated.
2. **Evidence Requirement** — Validation rule blocking `employee_participation.approval_status = approved` unless `proof_file` is attached, when toggle is enabled.
3. **Badge Auto-Award** — After every XP Ledger write or Challenge/CSR approval, evaluate all active Badge `unlock_rule` expressions against the employee's cumulative metrics; insert into `employee_badge` and fire a notification if matched.
4. **Reward Redemption** — Check `reward.stock > 0` and `employee.points_balance >= points_required`; deduct points, decrement stock, create `reward_redemption` record, atomically (use a DB transaction to avoid race conditions on stock).
5. **Compliance Issue Ownership & Escalation** — Enforce `owner_id` and `due_date` as required fields at the DB/validation layer; nightly cron flips `status → overdue` when `due_date < today AND status = open`, and triggers a notification.
6. **Scoring Aggregation** — Scheduled job (e.g., nightly or on-demand) computes:
   - `environmental_score` from Carbon Transactions vs. Goals
   - `social_score` from CSR participation rate, diversity metrics, training completion
   - `governance_score` from policy acknowledgement rate, audit findings, open compliance issues
   - `total_score = env_weight × environmental_score + social_weight × social_score + governance_weight × governance_score`
   - Rolls up to Organization Dashboard as a weighted average of Department Total Scores.
7. **Notification Triggers** — Event-driven (pub/sub or ORM hooks) for: new Compliance Issue, CSR/Challenge approval decisions, Policy Acknowledgement reminders (scheduled), Badge unlocks.

---

## 6. Reports Module

- Environmental Report, Social Report, Governance Report, ESG Summary Report — each a pre-built template pulling from the relevant module's tables
- **Custom Report Builder** — a query-builder UI/endpoint accepting filters (Department, Date Range, Module, Employee, Challenge, ESG Category) and an export format (PDF via templating engine, Excel via openpyxl, CSV via direct export)
- All reports should support scheduled generation + email delivery (ties into Notification Engine)

---

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Scalability | Support multi-department orgs with 1,000+ employees; async score recalculation to avoid blocking UI |
| Security | RBAC per module; row-level security scoped to department for Department Heads |
| Auditability | All approval actions (CSR, Challenge, Compliance) must retain an immutable log (who/when/what) |
| Performance | Dashboard queries should read from pre-aggregated `department_score` rather than computing live |
| Mobile | Responsive UI, especially for Employee Participation, Challenge progress, and Leaderboards |
| Extensibility | New Emission Factors, Categories, and Badge rules should be configurable without code changes |

---

## 8. Suggested Delivery Milestones

1. **Foundation**: `esg_base` module — Department, Category, Configuration, RBAC
2. **Environmental**: Emission Factors, Carbon Transactions (manual first, then auto-calc), Goals, Dashboard
3. **Social**: CSR Activities, Employee Participation, Diversity/Training metrics
4. **Governance**: Policies, Acknowledgements, Audits, Compliance Issues + overdue escalation
5. **Gamification**: Challenges, XP Ledger, Badges (auto-award), Rewards (redemption), Leaderboards
6. **Scoring Engine**: Weighted aggregation, Department/Organization scores
7. **Reports**: Fixed reports + Custom Report Builder (PDF/Excel/CSV)
8. **Notifications**: In-app + email, configurable triggers
9. **Polish**: Mobile responsiveness, smart dashboard visualizations, department ESG rankings

---

*Reference mockup: https://link.excalidraw.com/l/65VNwvy7c4X/2m6lz9Ln4*
