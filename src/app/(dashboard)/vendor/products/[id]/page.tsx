import VendorUpdateProduct from "@/features/products/components/vendor-products/vendor-update-product";

export default async function VendorEditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <VendorUpdateProduct id={id} />;
}
