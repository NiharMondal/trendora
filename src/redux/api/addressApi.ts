import { baseApi } from "./baseApi";

export const addressApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// create address
		createAddress: builder.mutation({
			query: (payload) => {
				return {
					url: "/address",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["address"],
		}),

		// my address
		myAddress: builder.query({
			query: () => ({
				url: `/address/my-address`,
				method: "GET",
			}),
			providesTags: ["address"],
		}),

		// address by id
		addressById: builder.query({
			query: (id) => ({
				url: `/address/${id}`,
				method: "GET",
			}),
			providesTags: ["address"],
		}),

		// update address
		updateAddress: builder.mutation({
			query: ({ payload, id }) => {
				return {
					url: `/address/${id}`,
					method: "PATCH",
					body: payload,
				};
			},
			invalidatesTags: ["address"],
		}),

		// delete address
		deleteAddress: builder.mutation({
			query: (id) => {
				return {
					url: `/address/${id}`,
					method: "DELETE",
				};
			},
			invalidatesTags: ["address"],
		}),
	}),
});

export const {
	useCreateAddressMutation,
	useMyAddressQuery,
	useAddressByIdQuery,
	useDeleteAddressMutation,
	useUpdateAddressMutation,
} = addressApi;
