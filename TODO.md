# CrewForce - Project Tasks

## ✅ Phase 1: Foundation & Setup
- [x] Initial Next.js setup with App Router
- [x] Tailwind CSS and generic UI scaffolding
- [x] PostgreSQL & Prisma schema definition
- [x] Create seed data for testing
- [x] Base Layout, Sidebar, Header implementation

## ✅ Phase 2: Core Dashboard Modules (UI + DB Integration)
- [x] **Dashboard (`/`)**: High-level KPI tracking, recent activity feed.
- [x] **Projects (`/projects`)**: List view with status badges, create project form, project detail pages.
- [x] **Crews (`/crews`)**: Manage personnel directory and crew assignments, config settings per worker (pay rates).
- [x] **Map View (`/map`)**: Leaflet integration visualizing active projects in geographical view.
- [x] **Payroll (`/payroll`)**: Calculate total hours, generate estimated payouts based on logs and production metrics.
- [x] **Analytics (`/analytics`)**: Provide visual breakdowns of key performance metrics, hours tracked, production data via charts.
- [x] **Settings (`/settings`)**: Profile, Company defaults, Integration statuses, Danger Zone exports.

## 🕒 Phase 3: External Integrations & Auth (IN PROGRESS)
- [ ] **Telegram Bot Implementation**:
  - [ ] Set up continuous Webhook API route (`/api/telegram/webhook`).
  - [ ] Build conversation flow mapping (Ask project, request photos, request metrics, request hours).
  - [ ] Link `telegramChatId` to internal worker account.
  - [ ] Media handling: Download and store images sent by Telegram directly to a storage bucket (S3 or local public folder).
- [ ] **NextAuth Setup**:
  - [ ] Secure all dashboard routes with a middleware redirecting to login.
  - [ ] Create `/login` page for Managers/Admins.
  - [ ] Implement `credentials` provider (checking against the Prisma `User` table).
- [ ] **PDF Generation (Payroll)**:
  - [ ] Provide functionality to convert Payroll estimated tables into shareable, print-ready PDF invoices or pay stubs.

## 💡 Backlog / Nice-To-Haves
- [ ] Real-time updates via WebSockets or polling for incoming Telegram messages on the Dashboard.
- [ ] Dark Mode toggle in Settings.
- [ ] Internationalization (PT-BR, ES, EN) for field workers interaction via Telegram.
