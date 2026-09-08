import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { isAdminRole, isVendorRole, roleHomePath } from "@/features/auth/utils/role-home";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const role = req.nextauth.token?.role;

        if (pathname.startsWith("/admin") && !isAdminRole(role)) {
            return NextResponse.redirect(new URL(roleHomePath(role), req.url));
        }

        // The seller area. A CUSTOMER who has not been approved yet is sent to
        // their own dashboard, where the "become a seller" entry point lives —
        // except for /vendor/apply, which is exactly where a shopper needs to
        // be able to go in order to become a vendor.
        if (pathname.startsWith("/vendor") && !isVendorRole(role)) {
            if (pathname.startsWith("/vendor/apply")) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(roleHomePath(role), req.url));
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
    matcher: ["/admin/:path*", "/dashboard/:path*", "/vendor/:path*"],
};
