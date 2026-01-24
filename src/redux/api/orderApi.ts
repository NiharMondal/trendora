import { TServerResponse } from "@/types/common.types";

import { TOrder } from "@/types/order.types";
import { baseApi } from "./baseApi";

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<TServerResponse<TOrder>, TOrder>({
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
                const params = new URLSearchParams();

                Object.entries(query).forEach(([Key, value]) => {
                    if (value?.trim().length > 0) {
                        params.append(Key, value);
                    }
                });

                return {
                    url: "/orders",
                    method: "GET",
                    params,
                };
            },
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
    useOrderByIdQuery,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} = orderApi;
