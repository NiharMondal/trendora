"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { EnumUserRole } from "@/global/user-role";

const PUBLIC_AUTH_PATHS = ["/login", "/register", "/forgot-password"];

export default function AuthSync({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (
            status === "authenticated" &&
            PUBLIC_AUTH_PATHS.includes(pathname)
        ) {
            const role = session?.user?.role;
            if (
                role === EnumUserRole.ADMIN ||
                role === EnumUserRole.SUPER_ADMIN
            ) {
                router.replace("/admin");
            } else {
                router.replace("/dashboard");
            }
        }
    }, [session, status, pathname, router]);

    return <>{children}</>;
}
