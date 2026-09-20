import { TServerResponse } from "@/shared/types/common.types";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

import {
    TVendor,
    TVendorDashboard,
    TVendorPublic,
    TVendorReview,
} from "@/features/vendors/types/vendor.types";
import {
    TStoreSettingsFormValues,
    TVendorApplyFormValues,
    TVendorReasonFormValues,
    TVendorReviewFormValues,
    TVendorSettingsFormValues,
} from "@/features/vendors/schemas/vendor-form.schema";

export const vendorApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ---------------------------------------------------------- public
        /** Approved storefronts for the store directory. */
        allStores: builder.query<
            TServerResponse<TVendorPublic[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/vendors",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["vendors"],
        }),

        storeBySlug: builder.query<TServerResponse<TVendorPublic>, string>({
            query: (slug) => ({
                url: `/vendors/${slug}`,
                method: "GET",
            }),
            providesTags: ["vendors"],
        }),

        // ------------------------------------------------------ seller self
        /**
         * Apply to become a seller. A rejected applicant may re-apply and the
         * backend reuses the same row.
         */
        applyForVendor: builder.mutation<
            TServerResponse<TVendor>,
            TVendorApplyFormValues
        >({
            query: (payload) => ({
                url: "/vendors/apply",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["vendors"],
        }),

        /**
         * The caller's own store in ANY status — 404 means "has not applied".
         * Components use that 404 to decide between showing the apply CTA and
         * the seller dashboard, so don't treat it as an error to surface.
         */
        myStore: builder.query<TServerResponse<TVendor>, void>({
            query: () => ({
                url: "/vendors/me",
                method: "GET",
            }),
            providesTags: ["vendors"],
        }),

        updateMyStore: builder.mutation<
            TServerResponse<TVendor>,
            Partial<TStoreSettingsFormValues>
        >({
            query: (payload) => ({
                url: "/vendors/me",
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["vendors"],
        }),

        vendorDashboard: builder.query<
            TServerResponse<TVendorDashboard>,
            Record<string, string> | void
        >({
            query: (query) => ({
                url: "/vendors/me/dashboard",
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["vendors", "vendorOrders"],
        }),

        // ------------------------------------------------------------ admin
        allVendorsForAdmin: builder.query<
            TServerResponse<TVendor[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/vendors/admin/all",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["vendors"],
        }),

        vendorByIdForAdmin: builder.query<TServerResponse<TVendor>, string>({
            query: (id) => ({
                url: `/vendors/admin/${id}`,
                method: "GET",
            }),
            providesTags: ["vendors"],
        }),

        approveVendor: builder.mutation<TServerResponse<TVendor>, string>({
            query: (id) => ({
                url: `/vendors/${id}/approve`,
                method: "PATCH",
            }),
            // Approval promotes the owner's role, so users go stale too.
            invalidatesTags: ["vendors", "users"],
        }),

        rejectVendor: builder.mutation<
            TServerResponse<TVendor>,
            { id: string; payload: TVendorReasonFormValues }
        >({
            query: ({ id, payload }) => ({
                url: `/vendors/${id}/reject`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["vendors", "users", "products"],
        }),

        suspendVendor: builder.mutation<
            TServerResponse<TVendor>,
            { id: string; payload: TVendorReasonFormValues }
        >({
            query: ({ id, payload }) => ({
                url: `/vendors/${id}/suspend`,
                method: "PATCH",
                body: payload,
            }),
            // A suspended store's catalogue disappears from the storefront.
            invalidatesTags: ["vendors", "products"],
        }),

        reinstateVendor: builder.mutation<TServerResponse<TVendor>, string>({
            query: (id) => ({
                url: `/vendors/${id}/reinstate`,
                method: "PATCH",
            }),
            invalidatesTags: ["vendors", "products"],
        }),

        updateVendorSettings: builder.mutation<
            TServerResponse<TVendor>,
            { id: string; payload: TVendorSettingsFormValues }
        >({
            query: ({ id, payload }) => ({
                url: `/vendors/${id}/settings`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["vendors"],
        }),

        deleteVendor: builder.mutation<TServerResponse<TVendor>, string>({
            query: (id) => ({
                url: `/vendors/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["vendors", "products"],
        }),

        // ---------------------------------------------------- store reviews
        createVendorReview: builder.mutation<
            TServerResponse<TVendorReview>,
            TVendorReviewFormValues
        >({
            query: (payload) => ({
                url: "/vendor-reviews",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["vendorReviews", "vendors"],
        }),

        storeReviews: builder.query<
            TServerResponse<TVendorReview[]>,
            { slug: string; query?: Record<string, string> }
        >({
            query: ({ slug, query }) => ({
                url: `/vendor-reviews/store/${slug}`,
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["vendorReviews"],
        }),

        myStoreReviews: builder.query<TServerResponse<TVendorReview[]>, void>({
            query: () => ({
                url: "/vendor-reviews/my-reviews",
                method: "GET",
            }),
            providesTags: ["vendorReviews"],
        }),
    }),
});

export const {
    useAllStoresQuery,
    useStoreBySlugQuery,
    //
    useApplyForVendorMutation,
    useMyStoreQuery,
    useUpdateMyStoreMutation,
    useVendorDashboardQuery,
    //
    useAllVendorsForAdminQuery,
    useVendorByIdForAdminQuery,
    useApproveVendorMutation,
    useRejectVendorMutation,
    useSuspendVendorMutation,
    useReinstateVendorMutation,
    useUpdateVendorSettingsMutation,
    useDeleteVendorMutation,
    //
    useCreateVendorReviewMutation,
    useStoreReviewsQuery,
    useMyStoreReviewsQuery,
} = vendorApi;
