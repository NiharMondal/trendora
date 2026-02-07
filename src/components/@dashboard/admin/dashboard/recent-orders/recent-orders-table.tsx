"use client";
import { useAllOrderQuery } from "@/redux/api/orderApi";
import { DataTable } from "@/shared/table";
import { orderColumns } from "./order-columns";

export default function RecentOrdersTable() {
    const { data: orders } = useAllOrderQuery({
        limit: "5",
        sortBy: "createdAt",
        orderBy: "desc",
    });

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-5 lg:col-span-3">
            <h4 className="mb-10 font-medium text-black">Recent Orders</h4>

            <DataTable
                columns={orderColumns}
                data={orders?.result || []}
                rowKey={(row) => row.id}
            />
        </div>
    );
}
