import { TServerResponse } from "@/types/common.types";
import { baseApi } from "./baseApi";

import { TUser } from "@/types/user.types";

export const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// get all user
		allUser: builder.query<
			TServerResponse<TUser[]>,
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
					url: "/users",
					method: "GET",
					params,
				};
			},
			providesTags: ["users"],
		}),

		//get user by ID
		myProfile: builder.query<TServerResponse<TUser>, string>({
			query: (id) => ({
				url: `/users/${id}`,
				method: "GET",
			}),
			providesTags: ["users"],
		}),

		// update user
		updateUser: builder.mutation<
			TServerResponse<TUser>,
			{ payload: Partial<TUser>; id: string }
		>({
			query: ({ payload, id }) => ({
				url: `/users/${id}`,
				method: "PATCH",
				body: payload,
			}),
			invalidatesTags: ["users"],
		}),
		// delete category
		deleteUser: builder.mutation<TServerResponse<TUser>, string>({
			query: (id) => ({
				url: `/users/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["users"],
		}),
	}),
});

export const {
	useAllUserQuery,
	useMyProfileQuery,
	useUpdateUserMutation,
	useDeleteUserMutation,
} = userApi;
