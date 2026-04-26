import { TLoginValues } from "@/app/(auth)/login/login-schema";
import { TRegisterValues } from "@/app/(auth)/register/register-schema";
import {
    TAuthLoginResponse,
    TAuthRegisterResponse,
} from "@/components/types/auth.types";
import { TServerResponse } from "@/components/types/common.types";

import { baseApi } from "./baseApi";

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
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useOAuthLoginMutation,
    useChangePasswordMutation,
} = authApi;
