import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isApiWebhook = nextUrl.pathname.startsWith('/api/webhook');
            const isApiAuth = nextUrl.pathname.startsWith('/api/auth');
            const isLogin = nextUrl.pathname.startsWith('/login');

            // Allow unfettered access to Webhook and Auth routes
            if (isApiWebhook || isApiAuth) {
                return true;
            }

            // Dashboard Protection
            if (!isLogin) {
                if (isLoggedIn) return true;
                return false; // Redirects to /login automatically
            }

            // Redirect away from login if already authenticated
            if (isLoggedIn && isLogin) {
                return Response.redirect(new URL('/', nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
