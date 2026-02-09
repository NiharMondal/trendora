import { cn } from "@/lib/utils";
import { TOrder } from "@/types/order.types";
import { DataTableColumn } from "@/types/table.types";

export const orderColumns: DataTableColumn<TOrder>[] = [
    {
        key: "user",
        header: "User",
        cell: (row) => (
            <div className="flex items-center gap-x-2">
                <div className="size-16 flex items-center justify-center bg-gray-100 rounded-md">
                    <img
                        src={row.user.avatar}
                        alt="User Avatar"
                        className="size-full rounded-md"
                        loading="lazy"
                    />
                </div>
                <div>
                    <p className="font-medium">{row.user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {row.user.email}
                    </p>
                </div>
            </div>
        ),
    },
    {
        key: "totalAmount",
        header: "Total Amount",
        cell: (row) => `$${row.totalAmount}`,
    },
    {
        key: "orderStatus",
        header: "Order Status",
        cell: (row) => (
            <span
                className={cn("px-3 py-0.5 rounded-full text-sm font-medium", {
                    "bg-yellow-100 text-yellow-800":
                        row.orderStatus === "PENDING",
                    "bg-blue-100 text-blue-800":
                        row.orderStatus === "PROCESSING",
                    "bg-purple-100 text-purple-800":
                        row.orderStatus === "SHIPPED",
                    "bg-green-100 text-green-800":
                        row.orderStatus === "DELIVERED",
                    "bg-red-100 text-red-800": row.orderStatus === "CANCELED",
                })}
            >
                {row.orderStatus}
            </span>
        ),
    },
    {
        key: "paymentMethod",
        header: "Payment",
    },
    {
        key: "paymentStatus",
        header: "Payment Status",
        cell: (row) => (
            <span
                className={cn("px-3 py-0.5 rounded-full text-sm font-medium", {
                    "bg-yellow-100 text-yellow-800":
                        row.paymentStatus === "PENDING",
                    "bg-green-100 text-green-800": row.paymentStatus === "PAID",
                    "bg-red-100 text-red-800": row.paymentStatus === "FAILED",
                    "bg-purple-100 text-purple-800":
                        row.paymentStatus === "REFUNDED",
                })}
            >
                {row.paymentStatus}
            </span>
        ),
    },
];
