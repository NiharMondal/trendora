import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { envConfig } from "@/config/env-config";
import { EnumUserRole } from "@/global/user-role";

const REFRESH_SKEW_MS = 30 * 1000; // 30 seconds
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30; // 30 days

// Read the `exp` claim from a JWT (seconds since epoch) and convert to ms.
// Falls back to a 15-minute default if the token is malformed.
function getAccessTokenExpiry(accessToken: string): number {
    try {
        const [, payloadB64] = accessToken.split(".");
        const json = Buffer.from(payloadB64, "base64url").toString("utf-8");
        const { exp } = JSON.parse(json) as { exp?: number };
        if (typeof exp === "number") return exp * 1000;
    } catch {
        // ignore — fall through
    }
    return Date.now() + 15 * 60 * 1000;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        if (!token.refreshToken) {
            throw new Error("No refresh token on session");
        }

        const res = await fetch(`${envConfig.backend_url}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        const data = await res.json().catch(() => ({}));
        const payload = data?.result;
        const newAccessToken = payload?.accessToken;

        if (!res.ok || !newAccessToken) {
            console.error("[next-auth] refresh failed", {
                status: res.status,
                body: data,
            });
            throw new Error(
                data?.message || `Refresh failed with status ${res.status}`,
            );
        }

        return {
            ...token,
            accessToken: newAccessToken,
            accessTokenExpires: getAccessTokenExpiry(newAccessToken),
            refreshToken: payload?.refreshToken ?? token.refreshToken,
            error: undefined,
        };
    } catch (error) {
        console.error("[next-auth] refreshAccessToken error", error);
        return { ...token, error: "RefreshAccessTokenError" };
    }
}

export const authOptions: NextAuthOptions = {
    session: { strategy: "jwt", maxAge: SESSION_MAX_AGE_S },
    providers: [
        GoogleProvider({
            clientId: envConfig.GOOGLE_CLIENT_ID ?? "",
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const res = await fetch(`${envConfig.backend_url}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: credentials.email,
                        password: credentials.password,
                    }),
                });

                const data = await res.json().catch(() => ({}));
                const payload = data?.result;
                if (!res.ok || !payload?.accessToken || !payload?.user) {
                    throw new Error(data?.message || "Invalid credentials");
                }

                return {
                    id: payload.user.id,
                    name: payload.user.name,
                    email: payload.user.email,
                    image: payload.user.avatar ?? null,
                    role: payload.user.role as EnumUserRole,
                    accessToken: payload.accessToken,
                    refreshToken: payload.refreshToken,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user && account?.provider === "credentials") {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    accessTokenExpires: getAccessTokenExpiry(user.accessToken),
                    provider: "credentials",
                };
            }

            if (account?.provider === "google" && user) {
                try {
                    const res = await fetch(
                        `${envConfig.backend_url}/auth/oauth-login`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: user.email,
                                name: user.name,
                                avatar: user.image,
                                provider: "google",
                                providerId: account.providerAccountId,
                            }),
                        },
                    );

                    const data = await res.json().catch(() => ({}));
                    const payload = data?.result;
                    if (!res.ok || !payload?.accessToken || !payload?.user) {
                        throw new Error(data?.message || "OAuth login failed");
                    }

                    return {
                        ...token,
                        id: payload.user.id,
                        role: payload.user.role as EnumUserRole,
                        accessToken: payload.accessToken,
                        refreshToken: payload.refreshToken,
                        accessTokenExpires: getAccessTokenExpiry(payload.accessToken),
                        provider: "google",
                    };
                } catch (error) {
                    console.error("[next-auth] oauth-login error", error);
                    return { ...token, error: "RefreshAccessTokenError" };
                }
            }

            if (
                token.accessTokenExpires &&
                Date.now() < token.accessTokenExpires - REFRESH_SKEW_MS
            ) {
                return token;
            }

            if (!token.refreshToken) {
                return { ...token, error: "RefreshAccessTokenError" };
            }

            return refreshAccessToken(token);
        },

        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                role: token.role,
            };
            session.accessToken = token.accessToken;
            session.error = token.error;
            return session;
        },
    },
    pages: { signIn: "/login" },
    secret: process.env.NEXT_AUTH_SECRET,
};
