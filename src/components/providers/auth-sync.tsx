"use client";

import { EnumUserRole } from "@/global/user-role";
import { setCredentials, TUserState } from "@/redux/slice/authSlice";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/redux.hooks";

export default function AuthSync({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const hasSynced = useRef(false);

    const publicPaths = ["/login", "/register", "/forgot-password"];
    const isPublicPath = publicPaths.includes(pathname);

    useEffect(() => {
        if (
            status === "authenticated" &&
            (session as any)?.accessToken &&
            !hasSynced.current
        ) {
            hasSynced.current = true;

            const expiryTime = new Date(Date.now() + 20 * 60 * 1000);
            dispatch(
                setCredentials({
                    user: session.user as TUserState,
                    token: (session as any).accessToken,
                    expires: expiryTime.toISOString(),
                }),
            );
        }

        // Redirect authenticated users away from public auth pages
        if (status === "authenticated" && isPublicPath) {
            const role = (session as any)?.user?.role;
            if (role === EnumUserRole.ADMIN || role === EnumUserRole.SUPER_ADMIN) {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }

        if (status === "unauthenticated") {
            hasSynced.current = false;

            dispatch(setCredentials({ user: null, token: null, expires: null }));

            // Only redirect to login if they are not already on a public path
            if (!isPublicPath) {
                router.push("/login");
            }
        }
    }, [session, status, dispatch, router, pathname, isPublicPath]);

    return <>{children}</>;
}
