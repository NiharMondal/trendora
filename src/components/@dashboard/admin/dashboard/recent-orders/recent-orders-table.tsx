"use client";
import { TDTable } from "@/components/common/td-table";
import { useAllOrderQuery } from "@/redux/api/orderApi";
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

            <TDTable
                columns={orderColumns}
                data={orders?.result || []}
                rowKey={(row) => row.id}
            />
        </div>
    );
}
