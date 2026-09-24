import { TForgotPasswordValues } from "@/features/auth/schemas/forgot-password.schema";
import { TLoginValues } from "@/features/auth/schemas/login.schema";
import { TRegisterValues } from "@/features/auth/schemas/register.schema";
import {
    TAuthLoginResponse,
    TAuthRegisterResponse,
} from "@/features/auth/types/auth.types";
import { TServerResponse } from "@/shared/types/common.types";

import { baseApi } from "@/store/api/base-api";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<
            TServerResponse<TAuthRegisterResponse>,
            TRegisterValues
        >({
            query: (payload) => {
                return {
                    url: "/auth/register",
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: ["auth"],
        }),
        loginUser: builder.mutation<
            TServerResponse<TAuthLoginResponse>,
            TLoginValues
        >({
            query: (payload) => ({
                url: `/auth/login`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),

        oAuthLogin: builder.mutation({
            query: () => ({
                url: `/auth/google`,
                method: "GET",
            }),
            invalidatesTags: ["auth"],
        }),
        changePassword: builder.mutation({
            query: (payload) => ({
                url: `/auth/change-password`,
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["auth"],
        }),
        // Always a generic 200 — the response is identical whether or not the
        // account exists, so callers must never branch on it (XR-11).
        forgotPassword: builder.mutation<
            TServerResponse<null>,
            TForgotPasswordValues
        >({
            query: (payload) => ({
                url: `/auth/forgot-password`,
                method: "POST",
                body: payload,
            }),
        }),
        // Returns no tokens by design; the user logs in afterwards.
        resetPassword: builder.mutation<
            TServerResponse<null>,
            { token: string; newPassword: string }
        >({
            query: (payload) => ({
                url: `/auth/reset-password`,
                method: "POST",
                body: payload,
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useOAuthLoginMutation,
    useChangePasswordMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApi;
