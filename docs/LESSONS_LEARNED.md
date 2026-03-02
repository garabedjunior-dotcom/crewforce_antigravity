## Coolify Deployments (NextAuth v5 + Traefik/Caddy) 
- **CRITICAL**: When deploying NextAuth/Auth.js onto Coolify (or any Dockerized hosting behind a reverse proxy like Traefik/Caddy), ALWAYS ensure the environment variable \AUTH_TRUST_HOST=true\ is added to the Coolify project. Otherwise, NextAuth blocks all sign-ins yielding an \UntrustedHost\ loop redirect.
