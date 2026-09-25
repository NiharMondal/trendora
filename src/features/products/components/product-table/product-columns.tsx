import {
    Edit,
    EllipsisVertical,
    ExternalLink,
    Eye,
    EyeOff,
    ImageOff,
    Star,
    Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productStatusMap } from "@/features/orders/constants/status-maps";
import ProductPrice from "@/features/products/components/product-card/product-price";
import StockPill from "@/features/products/components/stock-pill";
import { TProduct } from "@/features/products/types/product.types";
import { getDiscountPercent } from "@/features/products/utils/discount-percent";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDPopover from "@/shared/components/td-popover";
import { productGenderOptions } from "@/shared/constants/mock-products";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

const genderLabel = (value: string) =>
    productGenderOptions.find((option) => option.value === value)?.label ??
    value;

/**
 * On the storefront only when approved AND published (and its store is
 * approved — not visible on this row, so a suspended store's listing still
 * reads as live here). `/products/:slug` 404s otherwise, so the storefront
 * link is offered only for these.
 */
const isLive = (row: TProduct) => row.status === "APPROVED" && row.isPublished;

/**
 * Admin catalogue columns. The product and actions columns are pinned; the
 * rest can be shown or hidden from the toolbar's "Columns" menu, and the
 * less-used ones start hidden so the default view fits without scrolling.
 */
export const productColumns = (
    handleDeleteProduct: (id: string) => void,
): DataTableColumn<TProduct>[] => [
    {
        key: "name",
        header: "Product",
        hideable: false,
        cell: (row) => {
            const image =
                row.images?.find((img) => img.isMain) ?? row.images?.[0];
            return (
                <div className="flex min-w-60 items-center gap-3">
                    <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
                        {image?.url ? (
                            <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        ) : (
                            <ImageOff className="size-4" aria-hidden="true" />
                        )}
                    </div>
                    <div className="min-w-0 space-y-0.5">
                        <Link
                            href={`/admin/product-list/${row.id}`}
                            className="line-clamp-1 font-medium hover:underline"
                        >
                            {row.name}
                        </Link>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                            {[row.brand?.name, row.category?.name]
                                .filter(Boolean)
                                .join(" · ") || "—"}
                        </p>
                    </div>
                </div>
            );
        },
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
        cell: (row) => (
            <div className="space-y-1">
                <StatusBadge statusMap={productStatusMap} status={row.status} />
                {row.status === "REJECTED" && row.rejectionReason && (
                    <p
                        className="line-clamp-1 max-w-48 text-xs text-muted-foreground"
                        title={row.rejectionReason}
                    >
                        {row.rejectionReason}
                    </p>
                )}
            </div>
        ),
    },
    {
        key: "isPublished",
        header: "Visibility",
        cell: (row) => {
            const live = isLive(row);
            return (
                <span
                    className={cn(
                        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
                        live
                            ? "bg-success-50 text-success-600"
                            : row.isPublished
                              ? "bg-warning-50 text-warning-600"
                              : "bg-muted text-muted-foreground",
                    )}
                    // Published but not approved is the confusing case: the
                    // seller has switched it on and shoppers still cannot see it.
                    title={
                        live
                            ? "On the storefront"
                            : row.isPublished
                              ? "Published by the store, waiting on approval"
                              : "Hidden by the store"
                    }
                >
                    {live ? (
                        <Eye className="size-3" aria-hidden="true" />
                    ) : (
                        <EyeOff className="size-3" aria-hidden="true" />
                    )}
                    {live ? "Live" : row.isPublished ? "Awaiting approval" : "Hidden"}
                </span>
            );
        },
    },
    {
        key: "basePrice",
        header: "Price",
        cell: (row) => {
            const percent = getDiscountPercent(row.basePrice, row.discountPrice);
            return (
                <div className="space-y-0.5 whitespace-nowrap">
                    <ProductPrice
                        basePrice={row.basePrice}
                        discountPrice={row.discountPrice}
                    />
                    {percent > 0 && (
                        <span className="text-xs font-medium text-destructive-600">
                            {percent}% off
                        </span>
                    )}
                </div>
            );
        },
    },
    {
        key: "stockQuantity",
        header: "Stock",
        cell: (row) => <StockPill quantity={row.stockQuantity} />,
    },
    {
        key: "isFeatured",
        header: "Featured",
        cell: (row) =>
            row.isFeatured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-600">
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    Featured
                </span>
            ) : (
                <span className="text-sm text-muted-foreground">—</span>
            ),
    },
    {
        key: "category",
        header: "Category",
        defaultHidden: true,
        cell: (row) => (
            <span className="text-sm">{row.category?.name ?? "—"}</span>
        ),
    },
    {
        key: "brand",
        header: "Brand",
        defaultHidden: true,
        cell: (row) => <span className="text-sm">{row.brand?.name ?? "—"}</span>,
    },
    {
        key: "gender",
        header: "Gender",
        defaultHidden: true,
        cell: (row) => (
            <span className="text-sm">
                {row.gender ? genderLabel(row.gender) : "—"}
            </span>
        ),
    },
    {
        key: "averageRating",
        header: "Rating",
        defaultHidden: true,
        cell: (row) =>
            row.averageRating ? (
                <span className="flex items-center gap-1 whitespace-nowrap text-sm">
                    <Star
                        className="size-3.5 fill-warning-500 text-warning-500"
                        aria-hidden="true"
                    />
                    {Number(row.averageRating).toFixed(1)}
                    {!!row.totalReviews && (
                        <span className="text-muted-foreground">
                            ({row.totalReviews})
                        </span>
                    )}
                </span>
            ) : (
                <span className="text-sm text-muted-foreground">—</span>
            ),
    },
    {
        key: "createdAt",
        header: "Created",
        defaultHidden: true,
        cell: (row) => (
            <span className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(row.createdAt, "ll")}
            </span>
        ),
    },
    {
        key: "updatedAt",
        header: "Last updated",
        defaultHidden: true,
        cell: (row) => (
            <span className="whitespace-nowrap text-sm text-muted-foreground">
                {formatDate(row.updatedAt, "ll")}
            </span>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        label: "Actions",
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
                className="w-48"
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
                    {isLive(row) && (
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
