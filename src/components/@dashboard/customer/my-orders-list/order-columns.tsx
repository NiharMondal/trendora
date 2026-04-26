import { TOrder } from "@/components/types/order.types";
import { DataTableColumn } from "@/components/types/table.types";
import { formatMonthDateYear } from "@/lib/format-date-time";

export const myOrderColumns = (): DataTableColumn<TOrder>[] => {
    return [
        {
            key: "orderNumber",
            header: "Order ID",
        },

        {
            key: "totalAmount",
            header: "Total Amount",
            cell: (row) => <span>${row?.totalAmount}</span>,
        },
        {
            key: "orderStatus",
            header: "Status",
        },
        {
            key: "items",
            header: "Items",
            cell: (row) => <span>{row?.items?.length}</span>,
        },
        {
            key: "createdAt",
            header: "Order Date",
            cell: (row) => <span>{formatMonthDateYear(row?.createdAt)}</span>,
        },
    ];
};
