import { TServerResponse } from "@/shared/types/common.types";
import { TProduct } from "@/features/products/types/product.types";

import { TProductFormValues } from "@/features/products/schemas/product-form.schema";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // create product
        createProduct: builder.mutation<
            TServerResponse<TProduct>,
            TProductFormValues
        >({
            query: (payload) => {
                return {
                    url: "/products",
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: ["products"],
        }),

        // get all products
        allProducts: builder.query<
            TServerResponse<TProduct[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/products",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["products"],
        }),

        //get product by slug
        productBySlug: builder.query<TServerResponse<TProduct>, string>({
            query: (slug) => ({
                url: `/products/by-slug/${slug}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        //get product by ID
        productById: builder.query<TServerResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        // update product
        updateProduct: builder.mutation<
            TServerResponse<TProduct>,
            { payload: Partial<TProductFormValues>; id: string }
        >({
            query: ({ payload, id }) => {
                return {
                    url: `/products/${id}`,
                    method: "PATCH",
                    body: payload,
                };
            },
            invalidatesTags: ["products"],
        }),
        // delete product
        deleteProduct: builder.mutation<TServerResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["products"],
        }),

        /** Everything one store currently sells (public storefront). */
        storeProducts: builder.query<
            TServerResponse<TProduct[]>,
            { slug: string; query?: Record<string, string> }
        >({
            query: ({ slug, query }) => ({
                url: `/products/store/${slug}`,
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
            providesTags: ["products"],
        }),

        /**
         * The caller's own catalogue in EVERY moderation state — this is the
         * vendor dashboard's product table. `GET /products` only returns
         * approved+published listings, so it cannot be used here.
         */
        myVendorProducts: builder.query<
            TServerResponse<TProduct[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/products/vendor/my-products",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["products"],
        }),

        myVendorProductById: builder.query<TServerResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/vendor/my-products/${id}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        /** Every listing in any state — the admin moderation queue. */
        allProductsForAdmin: builder.query<
            TServerResponse<TProduct[]>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/products/admin/all",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["products"],
        }),

        /** Vendor sends a DRAFT or REJECTED listing to the review queue. */
        submitProductForReview: builder.mutation<
            TServerResponse<TProduct>,
            string
        >({
            query: (id) => ({
                url: `/products/${id}/submit`,
                method: "PATCH",
            }),
            invalidatesTags: ["products"],
        }),

        /** The vendor's own show/hide switch. Only works once APPROVED. */
        setProductPublished: builder.mutation<
            TServerResponse<TProduct>,
            { id: string; isPublished: boolean }
        >({
            query: ({ id, isPublished }) => ({
                url: `/products/${id}/publish`,
                method: "PATCH",
                body: { isPublished },
            }),
            invalidatesTags: ["products"],
        }),

        approveProduct: builder.mutation<TServerResponse<TProduct>, string>({
            query: (id) => ({
                url: `/products/${id}/approve`,
                method: "PATCH",
            }),
            invalidatesTags: ["products"],
        }),

        rejectProduct: builder.mutation<
            TServerResponse<TProduct>,
            { id: string; payload: { reason: string } }
        >({
            query: ({ id, payload }) => ({
                url: `/products/${id}/reject`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["products"],
        }),

        // get related products
        relatedProducts: builder.query<TServerResponse<TProduct[]>, string>({
            query: (id) => ({
                url: `/products/related-products/${id}`,
                method: "GET",
            }),
            providesTags: ["products"],
        }),
    }),
});

export const {
    useAllProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useProductByIdQuery,
    useProductBySlugQuery,
    useUpdateProductMutation,
    useRelatedProductsQuery,
    //
    useStoreProductsQuery,
    useMyVendorProductsQuery,
    useMyVendorProductByIdQuery,
    useSubmitProductForReviewMutation,
    useSetProductPublishedMutation,
    //
    useAllProductsForAdminQuery,
    useApproveProductMutation,
    useRejectProductMutation,
} = productApi;
