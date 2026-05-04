import { TServerResponse } from "@/components/types/common.types";
import { TUser } from "@/components/types/user.types";

import { TProfileFormValues } from "@/components/common/profile/profile-form-validation";
import { buildQueryParams } from "@/utils/build-query-params";
import { baseApi } from "./baseApi";

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
