"use client";

import { useAppDispatch } from "@/redux/redux.hooks";
import { setCredentials, TUserState } from "@/redux/slice/authSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthSync({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (
            status === "authenticated" &&
            (session as any)?.accessToken &&
            !hasSynced.current
        ) {
            hasSynced.current = true;

            dispatch(
                setCredentials({
                    user: session.user as TUserState,
                    token: (session as any).accessToken,
                }),
            );
        }

        if (status === "unauthenticated") {
            hasSynced.current = false;

            dispatch(setCredentials({ user: null, token: null }));

            // Redirect to login
            router.push("/login");
        }
    }, [session, status, dispatch, router]);

    return <>{children}</>;
}
