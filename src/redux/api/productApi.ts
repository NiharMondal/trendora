import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// create product
		createProduct: builder.mutation({
			query: (payload) => {
				console.log(payload);
				return {
					url: "/products",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["products"],
		}),

		// get all products
		allProducts: builder.query({
			query: () => {
				return {
					url: "/products",
					method: "GET",
				};
			},
			providesTags: ["products"],
		}),

		//get product by slug
		productBySlug: builder.query({
			query: (slug) => ({
				url: `/products/by-slug/${slug}`,
				method: "GET",
			}),
			providesTags: ["products"],
		}),

		//get product by ID
		productById: builder.query({
			query: (id) => ({
				url: `/products/${id}`,
				method: "GET",
			}),
			providesTags: ["products"],
		}),

		// update product
		updateProduct: builder.mutation({
			query: ({ payload, id }) => ({
				url: `/products/${id}`,
				method: "PATCH",
				body: payload,
			}),
			invalidatesTags: ["products"],
		}),
		// delete product
		deleteProduct: builder.mutation({
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
