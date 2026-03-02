# CrewForce - Infrastructure Management OS (PRD)

## 1. Product Overview
CrewForce is an Infrastructure Management OS designed to streamline the operations of construction and telecommunications fieldwork. It aims to eliminate paperwork by using Telegram to collect Daily Logs directly from the field, process them automatically, and generate critical insights for project tracking and payroll calculation.

## 2. Core Modules
- **Dashboard**: Real-time overview of active projects, crews, and daily logs.
- **Projects**: Management of project details, physical locations, status tracking, and associated crews.
- **Crews & Personnel**: A centralized directory of workers, roles, rates, and crew assignments.
- **Map View**: Geospatial visualization of active project locations.
- **Payroll**: Automated calculation engine for generating weekly or bi-weekly timesheets from Daily Logs via Telegram.
- **Analytics**: Key Performance Indicators (KPIs) and data visualizations on operational metrics.
- **Settings**: System configurations, user profile, integration statuses (Database, Telegram, Auth).

## 3. Key Integrations
- **Telegram Bot API**: End-users (workers/managers in the field) submit Daily Logs (text, images, metrics) into specified Telegram chats.
- **PostgreSQL via Prisma**: A relational database to store the state of the app (Users, Projects, Crews, DailyLogs, Production).
- **NextAuth.js**: Role-based authentication (Admin, Manager, Worker) to restrict dashboard access.

## 4. Workflows
- **Field Reporting**: A worker types `/log` (or similar) into Telegram, answers the bot's standard questions, uploads a photo of the completed site.
- **Data Ingestion**: Application catches webhook from Telegram -> parsers map to specific `ProjectId` -> saves `DailyLog` row -> updates `Project` progress.
- **Payroll Generation**: Manager opens `/payroll` at week's end -> app calculates `totalHours` * `baseRate` + `pieceRateEarned` based on the approved `DailyLog`s. Manager exports to CSV or processes payments.

## 5. UI/UX Standard
- **Design System**: Glassmorphism, dark/light modes, Lucide React icons, structured cards, animated states using Framer Motion (if requested).
- **Performance**: High focus on quick API responses, optimistic UI updates, proper skeleton loading. 
