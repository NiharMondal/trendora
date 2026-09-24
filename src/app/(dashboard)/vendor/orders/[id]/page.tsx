import VendorOrderDetails from "@/features/vendors/components/vendor-order-details";

export default async function VendorOrderDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <VendorOrderDetails id={id} />;
}
