import AdminProductDetailsView from "@/features/products/components/admin/admin-product-details-view";

export default async function ProductDetailsPageAdmin({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <AdminProductDetailsView id={id} />;
}
