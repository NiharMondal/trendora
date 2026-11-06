"use client";

import {
    Edit,
    EllipsisVertical,
    ExternalLink,
    Send,
    Sparkles,
    ToggleLeft,
    ToggleRight,
    Trash,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
    useSetProductPublishedMutation,
    useSubmitProductForReviewMutation,
} from "@/features/products/api/product.api";
import {
    optionalProductColumns,
    PriceCell,
    ProductIdentityCell,
    ReviewStatusCell,
} from "@/features/products/components/product-table/product-cells";
import StockPill from "@/features/products/components/stock-pill";
import { TProduct } from "@/features/products/types/product.types";
import { isProductLive } from "@/features/products/utils/product-visibility";
import { DataTableColumn } from "@/shared/components/table/table-types";
import TDButton from "@/shared/components/td-button";
import TDPopover from "@/shared/components/td-popover";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-error";

type Handlers = {
    onDelete: (id: string) => void;
    /** Where the edit link points. */
    editHref: (product: TProduct) => string;
};

/** A draft or rejected listing is the only thing worth submitting. */
const canSubmit = (product: TProduct) =>
    product.status === "DRAFT" || product.status === "REJECTED";

/**
 * The seller's own show/hide switch. Each row owns its mutation, so
 * switching one listing does not lock every other row's controls.
 */
function PublishToggle({ product }: { product: TProduct }) {
    const [setPublished, { isLoading }] = useSetProductPublishedMutation();
    // Publishing an unapproved listing is refused by the backend, so the
    // control is disabled rather than allowed to fail.
    const canPublish = product.status === "APPROVED";

    const toggle = async () => {
        try {
            await setPublished({
                id: product.id,
                isPublished: !product.isPublished,
            }).unwrap();
            toast.success(
                product.isPublished
                    ? "Hidden from the storefront"
                    : "Now live on the storefront",
            );
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not change visibility"));
        }
    };

    return (
        <div className="space-y-1">
            <TDButton
                type="button"
                size="sm"
                variant="outline"
                isLoading={isLoading}
                disabled={!canPublish}
                onClick={toggle}
                aria-pressed={product.isPublished}
                aria-label={
                    product.isPublished
                        ? `Hide ${product.name} from the storefront`
                        : `Publish ${product.name}`
                }
                className={cn(
                    // Explicit hover text: the outline variant's hover is the
                    // orange accent with white text.
                    "min-w-24 cursor-pointer rounded-full hover:bg-gray-50 hover:text-foreground",
                    product.isPublished &&
                        "border-success-500 bg-success-50 text-success-600 hover:bg-success-50 hover:text-success-600",
                )}
            >
                {!isLoading &&
                    (product.isPublished ? (
                        <ToggleRight className="size-4" aria-hidden="true" />
                    ) : (
                        <ToggleLeft className="size-4" aria-hidden="true" />
                    ))}
                {product.isPublished ? "Live" : "Hidden"}
            </TDButton>
            {!canPublish && (
                <p className="text-xs text-muted-foreground">Needs approval</p>
            )}
        </div>
    );
}

function SubmitForReviewButton({ product }: { product: TProduct }) {
    const [submit, { isLoading }] = useSubmitProductForReviewMutation();

    const handleSubmit = async () => {
        try {
            await submit(product.id).unwrap();
            toast.success("Sent for review");
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not submit for review"));
        }
    };

    return (
        <TDButton
            type="button"
            size="sm"
            variant="ghost"
            isLoading={isLoading}
            onClick={handleSubmit}
            className="w-full justify-start"
        >
            {!isLoading && <Send />}
            {product.status === "REJECTED" ? "Resubmit for review" : "Submit for review"}
        </TDButton>
    );
}

/**
 * The seller's catalogue.
 *
 * `Review` is the admin's decision and `Live` is the seller's own switch —
 * a product is on the storefront only when it is APPROVED *and* published.
 * "Featured" is read-only here: featuring on the home page is Trendora's
 * editorial call (`PATCH /products/:id/feature`, admin-only), but a seller
 * should still be able to see which of their listings were picked.
 */
export const vendorProductColumns = ({
    onDelete,
    editHref,
}: Handlers): DataTableColumn<TProduct>[] => [
    {
        key: "name",
        header: "Product",
        hideable: false,
        cell: (row) => <ProductIdentityCell product={row} href={editHref(row)} />,
    },
    {
        key: "status",
        header: "Review",
        // The rejection reason is what the seller has to act on, so it is
        // shown in full rather than as a one-line reminder.
        cell: (row) => <ReviewStatusCell product={row} emphasiseReason />,
    },
    {
        key: "isPublished",
        header: "Live",
        cell: (row) => <PublishToggle product={row} />,
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
        cell: (row) =>
            row.isFeatured ? (
                <span
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-warning-50 px-2.5 py-0.5 text-xs font-medium text-warning-600"
                    title={
                        isProductLive(row)
                            ? "Shown in the home page's Featured rail"
                            : "Picked for the home page — appears once live"
                    }
                >
                    <Sparkles className="size-3" aria-hidden="true" />
                    Featured by Trendora
                </span>
            ) : (
                <span className="text-sm text-muted-foreground">—</span>
            ),
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
                className="w-52"
            >
                <div className="flex flex-col gap-1">
                    {canSubmit(row) && <SubmitForReviewButton product={row} />}
                    {/* `/products/:slug` 404s until the listing is live. */}
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
                        <Link href={editHref(row)}>
                            <Edit />
                            Edit
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(row.id)}
                    >
                        <Trash />
                        Delete
                    </Button>
                </div>
            </TDPopover>
        ),
    },
];
