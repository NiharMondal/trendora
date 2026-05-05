import MyOrdersList from "@/components/@dashboard/customer/my-orders-list/my-orders-list";

export default function MyOrdersListPage() {
    return (
        <div className="space-y-5 bg-white rounded-md padding border-radius">
            <h3>My Orders</h3>
            <MyOrdersList />
        </div>
    );
}
