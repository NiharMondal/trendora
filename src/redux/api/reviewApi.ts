import { TServerResponse } from "@/components/types/common.types";
import { TReview } from "@/components/types/review.types";

import { TReviewFormValues } from "@/components/common/form/review-form/review-schema";
import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation<TServerResponse<TReview>, TReview>({
            query: (payload) => ({
                url: "/reviews",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["reviews"],
        }),

        allReview: builder.query<
            TServerResponse<TReview[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/reviews",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["reviews"],
        }),

        //get review by id
        reviewById: builder.query<TServerResponse<TReview>, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: "GET",
            }),
            providesTags: ["reviews"],
        }),

        // update review
        updateReview: builder.mutation<
            TServerResponse<TReview>,
            { payload: TReviewFormValues; id: string }
        >({
            query: ({ payload, id }) => {
                return {
                    url: `/reviews/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["reviews"],
        }),

        // delete review
        deleteReview: builder.mutation<TServerResponse<TReview>, string>({
            query: (id) => ({
                url: `/reviews/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviews"],
        }),
    }),
});

export const {
    useAllReviewQuery,
    useCreateReviewMutation,
    useReviewByIdQuery,
    useDeleteReviewMutation,
    useUpdateReviewMutation,
} = reviewApi;
