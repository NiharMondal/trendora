"use client";

import { toast } from "sonner";

import { useSetProductFeaturedMutation } from "@/features/products/api/product.api";
import { TProduct } from "@/features/products/types/product.types";
import { getApiErrorMessage } from "@/shared/utils/api-error";

/**
 * Feature / unfeature one product, with the toast either way. Shared by the
 * table's star button and the row's actions menu so the two cannot diverge.
 * Each caller gets its own mutation, so toggling one row spins only that row.
 */
export function useToggleFeatured(product: TProduct) {
    const [setFeatured, { isLoading }] = useSetProductFeaturedMutation();

    const toggle = async () => {
        const next = !product.isFeatured;
        try {
            await setFeatured({ id: product.id, isFeatured: next }).unwrap();
            toast.success(
                next
                    ? `${product.name} is now featured on the home page`
                    : `${product.name} removed from featured`,
            );
        } catch (error) {
            toast.error(
                getApiErrorMessage(error, "Could not update featured status"),
            );
        }
    };

    return { toggle, isLoading };
}
