import { DataTableColumn } from "@/components/common/shared/table/table-types";
import {
    orderStatusMap,
    paymentStatusMap,
} from "@/components/helpers/status-maps";
import { TOrder } from "@/components/types/order.types";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatMonthDateYear } from "@/lib/format-date-time";

export const myOrderColumns = (): DataTableColumn<TOrder>[] => {
    return [
        {
            key: "orderNumber",
            header: "Order ID",
        },
        {
            key: "createdAt",
            header: "Date",
            cell: (row) => <span>{formatMonthDateYear(row?.createdAt)}</span>,
        },
        {
            key: "paymentStatus",
            header: "Payment",
            cell: (row) => (
                <StatusBadge
                    statusMap={paymentStatusMap}
                    status={row?.paymentStatus}
                />
            ),
        },
        {
            key: "paymentMethod",
            header: "Method",
            cell: (row) => (
                <span>{row?.paymentMethod?.split("_")?.join(" ")}</span>
            ),
        },
        {
            key: "items",
            header: "Items",
            cell: (row) => <span>{row?.items?.length}</span>,
        },

        {
            key: "orderStatus",
            header: "Status",
            cell: (row) => (
                <StatusBadge
                    statusMap={orderStatusMap}
                    status={row?.orderStatus}
                />
            ),
        },
        {
            key: "shippingCost",
            header: "Shipping Cost",
        },
        {
            key: "tax",
            header: "Tax",
        },
        {
            key: "totalAmount",
            header: "Total",
            cell: (row) => <span>${row?.totalAmount}</span>,
        },
        {
            key: "actions",
            header: "Actions",
            cell: (row) => (
                <Button
                    variant="link"
                    size="sm"
                    onClick={() => console.log(row)}
                >
                    View
                </Button>
            ),
        },
    ];
};
