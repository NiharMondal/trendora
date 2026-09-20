import { TServerResponse } from "@/shared/types/common.types";
import {
    TCreateOrderPayload,
    TCreateOrderResult,
    TOrder,
    TOrderAnalytics,
} from "@/features/orders/types/order.types";

import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<
            TServerResponse<TCreateOrderResult>,
            TCreateOrderPayload
        >({
            query: (payload) => ({
                url: "/orders",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["orders"],
        }),

        allOrder: builder.query<
            TServerResponse<TOrder[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/orders",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["orders"],
        }),

        getMyOrders: builder.query<
            TServerResponse<TOrder[]>,
            Record<string, string> | void
        >({
            query: (query) => ({
                url: "/orders/my-orders",
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["orders"],
        }),
        //get order by id
        orderById: builder.query<TServerResponse<TOrder>, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "GET",
            }),
            providesTags: ["orders"],
        }),

        /**
         * Platform-wide analytics (ADMIN). Reports commission separately from
         * gross merchandise value, since most of GMV belongs to the vendors.
         */
        orderAnalytics: builder.query<
            TServerResponse<TOrderAnalytics>,
            Record<string, string> | void
        >({
            query: (query) => ({
                url: "/orders/analytics",
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["orders"],
        }),

        // NOTE: there is deliberately no updateOrder/deleteOrder here.
        // `PATCH /orders/:id` and `DELETE /orders/:id` do not exist on the
        // backend — fulfilment happens per store through
        // `useUpdateVendorOrderStatusMutation`
        // (features/vendors/api/vendor-order.api.ts), because an order with
        // several sellers has no single status to set.
    }),
});

export const {
    useAllOrderQuery,
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useOrderByIdQuery,
    useOrderAnalyticsQuery,
} = orderApi;
