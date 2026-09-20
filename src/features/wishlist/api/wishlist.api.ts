import { TServerResponse } from "@/shared/types/common.types";
import { TWishlist } from "@/features/wishlist/types/wishlist.types";

import { baseApi } from "@/store/api/base-api";

export const wishlistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // wishlist of the currently authenticated customer
        myWishlist: builder.query<TServerResponse<TWishlist[]>, void>({
            query: () => ({
                url: "/wishlists/my-wishlist",
                method: "GET",
            }),
            providesTags: ["wishlist"],
        }),

        // add a product to the wishlist
        addToWishlist: builder.mutation<
            TServerResponse<TWishlist>,
            { productId: string }
        >({
            query: (payload) => ({
                url: "/wishlists",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["wishlist"],
        }),

        // remove a wishlist entry by its id
        removeFromWishlist: builder.mutation<TServerResponse<null>, string>({
            query: (id) => ({
                url: `/wishlists/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["wishlist"],
        }),
    }),
});

export const {
    useMyWishlistQuery,
    useAddToWishlistMutation,
    useRemoveFromWishlistMutation,
} = wishlistApi;
