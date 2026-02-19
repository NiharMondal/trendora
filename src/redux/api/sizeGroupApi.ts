import { TSizeGroupFormValues } from "@/components/common/form/size-group-form/size-group-schema";
import { TServerResponse } from "@/types/common.types";
import { TSizeGroup } from "@/types/size-group.types";
import { baseApi } from "./baseApi";

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
				const params = new URLSearchParams();

				Object.entries(query).forEach(([Key, value]) => {
					if (value?.trim().length > 0) {
						params.append(Key, value);
					}
				});
				return {
					url: "/size-groups",
					method: "GET",
					params,
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
