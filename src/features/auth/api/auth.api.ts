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
        }),

        oAuthLogin: builder.mutation({
            query: () => ({
                url: `/auth/google`,
                method: "GET",
            }),
        }),
        changePassword: builder.mutation({
            query: (payload) => ({
                url: `/auth/change-password`,
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
} = authApi;
