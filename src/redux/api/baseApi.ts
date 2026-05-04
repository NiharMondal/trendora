import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { getSession, signOut } from "next-auth/react";

import { envConfig } from "@/config/env-config";

const baseUrl = envConfig.backend_url;

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: async (headers) => {
        const session = await getSession();
        if (session?.accessToken) {
            headers.set("authorization", session.accessToken);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error && result.error.status === 401) {
        // getSession() always re-runs the NextAuth jwt callback, which will
        // refresh the access token if it has expired.
        const session = await getSession();

        if (
            !session?.accessToken ||
            session.error === "RefreshAccessTokenError"
        ) {
            await signOut({ callbackUrl: "/login" });
            return result;
        }

        result = await baseQuery(args, api, extraOptions);
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
    tagTypes: [
        "auth",
        "products",
        "users",
        "categories",
        "orders",
        "payments",
        "brands",
        "address",
        "slides",
        "reviews",
        "sizeGroups",
        "sizes",
    ],
});
