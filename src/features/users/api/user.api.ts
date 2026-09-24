import { TServerResponse } from "@/shared/types/common.types";
import { TAssignableRole, TUser } from "@/features/users/types/user.types";

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

        /**
         * ADMIN: disable an account. A soft delete, and the ban primitive —
         * the backend 401s the user on their next request and suspends their
         * store if they sell, which is why `vendors` is invalidated too.
         */
        disableUser: builder.mutation<TServerResponse<TUser>, string>({
            query: (id) => ({
                url: `/users/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["users", "vendors"],
        }),

        /** ADMIN: re-enable a disabled account. Does NOT lift a store suspension. */
        restoreUser: builder.mutation<TServerResponse<TUser>, string>({
            query: (id) => ({
                url: `/users/${id}/restore`,
                method: "PATCH",
            }),
            invalidatesTags: ["users"],
        }),

        /**
         * ADMIN: assign CUSTOMER or ADMIN. VENDOR is refused by the backend in
         * both directions unless the store's approval state agrees — a seller
         * role comes from store approval, not from here.
         */
        updateUserRole: builder.mutation<
            TServerResponse<TUser>,
            { id: string; role: TAssignableRole }
        >({
            query: ({ id, role }) => ({
                url: `/users/${id}/role`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useAllUserQuery,
    useMyProfileQuery,
    useUpdateMyProfileMutation,
    useDisableUserMutation,
    useRestoreUserMutation,
    useUpdateUserRoleMutation,
} = userApi;
