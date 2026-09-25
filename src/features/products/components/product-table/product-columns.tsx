import {
    Edit,
    EllipsisVertical,
    ExternalLink,
    Eye,
    EyeOff,
    Star,
    Trash,
} from "lucide-react";
import Link from "next/link";

import FeaturedToggle from "@/features/products/components/featured/featured-toggle";
import StockPill from "@/features/products/components/stock-pill";
import { useToggleFeatured } from "@/features/products/hooks/use-toggle-featured";
import { TProduct } from "@/features/products/types/product.types";
import { isProductLive } from "@/features/products/utils/product-visibility";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDPopover from "@/shared/components/td-popover";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

import {
    optionalProductColumns,
    PriceCell,
    ProductIdentityCell,
    ReviewStatusCell,
} from "./product-cells";

/**
 * Feature / unfeature from the row menu — the same action as the Featured
 * column's star, for when that column is hidden.
 */
function FeatureMenuItem({ product }: { product: TProduct }) {
    const { toggle, isLoading } = useToggleFeatured(product);
    return (
        <Button
            variant="ghost"
            size="sm"
            className="justify-start truncate"
            onClick={toggle}
            disabled={isLoading}
        >
            <Star className={cn(product.isFeatured && "fill-current")} />
            {product.isFeatured ? "Unfeature" : "Feature on home page"}
        </Button>
    );
}

/** Live / awaiting approval / hidden — read-only, the seller owns the switch. */
function VisibilityPill({ product }: { product: TProduct }) {
    const live = isProductLive(product);
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
                live
                    ? "bg-success-50 text-success-600"
                    : product.isPublished
                      ? "bg-warning-50 text-warning-600"
                      : "bg-muted text-muted-foreground",
            )}
            // Published but not approved is the confusing case: the seller
            // has switched it on and shoppers still cannot see it.
            title={
                live
                    ? "On the storefront"
                    : product.isPublished
                      ? "Published by the store, waiting on approval"
                      : "Hidden by the store"
            }
        >
            {live ? (
                <Eye className="size-3" aria-hidden="true" />
            ) : (
                <EyeOff className="size-3" aria-hidden="true" />
            )}
            {live ? "Live" : product.isPublished ? "Awaiting approval" : "Hidden"}
        </span>
    );
}

/**
 * Admin catalogue columns. The product and actions columns are pinned; the
 * rest can be shown or hidden from the toolbar's "Columns" menu, and the
 * less-used ones (`optionalProductColumns`) start hidden. Shared cells live
 * in `product-cells.tsx` so this table and the seller's read the same.
 */
export const productColumns = (
    handleDeleteProduct: (id: string) => void,
): DataTableColumn<TProduct>[] => [
    {
        key: "name",
        header: "Product",
        hideable: false,
        cell: (row) => (
            <ProductIdentityCell
                product={row}
                href={`/admin/product-list/${row.id}`}
            />
        ),
    },
    {
        key: "vendor",
        header: "Store",
        cell: (row) =>
            row.vendor ? (
                <Link
                    href={`/stores/${row.vendor.slug}`}
                    className="whitespace-nowrap text-sm hover:underline"
                >
                    {row.vendor.storeName}
                </Link>
            ) : (
                <span className="text-sm text-muted-foreground">—</span>
            ),
    },
    {
        key: "status",
        header: "Review",
        cell: (row) => <ReviewStatusCell product={row} />,
    },
    {
        key: "isPublished",
        header: "Visibility",
        cell: (row) => <VisibilityPill product={row} />,
    },
    {
        key: "basePrice",
        header: "Price",
        cell: (row) => <PriceCell product={row} />,
    },
    {
        key: "stockQuantity",
        header: "Stock",
        cell: (row) => <StockPill quantity={row.stockQuantity} />,
    },
    {
        key: "isFeatured",
        header: "Featured",
        // Featuring happens here, on the row — there is no separate screen
        // for it. The "Featured" tab is this table pre-filtered.
        cell: (row) => <FeaturedToggle product={row} />,
    },
    ...optionalProductColumns,
    {
        key: "actions",
        header: "Actions",
        hideable: false,
        align: "right",
        cell: (row) => (
            <TDPopover
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${row.name}`}
                    >
                        <EllipsisVertical />
                    </Button>
                }
                className="w-60"
                
            >
                <div className="flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        asChild
                    >
                        <Link href={`/admin/product-list/${row.id}`}>
                            <Eye />
                            View details
                        </Link>
                    </Button>
                    {isProductLive(row) && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start"
                            asChild
                        >
                            <Link
                                href={`/products/${row.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink />
                                View on storefront
                            </Link>
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start"
                        asChild
                    >
                        <Link
                            href={`/admin/product-list/update-product/${row.id}`}
                        >
                            <Edit />
                            Edit
                        </Link>
                    </Button>
                    <FeatureMenuItem product={row} />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeleteProduct(row.id)}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </TDPopover>
        ),
    },
];
