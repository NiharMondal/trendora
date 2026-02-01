import ProductTable from "@/components/@dashboard/admin/product-table/product-table";
import Headline from "@/components/common/dashboard/headline";

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
