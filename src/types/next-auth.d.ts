import { DefaultSession } from "next-auth";

import { EnumUserRole } from "@/global/user-role";

declare module "next-auth" {
    interface User {
        id: string;
        role: EnumUserRole;
        accessToken: string;
        refreshToken: string;
    }

    interface Session {
        user: {
            id: string;
            role: EnumUserRole;
        } & DefaultSession["user"];
        accessToken: string;
        error?: "RefreshAccessTokenError";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: EnumUserRole;
        accessToken: string;
        refreshToken: string;
        accessTokenExpires: number;
        provider?: "credentials" | "google";
        error?: "RefreshAccessTokenError";
    }
}
