import { TServerResponse } from "@/shared/types/common.types";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

import {
    TUpdateVendorOrderStatusPayload,
    TVendorOrder,
} from "@/features/vendors/types/vendor-order.types";

/**
 * Fulfilment endpoints.
 *
 * A vendor acts on VendorOrders, never on the parent Order — the old
 * `PATCH /orders/:orderId/status` no longer exists, because an order with
 * several sellers has no single status to set.
 */
export const vendorOrderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /** The seller's own queue. An admin may narrow it with `vendorId`. */
        myVendorOrders: builder.query<
            TServerResponse<TVendorOrder[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/orders/vendor/my-orders",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["vendorOrders"],
        }),

        vendorOrderById: builder.query<TServerResponse<TVendorOrder>, string>({
            query: (vendorOrderId) => ({
                url: `/orders/vendor/my-orders/${vendorOrderId}`,
                method: "GET",
            }),
            providesTags: ["vendorOrders"],
        }),

        updateVendorOrderStatus: builder.mutation<
            TServerResponse<TVendorOrder>,
            { vendorOrderId: string; payload: TUpdateVendorOrderStatusPayload }
        >({
            query: ({ vendorOrderId, payload }) => ({
                url: `/orders/vendor-orders/${vendorOrderId}/status`,
                method: "PATCH",
                body: payload,
            }),
            // Cancelling restores stock and the parent order's rollup status
            // changes, so orders/products/payout balances all go stale.
            invalidatesTags: [
                "vendorOrders",
                "orders",
                "products",
                "payouts",
                "vendors",
            ],
        }),
    }),
});

export const {
    useMyVendorOrdersQuery,
    useVendorOrderByIdQuery,
    useUpdateVendorOrderStatusMutation,
} = vendorOrderApi;
