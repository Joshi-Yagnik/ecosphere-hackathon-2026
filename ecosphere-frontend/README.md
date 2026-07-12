# 🌿 EcoSphere – ESG Management Platform

> A modern, full-featured ESG (Environmental, Social, and Governance) management platform for mid-to-large enterprises. Built as a hackathon prototype with a fully interactive frontend and realistic mock data.

![EcoSphere Dashboard](./public/og-preview.png)

---

## 📖 Project Description

EcoSphere centralizes ESG data collection, tracking, reporting, and employee engagement in a single, beautifully designed interface. It enables organizations to:

- **Track** carbon emissions across Scope 1, 2, and 3 with full transaction history
- **Manage** environmental goals, CSR activities, governance policies, and compliance issues
- **Engage** employees through a gamification system with challenges, badges, XP, and a live leaderboard
- **Report** across all ESG pillars with customizable, exportable reports
- **Configure** organizational settings including ESG scoring weights and notification preferences

---

## ✨ Features

### 🏠 Dashboard
- Animated KPI counter cards (ESG Score, Carbon Emissions, CSR Hours, Compliance Issues, Policy Acknowledgements)
- ESG Score Breakdown Doughnut Chart
- Monthly Carbon Trend Line Chart (12 months)
- Department ESG Score Comparison Bar Chart
- Real-time Activity Feed
- Quick-access navigation cards

### 🌱 Environmental Module
- **Carbon Transactions** – Full CRUD with Scope 1/2/3 support, Draft → Confirmed → Cancelled workflow
- **Emission Factors Library** – 15+ pre-loaded factors with CRUD, search, and active/inactive toggles
- **Environmental Goals** – Progress tracking with deadlines, priority levels, and state management

### 🤝 Social Module
- **CSR Activities** – Activity management with evidence upload toggle and approval workflow
- **Employee Participation Tracker** – Track hours contributed, XP earned, and badges awarded per employee

### 🏛️ Governance Module
- **Policies** – Version-controlled policy management with mandatory flag and acknowledgement tracking
- **Policy Acknowledgements** – Overdue detection with per-employee compliance status
- **Audits** – Schedule, track, and score internal/external audits
- **Compliance Issues / Risk Register** – Severity-based issue tracking with escalation workflow

### 🎮 Gamification Module
- **Challenges** – Create and manage sustainability challenges with XP targets and progress bars
- **Challenge Participation** – Employee enrollment and completion tracking
- **Badges** – Configurable achievement badges with unlock rules
- **Rewards Store** – XP-based redemption catalog with inventory management
- **Leaderboard** – Animated Top-3 podium with rank trend indicators (↑/↓/stable)

### 📊 Reports
- Saved report history with status (Generating / Ready / Failed)
- Report generator: module selection, date range, PDF/XLSX/CSV format, graph toggle
- Mock download actions

### ⚙️ Settings
- **Global Configuration** – Interactive ESG scoring sliders (must total 100%), feature toggles, alert thresholds
- **User Profile** – Personal info, language, timezone, and password management
- **Departments** – Full CRUD with carbon targets and ESG score display

### 🔐 Authentication
- Clean, modern login page with pre-filled demo credentials
- Mock authentication (no backend required)

### 🎨 UI/UX
- **Dark mode** toggle with system preference detection and localStorage persistence
- Collapsible sidebar with mobile overlay and touch support
- Breadcrumb navigation on all sub-pages
- Custom 404 error page
- Empty states with meaningful icons

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Charts | Chart.js via react-chartjs-2 |
| Tables | TanStack Table v8 |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Data | Mock JSON (no backend) |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Joshi-Yagnik/ecosphere-hackathon-2026.git

# Navigate to the frontend
cd ecosphere-hackathon-2026/ecosphere-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

```
Email:    admin@ecosphere.com
Password: demo1234
```

---

## 📁 Project Structure

```
ecosphere-frontend/
├── app/
│   ├── (auth)/login/         # Login page (mock auth)
│   └── (dashboard)/
│       ├── dashboard/        # Main dashboard
│       ├── environmental/    # Carbon, Emission Factors, Goals
│       ├── social/           # CSR Activities, Participation
│       ├── governance/       # Policies, Audits, Compliance
│       ├── gamification/     # Challenges, Badges, Rewards, Leaderboard
│       ├── reports/          # Report Builder
│       └── settings/         # Global Config, Profile, Departments
├── components/
│   ├── layout/               # Sidebar, Navbar, Breadcrumb, DarkModeToggle
│   ├── dashboard/            # KpiCard, Charts, ActivityFeed
│   └── ui/                   # DataTable, Modal (shared)
├── lib/
│   ├── mock-data/            # All mock JSON data
│   ├── mock-auth.ts          # Mock authentication utility
│   └── utils.ts              # Shared utilities
└── types/
    └── index.ts              # Global TypeScript definitions
```

---

## 📸 Screenshots

> Coming soon — deploy to Vercel for live demo URL.

---

## 🏆 Hackathon

**Event:** EcoSphere Hackathon 2026  
**Team:** Yagnik Joshi  
**Branch:** `Yagnik` → merged to `main`

---

## 📄 License

This project was created for hackathon purposes. All rights reserved.
