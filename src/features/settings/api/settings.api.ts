import { TServerResponse } from "@/shared/types/common.types";
import { baseApi } from "@/store/api/base-api";

import { TPlatformSettings } from "@/features/settings/types/settings.types";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Read-only: every value is backend environment configuration. The
         * overrides it summarises are edited elsewhere (store terms, category
         * tax), so it refetches when those tags change.
         */
        platformSettings: builder.query<TServerResponse<TPlatformSettings>, void>({
            query: () => ({ url: "/settings", method: "GET" }),
            providesTags: ["settings", "vendors", "categories"],
        }),
    }),
});

export const { usePlatformSettingsQuery } = settingsApi;
