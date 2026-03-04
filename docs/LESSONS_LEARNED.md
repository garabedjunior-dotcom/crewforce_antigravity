## Coolify Deployments (NextAuth v5 + Traefik/Caddy) 
- **CRITICAL**: When deploying NextAuth/Auth.js onto Coolify (or any Dockerized hosting behind a reverse proxy like Traefik/Caddy), ALWAYS ensure the environment variable \AUTH_TRUST_HOST=true\ is added to the Coolify project. Otherwise, NextAuth blocks all sign-ins yielding an \UntrustedHost\ loop redirect.

## Next.js / TailwindCSS CSS Layout (Flex/Grid Blowouts)
- **CRITICAL**: CSS Grid and Flexbox containers with scrollable children (`overflow-y-auto` or `overflow-x-auto`) will stretch out of the browser bounds and cut off content (like modal footers or card edges) unless constrained. Always apply `min-h-0` (for vertical flex) or `min-w-0` (for grid items) to the middle scrollable parent to force it to yield to the screen size. Apply `shrink-0` to headers and footers to protect them from squishing.

## Backend Validation (Zod + Prisma) Errors
- **Handling Form Empty Strings**: Zod's `.email().optional().nullable()` will crash with a Server 500 Error if the UI passes an empty string `""` (common in controlled React inputs when cleared). Use `z.union([z.string().email(), z.literal(""), z.null()]).optional()` and intercept it via `v.email === "" ? null : v.email` before hitting the database.
- **Server Actions Catch Blocks**: Always run `schema.parse()` *inside* the `try {}` block, otherwise validation errors will bypass your custom Try/Catch and throw an unhandled `Internal Server Error` to the client instead of returning a predictable `success: false`.
