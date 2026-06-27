import { TBrandFormValues } from "@/components/common/form/brand-form/brand-form-schema";
import { TBrand } from "@/components/types/brand.types";
import { TServerResponse } from "@/components/types/common.types";

import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

export const brandApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBrand: builder.mutation<
            TServerResponse<TBrand>,
            TBrandFormValues
        >({
            query: (payload) => ({
                url: "/brands",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["brands"],
        }),
        allBrand: builder.query<
            TServerResponse<TBrand[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/brands",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["brands"],
        }),

        //get brand by id
        brandById: builder.query<TServerResponse<TBrand>, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "GET",
            }),
            providesTags: ["brands"],
        }),

        // update brand
        updateBrand: builder.mutation<
            TServerResponse<TBrand>,
            { payload: TBrandFormValues; id: string }
        >({
            query: ({ payload, id }) => {
                return {
                    url: `/brands/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["brands"],
        }),
        // delete product
        deleteBrand: builder.mutation<TServerResponse<TBrand>, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["brands"],
        }),
    }),
});

export const {
    useAllBrandQuery,
    useCreateBrandMutation,
    useBrandByIdQuery,
    useDeleteBrandMutation,
    useUpdateBrandMutation,
} = brandApi;
