# CrewForce - Architecture & Tech Stack

## Tech Stack
-   **Framework:** Next.js 15 (App Router)
-   **Language:** TypeScript (Strict mode)
-   **Database:** PostgreSQL (Vercel Postgres or local)
-   **ORM:** Prisma
-   **Authentication:** NextAuth.js (To be implemented)
-   **Bot Engine:** `node-telegram-bot-api` / Telegraf or raw fetch API endpoints
-   **Styling:** Tailwind CSS V4 + Lucide React for Icons
-   **Maps:** react-leaflet

## Core Folders
-   `/src/app`: Application pages and layout standard in Next.js.
-   `/src/app/api`: Serverless functions and webhooks.
-   `/src/components`: UI components, charts, and layout elements, organized by feature domain (`/dashboard`, `/layout`, `/ui`).
-   `/src/lib`: Internal libraries, configuration for Prisma, utility functions.
-   `/prisma`: Prisma schema (`schema.prisma`), migrations, seed scripts.

## Database Schema (Summary)
1.  **User**: Represents admins, managers, and field workers (Role: ADMIN, MANAGER, WORKER). Has payroll settings (rates, multipliers). Linked to Telegram via `telegramChatId`.
2.  **Crew**: Group of users under a specific label working on projects.
3.  **Project**: The main entity for physical job sites. Tracks status, budget, geo-location, deadline, etc.
4.  **DailyLog**: Represents a single daily submission from a worker for a given project. Contains description, image links, and date.
5.  **ProductionLog**: Child of DailyLog indicating specific quantities produced (e.g., footage trenched). Linked to a `PayItemCatalog`.
6.  **Timecard**: Dedicated record for tracking hours manually or via automatic check-ins.

## API Routes
-   **`POST /api/telegram/webhook`**: Receives incoming messages and updates from the Telegram Bot. Parses text/images, authenticates the `chatId` against the `User` table, and generates the `DailyLog` or `ProductionLog`.
-   **`GET /api/telegram/set-webhook`**: Helper route to register the deployment URL with Telegram's Webhook configuration.

## Deployment Strategy
-   **Frontend & APIs**: Vercel (Serverless Edge network).
-   **Database**: Supabase / Vercel Postgres.
-   **Image Storage**: AWS S3 or Supabase Storage (accessed via signed URLs) storing Telegram media files locally to be independent of Telegram cache expirations.
