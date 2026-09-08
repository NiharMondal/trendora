import VendorAdminTable from "@/features/vendors/components/admin/vendor-admin-table";

export const metadata = { title: "Vendor Applications | Trendora Admin" };

export default function VendorApplicationsPage() {
    return (
        <VendorAdminTable
            statusFilter="PENDING"
            title="Vendor applications"
            description="Sellers waiting for approval. Approving one promotes the owner's account to VENDOR."
        />
    );
}
