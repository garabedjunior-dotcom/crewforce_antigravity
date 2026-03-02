import { auth } from "@/auth";

type Role = "ADMIN" | "MANAGER" | "WORKER";

interface AuthResult {
  userId: string;
  role: Role;
}

/**
 * Server-side auth guard for server actions and API routes.
 * Throws if user is not authenticated or lacks required role.
 */
export async function requireAuth(allowedRoles?: Role[]): Promise<AuthResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = (session.user as { role?: Role }).role;

  if (!role) {
    throw new Error("Unauthorized: missing role");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new Error("Forbidden");
  }

  return { userId: session.user.id as string, role };
}

/**
 * Auth guard for API routes — returns Response objects instead of throwing.
 */
export async function requireAuthForApi(allowedRoles?: Role[]): Promise<AuthResult | Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const role = (session.user as { role?: Role }).role;

  if (!role) {
    return new Response("Unauthorized: missing role", { status: 401 });
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return new Response("Forbidden", { status: 403 });
  }

  return { userId: session.user.id as string, role };
}

/**
 * Type guard to check if the result is an error Response.
 */
export function isAuthError(result: AuthResult | Response): result is Response {
  return result instanceof Response;
}
