import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TDPopover from "@/shared/td-popover";
import { TProduct } from "@/types/product.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import Link from "next/link";

export const productColumns = (
    handleDeleteProduct: (id: string) => void,
): DataTableColumn<TProduct>[] => [
    {
        key: "name",
        header: "Product",
        cell: (row) => {
            const isMain = row?.images?.find((image) => image.isMain);
            return (
                <div className="flex items-center gap-x-2">
                    <div className="size-16 flex items-center justify-center bg-gray-100 rounded-md">
                        <img
                            src={isMain?.url || ""}
                            alt={row.name}
                            className="size-full rounded-md"
                            loading="lazy"
                        />
                    </div>
                    <p className="font-medium">{row.name}</p>
                </div>
            );
        },
    },
    {
        key: "category",
        header: "Category",
        cell: (row) => <span>{row.category?.name}</span>,
    },
    {
        key: "basePrice",
        header: "Base Price",
    },
    {
        key: "brand",
        header: "Brand",
        cell: (row) => <span>{row.brand?.name}</span>,
    },
    {
        key: "discountPrice",
        header: "Discount Price",
        cell: (row) => (
            <span>{row.discountPrice ? row.discountPrice : "N/A"}</span>
        ),
    },
    {
        key: "stockQuantity",
        header: "Quantity",
    },

    {
        key: "isFeatured",
        header: "Featured",
        cell: (row) => (
            <span
                className={cn(
                    "px-3 py-0.5 bg-success/10 text-success rounded-full",
                    {
                        "bg-warning/5 text-warning": !row.isFeatured,
                    },
                )}
            >
                {row.isFeatured ? "Yes" : "No"}
            </span>
        ),
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (
            <TDPopover
                trigger={
                    <Button variant="ghost" size="icon">
                        <EllipsisVertical />
                    </Button>
                }
                className="max-w-[150px]"
            >
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/admin/product-list/update-product/${row.id}`}
                        className="min-w-full"
                    >
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            className=" min-w-full"
                        >
                            <Edit />
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/products/${row.slug}`} className="min-w-full">
                        <Button
                            variant={"secondary"}
                            size={"sm"}
                            className="w-full"
                        >
                            <Eye />
                            View
                        </Button>
                    </Link>

                    <Button
                        variant={"destructive"}
                        size={"sm"}
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
