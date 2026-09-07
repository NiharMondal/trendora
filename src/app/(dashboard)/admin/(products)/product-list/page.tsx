import ProductTable from "@/components/@dashboard/admin/product-table/product-table";
import Headline from "@/shared/components/headline";

export default function ProductListPage() {
    return (
        <div className="space-y-4">
            <Headline
                title="Product List"
                showBackButton
                href="/admin/add-product"
                buttonText="Add Product"
            />
            <ProductTable />
        </div>
    );
}
