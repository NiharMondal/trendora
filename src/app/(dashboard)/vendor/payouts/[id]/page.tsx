import VendorPayoutDetails from "@/features/payouts/components/vendor-payout-details";

export default async function VendorPayoutDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <VendorPayoutDetails id={id} />;
}
