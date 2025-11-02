import { TServerResponse } from "@/app/types/common.types";
import { baseApi } from "./baseApi";
import { TCategory } from "@/app/types/category.types";
type TCategoryInput = {
	name: string;
	parentId?: string | null;
};
export const categoryCategoryApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// create category
		createCategory: builder.mutation<
			TServerResponse<TCategory>,
			TCategoryInput
		>({
			query: (payload) => {
				return {
					url: "/categories",
					method: "POST",
					body: payload,
				};
			},
			invalidatesTags: ["categories"],
		}),

		// get all categories
		allCategory: builder.query<TServerResponse<TCategory[]>, void>({
			query: () => {
				return {
					url: "/categories",
					method: "GET",
				};
			},
			providesTags: ["categories"],
		}),

		//get category by ID
		categoryById: builder.query<TServerResponse<TCategory[]>, string>({
			query: (id) => ({
				url: `/categories/${id}`,
				method: "GET",
			}),
			providesTags: ["categories"],
		}),

		// update category
		updateCategory: builder.mutation<
			TServerResponse<TCategory[]>,
			{ payload: Partial<TCategory>; id: string }
		>({
			query: ({ payload, id }) => ({
				url: `/categories/${id}`,
				method: "PATCH",
				body: payload,
			}),
			invalidatesTags: ["categories"],
		}),
		// delete category
		deleteCategory: builder.mutation<TServerResponse<TCategory>, string>({
			query: (id) => ({
				url: `/categories/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["categories"],
		}),
	}),
});

export const {
	useAllCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useCategoryByIdQuery,
} = categoryCategoryApi;
