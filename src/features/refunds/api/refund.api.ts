import { TServerResponse } from "@/shared/types/common.types";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

import {
    TManualRefundPayload,
    TOutstandingRefunds,
    TRefund,
    TRetryAllResult,
} from "@/features/refunds/types/refund.types";

/**
 * Refunds are issued automatically when a paid parcel is cancelled — there is
 * no "create refund" endpoint for the happy path. These cover what automation
 * cannot close: retrying a gateway failure, recording money returned by hand,
 * and abandoning a refund.
 */
export const refundApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /** Buyer: refunds on my orders. Vendor: refunds on my parcels. */
        myRefunds: builder.query<
            TServerResponse<TRefund[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/refunds/me",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["refunds"],
        }),

        // ----------------------------------------------------------- admin
        outstandingRefunds: builder.query<
            TServerResponse<TOutstandingRefunds>,
            void
        >({
            query: () => ({
                url: "/refunds/admin/outstanding",
                method: "GET",
            }),
            providesTags: ["refunds"],
        }),

        allRefunds: builder.query<
            TServerResponse<TRefund[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/refunds/admin/all",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["refunds"],
        }),

        refundById: builder.query<TServerResponse<TRefund>, string>({
            query: (id) => ({ url: `/refunds/${id}`, method: "GET" }),
            providesTags: ["refunds"],
        }),

        /**
         * Retry one refund at the gateway. Unlike the automatic path this
         * surfaces the gateway error, because an operator pressing retry needs
         * to see what went wrong.
         */
        retryRefund: builder.mutation<TServerResponse<TRefund>, string>({
            query: (id) => ({ url: `/refunds/${id}/retry`, method: "PATCH" }),
            // A successful refund changes the payment status, so orders go stale.
            invalidatesTags: ["refunds", "orders", "payments"],
        }),

        retryAllRefunds: builder.mutation<
            TServerResponse<TRetryAllResult>,
            void
        >({
            query: () => ({ url: "/refunds/retry-all", method: "POST" }),
            invalidatesTags: ["refunds", "orders", "payments"],
        }),

        /** Money already returned outside the gateway (cash, bank transfer). */
        recordManualRefund: builder.mutation<
            TServerResponse<TRefund>,
            TManualRefundPayload
        >({
            query: (payload) => ({
                url: "/refunds/manual",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["refunds", "orders", "payments"],
        }),

        cancelRefund: builder.mutation<
            TServerResponse<TRefund>,
            { id: string; payload: { reason: string } }
        >({
            query: ({ id, payload }) => ({
                url: `/refunds/${id}/cancel`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["refunds", "orders", "payments"],
        }),
    }),
});

export const {
    useMyRefundsQuery,
    useOutstandingRefundsQuery,
    useAllRefundsQuery,
    useRefundByIdQuery,
    useRetryRefundMutation,
    useRetryAllRefundsMutation,
    useRecordManualRefundMutation,
    useCancelRefundMutation,
} = refundApi;
