import MyOrdersList from "@/features/orders/components/my-orders/my-orders-list";

export default function MyOrdersListPage() {
    return (
        <div className="space-y-5 bg-white rounded-md padding border-radius">
            <h3>My Orders</h3>
            <MyOrdersList />
        </div>
    );
}
