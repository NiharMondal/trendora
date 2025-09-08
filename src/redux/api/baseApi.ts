import { RootState } from "../store";

import {
	BaseQueryFn,
	createApi,
	FetchArgs,
	fetchBaseQuery,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../slice/authSlice";
import { envConfig } from "@/config/env-config";

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
		const refreshResult = await baseQuery(
			{
				url: "/auth/refresh-token",
				method: "POST",
			},
			api,
			extraOptions
		);

		const user = (api.getState() as RootState).auth.user;

		const refreshData = refreshResult?.data as RefreshResponse | undefined;

		if (refreshData?.result?.accessToken) {
			api.dispatch(
				setCredentials({
					user: user,
					token: refreshData?.result?.accessToken,
				})
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
	tagTypes: ["products", "users", "categories", "orders", "payments"],
});
