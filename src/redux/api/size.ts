import { TSizeFormValues } from "@/components/common/form/size-form/size-form-schema";
import { TServerResponse } from "@/types/common.types";
import { TSize } from "@/types/size.types";
import { baseApi } from "./baseApi";

type TCategoryInput = {
	name: string;
	parentId?: string | null;
};

export const sizeApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// create size
		createSize: builder.mutation<TServerResponse<TSize>, TSizeFormValues>({
			query: (payload) => {
				return {
					url: "/sizes",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["sizes"],
		}),

		// get all sizes
		allSizes: builder.query<
			TServerResponse<TSize[]>,
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
					url: "/sizes",
					method: "GET",
					params,
				};
			},
			providesTags: ["sizes"],
		}),

		//get size by ID
		sizeById: builder.query<TServerResponse<TSize>, string>({
			query: (id) => ({
				url: `/sizes/${id}`,
				method: "GET",
			}),
			providesTags: ["sizes"],
		}),

		// update size
		updateSize: builder.mutation<
			TServerResponse<TSize>,
			{ payload: TSizeFormValues; id: string }
		>({
			query: ({ payload, id }) => ({
				url: `/sizes/${id}`,
				method: "PATCH",
				body: payload,
			}),
			invalidatesTags: ["sizes"],
		}),
		// delete size
		deleteSize: builder.mutation<TServerResponse<TSize>, string>({
			query: (id) => ({
				url: `/sizes/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["sizes"],
		}),
	}),
});

export const {
	useAllSizesQuery,
	useCreateSizeMutation,
	useUpdateSizeMutation,
	useDeleteSizeMutation,
	useSizeByIdQuery,
} = sizeApi;
