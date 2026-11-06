"use client";

import { Star } from "lucide-react";

import { useToggleFeatured } from "@/features/products/hooks/use-toggle-featured";
import { TProduct } from "@/features/products/types/product.types";
import TDButton from "@/shared/components/td-button";
import { cn } from "@/shared/lib/utils";

/**
 * The admin product table's one-click feature / unfeature button.
 *
 * A listing that is not live can still be starred: the home page rail reads
 * only approved + published listings, so it appears there once it goes live.
 * The tooltip says so, since a starred draft is otherwise surprising.
 */
export default function FeaturedToggle({ product }: { product: TProduct }) {
    const { toggle, isLoading } = useToggleFeatured(product);
    const isLive = product.status === "APPROVED" && product.isPublished;

    return (
        <TDButton
            type="button"
            size="sm"
            variant="outline"
            isLoading={isLoading}
            onClick={toggle}
            aria-pressed={product.isFeatured}
            aria-label={
                product.isFeatured
                    ? `Remove ${product.name} from featured`
                    : `Feature ${product.name}`
            }
            title={
                isLive
                    ? undefined
                    : "Not live yet — shows on the home page once approved and published"
            }
            className={cn(
                // Explicit hover text: the outline variant's hover is the
                // orange accent with white text.
                "min-w-28 cursor-pointer rounded-full hover:bg-gray-50 hover:text-foreground text-xs",
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
