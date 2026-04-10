import { TAddress } from "@/components/types/address.types";
import { TServerResponse } from "@/components/types/common.types";

import { TAddressFormValues } from "@/components/common/form/address-form/address-form-schema";
import { baseApi } from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // create address
        createAddress: builder.mutation<
            TServerResponse<TAddress>,
            TAddressFormValues
        >({
            query: (payload) => {
                return {
                    url: "/address",
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: ["address"],
        }),

        // all address // TODO: this should be only for admin, need to change the endpoint
        allAddress: builder.query<TServerResponse<TAddress[]>, undefined>({
            query: () => ({
                url: `/address`,
                method: "GET",
            }),
            providesTags: ["address"],
        }),
        // my address
        myAddress: builder.query<TServerResponse<TAddress[]>, undefined>({
            query: () => ({
                url: `/address/my-address`,
                method: "GET",
            }),
            providesTags: ["address"],
        }),

        // address by id
        addressById: builder.query({
            query: (id) => ({
                url: `/address/${id}`,
                method: "GET",
            }),
            providesTags: ["address"],
        }),

        // update address
        updateAddress: builder.mutation<TServerResponse<TAddress>, { payload: TAddressFormValues; id: string }>({
            query: ({ payload, id }) => {
                return {
                    url: `/address/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["address"],
        }),

        // delete address
        deleteAddress: builder.mutation({
            query: (id) => {
                return {
                    url: `/address/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["address"],
        }),
    }),
});

export const {
    useCreateAddressMutation,
    useMyAddressQuery,
    useAllAddressQuery,
    useAddressByIdQuery,
    useDeleteAddressMutation,
    useUpdateAddressMutation,
} = addressApi;
