import VendorAdminDetails from "@/features/vendors/components/admin/vendor-admin-details";

export default async function AdminVendorDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <VendorAdminDetails id={id} />;
}
