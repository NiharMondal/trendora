import { TServerResponse } from "@/components/types/common.types";
import { TCreateOrderPayload, TOrder } from "@/components/types/order.types";

import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<
            TServerResponse<TOrder>,
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

        getMyOrders: builder.query<TServerResponse<TOrder[]>, void>({
            query: () => ({
                url: "/orders/my-orders",
                method: "GET",
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

        // update order
        updateOrder: builder.mutation<
            TServerResponse<TOrder>,
            { payload: TOrder; id: string }
        >({
            query: ({ payload, id }) => {
                return {
                    url: `/orders/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["orders"],
        }),

        // delete order
        deleteOrder: builder.mutation<TServerResponse<TOrder>, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["orders"],
        }),
    }),
});

export const {
    useAllOrderQuery,
    useCreateOrderMutation,
    useGetMyOrdersQuery,
    useOrderByIdQuery,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} = orderApi;
