"use client";
import { DataTable, TableLoading } from "@/components/common/shared/table";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import { myOrderColumns } from "./order-columns";

export default function MyOrdersList() {
    const { data: orders, isFetching, isLoading } = useGetMyOrdersQuery();

    if (isLoading) {
        return <TableLoading />;
    }
    return (
        <DataTable
            columns={myOrderColumns()}
            data={orders?.result || []}
            rowKey={(row) => row.id}
            isFetching={isFetching}
        />
    );
}
