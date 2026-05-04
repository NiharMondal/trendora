"use client";
import { DataTable, TableLoading } from "@/components/common/shared/table";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { myOrderColumns } from "./order-columns";
import { DownloadButton, PrintButton } from "./pdf-download-print";
import { TOrder, TOrderItemResponse } from "@/components/types/order.types";


export default function MyOrdersList() {
    const { data: orders, isFetching, isLoading } = useGetMyOrdersQuery();

    if (isLoading) {
        return <TableLoading />;
    }

    const orderList = orders?.result ?? [];
    const hasOrders = orderList.length > 0;

    console.log(orderList)
    return (
        <div className="space-y-4">
            {/* Toolbar — only shown when there is data */}
            {hasOrders && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {orderList.length} order
                        {orderList.length !== 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center gap-2">
                        <PrintButton orders={orderList} />
                        <DownloadButton orders={orderList} />
                    </div>
                </div>
            )}

            <DataTable<TOrder, TOrderItemResponse>
                data={orderList}
                rowKey={(o) => o.id}
                columns={myOrderColumns()}
                isFetching={isFetching}
                expandable={{
                    getSubRows: (o) => o.items,
                    subRowKey: (item, o) => `${o.id}-${item.id}`,
                    subColumns: [
                        { key: "productName", header: "Product" },
                        {
                            key: "quantity",
                            header: "Qty",
                            className: "text-center",
                        },
                        {
                            key: "priceAtPurchase",
                            header: "Price",
                            cell: (i) => `$${i.priceAtPurchase}`,
                        },
                        {
                            key: "subtotal",
                            header: "Subtotal",
                            cell: (i) => `$${i.subtotal}`,
                        },
                    ],
                    title: (o) => `Items in #${o.orderNumber}`,
                    defaultExpanded: true,
                }}
            />
        </div>
    );
}
