import { ImageOff, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productStatusMap } from "@/features/orders/constants/status-maps";
import ProductPrice from "@/features/products/components/product-card/product-price";
import { TProduct } from "@/features/products/types/product.types";
import { getDiscountPercent } from "@/features/products/utils/discount-percent";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { productGenderOptions } from "@/shared/constants/mock-products";
import { formatDate } from "@/shared/lib/format-date-time";
import { cn } from "@/shared/lib/utils";
import { StatusBadge } from "@/shared/ui/status-badge";

/**
 * Cells shared by the admin catalogue (`product-columns.tsx`) and the
 * seller's catalogue (`vendor-product-columns.tsx`), so a product reads the
 * same in both. Each table keeps its own column list and actions.
 */

/** Thumbnail, name (linked) and "brand · category" beneath. */
export function ProductIdentityCell({
    product,
    href,
}: {
    product: TProduct;
    href: string;
}) {
    const image =
        product.images?.find((img) => img.isMain) ?? product.images?.[0];
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
                    href={href}
                    className="line-clamp-1 font-medium hover:underline"
                >
                    {product.name}
                </Link>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                    {[product.brand?.name, product.category?.name]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                </p>
            </div>
        </div>
    );
}

/**
 * Moderation status, with the rejection reason beneath a rejected listing.
 * `emphasiseReason` is for the seller, for whom the reason is the thing to
 * act on; the admin only needs a reminder.
 */
export function ReviewStatusCell({
    product,
    emphasiseReason = false,
}: {
    product: TProduct;
    emphasiseReason?: boolean;
}) {
    const showReason = product.status === "REJECTED" && product.rejectionReason;
    return (
        <div className="space-y-1">
            <StatusBadge statusMap={productStatusMap} status={product.status} />
            {showReason && (
                <p
                    className={cn(
                        "max-w-56 text-xs",
                        emphasiseReason
                            ? "line-clamp-3 text-destructive-600"
                            : "line-clamp-1 text-muted-foreground",
                    )}
                    title={product.rejectionReason ?? undefined}
                >
                    {product.rejectionReason}
                </p>
            )}
        </div>
    );
}

export function PriceCell({ product }: { product: TProduct }) {
    const percent = getDiscountPercent(product.basePrice, product.discountPrice);
    return (
        <div className="space-y-0.5 whitespace-nowrap">
            <ProductPrice
                basePrice={product.basePrice}
                discountPrice={product.discountPrice}
            />
            {percent > 0 && (
                <span className="text-xs font-medium text-destructive-600">
                    {percent}% off
                </span>
            )}
        </div>
    );
}

export function RatingCell({ product }: { product: TProduct }) {
    if (!product.averageRating) {
        return <span className="text-sm text-muted-foreground">—</span>;
    }
    return (
        <span className="flex items-center gap-1 whitespace-nowrap text-sm">
            <Star
                className="size-3.5 fill-warning-500 text-warning-500"
                aria-hidden="true"
            />
            {Number(product.averageRating).toFixed(1)}
            {!!product.totalReviews && (
                <span className="text-muted-foreground">
                    ({product.totalReviews})
                </span>
            )}
        </span>
    );
}

export function DateCell({ value }: { value: string }) {
    return (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatDate(value, "ll")}
        </span>
    );
}

export function TextCell({ value }: { value?: string | null }) {
    return <span className="text-sm">{value || "—"}</span>;
}

export const genderLabel = (value?: string | null) =>
    value
        ? (productGenderOptions.find((option) => option.value === value)
              ?.label ?? value)
        : null;

/**
 * The secondary columns both catalogues offer, hidden until the viewer turns
 * them on from the "Columns" menu. Spread into a table's column list.
 */
export const optionalProductColumns: DataTableColumn<TProduct>[] = [
    {
        key: "category",
        header: "Category",
        defaultHidden: true,
        cell: (row) => <TextCell value={row.category?.name} />,
    },
    {
        key: "brand",
        header: "Brand",
        defaultHidden: true,
        cell: (row) => <TextCell value={row.brand?.name} />,
    },
    {
        key: "gender",
        header: "Gender",
        defaultHidden: true,
        cell: (row) => <TextCell value={genderLabel(row.gender)} />,
    },
    {
        key: "averageRating",
        header: "Rating",
        defaultHidden: true,
        cell: (row) => <RatingCell product={row} />,
    },
    {
        key: "createdAt",
        header: "Created",
        defaultHidden: true,
        cell: (row) => <DateCell value={row.createdAt} />,
    },
    {
        key: "updatedAt",
        header: "Last updated",
        defaultHidden: true,
        cell: (row) => <DateCell value={row.updatedAt} />,
    },
];
