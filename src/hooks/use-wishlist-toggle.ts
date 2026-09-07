"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
    useAddToWishlistMutation,
    useMyWishlistQuery,
    useRemoveFromWishlistMutation,
} from "@/redux/api/wishlistApi";
import { useUserInfoClient } from "@/features/auth/utils/user-info";

/**
 * Encapsulates the "add / remove product from wishlist" toggle so the heart
 * buttons on product cards and the product-details view share one behaviour.
 */
export const useWishlistToggle = (productId: string) => {
    const user = useUserInfoClient();
    const router = useRouter();

    // only fetch the wishlist for authenticated users
    const { data: wishlist } = useMyWishlistQuery(undefined, { skip: !user });
    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] =
        useRemoveFromWishlistMutation();

    const entry = wishlist?.result?.find(
        (item) => item.productId === productId,
    );
    const isWishlisted = Boolean(entry);

    const toggle = async () => {
        if (!user) {
            toast.error("Please log in to use your wishlist");
            router.push("/login");
            return;
        }

        try {
            if (entry) {
                await removeFromWishlist(entry.id).unwrap();
                toast.success("Removed from wishlist");
            } else {
                await addToWishlist({ productId }).unwrap();
                toast.success("Added to wishlist");
            }
        } catch (error: any) {
            toast.error(error?.data?.message ?? "Something went wrong");
        }
    };

    return { isWishlisted, toggle, isLoading: isAdding || isRemoving };
};
