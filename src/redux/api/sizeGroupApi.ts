import { TSizeGroupFormValues } from "@/components/common/form/size-group-form/size-group-schema";
import { TServerResponse } from "@/shared/types/common.types";
import { TSizeGroup } from "@/components/types/size-group.types";

import { buildQueryParams } from "@/shared/utils/build-query-params";
import { baseApi } from "@/store/api/base-api";

export const sizeGroupApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // create size group
        createSizeGroup: builder.mutation<
            TServerResponse<TSizeGroup>,
            TSizeGroupFormValues
        >({
            query: (payload) => {
                return {
                    url: "/size-groups",
                    method: "POST",
                    body: payload,
                };
            },
            invalidatesTags: ["sizeGroups"],
        }),

        // get all size groups
        allSizeGroups: builder.query<
            TServerResponse<TSizeGroup[]>,
            Record<string, string>
        >({
            query: (query) => {
                return {
                    url: "/size-groups",
                    method: "GET",
                    params: buildQueryParams(query),
                };
            },
            providesTags: ["sizeGroups"],
        }),

        //get size group by ID
        sizeGroupById: builder.query<TServerResponse<TSizeGroup>, string>({
            query: (id) => ({
                url: `/size-groups/${id}`,
                method: "GET",
            }),
            providesTags: ["sizeGroups"],
        }),

        // update size group
        updateSizeGroup: builder.mutation<
            TServerResponse<TSizeGroup>,
            { payload: TSizeGroupFormValues; id: string }
        >({
            query: ({ payload, id }) => ({
                url: `/size-groups/${id}`,
                method: "PATCH",
                body: payload,
            }),
            invalidatesTags: ["sizeGroups"],
        }),
        // delete size group
        deleteSizeGroup: builder.mutation<TServerResponse<TSizeGroup>, string>({
            query: (id) => ({
                url: `/size-groups/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["sizeGroups"],
        }),
    }),
});

export const {
    useAllSizeGroupsQuery,
    useCreateSizeGroupMutation,
    useUpdateSizeGroupMutation,
    useDeleteSizeGroupMutation,
    useSizeGroupByIdQuery,
} = sizeGroupApi;
