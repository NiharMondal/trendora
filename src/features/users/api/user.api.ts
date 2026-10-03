import { TServerResponse } from "@/shared/types/common.types";
import { TUser } from "@/features/users/types/user.types";

import { TProfileFormValues } from "@/features/users/schemas/profile-form.schema";
import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // get all user
        allUser: builder.query<
            TServerResponse<TUser[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/users",
                    method: "GET",
                    params: buildQueryParams(query),
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
        updateMyProfile: builder.mutation<
            TServerResponse<TUser>,
            { payload: TProfileFormValues }
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
    useUpdateMyProfileMutation,
    useDeleteUserMutation,
} = userApi;
