import { TServerResponse } from "@/components/types/common.types";
import { TUser } from "@/components/types/user.types";

import { baseApi } from "./baseApi";
import { TAccountFormValues } from "@/app/(dashboard)/dashboard/edit-account/account-form-schema";

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

        //get user profile
        myProfile: builder.query<TServerResponse<TUser>, void>({
            query: () => ({
                url: `/users/my-profile`,
                method: "GET",
            }),
            providesTags: ["users"],
        }),

        // update user
        updateUser: builder.mutation<
            TServerResponse<TUser>,
            { payload: Partial<TAccountFormValues> }
        >({
            query: ({ payload }) => ({
                url: `/users/my-profile-update`,
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
