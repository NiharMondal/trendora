import { Edit, Eye, Send, ToggleLeft, ToggleRight, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { productStatusMap } from "@/features/orders/constants/status-maps";
import { TProduct } from "@/features/products/types/product.types";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { Button } from "@/shared/ui/button";
import { StatusBadge } from "@/shared/ui/status-badge";

type Handlers = {
    onSubmitForReview: (id: string) => void;
    onTogglePublished: (product: TProduct) => void;
    onDelete: (id: string) => void;
    /** Where the edit link points — differs for a vendor and an admin. */
    editHref: (product: TProduct) => string;
    isMutating?: boolean;
};

/**
 * The seller's catalogue.
 *
 * Two independent columns, which is the thing sellers get confused about:
 * `Review` is the admin's decision, `Live` is the seller's own switch. A
 * product is only on the storefront when it is APPROVED *and* published.
 */
export const vendorProductColumns = ({
    onSubmitForReview,
    onTogglePublished,
    onDelete,
    editHref,
    isMutating,
}: Handlers): DataTableColumn<TProduct>[] => [
    {
        key: "name",
        header: "Product",
        cell: (row) => {
            const main = row?.images?.find((image) => image.isMain);
            return (
                <div className="flex items-center gap-x-2">
                    <div className="size-12 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                        {main?.url || row.images?.[0]?.url ? (
                            <Image
                                src={main?.url || row.images[0].url}
                                alt={row.name}
                                className="size-full object-cover rounded-md"
                                loading="lazy"
                                width={60}
                                height={60}
                            />
                        ) : null}
                    </div>
                    <div>
                        <p className="font-medium line-clamp-1">{row.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {row.category?.name}
                        </p>
                    </div>
                </div>
            );
        },
    },
    {
        key: "basePrice",
        header: "Price",
        cell: (row) => (
            <div className="text-sm">
                <p>${row.discountPrice ?? row.basePrice}</p>
                {row.discountPrice && (
                    <p className="text-xs text-muted-foreground line-through">
                        ${row.basePrice}
                    </p>
                )}
            </div>
        ),
    },
    {
        key: "stockQuantity",
        header: "Stock",
    },
    {
        key: "status",
        header: "Review",
        cell: (row) => (
            <div className="space-y-1">
                <StatusBadge statusMap={productStatusMap} status={row.status} />
                {row.status === "REJECTED" && row.rejectionReason && (
                    <p className="text-xs text-red-600 max-w-[220px]">
                        {row.rejectionReason}
                    </p>
                )}
            </div>
        ),
    },
    {
        key: "isPublished",
        header: "Live",
        cell: (row) => {
            // Publishing an unapproved listing is refused by the backend, so
            // the control is disabled rather than allowed to fail.
            const canPublish = row.status === "APPROVED";
            return (
                <div className="space-y-1">
                    <Button
                        variant={row.isPublished ? "secondary" : "outline"}
                        size="sm"
                        disabled={!canPublish || isMutating}
                        onClick={() => onTogglePublished(row)}
                    >
                        {row.isPublished ? (
                            <>
                                <ToggleRight className="size-4 text-success" />
                                Live
                            </>
                        ) : (
                            <>
                                <ToggleLeft className="size-4" />
                                Hidden
                            </>
                        )}
                    </Button>
                    {!canPublish && (
                        <p className="text-xs text-muted-foreground">
                            Needs approval
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (
            <div className="flex items-center gap-1">
                {/* A draft or rejected listing is the only thing worth
                    submitting; PENDING/APPROVED would be refused. */}
                {(row.status === "DRAFT" || row.status === "REJECTED") && (
                    <Button
                        variant="secondary"
                        size="sm"
                        disabled={isMutating}
                        onClick={() => onSubmitForReview(row.id)}
                    >
                        <Send className="size-3.5" />
                        Submit
                    </Button>
                )}

                <Link href={`/products/${row.slug}`}>
                    <Button variant="ghost" size="icon" title="View">
                        <Eye className="size-4" />
                    </Button>
                </Link>

                <Link href={editHref(row)}>
                    <Button variant="ghost" size="icon" title="Edit">
                        <Edit className="size-4" />
                    </Button>
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    title="Delete"
                    onClick={() => onDelete(row.id)}
                >
                    <Trash className="size-4 text-destructive" />
                </Button>
            </div>
        ),
    },
];
