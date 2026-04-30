import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { envConfig } from "@/config/env-config";
import { EnumUserRole } from "@/global/user-role";

const ACCESS_TOKEN_TTL_MS = 20 * 60 * 1000;
const SESSION_MAX_AGE_S = 60 * 60 * 24 * 30;
const REFRESH_SKEW_MS = 30 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        if (!token.refreshToken) {
            throw new Error("No refresh token on session");
        }

        const res = await fetch(`${envConfig.backend_url}/auth/refresh-token`, {
            method: "POST",
            headers: {
                Cookie: `td_refresh_token=${token.refreshToken}`,
            },
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
            accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
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
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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

                const res = await fetch(
                    `${envConfig.backend_url}/auth/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    },
                );

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
                    accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
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
                    const payload = data?.result ?? data?.data ?? data;
                    if (!res.ok || !payload?.accessToken || !payload?.user) {
                        throw new Error(data?.message || "OAuth login failed");
                    }

                    return {
                        ...token,
                        id: payload.user.id,
                        role: payload.user.role as EnumUserRole,
                        accessToken: payload.accessToken,
                        refreshToken: payload.refreshToken,
                        accessTokenExpires: Date.now() + ACCESS_TOKEN_TTL_MS,
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
