import { TSizeFormValues } from "@/components/common/form/size-form/size-form-schema";
import { TServerResponse } from "@/components/types/common.types";
import { TSize } from "@/components/types/size.types";

import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

export const sizeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // create size
        createSize: builder.mutation<TServerResponse<TSize>, TSizeFormValues>({
            query: (payload) => {
                return {
                    url: "/sizes",
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: ["sizes"],
        }),

        // get all sizes
        allSizes: builder.query<
            TServerResponse<TSize[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/sizes",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["sizes"],
        }),

        //get size by ID
        sizeById: builder.query<TServerResponse<TSize>, string>({
            query: (id) => ({
                url: `/sizes/${id}`,
                method: "GET",
            }),
            providesTags: ["sizes"],
        }),

        // update size
        updateSize: builder.mutation<
            TServerResponse<TSize>,
            { payload: TSizeFormValues; id: string }
        >({
            query: ({ payload, id }) => ({
                url: `/sizes/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["sizes"],
        }),
        // delete size
        deleteSize: builder.mutation<TServerResponse<TSize>, string>({
            query: (id) => ({
                url: `/sizes/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["sizes"],
        }),
    }),
});

export const {
    useAllSizesQuery,
    useCreateSizeMutation,
    useUpdateSizeMutation,
    useDeleteSizeMutation,
    useSizeByIdQuery,
} = sizeApi;
