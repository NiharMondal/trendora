import { TServerResponse } from "@/shared/types/common.types";
import { TProduct } from "@/features/products/types/product.types";
import { TProductFacets } from "@/features/products/types/product-filter.types";

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

        /**
         * The storefront filter panel's options, built from the live
         * catalogue. Takes the SAME params as `allProducts`, so the counts
         * narrow as the shopper filters — pass `queryParams` straight through.
         */
        productFilters: builder.query<
            TServerResponse<TProductFacets>,
            Record<string, string>
        >({
            query: (query) => ({
                url: "/products/filters",
                method: "GET",
                params: buildQueryParams(query),
            }),
            providesTags: ["products"],
        }),

        /** The 10 most recently listed products — the home page rail. */
        newArrivals: builder.query<TServerResponse<TProduct[]>, void>({
            query: () => ({
                url: "/products/new-arrival",
                method: "GET",
            }),
            providesTags: ["products"],
        }),

        /**
         * Ranked by units actually sold in a rolling window, cancelled parcels
         * excluded. Returns [] on a marketplace with no completed orders yet —
         * the rail hides itself rather than rendering an empty shelf.
         */
        bestSellers: builder.query<
            TServerResponse<TProduct[]>,
            Record<string, string> | void
        >({
            query: (query) => ({
                url: "/products/best-sellers",
                method: "GET",
                params: query ? buildQueryParams(query) : undefined,
            }),
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

        /**
         * Admin-only: put a listing in (or out of) the home page's Featured
         * rail. Its own endpoint — the general product edit ignores
         * `isFeatured` entirely.
         */
        setProductFeatured: builder.mutation<
            TServerResponse<TProduct>,
            { id: string; isFeatured: boolean }
        >({
            query: ({ id, isFeatured }) => ({
                url: `/products/${id}/feature`,
                method: "PATCH",
                body: { isFeatured },
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
    useProductFiltersQuery,
    useNewArrivalsQuery,
    useBestSellersQuery,
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
    useSetProductFeaturedMutation,
    useApproveProductMutation,
    useRejectProductMutation,
} = productApi;
