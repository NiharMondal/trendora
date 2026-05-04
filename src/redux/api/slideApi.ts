import { TServerResponse } from "@/components/types/common.types";
import { TSlide } from "@/components/types/slide.types";

import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

export const slideApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSlide: builder.mutation<TServerResponse<TSlide>, TSlide>({
            query: (payload) => ({
                url: "/slides",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["slides"],
        }),
        allSlide: builder.query<
            TServerResponse<TSlide[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/slides",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["slides"],
        }),

        //get product by id
        slideById: builder.query<TServerResponse<TSlide>, string>({
            query: (id) => ({
                url: `/slides/${id}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        // update slide
        updateSlide: builder.mutation<
            TServerResponse<TSlide>,
            { payload: TSlide; id: string }
        >({
            query: ({ payload, id }) => {
                return {
                    url: `/slides/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["slides"],
        }),
        // delete product
        deleteSlide: builder.mutation<TServerResponse<TSlide>, string>({
            query: (id) => ({
                url: `/slides/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["slides"],
        }),
    }),
});

export const {
    useAllSlideQuery,
    useCreateSlideMutation,
    useSlideByIdQuery,
    useDeleteSlideMutation,
    useUpdateSlideMutation,
} = slideApi;
