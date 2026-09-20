"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { roleHomePath } from "@/features/auth/utils/role-home";

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
            router.replace(roleHomePath(session?.user?.role));
        }
    }, [session, status, pathname, router]);

    return <>{children}</>;
}
