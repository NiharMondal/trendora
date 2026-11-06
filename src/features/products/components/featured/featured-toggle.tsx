"use client";

import { Star } from "lucide-react";
import { toast } from "sonner";

import { useUpdateProductMutation } from "@/features/products/api/product.api";
import { TProduct } from "@/features/products/types/product.types";
import TDButton from "@/shared/components/td-button";
import { cn } from "@/shared/lib/utils";
import { getApiErrorMessage } from "@/shared/utils/api-error";

/**
 * One-click feature / unfeature. Each row owns its mutation, so toggling one
 * spins only that button and several rows can be changed in quick succession.
 *
 * Sends ONLY `isFeatured`. That is safe against the product-edit footgun: the
 * backend reads a missing `images` / `variants` array as "unchanged", not
 * "delete everything", and `isFeatured` is not a field that re-opens
 * moderation.
 */
export default function FeaturedToggle({ product }: { product: TProduct }) {
    const [updateProduct, { isLoading }] = useUpdateProductMutation();
    const next = !product.isFeatured;

    const handleToggle = async () => {
        try {
            await updateProduct({
                id: product.id,
                payload: { isFeatured: next },
            }).unwrap();
            toast.success(
                next
                    ? `${product.name} is now featured on the home page`
                    : `${product.name} removed from featured`,
            );
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not update featured status"));
        }
    };

    return (
        <TDButton
            type="button"
            size="sm"
            variant="outline"
            isLoading={isLoading}
            onClick={handleToggle}
            aria-pressed={product.isFeatured}
            aria-label={
                product.isFeatured
                    ? `Remove ${product.name} from featured`
                    : `Feature ${product.name}`
            }
            className={cn(
                "min-w-28 cursor-pointer rounded-full",
                product.isFeatured &&
                    "border-warning-500 bg-warning-50 text-warning-600 hover:bg-warning-100 hover:text-warning-600",
            )}
        >
            {!isLoading && (
                <Star
                    className={cn("size-4", product.isFeatured && "fill-current")}
                    aria-hidden="true"
                />
            )}
            {product.isFeatured ? "Featured" : "Feature"}
        </TDButton>
    );
}
