import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

import { envConfig } from "@/config/env-config";

import { logout, setCredentials } from "../slice/authSlice";
import { RootState } from "../store";

// Explicitly type the refreshResult data
type RefreshResponse = {
    success: true;
    result: {
        accessToken: string;
    };
};

const baseUrl = envConfig.backend_url; // backend url

const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        if (token) {
            headers.set("authorization", token);
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

    if (result?.error && result?.error.status === 401) {
        const refreshResponse = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        });

        const refreshData = (await refreshResponse
            .json()
            .catch(() => undefined)) as RefreshResponse | undefined;

        const user = (api.getState() as RootState).auth.user;

        if (refreshResponse.ok && refreshData?.result?.accessToken) {
            // set 20 minutes expiry for new access token
            const expiryTime = new Date(Date.now() + 20 * 60 * 1000);
            api.dispatch(
                setCredentials({
                    user: user,
                    token: refreshData?.result?.accessToken,
                    expires: expiryTime.toISOString(),
                }),
            );

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
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
