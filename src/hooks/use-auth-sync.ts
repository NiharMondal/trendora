"use client";

import { useAppDispatch } from "@/redux/redux.hooks";
import {
    setCredentials,
    TLoginSessionResponse,
    TUserState,
} from "@/redux/slice/authSlice";
import { setCookie } from "cookies-next";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useAuthSync = () => {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();


    useEffect(() => {
        if (
            status === "authenticated" &&
            (session as TLoginSessionResponse)?.accessToken
        ) {
            const token = (session as TLoginSessionResponse)?.accessToken;

            // ✅ Set cookie (same as email login)
            setCookie("accessToken", token);

            // ✅ Sync Redux
            dispatch(
                setCredentials({
                    user: session.user as TUserState,
                    token: token,
                }),
            );
        }
    }, [session, status]);

    return { session, status };
};
