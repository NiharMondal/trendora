import MyOrderDetails from "@/features/orders/components/my-orders/my-order-details";

export default async function MyOrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <MyOrderDetails id={id} />;
}
