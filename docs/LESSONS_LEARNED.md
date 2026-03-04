## Coolify Deployments (NextAuth v5 + Traefik/Caddy) 
- **CRITICAL**: When deploying NextAuth/Auth.js onto Coolify (or any Dockerized hosting behind a reverse proxy like Traefik/Caddy), ALWAYS ensure the environment variable \AUTH_TRUST_HOST=true\ is added to the Coolify project. Otherwise, NextAuth blocks all sign-ins yielding an \UntrustedHost\ loop redirect.

## Next.js / TailwindCSS CSS Layout (Flex/Grid Blowouts)
- **CRITICAL**: CSS Grid and Flexbox containers with scrollable children (`overflow-y-auto` or `overflow-x-auto`) will stretch out of the browser bounds and cut off content (like modal footers or card edges) unless constrained. Always apply `min-h-0` (for vertical flex) or `min-w-0` (for grid items) to the middle scrollable parent to force it to yield to the screen size. Apply `shrink-0` to headers and footers to protect them from squishing.

## Backend Validation (Zod + Prisma) Errors
- **Handling Form Empty Strings**: Zod's `.email().optional().nullable()` will crash with a Server 500 Error if the UI passes an empty string `""` (common in controlled React inputs when cleared). Use `z.union([z.string().email(), z.literal(""), z.null()]).optional()` and intercept it via `v.email === "" ? null : v.email` before hitting the database.
- **Server Actions Catch Blocks**: Always run `schema.parse()` *inside* the `try {}` block, otherwise validation errors will bypass your custom Try/Catch and throw an unhandled `Internal Server Error` to the client instead of returning a predictable `success: false`.

## UI/UX: Leaflet Maps in Dark Mode
- **Map Dimming over Tile Inversion**: Replacing the geographical map tiles (e.g. `Voyager` to `Dark Matter`) in Dark Mode often strips away vital topographic features (rivers, local streets, colors) necessary for operational context (like construction sites). Instead of swapping endpoints, stick to a detailed base (like OpenStreetMap) and apply a CSS filter directly to the layer's container: `filter: brightness(0.65) contrast(1.1) saturate(0.8) hue-rotate(350deg)` via a dynamic `.map-dark-mode` class. This safely dims the interface visually keeping the exact topological information.

## AI Integrations (Gemini/Webhooks)
- **Strict Validation of AI Data**: When parsing natural language to update databases (like extracting Pay Item Codes from Telegram), never trust the AI strings blindly. Before executing `prisma.model.create({ data: { code: aiString } })`, ALWAYS intersect/filter the proposed items against the actual database array. A hallucination inserting an invalid code will cause a fatal `Foreign Key Constraint Failure`, and the whole object/webhook state will be lost.
