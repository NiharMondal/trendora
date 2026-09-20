import Link from "next/link";
import { Store } from "lucide-react";

import { TVendorCard } from "@/features/vendors/types/vendor.types";
import { cn } from "@/shared/lib/utils";

/**
 * "Sold by <store>" — the attribution line on a product.
 *
 * In a marketplace the shopper needs to know who they are buying from before
 * they buy, so this appears on cards and on the product page, linking through
 * to the storefront.
 */
export default function StoreBadge({
    vendor,
    className,
    withIcon = true,
}: {
    vendor?: TVendorCard | null;
    className?: string;
    withIcon?: boolean;
}) {
    if (!vendor) return null;

    return (
        <p
            className={cn(
                "flex items-center gap-1 text-xs text-muted-foreground",
                className,
            )}
        >
            {withIcon && <Store className="size-3" />}
            <span>Sold by</span>
            <Link
                href={`/stores/${vendor.slug}`}
                className="font-medium text-foreground hover:underline"
            >
                {vendor.storeName}
            </Link>
        </p>
    );
}
