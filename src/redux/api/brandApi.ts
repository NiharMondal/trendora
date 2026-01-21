import { TBrand } from "@/types/brand.types";
import { TServerResponse } from "@/types/common.types";
import { baseApi } from "./baseApi";

export const brandApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBrand: builder.mutation<TServerResponse<TBrand>, TBrand>({
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
                const params = new URLSearchParams();

                Object.entries(query).forEach(([Key, value]) => {
                    if (value?.trim().length > 0) {
                        params.append(Key, value);
                    }
                });

                return {
                    url: "/brands",
                    method: "GET",
                    params,
                };
            },
            providesTags: ["brands"],
        }),

        //get product by id
        brandById: builder.query<TServerResponse<TBrand>, string>({
            query: (id) => ({
                url: `/brands/${id}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        // update brand
        updateBrand: builder.mutation<
            TServerResponse<TBrand>,
            { payload: TBrand; id: string }
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
