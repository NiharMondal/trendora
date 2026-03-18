import { TRegisterValues } from "@/app/(auth)/register/register-schema";
import { TAuthLoginResponse, TAuthRegisterResponse } from "@/components/types/auth.types";
import { TServerResponse } from "@/components/types/common.types";
import { baseApi } from "./baseApi";
import { TLoginValues } from "@/app/(auth)/login/login-schema";

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
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useOAuthLoginMutation,
} = authApi;
