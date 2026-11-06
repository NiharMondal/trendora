import { TServerResponse } from "@/shared/types/common.types";
import { TSlideFormValues } from "@/features/home/schemas/slide-form.schema";
import { TSlide } from "@/features/home/types/slide.types";

import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const slideApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createSlide: builder.mutation<TServerResponse<TSlide>, TSlideFormValues>({
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

        /**
         * ADMIN listing — every non-deleted slide, INCLUDING deactivated ones.
         * The public `allSlide` hard-filters `isActive: true`, so a management
         * screen built on it could never show or restore a hidden slide.
         */
        allSlidesForAdmin: builder.query<
            TServerResponse<TSlide[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/slides/admin/all",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["slides"],
        }),

        //get slide by id
        slideById: builder.query<TServerResponse<TSlide>, string>({
            query: (id) => ({
                url: `/slides/${id}`,
                method: "GET",
            }),
            providesTags: ["slides"],
        }),

        // update slide
        updateSlide: builder.mutation<
            TServerResponse<TSlide>,
            { payload: Partial<TSlideFormValues>; id: string }
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
        // soft delete — the backend sets `isDeleted`
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
    useAllSlidesForAdminQuery,
    useCreateSlideMutation,
    useSlideByIdQuery,
    useDeleteSlideMutation,
    useUpdateSlideMutation,
} = slideApi;
