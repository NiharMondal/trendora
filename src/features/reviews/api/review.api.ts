import { TServerResponse } from "@/shared/types/common.types";
import { TReview, TReviewEligibility } from "@/features/reviews/types/review.types";

import { TReviewFormValues } from "@/features/reviews/schemas/review-form.schema";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const reviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createReview: builder.mutation<
            TServerResponse<TReview>,
            TReviewFormValues
        >({
            query: (payload) => ({
                url: "/reviews",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["reviews"],
        }),

        /**
         * Can the signed-in user review this product, and if not, why. The
         * backend enforces the same rule on create, so this only decides what
         * the product page shows. Provides `reviews`, so posting a review
         * refetches it and the form turns into "you have reviewed this".
         */
        reviewEligibility: builder.query<
            TServerResponse<TReviewEligibility>,
            string
        >({
            query: (productId) => ({
                url: `/reviews/eligibility/${productId}`,
                method: "GET",
            }),
            providesTags: ["reviews"],
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

        reviewsByProductId: builder.query<TServerResponse<TReview[]>, string>({
            query: (productId) => ({
                url: `/reviews/product/${productId}`,
                method: "GET",
            }),
            providesTags: ["reviews"],
        }),

        // reviews written by the currently authenticated customer
        getMyReviews: builder.query<TServerResponse<TReview[]>, void>({
            query: () => ({
                url: "/reviews/my-reviews",
                method: "GET",
            }),
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
    useReviewsByProductIdQuery,
    useGetMyReviewsQuery,
    useReviewEligibilityQuery,
} = reviewApi;
