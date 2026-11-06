import { DataTableColumn } from "@/shared/components/table/table-types";
import { TOrder } from "@/features/orders/types/order.types";
import {
    orderStatusMap,
    paymentStatusMap,
} from "@/features/orders/constants/status-maps";
import { StatusBadge } from "@/shared/ui/status-badge";
import TdUserInfo from "@/shared/components/td-user-info";

export const orderColumns: DataTableColumn<TOrder>[] = [
    {
        key: "user",
        header: "User",
        cell: (row) => (
            <TdUserInfo
                name={row.user.name}
                email={row.user.email}
                avatar={row.user.avatar}
            />
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
            <StatusBadge statusMap={orderStatusMap} status={row.orderStatus} />
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
            <StatusBadge
                statusMap={paymentStatusMap}
                status={row.paymentStatus}
            />
        ),
    },
];
