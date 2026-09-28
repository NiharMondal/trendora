import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { currencyFormatter } from "@/features/cart/utils/calculate-order-total";
import type { TTopProduct } from "@/features/orders/types/order.types";
import { DataTableColumn } from "@/shared/components/table/table-types";
import { cn } from "@/shared/lib/utils";

/** Rows arrive ranked; the rank is their position, carried in by the table. */
export type TRankedTopProduct = TTopProduct & { rank: number };

const RANK_CLASS: Record<number, string> = {
    1: "bg-primary-500 text-white",
    2: "bg-primary-200 text-primary-800",
    3: "bg-primary-100 text-primary-700",
};

export const topProductColumns: DataTableColumn<TRankedTopProduct>[] = [
    {
        key: "rank",
        header: "#",
        width: "w-12",
        cell: (row) => (
            <span
                className={cn(
                    "flex size-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    RANK_CLASS[row.rank] ?? "bg-muted text-muted-foreground",
                )}
            >
                {row.rank}
            </span>
        ),
    },
    {
        key: "productName",
        header: "Product",
        cell: (row) => (
            <div className="flex min-w-52 items-center gap-3">
                <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground">
                    {row.image ? (
                        <Image
                            src={row.image}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                        />
                    ) : (
                        <ImageOff className="size-4" aria-hidden="true" />
                    )}
                </div>
                <div className="min-w-0 space-y-0.5">
                    {/* A deleted listing has no edit page to open. */}
                    {row.slug ? (
                        <Link
                            href={`/admin/product-list/update-product/${row.productId}`}
                            className="line-clamp-1 font-medium hover:underline"
                        >
                            {row.productName}
                        </Link>
                    ) : (
                        <p className="line-clamp-1 font-medium">
                            {row.productName}{" "}
                            <span className="text-xs font-normal text-muted-foreground">
                                (deleted)
                            </span>
                        </p>
                    )}
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                        {row.storeName ?? "—"}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "quantitySold",
        header: "Units",
        align: "right",
        cell: (row) => (
            <span className="tabular-nums">
                {row.quantitySold.toLocaleString("en-US")}
            </span>
        ),
    },
    {
        key: "revenue",
        header: "Sales",
        align: "right",
        cell: (row) => (
            <span className="font-medium tabular-nums">
                {currencyFormatter(row.revenue)}
            </span>
        ),
    },
];
