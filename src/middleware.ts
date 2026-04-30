import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { EnumUserRole } from "@/global/user-role";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role;

        if (pathname.startsWith("/admin")) {
            const isAdmin =
                role === EnumUserRole.ADMIN ||
                role === EnumUserRole.SUPER_ADMIN;
            if (!isAdmin) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token && !token.error,
        },
        pages: { signIn: "/login" },
        secret: process.env.NEXT_AUTH_SECRET,
    },
);

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
};
