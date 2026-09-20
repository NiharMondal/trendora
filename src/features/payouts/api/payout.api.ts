import { TServerResponse } from "@/shared/types/common.types";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

import {
    TGeneratePayoutPayload,
    TOutstandingBalances,
    TPayout,
    TVendorBalance,
} from "@/features/payouts/types/payout.types";

export const payoutApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ---------------------------------------------------------- vendor
        /** What the store is owed now, in flight, and has been paid. */
        myBalance: builder.query<
            TServerResponse<TVendorBalance>,
            Record<string, string> | void
        >({
            query: (query) => ({
                url: "/payouts/me/balance",
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["payouts"],
        }),

        myPayouts: builder.query<
            TServerResponse<TPayout[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/payouts/me",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["payouts"],
        }),

        payoutById: builder.query<TServerResponse<TPayout>, string>({
            query: (id) => ({
                url: `/payouts/${id}`,
                method: "GET",
            }),
            providesTags: ["payouts"],
        }),

        // ----------------------------------------------------------- admin
        /** The settlement work queue: who is owed what right now. */
        outstandingBalances: builder.query<
            TServerResponse<TOutstandingBalances>,
            void
        >({
            query: () => ({
                url: "/payouts/admin/outstanding",
                method: "GET",
            }),
            providesTags: ["payouts"],
        }),

        allPayouts: builder.query<
            TServerResponse<TPayout[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/payouts/admin/all",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["payouts"],
        }),

        /**
         * Create a payout run. Which earnings are included is the server's
         * decision (delivered + paid + unattached); re-running the same window
         * settles nothing twice and returns 400.
         */
        generatePayout: builder.mutation<
            TServerResponse<TPayout>,
            TGeneratePayoutPayload
        >({
            query: (payload) => ({
                url: "/payouts/generate",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["payouts", "vendorOrders"],
        }),

        markPayoutPaid: builder.mutation<
            TServerResponse<TPayout>,
            {
                id: string;
                payload: { reference: string; method?: string; notes?: string };
            }
        >({
            query: ({ id, payload }) => ({
                url: `/payouts/${id}/mark-paid`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["payouts"],
        }),

        /** Releases the attached earnings back into the pool. */
        markPayoutFailed: builder.mutation<
            TServerResponse<TPayout>,
            { id: string; payload: { failureReason: string } }
        >({
            query: ({ id, payload }) => ({
                url: `/payouts/${id}/mark-failed`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["payouts", "vendorOrders"],
        }),
    }),
});

export const {
    useMyBalanceQuery,
    useMyPayoutsQuery,
    usePayoutByIdQuery,
    //
    useOutstandingBalancesQuery,
    useAllPayoutsQuery,
    useGeneratePayoutMutation,
    useMarkPayoutPaidMutation,
    useMarkPayoutFailedMutation,
} = payoutApi;
