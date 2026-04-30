"use client";
import { DataTable, TableLoading } from "@/components/common/shared/table";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { myOrderColumns } from "./order-columns";
import { DownloadButton, PrintButton } from "./pdf-download-print";


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

            <DataTable
                columns={myOrderColumns()}
                data={orderList}
                rowKey={(row) => row.id}
                isFetching={isFetching}
            />
        </div>
    );
}
