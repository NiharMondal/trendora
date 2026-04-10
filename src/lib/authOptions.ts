import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { envConfig } from "@/config/env-config";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
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

                try {
                    const res = await fetch(
                        `${envConfig.backend_url}/auth/login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: credentials.email,
                                password: credentials.password,
                            }),
                        },
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data?.message || "Invalid credentials");
                    }

                    if (data?.success && data?.result) {
                        return {
                            id: data.result.user.id,
                            name: data.result.user.name,
                            email: data.result.user.email,
                            role: data.result.user.role,
                            accessToken: data.result.accessToken,
                        };
                    }

                    return null;
                } catch (error: any) {
                    throw new Error(error.message);
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // 1. Credentials login (already correct)
            if (user && account?.provider === "credentials") {
                token.id = user.id;
                token.role = (user as any).role;
                token.accessToken = (user as any).accessToken;
                return token;
            }

            if (account?.provider === "google") {
                try {
                    const res = await fetch(
                        `${envConfig.backend_url}/auth/oauth-login`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                email: token.email || user?.email,
                                name: token.name || user?.name,
                                avatar: token.picture || user?.image,
                                provider: "google",
                                providerId: account.providerAccountId,
                            }),
                        },
                    );

                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data?.message || "OAuth login failed");
                    }

                    const result = data?.result;

                    token.id = result?.user?.id;
                    token.role = result?.user?.role;
                    token.accessToken = result?.accessToken;
                    token.provider = "google";
                } catch (error) {
                    console.error("OAuth error:", error);
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session as any).accessToken = token.accessToken;
                (session as any).provider = token.provider;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
};
