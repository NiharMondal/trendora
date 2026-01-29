import { TProductFormValues } from "@/form-schema/product-schema";
import { TServerResponse } from "@/types/common.types";
import { TProduct } from "@/types/product.types";
import { baseApi } from "./baseApi";

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
                const params = new URLSearchParams();

                Object.entries(query).forEach(([Key, value]) => {
                    if (value?.trim().length > 0) {
                        params.append(Key, value);
                    }
                });

                return {
                    url: "/products",
                    method: "GET",
                    params,
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
    }),
});

export const {
    useAllProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useProductByIdQuery,
    useProductBySlugQuery,
    useUpdateProductMutation,
} = productApi;
