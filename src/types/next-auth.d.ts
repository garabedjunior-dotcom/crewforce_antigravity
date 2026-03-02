import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "ADMIN" | "MANAGER" | "WORKER";
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        role: "ADMIN" | "MANAGER" | "WORKER";
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: "ADMIN" | "MANAGER" | "WORKER";
        id: string;
    }
}
