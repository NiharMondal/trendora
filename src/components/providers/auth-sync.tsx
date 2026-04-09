"use client";

import { useAppDispatch } from "@/redux/redux.hooks";
import {
    setCredentials,
    TLoginSessionResponse,
    TUserState,
} from "@/redux/slice/authSlice";
import { deleteCookie, setCookie } from "cookies-next/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function AuthSync({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();

    const hasSynced = useRef(false);

    useEffect(() => {
        if (
            status === "authenticated" &&
            (session as TLoginSessionResponse)?.accessToken &&
            !hasSynced.current
        ) {
            hasSynced.current = true;

            // ✅ persist token
            setCookie(
                "accessToken",
                (session as TLoginSessionResponse)?.accessToken,
            );

            // ✅ sync redux
            dispatch(
                setCredentials({
                    user: session.user as TUserState,
                    token: (session as TLoginSessionResponse)?.accessToken,
                }),
            );
            if ((session.user as TUserState).role === "ADMIN") {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }

        // ❗ When logged out
        if (status === "unauthenticated") {
            hasSynced.current = false;

            // ✅ Clear cookie
            deleteCookie("accessToken");

            // ✅ Clear redux
            dispatch(
                setCredentials({
                    user: null,
                    token: null,
                }),
            );
            router.push("/login")
        }
    }, [session, status]);

    return <>{children}</>;
}
