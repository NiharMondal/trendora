import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TDPopover from "@/shared/td-popover";
import { TProduct } from "@/types/product.types";
import { DataTableColumn } from "@/types/table.types";
import { Edit, EllipsisVertical, Eye, Trash } from "lucide-react";
import Link from "next/link";

export const productColumns: DataTableColumn<TProduct>[] = [
    {
        key: "name",
        header: "Product",
        cell: (row) => (
            <div className="flex items-center gap-x-2">
                <div className="size-16 flex items-center justify-center bg-gray-100 rounded-md">
                    <img
                        src={row.images[0].url}
                        alt="User Avatar"
                        className="size-full rounded-md"
                    />
                </div>
                <p className="font-medium">{row.name}</p>
            </div>
        ),
    },
    {
        key: "basePrice",
        header: "Base Price",
    },
    {
        key: "discountPrice",
        header: "Discount Price",
        cell: (row) => (
            <span>{row.discountPrice ? row.discountPrice : "--"}</span>
        ),
    },
    {
        key: "stockQuantity",
        header: "Quantity",
    },
    {
        key: "stock",
        header: "Stock Status",
        cell: (row) => {
            let stock = "";
            if (row.stockQuantity > 50) {
                stock = "Available";
            } else if (row.stockQuantity < 10) {
                stock = "Very Low";
            } else {
                stock = "Low Stock";
            }
            return (
                <span
                    className={cn(
                        "bg-success/5 text-success font-medium px-3 py-0.5 rounded-full",
                        {
                            "bg-destructive/bg-success/5":
                                row.stockQuantity < 10,
                        },
                        {
                            "bg-warning/bg-success/5 text-warning":
                                row.stockQuantity > 10 &&
                                row.stockQuantity < 50,
                        },
                    )}
                >
                    {stock}
                </span>
            );
        },
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
                triggerIcon={<EllipsisVertical />}
                className="max-w-[200px]"
            >
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/admin/product-list/update-product/${row.id}`}
                        className="min-w-full"
                    >
                        <Button variant={"outline"} className=" min-w-full">
                            <Edit />
                            Edit
                        </Button>
                    </Link>
                    <Link href={`/products/${row.slug}`} className="min-w-full">
                        <Button variant={"secondary"} className="w-full">
                            <Eye />
                            View
                        </Button>
                    </Link>

                    <Button variant={"destructive"} className="justify-start">
                        <Trash />
                        Delete
                    </Button>
                </div>
            </TDPopover>
        ),
    },
];
