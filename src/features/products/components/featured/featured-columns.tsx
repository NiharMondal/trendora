import { Edit, Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ProductPrice from "@/features/products/components/product-card/product-price";
import { TProduct } from "@/features/products/types/product.types";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { Button } from "@/shared/ui/button";

import StockPill from "@/features/products/components/stock-pill";

import FeaturedToggle from "./featured-toggle";

export const featuredColumns: DataTableColumn<TProduct>[] = [
    {
        key: "name",
        header: "Product",
        cell: (row) => {
            const image =
                row.images?.find((img) => img.isMain) ?? row.images?.[0];
            return (
                <div className="flex min-w-56 items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        {image?.url && (
                            <Image
                                src={image.url}
                                alt=""
                                fill
                                sizes="48px"
                                className="object-cover"
                            />
                        )}
                    </div>
                    <div className="min-w-0">
                        <Link
                            href={`/products/${row.slug}`}
                            className="line-clamp-1 font-medium hover:underline"
                        >
                            {row.name}
                        </Link>
                        {row.vendor && (
                            <Link
                                href={`/stores/${row.vendor.slug}`}
                                className="text-xs text-muted-foreground hover:underline"
                            >
                                {row.vendor.storeName}
                            </Link>
                        )}
                    </div>
                </div>
            );
        },
    },
    {
        key: "category",
        header: "Category",
        cell: (row) => (
            <span className="text-sm">{row.category?.name ?? "—"}</span>
        ),
    },
    {
        key: "basePrice",
        header: "Price",
        cell: (row) => (
            <ProductPrice
                basePrice={row.basePrice}
                discountPrice={row.discountPrice}
            />
        ),
    },
    {
        key: "stockQuantity",
        header: "Stock",
        cell: (row) => <StockPill quantity={row.stockQuantity} />,
    },
    {
        key: "averageRating",
        header: "Rating",
        cell: (row) =>
            row.averageRating ? (
                <span className="flex items-center gap-1 text-sm">
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
                <span className="text-sm text-muted-foreground">No reviews</span>
            ),
    },
    {
        key: "isFeatured",
        header: "Featured",
        cell: (row) => <FeaturedToggle product={row} />,
    },
    {
        key: "actions",
        header: "Actions",
        align: "right",
        cell: (row) => (
            <div className="flex justify-end gap-2">
                {/* Button asChild, not <Link><Button>: a button inside a link
                    is invalid HTML and reads as two controls. */}
                <Button variant="ghost" size="icon" asChild>
                    <Link
                        href={`/admin/product-list/${row.id}`}
                        aria-label={`View ${row.name}`}
                    >
                        <Eye />
                    </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <Link
                        href={`/admin/product-list/update-product/${row.id}`}
                        aria-label={`Edit ${row.name}`}
                    >
                        <Edit />
                    </Link>
                </Button>
            </div>
        ),
    },
];
